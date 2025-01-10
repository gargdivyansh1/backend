import { Router } from "express";
import {verifyJWt} from "../middlewares/auth.middleware.js"
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controllers";

const router = Router()

router.route("/toggle-subscription/:channelId/:subscriberId").get(verifyJWt, toggleSubscription)

router.route("/get-channel-subscribers/:channelId").get(verifyJWt, getUserChannelSubscribers)

router.route("/get-subscribed-channel/:subscriberId").get(verifyJWt, getSubscribedChannels)

export default router