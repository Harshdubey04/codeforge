const Problem = require('../models/problem');
const { findByIdAndUpdate, findByIdAndDelete } = require('../models/user');
const {getLanguageById,submitBatch,submitToken} = require('../utils/problemUtility');
const User = require('../models/user');
const Submission=require('../models/submission');

const createProblem = async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        problemCreator
    } = req.body;

    try {

        // Validate reference solutions using Judge0
        for (const { language, completeCode } of referenceSolution) {
            
            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({
                    message: `Unsupported language: ${language}`
                });
            }

            const allTestCases = [...visibleTestCases, ...hiddenTestCases];

            const submissions = allTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);

            if (!submitResult || !Array.isArray(submitResult)) {
                    return res.status(500).json({
                        message: "Judge0 submission failed"
                });
            }

            const resultToken = submitResult.map((value) => value.token);

            const testResult=await submitToken(resultToken);
            // console.log(testResult);

            for(const test of testResult){
                if(test.status_id!=3){
                    // return res.status(400).send("Error Occured");
                        return res.status(400).json({
                        message: "Reference solution failed",
                        error: test.stderr || test.compile_output || "Wrong Answer",
                        status: test.status?.description
                    });
                    
                }
            }

        }

        //We can store problem in our DB
        const userProblem=await Problem.create({
            ...req.body,
            problemCreator:req.user._id //Attaching the problem creater id also
        })
        res.status(200).send("Problem saved successfully")
    } 
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const updateProblem=async (req,res)=>{
    const id=req.params.id;
        const {
        title,
        description,
        difficulty,
        tags,
        visibleTestCases,
        hiddenTestCases,
        startCode,
        referenceSolution,
        problemCreator
    } = req.body;

    try{
        if(!id){
            return res.status(400).send("Missing Id");
        }

        const dsaProblem=await Problem.findById(id);
        if(!dsaProblem){
            return res.status(404).send("Could not find problem with given Id");
        }

        // Validate reference solutions using Judge0
        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);

            if (!languageId) {
                return res.status(400).json({
                    message: `Unsupported language: ${language}`
                });
            }

            //Creating a batch submittion
            const allTestCases = [...visibleTestCases, ...hiddenTestCases];

            const submissions = allTestCases.map((testcase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testcase.input,
                expected_output: testcase.output
            }));

            const submitResult = await submitBatch(submissions);

            if (!submitResult || !Array.isArray(submitResult)) {
                    return res.status(500).json({
                        message: "Judge0 submission failed"
                });
            }

            const resultToken = submitResult.map((value) => value.token);

            const testResult=await submitToken(resultToken);

            for(const test of testResult){
                if(test.status_id!=3){
                        return res.status(400).json({
                        message: "Reference solution failed",
                        error: test.stderr || test.compile_output || "Wrong Answer",
                        status: test.status?.description
                    });
                    
                }
            }

        }

        const updatedProblem=await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true});
        res.status(200).send(updatedProblem);
    }
    catch(err){
        res.status(404).send(err.message);
    }

}

const deleteProblem=async(req,res)=>{
    
    const id=req.params.id;

    try{
        if(!id){
            return res.status(400).send("Missing Id");
        }
        const deletedProblem=await Problem.findByIdAndDelete(id);
        if(!deletedProblem){
            return res.status(404).send("Problem is missing");
        }
        else{
            return res.status(200).send("Problem Deleted Successfully")
        }
    }
    catch(err){
        res.status(404).send(err.message);
    }
}


const getProblemById = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            return res.status(400).send("Missing Id");
        }
        const findProblem = await Problem.findById(id); // remove .select() so all fields return
        if (!findProblem) {
            return res.send("Could not find the problem");
        }
        res.send(findProblem);
    } catch (err) {
        res.status(404).send(err.message);
    }
};

const getAllProblem=async(req,res)=>{
        try{
    
        const allProblem=await Problem.find({}).select('_id title difficulty tags');
        if(allProblem.length==0){
            return res.status(404).send("Could not find the problem");
        }
        else{
            res.status(200).send(allProblem); 
        }
    }
    catch(err){
        res.status(404).send(err.message);
    }
}

const solvedAllProblemByUser=async(req,res)=>{
    try{
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id title difficulty tags"
        });//select all the data of schema reffered by the user schema 
        // replaces the referenced ObjectIds(problemIds) with actual documents from the referenced collection

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json({
            solvedProblems: user.problemSolved
        });

    }
    catch(err){
        res.status(500).send(err.message);
    }
}

const submittedProblem = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.pid;

        const ans = await Submission.find({ userId, problemId })
            .sort({ createdAt: -1 });

        res.status(200).json({ submissions: ans });

    } catch (err) {
        res.status(500).send(err.message);
    }
};


const getAllUserSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;

        const submissions = await Submission.find({ userId })
            .populate('problemId', 'title difficulty')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({ submissions });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getLeaderboard = async (req, res) => {
    try {
        // const users = await User.find({role: "user"})
        //     .select('firstName lastName emailId problemSolved')
        //     .sort({ 'problemSolved': -1 })
        //     .limit(50);

        //  const leaderboard = users.map((user, index) => ({
        //     rank: index + 1,
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     emailId: user.emailId,
        //     totalSolved: user.problemSolved.length,
        // }));

        const users = await User.find({ role: "user" })
        .select('firstName lastName emailId problemSolved');

        const leaderboard = users
        .map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            totalSolved: user.problemSolved.length
        }))
        .sort((a, b) => b.totalSolved - a.totalSolved)
        .map((user, index) => ({
            rank: index + 1,
            ...user
        }));

       

        res.status(200).json({ leaderboard });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getSubmissionHeatmap = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all submissions from last 365 days
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const submissions = await Submission.find({
            userId,
            createdAt: { $gte: oneYearAgo }
        }).select('createdAt status');

        // Count submissions per day
        const heatmap = {};
        submissions.forEach(sub => {
            const date = sub.createdAt.toISOString().split('T')[0];
            heatmap[date] = (heatmap[date] || 0) + 1;
        });

        // Calculate streak
        let streak = 0;
        const today = new Date();
        for (let i = 1; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            if (heatmap[dateStr]) {
                streak++;
            } else {
                break;
            }
        }

        res.status(200).json({ heatmap, streak });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    createProblem, updateProblem, deleteProblem,
    getProblemById, getAllProblem, solvedAllProblemByUser,
    submittedProblem, getAllUserSubmissions,
    getLeaderboard, getSubmissionHeatmap
};
