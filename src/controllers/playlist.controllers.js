import asyncHandler from "../utils/asyncHandler.js";
<<<<<<< HEAD

const createPlaylist = asyncHandler(async (req, res) => {

})

const getPlaylistById = asyncHandler(async (req, res) => {

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    
})

const deletePlaylist = asyncHandler(async (req, res) => {

})

const updatePlaylist = asyncHandler(async (req, res) => {

})

export {    
    createPlaylist,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist    
}
=======
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

// Create Playlist
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videos = [] } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    videos,
    owner: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, playlist, "Playlist created"));
});

// Get Playlist by ID
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId)
    .populate("videos", "title thumbnail duration")
    .populate("owner", "username");

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched"));
});

// Add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can modify this playlist");
  }

  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

// Remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { videoId } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can modify this playlist");
  }

  playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

// Delete playlist
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can delete this playlist");
  }

  await playlist.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Playlist deleted"));
});

// Update playlist (name/description only)
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Only the owner can update this playlist");
  }

  if (name) playlist.name = name;
  if (description) playlist.description = description;

  await playlist.save();

  res.status(200).json(new ApiResponse(200, playlist, "Playlist updated"));
});

export {
  createPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
>>>>>>> 67be600 (final commit)
