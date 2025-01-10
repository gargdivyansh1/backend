import { Router } from "express";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-playlist").post(createPlaylist)

router.route("/get-user-playlist/:userId").get(verifyJWt , getUserPlaylists)

router.route("/get-playlist-By-id/:playlistId").get(verifyJWt , getPlaylistById)

router.route("/add-video/:playlistId/:videoId").post(verifyJWt, addVideoToPlaylist)

router.route("/remove-video/:playlistId/:videoId").patch(verifyJWt, removeVideoFromPlaylist)

router.route("/delete-playlist/:playlistId").delete(verifyJWt , deletePlaylist)

router.route("/update-playlist/:playlistId").post(verifyJWt,
    updatePlaylist
)

export default router