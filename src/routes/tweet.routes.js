import {Router} from 'express'
import {createTweet , deleteTweet, getUserTweet, updateTweet} from '../controllers/tweet.controllers.js'
import { verifyJWt } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/create-tweet").post(
    verifyJWt,
    createTweet
)

router.route("/get-user-tweet").get(
    verifyJWt,
    getUserTweet
)

router.route("/tweets/:tweetId").patch(
    verifyJWt,
    updateTweet
)

router.route("/delete-tweet/:tweetId").delete(
    verifyJWt,
    deleteTweet
)

export default router