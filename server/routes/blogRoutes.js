const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');


router.get('', blogController.blogHome);
router.get('/about', blogController.about);

module.exports = router;