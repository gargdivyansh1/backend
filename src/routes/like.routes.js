import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";
import { verifyJWt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/toggle-video-like/:videoId").post(
    verifyJWt, 
    toggleVideoLike
)

router.route("/toggle-comment-like/:commentId").post(
    verifyJWt, 
    toggleCommentLike
)

router.route("/toggle-tweet-like/:tweetId").post(
    verifyJWt, 
    toggleTweetLike
)

router.route("/liked-videos").get(
    verifyJWt, 
    getLikedVideos
)

export default router