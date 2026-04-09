const lrv2 = require("./config/login_radius_sdk");
const axios = require("axios");

const getProfileDetailsByAccessId = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const api_res = await axios.get(
            process.env.API_URL + process.env.PROFILE_DETAILS,
            {
                params: {
                    apikey: process.env.API_KEY
                },
                headers: {
                    // Authorization: `Bearer ${token}`
                    Authorization: token
                }
            }
        );
        // console.log("api_res is ", api_res.data)
        if (api_res && api_res.data.Uid) {
            const { Uid, FullName, Email, ID, EmailVerified, PhoneId } = api_res.data
            let user_data = { Uid, FullName, ID, verifiedEmail: EmailVerified, mobile_number: PhoneId };
            if (Email && Email.length > 0) {
                user_data.email = Email[0].Value;
            }
            res.status(200).json({ status: true, data: user_data });
        } else {
            res.status(400).json({ status: false, message: "some error had occured" });
        }
    } catch (error) {
        if (error && error.response && error.response.data) {
            console.log("error in getProfileDetailsByAccessId ", error.response.data);
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
}

const InvalidateAccessToken = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const api_res = await axios.get(
            process.env.API_URL + process.env.INVALIDATE_ACCESS_TOKEN,
            {
                params: {
                    apikey: process.env.API_KEY
                },
                headers: {
                    // Authorization: `Bearer ${token}`
                    Authorization: token
                }
            }
        );
        if (api_res && api_res.data.IsPosted) {
            res.status(200).json({ status: true, message: "access token is invalidated" });
        } else {
            res.status(400).json({ status: false, message: "some error had occured" });
        }
    } catch (error) {
        if (error && error.response && error.response.data) {
            console.log("error in InvalidateAccessToken ", error.response.data);
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const api_res = await axios.post(process.env.API_URL + process.env.LOGIN_API,
            {
                "email": email,
                "password": password
            },
            {
                params: {
                    apikey: process.env.API_KEY,
                }
            })
        if (api_res && api_res.data && api_res.data.access_token) {
            res.status(200).json({ status: true, message: "Logged In successfully", access_token: api_res.data.access_token });
        }
    } catch (error) {
        if (error && error.response && error.response.data) {
            console.log("errro in login ", error.response.data);
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
}
module.exports = {
    getProfileDetailsByAccessId,
    InvalidateAccessToken,
    login
}