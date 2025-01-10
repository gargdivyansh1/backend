import mongoose from "mongoose";
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'
import {asynchandler} from '../utils/asynchandler.js'
import { Subscription } from "../models/subscription.models.js";
import {User} from '../models/user.models.js'

const toggleSubscription = asynchandler(async (req, res) => {

    const {channelId, subscriberId} = req.params
    if(!mongoose.Types.ObjectId.isValid(channelId || !mongoose.Types.ObjectId.isValid(subscriberId))){
        throw new ApiError(
            400 , "The channelId is invalid"
        )
    }

    if(subscriberId === channelId){
        throw new ApiError(400, "a user cannot subscribe to themselves")
    }

    const existingUser = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    })

    // if the user is subscribed then deletet the subscription
    if(existingUser){
        await existingSubscription.deleteOne();

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 ,
                null,
                "Successfully unscribed from the channel"
            )
        )
    } else {
        // then subscription is not availble then make it 
        const newSubscription = new Subscription({
            subscriber: subscriberId,
            channel: channelId
        })

        await newSubscription.save()

        return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                newSubscription,
                "successfully subscrived to the channel"
            )
        )
    }



})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {

    const {channelId} = req.params
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(
            400 , "Invalid channel ID"
        )
    }

    // now match all the channel which are matching the channel id
    const subscriptions = await Subscription.find(
        {channel: channelId}
    ).populate('subscriber' , 'username email')

    // if no subscription are found ,throw an error
    if(subscriptions.length === 0){
        throw new ApiError(
            404 , 'No subscribers found for this channel'
        )
    }

    // now get the information
    const subscribers = subscriptions.map(sub => sub.subscriber)

    // now return the list of the subscribers 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            subscribers,
            "All the subscrobed users are fetched"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!mongoose.Types.ObjectId.isValid(subscriberId)){
        throw new ApiError(
            400 , "Invalid Subscriber ID"
        )
    }

    // now get all the users of the same subscriber id
    const channels = await Subscription.find(
        {subscriber: subscriberId}
    ).populate('channel' , "channels email")

    if(channels.length === 0){
        throw new ApiError(404, "No subscribers found for this channel")
    }

    // now map them \
    const channelList = Subscription.map(cha => cha.channel)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            channelList,
            "The channel list is fetched"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}