import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import scrapeRoutes from "./routes/scrapeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "hacker-news-story-hub" });
});

app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api", scrapeRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
