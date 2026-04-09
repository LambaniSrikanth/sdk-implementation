const express = require("express");
const cors = require("cors");
const app = express();
const { register } = require("./registration")

app.use(cors());
app.use(express.json());

app.post("/api/register", register);

app.listen(5000, () => {
    console.log("API running on http://localhost:5000");
});