const express = require('express');
const aiRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { askAI } = require('../controllers/aiController');

aiRouter.post('/ask', userMiddleware, askAI);

module.exports = aiRouter;