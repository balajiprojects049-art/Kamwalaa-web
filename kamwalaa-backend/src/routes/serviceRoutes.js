const express = require('express');
const router = express.Router();
const {
    getCategories,
    getServicesByCategory,
    getAllServices
} = require('../controllers/serviceController');

router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/category/:slug', getServicesByCategory);

module.exports = router;
