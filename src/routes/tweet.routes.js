import {Router} from 'express'
import {createTweet , deleteTweet, getUserTweet, updateTweet} from '../controllers/tweet.controllers.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/create-tweet").post(
    verifyJWT,
    createTweet
)

router.route("/get-user-tweet").get(
    verifyJWT,
    getUserTweet
)

router.route("/tweets/:tweetId").patch(
    verifyJWT,
    updateTweet
)

router.route("/delete-tweet/:tweetId").delete(
    verifyJWT,
    deleteTweet
)