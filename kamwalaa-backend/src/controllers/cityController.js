const pool = require('../config/db');

// @desc    Get all active cities
// @route   GET /api/v1/cities
// @access  Public
exports.getCities = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM cities WHERE is_active = true ORDER BY display_order'
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching cities:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.toString()
        });
    }
};
