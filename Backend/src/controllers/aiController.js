const axios = require("axios");


const askAI = async (req, res) => {

    try {

        const {
            question,
            problemTitle,
            problemDescription,
            conversationHistory
        } = req.body;


        if (!question || !problemTitle) {

            return res.status(400).json({
                message: "Question and problem title are required"
            });

        }



        const systemPrompt = `
You are CodeForge AI Assistant.

The user is solving this coding problem:

Title:
${problemTitle}


Description:
${problemDescription}


Rules:
1. Give hints only.
2. Never provide complete solution code.
3. Explain algorithms and concepts.
4. Ask guiding questions.
5. Help the user think.
6. Keep answers concise.
`;



        const messages = [

            {
                role: "system",
                content: systemPrompt
            },


            ...(conversationHistory || []).map(msg => ({

                role: msg.role === "model"
                    ? "assistant"
                    : "user",

                content: msg.content

            })),


            {
                role: "user",
                content: question
            }

        ];




        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                // Free coding model
                 model:"openai/gpt-4o",

                messages,

                temperature:0.7,

                max_tokens:500

            },


            {

                headers: {

                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,


                    "Content-Type":
                        "application/json",


                    "HTTP-Referer":
                        "http://localhost:5173",


                    "X-Title":
                        "CodeForge AI"

                }

            }

        );



        const answer =
            response.data.choices[0].message.content;



        res.status(200).json({

            response: answer

        });



    }
    catch (error) {

        console.log(
            "OpenRouter Error:",
            error.response?.data || error.message
        );


        res.status(500).json({

            message:
                "AI service error"

        });

    }

};



module.exports = {
    askAI
};