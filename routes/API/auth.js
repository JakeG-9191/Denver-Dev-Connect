const express = require("express");
const router = express.Router();

// GET Api/auth
// Test Route
// Public 
router.get("/", (req, res) => res.send("Auth Route"));

module.exports = router;