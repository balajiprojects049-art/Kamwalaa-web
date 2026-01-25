const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUserAddresses,
    addUserAddress,
    getAllUsers
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/:id', getUserProfile);
router.put('/:id', updateUserProfile);
router.get('/:id/addresses', getUserAddresses);
router.post('/:id/addresses', addUserAddress);

module.exports = router;
