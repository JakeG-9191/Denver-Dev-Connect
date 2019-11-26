const express = require("express");
const router = express.Router();

// GET Api/Profile
// Test Route
// Public 
router.get("/", (req, res) => res.send("Profile Route"));

module.exports = router;