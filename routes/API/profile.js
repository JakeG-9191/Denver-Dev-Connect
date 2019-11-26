const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check")

const Profile = require("../../models/Profile");
const User = require("../../models/User");

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

// Post Api/Profile
// Create or update a user profile
// private - auth needs to be added 
router.post("/", 
[ auth, [
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills are required").not().isEmpty()
]
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ erros: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(",").map(skill => skill.trim())
    }
    // build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
        // Update
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

            return res.json(profile)
        }
        // Create 
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});

// Get Api/Profile
// Get all profiles
// public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (err) {
        console.log(err.message)
        res.status(500).send("Server Error")
    }
});

// Get Api/Profile/user/:user_id
// Get all profile by user ID
// public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]);

        if(!profile) return res.status(400).json({ msg: "Profile Not Found"});
        res.json(profile);
    } catch (err) {
        console.log(err.message);
        if (err.kind == "ObjectID") {
            return res.status(400).json({ msg: "Profile Not Found"});
        }
        res.status(500).send("Server Error")
    }
});

module.exports = router;