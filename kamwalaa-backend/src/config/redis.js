/**
 * Redis Configuration
 * Purpose: Caching, session management, rate limiting, real-time pub/sub
 */
const { createClient } = require('redis');

let redisClient = null;
let isConnected = false;

const getRedisClient = async () => {
    if (redisClient && isConnected) return redisClient;

    try {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('❌ Redis: Max reconnect attempts reached');
                        return new Error('Redis reconnect failed');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('connect', () => {
            isConnected = true;
            console.log('✅ Redis connected');
        });

        redisClient.on('disconnect', () => {
            isConnected = false;
            console.warn('⚠️ Redis disconnected');
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis error:', err.message);
        });

        await redisClient.connect();
        return redisClient;

    } catch (err) {
        console.warn('⚠️ Redis unavailable — running without cache:', err.message);
        return null;
    }
};

/* ---- Cache helpers ---- */

/**
 * Get cached value
 * @param {string} key
 * @returns {any|null}
 */
const cacheGet = async (key) => {
    try {
        const client = await getRedisClient();
        if (!client) return null;
        const val = await client.get(key);
        return val ? JSON.parse(val) : null;
    } catch { return null; }
};

/**
 * Set cached value with TTL
 * @param {string} key
 * @param {any} value
 * @param {number} ttlSeconds — default 5 minutes
 */
const cacheSet = async (key, value, ttlSeconds = 300) => {
    try {
        const client = await getRedisClient();
        if (!client) return;
        await client.setEx(key, ttlSeconds, JSON.stringify(value));
    } catch { /* silent */ }
};

/**
 * Delete cached value
 * @param {string} key
 */
const cacheDelete = async (key) => {
    try {
        const client = await getRedisClient();
        if (!client) return;
        await client.del(key);
    } catch { /* silent */ }
};

/**
 * Delete keys by pattern (e.g., 'services:*')
 */
const cacheDeletePattern = async (pattern) => {
    try {
        const client = await getRedisClient();
        if (!client) return;
        const keys = await client.keys(pattern);
        if (keys.length > 0) await client.del(keys);
    } catch { /* silent */ }
};

/**
 * Store JWT refresh token in Redis with expiry
 */
const storeRefreshToken = async (userId, token, ttlSeconds = 30 * 24 * 60 * 60) => {
    await cacheSet(`refresh:${userId}:${token}`, { userId, createdAt: Date.now() }, ttlSeconds);
};

/**
 * Verify refresh token exists in Redis
 */
const verifyRefreshToken = async (userId, token) => {
    const data = await cacheGet(`refresh:${userId}:${token}`);
    return !!data;
};

/**
 * Revoke a specific refresh token
 */
const revokeRefreshToken = async (userId, token) => {
    await cacheDelete(`refresh:${userId}:${token}`);
};

/**
 * Revoke ALL refresh tokens for a user (force logout all devices)
 */
const revokeAllUserTokens = async (userId) => {
    await cacheDeletePattern(`refresh:${userId}:*`);
};

/**
 * Rate limit check using Redis sliding window
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
const checkRateLimit = async (identifier, limit = 100, windowSeconds = 60) => {
    try {
        const client = await getRedisClient();
        if (!client) return { allowed: true, remaining: limit, resetAt: 0 };

        const key = `ratelimit:${identifier}`;
        const now = Date.now();
        const windowMs = windowSeconds * 1000;

        await client.zRemRangeByScore(key, 0, now - windowMs);
        const count = await client.zCard(key);

        if (count >= limit) {
            const oldest = await client.zRange(key, 0, 0, { REV: false, BY: 'SCORE' });
            const resetAt = oldest.length ? parseInt(oldest[0]) + windowMs : now + windowMs;
            return { allowed: false, remaining: 0, resetAt };
        }

        await client.zAdd(key, [{ score: now, value: `${now}` }]);
        await client.expire(key, windowSeconds);
        return { allowed: true, remaining: limit - count - 1, resetAt: 0 };

    } catch {
        return { allowed: true, remaining: limit, resetAt: 0 };
    }
};

module.exports = {
    getRedisClient,
    cacheGet,
    cacheSet,
    cacheDelete,
    cacheDeletePattern,
    storeRefreshToken,
    verifyRefreshToken,
    revokeRefreshToken,
    revokeAllUserTokens,
    checkRateLimit,
};
