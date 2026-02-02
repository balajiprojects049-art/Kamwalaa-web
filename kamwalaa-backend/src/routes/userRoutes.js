const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUserAddresses,
    addUserAddress,
    getAllUsers,
    deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getAllUsers);
router.delete('/:id', protect, adminOnly, deleteUser);
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/:id/addresses', protect, getUserAddresses);
router.post('/:id/addresses', protect, addUserAddress);

module.exports = router;
