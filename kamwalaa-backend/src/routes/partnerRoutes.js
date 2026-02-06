const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getAllPartners,
    registerPartner,
    getPartnerRequests,
    verifyPartner,
    rejectPartner,
    getCurrentPartner
} = require('../controllers/partnerController');
const { protect, adminOnly, protectAdmin } = require('../middleware/authMiddleware');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images and PDFs are allowed!'));
    }
});

// Partner Registration (Public)
router.post('/register', upload.fields([
    { name: 'aadhar_file', maxCount: 1 },
    { name: 'pan_file', maxCount: 1 }
]), registerPartner);

// Partner Profile
router.get('/me', protect, getCurrentPartner);

// Admin Routes
router.get('/requests', protectAdmin, getPartnerRequests);
router.put('/:id/verify', protectAdmin, verifyPartner);
router.put('/:id/reject', protectAdmin, rejectPartner);

// General Listings
router.get('/', getAllPartners); // Can be public or protected depending on use

module.exports = router;
