import User from "../models/User.js";
import { configureGeminiAI } from "../config/ai-config.js";
const INITIAL_GREETING = "Hi there! 👋 I'm your friendly AI companion. How are you feeling today? I'd love to hear about your day!";
const FRIENDLY_CONTEXT = `You are a caring and empathetic friend who wants to help. 
If the user expresses negative emotions or problems, show genuine concern and offer practical advice.
If they're happy, share their joy and encourage them to elaborate.
Keep the conversation natural and supportive.`;
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        console.log("Received message:", message);
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res
                .status(401)
                .json({ message: "User not registered OR Token malfunctioned" });
        // Format the conversation history with context
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        try {
            if (!process.env.GEMINI_API_KEY) {
                return res.status(500).json({
                    message: "Gemini API key not configured. Please set GEMINI_API_KEY in environment variables."
                });
            }
            console.log("Using Gemini AI...");
            const model = configureGeminiAI();
            // Format conversation history for Gemini
            const conversationHistory = chats.map(chat => `${chat.role === 'user' ? 'Human' : 'Assistant'}: ${chat.content}`).join('\n');
            // Create prompt with context and history
            const prompt = `${FRIENDLY_CONTEXT}\n\nConversation history:\n${conversationHistory}\n\nHuman: ${message}\nAssistant:`;
            const result = await model.generateContent(prompt);
            const aiResponse = result.response.text();
            console.log("AI Response:", aiResponse);
            user.chats.push({ content: aiResponse, role: "assistant" });
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        catch (aiError) {
            console.error("AI Error Details:", {
                name: aiError.name,
                message: aiError.message,
                stack: aiError.stack,
                details: aiError
            });
            return res.status(500).json({
                message: "Error with AI service",
                error: aiError.message
            });
        }
    }
    catch (error) {
        console.error("Server Error Details:", error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        // If user has no chats, add the initial greeting
        if (user.chats.length === 0) {
            user.chats.push({ content: INITIAL_GREETING, role: "assistant" });
            await user.save();
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        // Add initial greeting after clearing chat
        user.chats.push({ content: INITIAL_GREETING, role: "assistant" });
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map