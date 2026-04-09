const lrv2 = require("./config/login_radius_sdk");
const { sendVerificationMail } = require("./utils/sendMail")
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

const register = async (req, res) => {
    try {
        console.log("payload ", req.body)
        const { email, password, mobile, fullName, } = req.body;
        const api_res = await axios.post(process.env.API_URL + process.env.ACCOUNT_CREATE,
            {
                "FullName": fullName,
                "Email": [
                    {
                        "Type": "Primary",
                        "Value": email
                    }
                ],
                "Country": {
                    "Code": "",
                    "Name": "India"
                },
                "PhoneNumbers": [
                    {
                        "PhoneType": "Mobile",
                        "PhoneNumber": mobile
                    }
                ],
                "Password": password,
                "PhoneId": "91" + mobile

            },
            {
                params: {
                    apikey: process.env.API_KEY,
                    apisecret: process.env.API_SECRET
                }
            })
        console.log("api_res is ", api_res.data)
        if (api_res && api_res.data.ID) {
            await emailverificationMail(email)
            res.status(200).json({ status: true, message: "Registered successfully" });
        } else {
            res.status(400).json({ status: false, message: "Some error had occured" });
        }
    } catch (error) {
        if (error && error.response && error.response.data) {
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }

    }
}
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("payload received is ", email)
        const api_res = await axios.post(process.env.API_URL + process.env.FORGOT_PASSWORD_TOKEN,
            {
                "email": email
            },
            {
                params: {
                    apikey: process.env.API_KEY,
                    apisecret: process.env.API_SECRET,
                    sendemail: "true",
                    resetPasswordUrl: "http://localhost:5174/password-change"
                }
            })
        console.log("api_res is ", api_res.data)
        if (api_res && api_res.data.ForgotToken) {
            res.status(200).json({ status: true, message: "password reset link is sent to the mail" });
        } else {
            res.status(400).json({ status: false, message: "some error had occured" });
        }
    } catch (error) {
        console.log("error in forgotPassword ", error);
        if (error && error.response && error.response.data) {
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    }
}
const forgotPasswordByToken = async (req, res) => {
    try {
        const { password, vtoken } = req.body;
        const api_res = await axios.put(process.env.API_URL + process.env.REST_PASSWORD_BY_TOKEN,
            {
                "resettoken": vtoken,
                "password": password,
                "welcomeemailtemplate": "",
                "resetpasswordemailtemplate": ""
            },
            {
                params: {
                    apikey: process.env.API_KEY
                }
            })
        if (api_res && api_res.data.IsPosted) {
            res.status(200).json({ status: true, message: "Password set" });
        } else {
            res.status(400).json({ status: false, message: "some erorr had occured" });
        }
    } catch (error) {
        console.log("error in forgotPasswordByToken ", error);
        if (error && error.response && error.response.data) {
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }

    }
}
const emailverificationMail = async (email) => {
    try {
        const api_res = await axios.post(process.env.API_URL + process.env.EMAIL_VERIFICATION_TOKEN,
            {
                "email": email
            },
            {
                params: {
                    apikey: process.env.API_KEY,
                    apisecret: process.env.API_SECRET
                }
            })
        console.log("email verification code geneartion code response ", api_res.data)
        if (api_res && api_res.data && api_res.data.VerificationToken) {
            await sendVerificationMail(email, api_res.data.VerificationToken);
        }
        return true
    } catch (error) {
        console.log("error in emailverificationMail ", error);
        return false

    }
}
const verifyEmailByToken = async (req, res) => {
    try {
        const token = req.query.token;
        const email = req.query.email;
        if (!token || !email) {
            return res.status(400).json({
                status: false,
                message: "Token or email is  missing",
            });
        }
        const api_res = await axios.get(process.env.API_URL + process.env.EMAIL_VERIFICATION,
            {
                params: {
                    apikey: process.env.API_KEY,
                    verificationtoken: token,
                    email: email
                }
            })
        if (api_res && api_res.data.Data && api_res.data.Data.access_token) {
            res.status(200).json({ status: true, message: "Email verified", access_token: api_res.data.Data.access_token, refresh_token: api_res.data.Data.refresh_token });
        } else {
            res.status(400).json({ status: false, message: "some erorr had occured" });
        }
    } catch (error) {
        console.log("error in verifyEmailByToken ", error);
        if (error && error.response && error.response.data) {
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }

    }
}

module.exports = {
    register,
    forgotPassword,
    forgotPasswordByToken,
    verifyEmailByToken
}