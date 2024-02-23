const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login/page', adminController.goToLoginPage);
router.post('/login', adminController.login);
router.post('/register', adminController.register);
router.get('/dashboard', adminController.authMiddleware, adminController.loadDashboard);
router.get('/add-post/page', adminController.authMiddleware, adminController.loadAddPostPage);
router.post('/create-post', adminController.authMiddleware, adminController.createPost);
router.put('/edit-post/:id', adminController.authMiddleware, adminController.editPost);
router.get('/edit-post/page/:id', adminController.authMiddleware, adminController.loadEditPostPage);
router.delete('/delete-post/:id', adminController.authMiddleware, adminController.deletePost);
router.get('/edit-profile/page', adminController.authMiddleware, adminController.loadEditProfilePage);
router.put('/edit-profile/:id', adminController.authMiddleware, adminController.editProfile);
router.delete('/delete-user/:id', adminController.authMiddleware, adminController.deleteUser);

router.get('/logout', adminController.authMiddleware, adminController.logOut);



module.exports = router;