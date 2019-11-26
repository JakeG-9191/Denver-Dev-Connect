const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Post Api/Post
// Create a Post
// private
router.post("/", [auth, [
    check("text", "Text is required").not().isEmpty()
],
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select("-password");
    
        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }

});

// Get Api/Post
// Get all posts
// private
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// Get Api/Post/:id
// Get post by id
// private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post Not Found" })
        }

        res.json(post)
    } catch (err) {
        console.error(err.message);
        if (!err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post Not Found" })
        }
        res.status(500).send("Server Error")
    }
});

// Delete Api/Post/:id
// Delete a post
// private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post Not Found" })
        }

        // check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: "User is not authorized to delete"})
        }

        await post.remove();

        res.json({ msg: "Post Removed" })
    } catch (err) {
        console.error(err.message);
        if (!err.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post Not Found" })
        }
        res.status(500).send("Server Error")
    }
});

// Put Api/Post/like/:id
// Like a post
// private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check if already liked by user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post already liked" });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});

// Put Api/Post/unlike/:id
// Like a post
// private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check if already liked by user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post hasn't been liked yet" });
        }

        // get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1)

        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
});


module.exports = router;