import Journal from "../models/Journal.js";
import { configureGeminiAI } from "../config/ai-config.js";
// Helper function to analyze sentiment using Gemini
const analyzeSentiment = async (text) => {
    try {
        const model = configureGeminiAI();
        const prompt = `Analyze the sentiment of this text and return a JSON with 'mood' (emotion label) and 'score' (0-1 where 1 is most positive). Text: "${text}"`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const sentiment = JSON.parse(response);
        return {
            mood: sentiment.mood || "neutral",
            score: sentiment.score || 0.5
        };
    }
    catch (error) {
        console.error("Error in analyzeSentiment:", error);
        return {
            mood: "neutral",
            score: 0.5
        };
    }
};
export const createJournalEntry = async (req, res, next) => {
    try {
        const { title, content, tags = [] } = req.body;
        const userId = res.locals.jwtData.id;
        // Analyze sentiment
        const sentimentAnalysis = await analyzeSentiment(content);
        // Create and save journal entry
        const newJournalEntry = new Journal({
            userId,
            title: title.trim(),
            content: content.trim(),
            tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
            sentiment: sentimentAnalysis,
            date: new Date()
        });
        const savedEntry = await newJournalEntry.save();
        console.log("Journal entry saved:", savedEntry._id);
        // Try to create a mood entry but don't wait for it
        try {
            await fetch("http://localhost:5000/api/v1/mood/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": req.headers.cookie || ""
                },
                body: JSON.stringify({
                    mood: sentimentAnalysis.mood,
                    sentiment: sentimentAnalysis.score,
                    notes: title,
                    chatContext: content.substring(0, 100) + "..."
                })
            });
        }
        catch (moodError) {
            console.error("Failed to create mood entry:", moodError);
            // Continue anyway as this is not critical
        }
        return res.status(201).json({
            success: true,
            message: "Journal entry created successfully",
            entry: savedEntry
        });
    }
    catch (error) {
        console.error("Error in createJournalEntry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create journal entry",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const getJournalEntries = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const entries = await Journal.find({ userId })
            .sort({ date: -1 })
            .limit(20)
            .lean();
        return res.status(200).json({
            success: true,
            entries: entries.map(entry => ({
                ...entry,
                date: entry.createdAt.toISOString()
            }))
        });
    }
    catch (error) {
        console.error("Error in getJournalEntries:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch journal entries",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const getJournalEntry = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = res.locals.jwtData.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const entry = await Journal.findOne({ _id: id, userId }).lean();
        if (!entry) {
            return res.status(404).json({
                success: false,
                message: "Journal entry not found"
            });
        }
        return res.status(200).json({
            success: true,
            entry: {
                ...entry,
                date: entry.createdAt.toISOString()
            }
        });
    }
    catch (error) {
        console.error("Error in getJournalEntry:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch journal entry",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};
export const createJournal = async (req, res, next) => {
    try {
        const { content } = req.body;
        const userId = res.locals.jwtData.id;
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }
        const journal = new Journal({
            content,
            userId,
        });
        const savedJournal = await journal.save();
        return res.status(201).json({
            message: "Journal entry created successfully",
            success: true,
            journal: {
                content: savedJournal.content,
                createdAt: savedJournal.createdAt,
            },
        });
    }
    catch (error) {
        console.error("Error in createJournal:", error);
        return res.status(500).json({
            message: "Failed to save journal entry",
            success: false
        });
    }
};
export const getUserJournals = async (req, res, next) => {
    try {
        const userId = res.locals.jwtData.id;
        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }
        const journals = await Journal.find({ userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .select("content createdAt");
        return res.status(200).json({
            message: "Journals fetched successfully",
            success: true,
            journals,
        });
    }
    catch (error) {
        console.error("Error in getUserJournals:", error);
        return res.status(500).json({
            message: "Failed to fetch journals",
            success: false
        });
    }
};
//# sourceMappingURL=journal-controllers.js.map