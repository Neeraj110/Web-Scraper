import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Story title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
    },
    url: {
      type: String,
      required: [true, "Story URL is required"],
      trim: true,
      unique: [true, "Story URL must be unique"],
      index: true,
    },
    points: {
      type: Number,
      default: 0,
      min: [0, "Points cannot be negative"],
    },
    author: {
      type: String,
      required: [true, "Story author is required"],
      trim: true,
      minlength: [1, "Author cannot be empty"],
    },
    postedAt: {
      type: String,
      required: [true, "Post time is required"],
      trim: true,
      minlength: [1, "Posted time cannot be empty"],
    },
  },
  {
    timestamps: true,
  },
);

storySchema.pre("save", async function (next) {
  if (this.isModified("url")) {
    try {
      await mongoose.connection
        .collection("stories")
        .dropIndex("url_1")
        .catch(() => {});
    } catch (_error) {
      // Index might not exist yet
    }
  }
  next();
});

const Story = mongoose.model("Story", storySchema);

export default Story;
