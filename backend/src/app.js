const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "../public")));

app.get("*name", (req, res) => {
    res.sendFile(__dirname, "../public/index.html")
})
module.exports = app;