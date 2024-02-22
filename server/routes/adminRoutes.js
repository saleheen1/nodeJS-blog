const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login/page', adminController.goToLoginPage);
router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/dashboard', adminController.authMiddleware, adminController.loadDashboard);
router.get('/add-post/page', adminController.authMiddleware, adminController.loadDashboard);



module.exports = router;