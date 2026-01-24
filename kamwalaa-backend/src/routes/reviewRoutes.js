const express = require('express');
const router = express.Router();
const {
    submitReview,
    getServiceReviews,
    getPartnerReviews
} = require('../controllers/reviewController');

router.post('/', submitReview);
router.get('/service/:serviceId', getServiceReviews);
router.get('/partner/:partnerId', getPartnerReviews);

module.exports = router;
