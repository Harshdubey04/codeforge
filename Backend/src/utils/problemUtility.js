const axios = require('axios');

//  Language Mapping
const getLanguageById = (lang) => {
    const language = {
        "cpp":54,
        "c++": 54,
        "java": 62,
        "javascript": 63,
        "python": 71
    };
    return language[lang.toLowerCase()];
};

//  Submit Batch
const submitBatch = async (submissions) => {
    try {
        const response = await axios.post(
            'https://ce.judge0.com/submissions/batch',
            { submissions },
            {
                params: { base64_encoded: 'false' },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        // console.log("Judge0 Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Submit Error:", error.response?.data || error.message);
        return null;
    }
};

//  Delay
const waiting = (timer) => {
    return new Promise(resolve => setTimeout(resolve, timer));
};

//  Get Results  as array of  tokens
const submitToken = async (resultToken) => {

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://ce.judge0.com/submissions/batch',
                {
                    params: {
                        tokens: resultToken.join(','),
                        base64_encoded: 'false',
                        fields: '*'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Fetch Error:", error.response?.data || error.message);
            return null;
        }
    };

    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (attempts < MAX_ATTEMPTS) {
        const result = await fetchData();

        if (!result || !result.submissions) {
            throw new Error("Invalid Judge0 response");
        }

        //Successful op only if status_id >=3
        const isResultObtained = result.submissions.every(
            (r) => r.status_id > 2
        );

        if (isResultObtained) {
            return result.submissions;
        }

        attempts++;
        await waiting(1000);
    }

    throw new Error("Judge0 timeout");
};

module.exports = { getLanguageById, submitBatch, submitToken };