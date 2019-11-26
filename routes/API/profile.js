const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User")

// GET Api/Profile/me
// Get user profile
// private - auth needs tobe added 
// Api/profile will be all profiles
// Test Route
// Public 
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(400).json({ msg: "No Profile for this User"})
        }
        res.json(profile)
    } catch (err) {
        console.loglog(err.message)
        res.status(500).send("Server Error");
    }
});

module.exports = router;