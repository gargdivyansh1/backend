import { Router } from "express";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controllers";
import{verifyJWt} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/get-video-comment/:videoId").get(verifyJWt , getVideoComment)
router.route("/add-comment/:videoId").post(verifyJWt , addComment)
router.route("/update-comment/:commentId").post(verifyJWt, updateComment)
router.route("/delete-comment/:commentId").delete(verifyJWt, deleteComment)

export default router