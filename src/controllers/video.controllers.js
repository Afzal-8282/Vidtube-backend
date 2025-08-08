import asyncHandler from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get all videos with pagination and optional filters (like published only)
const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, isPublished } = req.query;

  const filter = {};
  if (typeof isPublished !== "undefined") {
    filter.isPublished = isPublished === "true";
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: "owner",
  };

  const result = await Video.aggregatePaginate(
    Video.aggregate().match(filter),
    options
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, "Videos fetched successfully"));
});

// Publish (create) a new video
const publishAVideo = asyncHandler(async (req, res) => {
  const { videoFile, thumbnail, title, description, duration } = req.body;

  if (!videoFile || !thumbnail || !title || !description || !duration) {
    throw new ApiError(400, "All fields are required");
  }

  const video = await Video.create({
    videoFile,
    thumbnail,
    title,
    description,
    duration,
    owner: req.user._id,
    isPublished: true,
  });

  res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

// Get video by ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId).populate("owner");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update video details (only owner)
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const updates = req.body;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You can only update your own videos");
  }

  Object.assign(video, updates);
  await video.save();

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete video (only owner)
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You can only delete your own videos");
  }

  await video.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

// Toggle publish status (only owner)
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(403, "You can only update your own videos");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video is now ${video.isPublished ? "published" : "unpublished"}`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

