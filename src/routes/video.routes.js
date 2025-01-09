import Router from 'express'
import { getAllVideos } from '../controllers/video.controllers'

const router = router()

router.route('/videos').get(getAllVideos)