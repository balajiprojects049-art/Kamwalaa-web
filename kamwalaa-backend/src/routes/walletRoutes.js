/**
 * Wallet API Routes
 */
const express = require('express');
const router = express.Router();
const {
    getWallet,
    getTransactions,
    addMoney,
    payViaWallet,
    adminGetUserWallet,
} = require('../controllers/walletController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All wallet routes require auth
router.use(authenticate);

router.get('/', getWallet);           // GET  /api/v1/wallet
router.get('/transactions', getTransactions);     // GET  /api/v1/wallet/transactions
router.post('/add', addMoney);            // POST /api/v1/wallet/add
router.post('/pay', payViaWallet);        // POST /api/v1/wallet/pay

// Admin routes
router.get('/admin/user/:userId', requireAdmin, adminGetUserWallet); // Admin view

module.exports = router;
