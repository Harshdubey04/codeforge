const express=require('express');

const authRouter=express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require('../controllers/userAuthent')
const userMiddleware=require('../middleware/userMiddleware')
const adminMiddleware=require('../middleware/adminMiddleware')


//Register
//Normal user
authRouter.post('/register',register);
//Admin
authRouter.post('/admin/register',adminMiddleware,adminRegister);
//Login
authRouter.post('/login',login);
//Logout
authRouter.post('/logout',userMiddleware,logout);
//Delete Profile
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
//For persistent login
authRouter.get('/check', userMiddleware, (req, res) => {
    const reply = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailId: req.user.emailId,
        _id: req.user._id,
        role: req.user.role  // ← this was missing
    }
    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
});

//Get Profile
// authRouter.post('/getProfile',getProfile);

module.exports=authRouter;

