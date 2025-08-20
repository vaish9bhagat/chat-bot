const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main(chatHistory) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
       contents:chatHistory
    });
    return response.text;
}

module.exports = main;