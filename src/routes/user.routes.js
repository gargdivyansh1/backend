import { upload } from '../middlewares/multer.middleware.js'
import { Router } from 'express'
import { refrestAccessToken, changeCurrentPassword, registerUser, currentUser, updateProfile, updateAvatar, updateCoverImage, getUserChannelProfile, watchHistoryPipeline } from '../controllers/user.controllers.js'
import { loginUser } from '../controllers/user.controllers.js'
import { logoutUser } from '../controllers/user.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

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

router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, currentUser)
router.route("/update-profile").patch(verifyJWT, updateProfile)

router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)
router.route("/update-coverimage").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)

// COLON IS IMPORTANT 
// and the name should be same as the name taken while taking the data 
// as the information is taking from the params
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, watchHistoryPipeline)

export default router