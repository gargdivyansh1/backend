import { upload } from '../middlewares/multer.middleware.js'
import {Router} from 'express'
import {registerUser} from '../controllers/user.controllers.js'

const router = Router()

router.route("/register").post(
    // now for using the multer 
    // we use it befre the controller function
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

export default router