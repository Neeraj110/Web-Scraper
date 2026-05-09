import mongoose from 'mongoose';

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    postedAt: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({ url: 1 }, { unique: true });

const Story = mongoose.model('Story', storySchema);

export default Story;