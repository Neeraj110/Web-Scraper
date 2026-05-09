import { Router } from "express";

import authMiddleware from "../middleware/auth.js";
import {
  getStories,
  getStoryById,
  toggleBookmark,
} from "../controllers/storyController.js";

const router = Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", authMiddleware, toggleBookmark);

export default router;
