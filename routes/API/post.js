const express = require("express");
const router = express.Router();

// GET Api/Post
// Test Route
// Public 
router.get("/", (req, res) => res.send("Post Route"));

module.exports = router;