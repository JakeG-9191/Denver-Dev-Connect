const express = require("express");
const connectDB = require("./config/db");
const app = express();

//DB Connection
connectDB();

// Init Middlewear
app.use(express.json({ extended: false }))

app.get("/", (req, res) => res.send("API Running"))

// Define Routes
app.use("/api/users", require("./routes/API/users"))
app.use("/api/auth", require("./routes/API/auth"))
app.use("/api/profile", require("./routes/API/profile"))
app.use("/api/post", require("./routes/API/post"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Started on ${PORT}`))