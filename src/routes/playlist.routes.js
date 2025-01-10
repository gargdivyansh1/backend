import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-playlist").post(createPlaylist)

router.route("/get-user-playlist/:userId").get(verifyJWT , getUserPlaylists)

router.route("/get-playlist-By-id/:playlistId").get(verifyJWT , getPlaylistById)

router.route("/add-video/:playlistId/:videoId").post(verifyJWT, addVideoToPlaylist)

router.route("/remove-video/:playlistId/:videoId").patch(verifyJWT, removeVideoFromPlaylist)

router.route("/delete-playlist/:playlistId").delete(verifyJWT , deletePlaylist)

router.route("/update-playlist/:playlistId").post(verifyJWT,
    updatePlaylist
)

export default router