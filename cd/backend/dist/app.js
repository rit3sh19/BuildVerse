import express from "express";
const app = express();
import { config } from 'dotenv';
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
config();
//Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
//Routes
app.use("/api/v1", appRouter);
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
export default app;
//# sourceMappingURL=app.js.map