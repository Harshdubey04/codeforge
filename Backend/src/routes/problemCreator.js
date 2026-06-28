const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
const {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblemById,
    getAllProblem,
    solvedAllProblemByUser,
    submittedProblem,
    getAllUserSubmissions,
    getLeaderboard,
    getSubmissionHeatmap
} = require('../controllers/userProblem');

// Admin routes
problemRouter.post('/create', adminMiddleware, createProblem);
problemRouter.put('/update/:id', adminMiddleware, updateProblem);
problemRouter.delete('/delete/:id', adminMiddleware, deleteProblem);

// User routes
problemRouter.get('/problemById/:id', userMiddleware, getProblemById);
problemRouter.get('/getAllProblem', userMiddleware, getAllProblem);
problemRouter.get('/problemSolvedByUser', userMiddleware, solvedAllProblemByUser);
problemRouter.get('/submittedProblem/:pid', userMiddleware, submittedProblem);
problemRouter.get('/allUserSubmissions', userMiddleware, getAllUserSubmissions);
problemRouter.get('/leaderboard', userMiddleware, getLeaderboard);
problemRouter.get('/heatmap', userMiddleware, getSubmissionHeatmap);

module.exports = problemRouter;