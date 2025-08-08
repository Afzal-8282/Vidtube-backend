import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
<<<<<<< HEAD
import {ApiResponse} from "../utils/ApiResponse.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    
    if (!videoId) {
        throw new ApiError(400, "Video id is required")
    }

    
});

const addComment = asyncHandler(async (req, res) => {});

const updateComment = asyncHandler(async (req, res) => {});

const deleteComment = asyncHandler(async (req, res) => {});
=======
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const comments = await Comment.aggregate([
    { $match: { video: mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        content: 1,
        createdAt: 1,
        owner: {
          _id: 1,
          username: 1,
          email: 1,
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ]).facetPaginate({
    page,
    limit,
  });

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { content, videoId } = req.body;

  if (!content || !videoId) {
    throw new ApiError(400, "Content and video ID are required");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content || comment.content;
  await comment.save();

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
>>>>>>> 67be600 (final commit)

export { getVideoComments, addComment, updateComment, deleteComment };
