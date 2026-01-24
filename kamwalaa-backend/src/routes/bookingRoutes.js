const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/user/:userId', getUserBookings);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
