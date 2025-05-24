import { GoogleGenerativeAI } from "@google/generative-ai";

export const configureGeminiAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
        },
    });
};

// Default model to use - a model that's hosted on Hugging Face
export const DEFAULT_MODEL = "tiiuae/falcon-7b-instruct";

// Default parameters for chat completion
export const DEFAULT_PARAMS = {
    max_new_tokens: 100,
    temperature: 0.7,
    top_p: 0.95,
    do_sample: true
}; 