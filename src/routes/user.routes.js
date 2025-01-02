import { upload } from '../middlewares/multer.middleware.js'
import {Router} from 'express'
import {registerUser} from '../controllers/user.controllers.js'
import {loginUser} from '../controllers/user.controllers.js'
import {logoutUser} from '../controllers/user.controllers.js'
imprt verifyJWT from ''

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

export default router