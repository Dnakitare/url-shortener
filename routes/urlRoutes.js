const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Route fo shortening a URL
router.post('/shorten', urlController.shortenUrl);

// Route for redirecting from the short URL to the original URL
router.get('/:shortCode', urlController.redirectUrl);

// Route for retrieving information about a shortened URL
router.get('/info/:shortCode', urlController.getUrlInfo);

// Route fo shortening a URL
router.post('/shorten', urlController.shortenUrl);

module.exports = router;