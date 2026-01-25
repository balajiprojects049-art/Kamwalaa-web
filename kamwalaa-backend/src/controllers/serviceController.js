const pool = require('../config/db');

// @desc    Get all service categories
// @route   GET /api/v1/services/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories WHERE is_active = true ORDER BY display_order'
        );

        const servicesResult = await pool.query(
            'SELECT * FROM services WHERE is_active = true ORDER BY name'
        );
        const services = servicesResult.rows;

        // Build the category tree (handle subcategories)
        const categories = result.rows;
        const rootCategories = categories.filter(c => c.parent_id === null);

        const populatedCategories = rootCategories.map(root => {
            // Find services strictly for the root category (if any)
            const rootServices = services.filter(s => s.category_id === root.id);

            const subcategories = categories.filter(c => c.parent_id === root.id).map(sub => ({
                ...sub,
                // Attach services to subcategory
                services: services.filter(s => s.category_id === sub.id)
            }));

            return {
                ...root,
                subcategories,
                services: rootServices
            };
        });

        res.status(200).json({
            success: true,
            count: populatedCategories.length,
            data: populatedCategories
        });
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.toString()
        });
    }
};

// @desc    Get services by category slug
// @route   GET /api/v1/services/category/:slug
// @access  Public
exports.getServicesByCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const { city } = req.query;

        // 1. Get Category ID first
        const categoryResult = await pool.query(
            'SELECT * FROM categories WHERE slug = $1',
            [slug]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const category = categoryResult.rows[0];

        // 2. Get Services for this category
        let query = `
            SELECT s.*, c.name as category_name 
            FROM services s
            JOIN categories c ON s.category_id = c.id
            WHERE (c.id = $1 OR c.parent_id = $1) 
            AND s.is_active = true
        `;

        const queryParams = [category.id];

        if (city) {
            query += ` AND s.city = $2`;
            queryParams.push(city);
        }

        const servicesResult = await pool.query(query, queryParams);

        res.status(200).json({
            success: true,
            count: servicesResult.rows.length,
            data: servicesResult.rows,
            category: category
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all services (for search or direct listing)
// @route   GET /api/v1/services
// @access  Public
exports.getAllServices = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM services WHERE is_active = true ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
