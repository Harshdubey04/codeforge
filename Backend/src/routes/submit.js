const express=require('express');
const userMiddleware=require('../middleware/userMiddleware');
const submitCodeRateLimit=require('../middleware/submitCodeRateLimit');
const {submitCode,runCode}=require('../controllers/userSubmission');




const submitRouter=express.Router();


submitRouter.post('/submit/:id',userMiddleware,submitCodeRateLimit,submitCode);
submitRouter.post('/run/:id',userMiddleware,runCode);


module.exports=submitRouter;