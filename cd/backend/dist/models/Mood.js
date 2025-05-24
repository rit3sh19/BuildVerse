import mongoose from "mongoose";
const moodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    mood: {
        type: String,
        required: true,
    },
    sentiment: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
        default: "",
    },
    chatContext: {
        type: String,
        required: true,
    }
});
export default mongoose.model("Mood", moodSchema);
//# sourceMappingURL=Mood.js.map