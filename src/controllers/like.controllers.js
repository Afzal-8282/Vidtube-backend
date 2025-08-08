import asyncHandler from "../utils/asyncHandler.js";
<<<<<<< HEAD

const toggleVideoLike = asyncHandler(async (req, res) => {

})

const toggleCommentLike = asyncHandler(async (req, res) => {

})

const toggleTweetLike = asyncHandler(async (req, res) => {

})

const getLikedVideos = asyncHandler(async (req, res) => {

})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}
=======
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Helper: toggles like
const toggleLike = async ({ entityId, field, userId }) => {
  const existing = await Like.findOne({ [field]: entityId, likedBy: userId });

  if (existing) {
    await existing.deleteOne();
    return { liked: false };
  }

  await Like.create({ [field]: entityId, likedBy: userId });
  return { liked: true };
};

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiError(400, "Video ID is required");

  const result = await toggleLike({
    entityId: videoId,
    field: "video",
    userId: req.user._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.liked ? "Video liked" : "Video unliked"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) throw new ApiError(400, "Comment ID is required");

  const result = await toggleLike({
    entityId: commentId,
    field: "comment",
    userId: req.user._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.liked ? "Comment liked" : "Comment unliked"
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) throw new ApiError(400, "Tweet ID is required");

  const result = await toggleLike({
    entityId: tweetId,
    field: "tweet",
    userId: req.user._id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.liked ? "Tweet liked" : "Tweet unliked"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likes = await Like.find({ likedBy: req.user._id, video: { $ne: null } })
    .populate("video", "title thumbnail createdAt") // customize as needed
    .sort({ createdAt: -1 });

  const videos = likes.map((like) => like.video).filter(Boolean); // filter out deleted/null videos

  res.status(200).json(new ApiResponse(200, videos, "Liked videos fetched"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
>>>>>>> 67be600 (final commit)
