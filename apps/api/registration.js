const lrv2 = require("./config/login_radius_sdk");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });

const register = async (req, res) => {
    try {
        console.log("payload ", req.body)
        const { email, password, mobile, fullName, } = req.body;
        const api_res = await axios.post(process.env.API_URL + process.env.ACCOUNT_CREATE,
            {
                "FullName": "Test Account",
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
        if (api_res && api_res.ID) {
            res.status(200).json({ status: true, message: "Register api called" });
        } else if (api_res && api_res.ErrorCode && api_res.Description) {
            res.status(500).json({ status: false, message: api_res.Description });
        }
    } catch (error) {
        console.log("error in register ", error);
        if (error && error.response && error.response.data) {
            res.status(500).json({ status: false, message: error.response.data.Description });
        } else {
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }

    }
}

module.exports = {
    register
}