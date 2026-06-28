const express=require("express");
const app=express();
require('dotenv').config();
const main=require('./config/db');
const cookieParser = require("cookie-parser");
const authRouter=require('./routes/userAuth');
const redisClient = require("./config/redis");
const problemRouter=require('./routes/problemCreator')
const submitRouter=require('./routes/submit')
const cors=require('cors');
const aiRouter = require('./routes/ai');
const session=require("express-session");
const passport=require("./config/passport");
const googleRouter =require("./routes/googleAuth");


// This origin is allowed only
app.use(cors({
    origin:"http://localhost:5173",//Access-Control-Allow-Origin
    credentials:true //Allows cookies in cross-origin requests
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({
secret:"codeforge-secret",
resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/user',authRouter);
app.use('/problem',problemRouter)
app.use('/submission',submitRouter)
app.use('/ai', aiRouter);
app.use("/auth",googleRouter);



const initializeConnection=async()=>{
    try{
        await Promise.all([main(), redisClient.connect()]);
        console.log("DB connected Successfully...");

        app.listen(process.env.PORT, () => {
            console.log("Server running at port number: " + process.env.PORT);
        });
    }
    catch(err){
        console.log("Connection Error:", err.message);
    }
}

initializeConnection();

