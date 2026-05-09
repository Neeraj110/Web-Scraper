import Story from "../models/Story.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getStories = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const [stories, total] = await Promise.all([
    Story.find()
      .sort({ points: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Story.countDocuments(),
  ]);

  res.json({
    status: "success",
    results: stories.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    stories,
  });
});

const getStoryById = asyncHandler(async (req, res, next) => {
  const story = await Story.findById(req.params.id).lean();

  if (!story) {
    return next(new AppError("Story not found", 404));
  }

  res.json({
    status: "success",
    story,
  });
});

const toggleBookmark = asyncHandler(async (req, res, next) => {
  const storyId = req.params.id;
  const story = await Story.findById(storyId).lean();

  if (!story) {
    return next(new AppError("Story not found", 404));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isBookmarked = user.bookmarks.some(
    (bookmarkId) => bookmarkId.toString() === storyId,
  );

  if (isBookmarked) {
    user.bookmarks = user.bookmarks.filter(
      (bookmarkId) => bookmarkId.toString() !== storyId,
    );
  } else {
    user.bookmarks.push(storyId);
  }

  await user.save();

  res.json({
    status: "success",
    bookmarked: !isBookmarked,
    bookmarks: user.bookmarks,
  });
});

export { getStories, getStoryById, toggleBookmark };
