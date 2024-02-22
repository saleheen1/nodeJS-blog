const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.get('', blogController.fetchPosts);
router.get('/post/:id', blogController.fetchSinglePost);
router.post('/search', blogController.searchPost);

router.get('/about', blogController.about);


module.exports = router;