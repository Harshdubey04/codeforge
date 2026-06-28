import axiosClient from "../utils/axiosInstance";

export const getAllProblems = async () => {
    const response = await axiosClient.get("/problem/getAllProblem");
    return response.data;
};

export const getProblemById = async (id) => {
    const response = await axiosClient.get(`/problem/problemById/${id}`);
    return response.data;
};

export const getSolvedProblems = async () => {
    const response = await axiosClient.get("/problem/problemSolvedByUser");
    return response.data;
};

export const getProblemSubmissions = async (problemId) => {
    const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
    return response.data;
};

export const getAllUserSubmissions = async () => {
    const response = await axiosClient.get('/problem/allUserSubmissions');
    return response.data;
};

export const createProblem = async (data) => {
    const response = await axiosClient.post('/problem/create', data);
    return response.data;
};

export const updateProblem = async (id, data) => {
    const response = await axiosClient.put(`/problem/update/${id}`, data);
    return response.data;
};

export const deleteProblem = async (id) => {
    const response = await axiosClient.delete(`/problem/delete/${id}`);
    return response.data;
};

export const getLeaderboard = async () => {
    const response = await axiosClient.get('/problem/leaderboard');
    return response.data;
};

export const getSubmissionHeatmap = async () => {
    const response = await axiosClient.get('/problem/heatmap');
    return response.data;
};

export const askAI = async (question, problemTitle, problemDescription, conversationHistory) => {
    const response = await axiosClient.post('/ai/ask', {
        question,
        problemTitle,
        problemDescription,
        conversationHistory
    });
    return response.data;
};