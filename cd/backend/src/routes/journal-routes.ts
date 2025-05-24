import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { createJournal, getUserJournals } from "../controllers/journal-controllers.js";
import { validate } from "../utils/validators.js";
import { journalValidator } from "../utils/validators.js";

const journalRoutes = Router();

// Protected routes - require authentication
journalRoutes.post("/create", validate(journalValidator), verifyToken, createJournal);
journalRoutes.get("/all", verifyToken, getUserJournals);

export default journalRoutes; 