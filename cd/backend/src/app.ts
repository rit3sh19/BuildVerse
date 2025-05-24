import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import moodRoutes from "./routes/mood-routes.js";
import journalRoutes from "./routes/journal-routes.js";

config();
const app = express();

//middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan("dev"));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: err.message 
  });
});

app.use("/api/v1", appRouter);
// app.use("/api/v1/mood", moodRoutes);
app.use("/api/v1/journal", journalRoutes);

export default app;
