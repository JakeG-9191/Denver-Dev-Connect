const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path")

//DB Connection
connectDB();

// Init Middlewear
app.use(express.json({ extended: false }))

// Define Routes
app.use("/api/users", require("./routes/API/users"))
app.use("/api/auth", require("./routes/API/auth"))
app.use("/api/profile", require("./routes/API/profile"))
app.use("/api/post", require("./routes/API/post"))

// Serve static assets in production
if(process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
    })
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started on ${PORT}`))