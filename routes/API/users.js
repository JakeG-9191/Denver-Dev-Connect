const express = require("express");
const router = express.Router();

// GET Api/Users
// Test Route
// Public 
router.get("/", (req, res) => res.send("User Route"));

module.exports = router;