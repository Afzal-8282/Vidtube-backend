import { Router } from "express";
import {
    createPlaylist, 
    getPlaylistById, 
    addVideoToPlaylist, 
    removeVideoFromPlaylist, 
    deletePlaylist, 
    updatePlaylist
} from "../controllers/playlist.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const router = Router();

router.use(verifyJWT)
router.route("/").post(createPlaylist)
router.route("/:playlistId")
    .get(getPlaylistById)
    .delete(deletePlaylist)
    .patch(updatePlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)
// router.route("/user/:userId").get(getPlaylists)

export default router