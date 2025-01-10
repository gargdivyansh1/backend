import Router from 'express'
import { AddAVideo, deleteVideo, getAllVideos, getvideosById, togglePublishStatus, updateVideo } from '../controllers/video.controllers.js'
import {verifyJWt} from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/videos').get(getAllVideos)
router.route('/add-video').post(AddAVideo)
router.route("/get-video-By-Id/:{videoId").get(verifyJWt , getvideosById)
router.route("/update-video/:videoId").patch(verifyJWt, updateVideo)
router.route("/delete-video/:videoId").delete(verifyJWt, deleteVideo)
router.route("/toggle-video/:{videoId").patch(verifyJWt, togglePublishStatus)

export default router