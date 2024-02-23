const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const paymentController = require('../controllers/paymentController');

router.get('', blogController.fetchPosts);
router.get('/post/:id', blogController.fetchSinglePost);
router.post('/search', blogController.searchPost);

router.get('/about', blogController.about);
router.get('/payment/page', paymentController.loadPaymentPage);
router.post('/payment', paymentController.payment);

router.post('/newsletter', blogController.saveEmailForNewsLetter);
router.get('/newsletter/page', (req, res) => {
    res.render('newsletter_page')
});

module.exports = router;