require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const journalsRoutes = require("./routes/journalsRoutes");

const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

app.use("/user", authRoutes);
app.use("/journals", journalsRoutes);

app.get("/", (req, res) => {
    res.send("hello node!");
})

app.listen(PORT, () => {
    console.log(`${PORT}번 포트에서 실행 중`);
})