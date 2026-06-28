const express = require("express");
const router = express.Router();

const passport = require("../config/passport");
const jwt = require("jsonwebtoken");


router.get(
    "/google",
    passport.authenticate("google", {
        scope: [
            "profile",
            "email"
        ],
        prompt: "select_account"
    })
);


router.get(
    "/google/callback",

    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login"
    }),

    (req, res) => {

        const token = jwt.sign(
            {
                _id: req.user._id,
                emailId: req.user.emailId,
                role: req.user.role
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1d"
            }
        );


        res.cookie(
            "token",
            token,
            {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge:24*60*60*1000
            }
        );


        res.redirect(
            "http://localhost:5173/dashboard"
        );

    }
);


module.exports = router;