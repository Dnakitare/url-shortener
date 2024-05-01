const Url = require('../models/Url');
const shortid = require('shortid');

// Controller method for shortening a URL
exports.shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Require a valid URL
    if (!originalUrl) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate a short URL
    const shortCode = shortid.generate();

    // Construct the short URL
    const shortUrl = `${req.protocol}://${req.get('host')}/api/${shortCode}`;

    //Save the shortened URL to the database
    const url = new Url({
      originalUrl,
      shortUrl,
      shortCode,
    });
    await url.save();

    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller method for redirecting a shortened URL to its original URL
exports.redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Validate shortUrl format
    if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      return res.status(400).json({ error: 'Invalid short URL format' });
    }

    // Find the corresponding original URL in the database
    const url = await Url.findOne({ shortCode: shortCode });

    // If the short URL is not found, return 404
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found or has expired' });
    }

    // Redirect the user to the original URL
    res.redirect(url.originalUrl);
  } catch (err) {
    console.error('Error redirecting URL:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller method for retrieving information about a shortened URL
exports.getUrlInfo = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the URL by the short code
    const url = await Url.findOne({ shortCode });

    // If the URL is not found, return a 404 error
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json(url);
  } catch (error) {
    console.error('Error getting URL info:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};