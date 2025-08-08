import asyncHandler from "../utils/asyncHandler.js";
<<<<<<< HEAD

const toggleSubscription = asyncHandler(async (req, res) => {

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {

})

const getSubscribedChannels = asyncHandler(async (req, res) => {

})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
=======
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Toggle subscription: subscribe if not subscribed, else unsubscribe
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user._id;

  if (!channelId) throw new ApiError(400, "Channel ID is required");
  if (channelId.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const existing = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existing) {
    await existing.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully")
      );
  }

  const subscription = await Subscription.create({
    subscriber: userId,
    channel: channelId,
  });
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { subscribed: true, subscription },
        "Subscribed successfully"
      )
    );
});

// Get all subscribers for a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) throw new ApiError(400, "Channel ID is required");

  const subscribers = await Subscription.find({ channel: channelId })
    .populate("subscriber", "username avatar") // adjust fields as needed
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched"));
});

// Get all channels a user is subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const subscriptions = await Subscription.find({ subscriber: userId })
    .populate("channel", "username avatar")
    .sort({ createdAt: -1 });

  const channels = subscriptions.map((sub) => sub.channel);

  res
    .status(200)
    .json(new ApiResponse(200, channels, "Subscribed channels fetched"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
>>>>>>> 67be600 (final commit)
