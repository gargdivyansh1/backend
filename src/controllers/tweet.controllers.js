import {Tweet} from '../models/tweet.models.js'
import {ApiResponse} from '../utils/ApiResponse.js'

import {ApiError} from '../utils/ApiError.js'

import asynchandler from '../utils/asynchandler.js'

const createTweet = asynchandler(async (req,res) => {
    
    // sabse pehele tweet ki value lo 
    const {content} = req.body

    if(!content){
        throw new ApiError(
            400 , "Enter the tweet first"
        )
    }

    // now take the user 
    const owner = req.user?._id

    if(!owner){
        throw new ApiError(
            500 , "user not found"
        )
    }

    // now include the tweet 
    const tweet = new Tweet({
        content,
        owner 
    })

    const savedTweet = await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            savedTweet,
            "The tweet has been made"
        )
    )
})

const getUserTweet = asynchandler(async (req,res) => {

    // too isme pehele user too nikalo 
    const user = req.user?._id

    if(!user){
        throw new ApiError(
            400 , "User not found"
        )
    }

    // now get the tweets 
    const tweets = await Tweet.find({
        owner: user
    })

    // now check if there are tweet available or not
    if(!tweets.length){
        throw new ApiError(
            400 , "no tweets to show"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            tweets,
            "user tweets are fetched"
        )
    )
})

const updateTweet = asynchandler(async (req,res) => {

    // for this ask the user for the details 
    // we have to take the user from the params 
    const {tweetId} = req.params
    const {content} = req.body

    // now check if the user entered the content or not
    if(!content){
        throw new ApiError(
            400 , "Enter the data to be updated"
        )
    }

    // now find the tweet
    const tweet = await Tweet.findById(tweetId)

    // now check if the current user is the owner or not
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(
            404 , "the user is not authorized"
        )
    }

    // now update if the user is same 
    tweet.content = content 

    // save it to database 
    const savedTweet = await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            savedTweet ,
            "the tweet has been modified "
        )
    )
})

const deleteTweet = asynchandler(async (req,res) => {
    // we have to get the user or can say get the tweet 
    
    const {tweetId} = req.params

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(
            404,
            "Tweet not found"
        )
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(
            403,
            "You are not authorised to delete this tweet"
        )
    }

    await tweet.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            null , 
            "The tweet is deleted"
        )
    )
})

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet

}