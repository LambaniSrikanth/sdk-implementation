const express = require("express");
const cors = require("cors");
const app = express();
const { register, forgotPassword, forgotPasswordByToken, verifyEmailByToken } = require("./registration")
const { getProfileDetailsByAccessId, InvalidateAccessToken } = require("./login")

app.use(cors());
app.use(express.json());

app.post("/api/register", register);
app.post("/api/forgot-password", forgotPassword);
app.post("/api/resetPassword", forgotPasswordByToken);
app.get("/api/verifyEmail", verifyEmailByToken);
app.get("/api/profile", getProfileDetailsByAccessId);
app.get("/api/invalidateAccessToken", InvalidateAccessToken)

app.listen(5000, () => {
    console.log("API running on http://localhost:5000");
});