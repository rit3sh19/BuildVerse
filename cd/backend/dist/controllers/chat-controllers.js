import User from "../models/User.js";
import { configureGeminiAI } from "../config/ai-config.js";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        console.log("Received message:", message);
        const user = await User.findById(res.locals.jwtData.id);
        if (!user)
            return res
                .status(401)
                .json({ message: "User not registered OR Token malfunctioned" });
        // grab chats of user
        const chats = user.chats.map(({ role, content }) => ({
            role,
            content,
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        try {
            console.log("Configuring Gemini AI...");
            // Get Gemini model
            const model = configureGeminiAI();
            console.log("Sending message to Gemini...");
            const prompt = message;
            const result = await model.generateContent([prompt]);
            const response = await result.response;
            const aiResponse = response.text();
            console.log("AI Response:", aiResponse);
            // Save AI response
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
                error: aiError.message,
                details: aiError
            });
        }
    }
    catch (error) {
        console.error("Server Error Details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            details: error
        });
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
            details: error
        });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
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
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR Token malfunctioned");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map