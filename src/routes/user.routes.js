import { upload } from '../middlewares/multer.middleware.js'
import {Router} from 'express'
import {refrestAccessToken, registerUser} from '../controllers/user.controllers.js'
import {loginUser} from '../controllers/user.controllers.js'
import {logoutUser} from '../controllers/user.controllers.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

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

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-access-token").post(verifyJWT, refrestAccessToken)

export default router