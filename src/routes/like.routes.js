import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/toggle-video-like/:videoId").post(
    verifyJWT, 
    toggleVideoLike
)

router.route("/toggle-comment-like/:commentId").post(
    verifyJWT, 
    toggleCommentLike
)

router.route("/toggle-tweet-like/:tweetId").post(
    verifyJWT, 
    toggleTweetLike
)

router.route("/liked-videos").get(
    verifyJWT, 
    getLikedVideos
)

export default router