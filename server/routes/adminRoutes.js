const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login/page', adminController.goToLoginPage);
router.post('/register', adminController.register);



module.exports = router;