const redisClient = require('../config/redis');
const User = require('../models/user');
const { validateRegister, validateLogin } = require('../utils/validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Submission = require('../models/submission')


//Old Register without OTP
const register = async (req, res) => {
    try {
        //Validate the data
        validateRegister(req.body);
        const { firstName, lastName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "user"; //set default as user    

        const user = await User.create(req.body);

        const token = jwt.sign({ emailId: emailId, _id: user.id, role: "user" }, process.env.JWT_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 3600 * 1000, httpOnly: true },);

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role  // add this
        }

        res.status(201).json({
            message: "User registered Successfully...",
            user: reply
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

//Login Feature
const login = async (req, res) => {
    try {
        // Validate input
        validateLogin(req.body);

        const { emailId, password } = req.body;

        if (!emailId || !password) {
            throw new Error("Invalid Credentials...");
        }

        // Find user
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("Invalid Credentials...");
        }

        // Compare password
        // const match = await bcrypt.compare(password, user.password);

        //Safe check for google auth
        if (user.authProvider === "google") {
            throw new Error(
                "Please login using Google"
            );
        }


        const match =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!match) {
            throw new Error("Invalid Credentials...");
        }

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role  // add this
        }

        // Create token
        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        // Send cookie
        res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true });

        res.status(200).json({
            message: "Logged In Successfully...",
            user: reply
        });
    }
    catch (err) {
        res.status(401).send(err.message);
    }
};


//Logout Feature
const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // res.cookie('token', null, { expires: new Date(Date.now()) });
        res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
        res.send("Log Out Successfully...")
    }
    catch (err) {
        res.status(401).send(err.message);
    }
};

//Admin Register
const adminRegister = async (req, res) => {
    try {
        //Validate the data
        validate(req.body);
        const { firstName, lastName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);
        // req.body.role="admin"; //set default as admin    

        const user = await User.create(req.body);

        const token = jwt.sign({ emailId: emailId, _id: user.id, role: user.role }, process.env.JWT_KEY, { expiresIn: 3600 });
        res.cookie('token', token, { maxAge: 3600 * 1000 });

        res.status(201).send("User registered Successfully...")
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

//Delete Profile
const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);//User schema deleted

        // Delete submitted code by the user also.
        await Submission.deleteMany({ userId })
        res.status(200).send("Profile Deleted Successfully")
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = { login, logout, register, adminRegister, deleteProfile };
