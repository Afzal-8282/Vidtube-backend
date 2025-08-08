import asyncHandler from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
<<<<<<< HEAD

const createTweet = asyncHandler(async (req, res) => {});

const getUserTweets = asyncHandler(async (req, res) => {});

const updateTweet = asyncHandler(async (req, res) => {});

const deleteTweet = asyncHandler(async (req, res) => {});
=======
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new tweet
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

// Get all tweets of the logged-in user (optionally with pagination)
const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  const tweets = await Tweet.find({ owner: userId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched"));
});

// Update a tweet by its owner
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Tweet content is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(403, "You can only update your own tweets");
  }

  tweet.content = content;
  await tweet.save();

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

// Delete a tweet by its owner
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(403, "You can only delete your own tweets");
  }

  await tweet.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});
>>>>>>> 67be600 (final commit)

export { createTweet, getUserTweets, updateTweet, deleteTweet };
