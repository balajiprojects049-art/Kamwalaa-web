/**
 * Wallet Controller — Enterprise Wallet System
 * Features: Balance, Top-up, Pay via wallet, Refund, Transaction history
 */
const pool = require('../config/db');
const { cacheGet, cacheSet, cacheDelete } = require('../config/redis');

/* ============================================================
   GET WALLET BALANCE
   ============================================================ */
const getWallet = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `wallet:${userId}`;

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
            return res.json({ status: 'success', data: cached });
        }

        // Get or create wallet
        let result = await pool.query(
            'SELECT * FROM wallets WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            // Auto-create wallet
            result = await pool.query(
                `INSERT INTO wallets (user_id, balance, currency) 
                 VALUES ($1, 0.00, 'INR') 
                 RETURNING *`,
                [userId]
            );
        }

        const wallet = result.rows[0];

        // Get recent transactions
        const txns = await pool.query(
            `SELECT id, type, amount, balance_after, description, reference_type, created_at
             FROM wallet_transactions 
             WHERE wallet_id = $1 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [wallet.id]
        );

        const data = {
            wallet: {
                id: wallet.id,
                balance: parseFloat(wallet.balance),
                currency: wallet.currency,
            },
            recentTransactions: txns.rows,
        };

        await cacheSet(cacheKey, data, 60); // cache for 1 minute
        return res.json({ status: 'success', data });

    } catch (err) {
        console.error('getWallet error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch wallet.' });
    }
};

/* ============================================================
   GET FULL TRANSACTION HISTORY (paginated)
   ============================================================ */
const getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const type = req.query.type; // optional filter

        const walletRes = await pool.query(
            'SELECT id FROM wallets WHERE user_id = $1', [userId]
        );

        if (walletRes.rows.length === 0) {
            return res.json({ status: 'success', data: { transactions: [], total: 0, page, totalPages: 0 } });
        }

        const walletId = walletRes.rows[0].id;

        let query = `
            SELECT wt.*, b.booking_number
            FROM wallet_transactions wt
            LEFT JOIN bookings b ON wt.reference_id = b.id::text
            WHERE wt.wallet_id = $1
        `;
        const params = [walletId];

        if (type) {
            params.push(type);
            query += ` AND wt.type = $${params.length}`;
        }

        // Count total
        const countRes = await pool.query(
            `SELECT COUNT(*) FROM (${query}) AS sub`, params
        );
        const total = parseInt(countRes.rows[0].count);

        // Get paginated data
        params.push(limit, offset);
        query += ` ORDER BY wt.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

        const txnRes = await pool.query(query, params);

        return res.json({
            status: 'success',
            data: {
                transactions: txnRes.rows,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });

    } catch (err) {
        console.error('getTransactions error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch transactions.' });
    }
};

/* ============================================================
   ADD MONEY TO WALLET (via Razorpay/Stripe)
   ============================================================ */
const addMoney = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { amount, paymentId, paymentMethod } = req.body;

        if (!amount || amount <= 0 || amount > 100000) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid amount. Must be between ₹1 and ₹1,00,000.',
            });
        }

        await client.query('BEGIN');

        // Get/create wallet
        let walletRes = await client.query(
            'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [userId]
        );

        if (walletRes.rows.length === 0) {
            walletRes = await client.query(
                `INSERT INTO wallets (user_id, balance) VALUES ($1, 0) RETURNING *`, [userId]
            );
        }

        const wallet = walletRes.rows[0];
        const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

        // Update balance
        await client.query(
            'UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2',
            [newBalance, wallet.id]
        );

        // Record transaction
        await client.query(
            `INSERT INTO wallet_transactions 
             (wallet_id, user_id, type, amount, balance_after, description, reference_id, reference_type, status)
             VALUES ($1, $2, 'credit', $3, $4, $5, $6, 'payment', 'completed')`,
            [
                wallet.id,
                userId,
                parseFloat(amount),
                newBalance,
                `Money added via ${paymentMethod || 'online payment'}`,
                paymentId || null,
            ]
        );

        await client.query('COMMIT');

        // Clear wallet cache
        await cacheDelete(`wallet:${userId}`);

        return res.json({
            status: 'success',
            message: `₹${amount} added to wallet successfully.`,
            data: { newBalance, amount: parseFloat(amount) },
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('addMoney error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to add money.' });
    } finally {
        client.release();
    }
};

/* ============================================================
   PAY VIA WALLET
   ============================================================ */
const payViaWallet = async (req, res) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { amount, bookingId, description } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ status: 'error', message: 'Invalid amount.' });
        }

        await client.query('BEGIN');

        const walletRes = await client.query(
            'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [userId]
        );

        if (walletRes.rows.length === 0 || parseFloat(walletRes.rows[0].balance) < parseFloat(amount)) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient wallet balance.',
                code: 'INSUFFICIENT_BALANCE',
            });
        }

        const wallet = walletRes.rows[0];
        const newBalance = parseFloat(wallet.balance) - parseFloat(amount);

        // Deduct balance
        await client.query(
            'UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2',
            [newBalance, wallet.id]
        );

        // Record transaction
        await client.query(
            `INSERT INTO wallet_transactions 
             (wallet_id, user_id, type, amount, balance_after, description, reference_id, reference_type, status)
             VALUES ($1, $2, 'debit', $3, $4, $5, $6, 'booking', 'completed')`,
            [
                wallet.id,
                userId,
                parseFloat(amount),
                newBalance,
                description || 'Payment for booking',
                bookingId || null,
            ]
        );

        await client.query('COMMIT');

        // Clear wallet cache
        await cacheDelete(`wallet:${userId}`);

        return res.json({
            status: 'success',
            message: 'Payment successful via wallet.',
            data: { newBalance, amountDeducted: parseFloat(amount) },
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('payViaWallet error:', err);
        return res.status(500).json({ status: 'error', message: 'Wallet payment failed.' });
    } finally {
        client.release();
    }
};

/* ============================================================
   REFUND TO WALLET
   ============================================================ */
const refundToWallet = async (userId, amount, bookingId, description, client = null) => {
    const usePool = !client;
    const dbClient = client || await pool.connect();

    try {
        if (usePool) await dbClient.query('BEGIN');

        let walletRes = await dbClient.query(
            'SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [userId]
        );

        if (walletRes.rows.length === 0) {
            walletRes = await dbClient.query(
                'INSERT INTO wallets (user_id, balance) VALUES ($1, 0) RETURNING *', [userId]
            );
        }

        const wallet = walletRes.rows[0];
        const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

        await dbClient.query(
            'UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2',
            [newBalance, wallet.id]
        );

        await dbClient.query(
            `INSERT INTO wallet_transactions 
             (wallet_id, user_id, type, amount, balance_after, description, reference_id, reference_type, status)
             VALUES ($1, $2, 'refund', $3, $4, $5, $6, 'booking', 'completed')`,
            [wallet.id, userId, parseFloat(amount), newBalance, description || 'Refund', bookingId || null]
        );

        if (usePool) await dbClient.query('COMMIT');

        // Clear wallet cache
        await cacheDelete(`wallet:${userId}`);

        return { success: true, newBalance };

    } catch (err) {
        if (usePool) await dbClient.query('ROLLBACK');
        throw err;
    } finally {
        if (usePool) dbClient.release();
    }
};

/* ============================================================
   ADMIN: GET USER WALLET (admin view)
   ============================================================ */
const adminGetUserWallet = async (req, res) => {
    try {
        const { userId } = req.params;

        const walletRes = await pool.query(
            `SELECT w.*, u.name, u.email, u.phone
             FROM wallets w
             JOIN users u ON w.user_id = u.id
             WHERE w.user_id = $1`,
            [userId]
        );

        if (walletRes.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Wallet not found.' });
        }

        const txnRes = await pool.query(
            `SELECT * FROM wallet_transactions WHERE wallet_id = $1
             ORDER BY created_at DESC LIMIT 20`,
            [walletRes.rows[0].id]
        );

        return res.json({
            status: 'success',
            data: {
                wallet: walletRes.rows[0],
                transactions: txnRes.rows,
            },
        });

    } catch (err) {
        console.error('adminGetUserWallet error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch wallet.' });
    }
};

module.exports = {
    getWallet,
    getTransactions,
    addMoney,
    payViaWallet,
    refundToWallet,
    adminGetUserWallet,
};
