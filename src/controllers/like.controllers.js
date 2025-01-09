import { asynchandler as asyncHandler}  from "../utils/asynchandler"
import {Like} from '../models/like.models.js'
import {Tweet} from '../models/tweet.models.js'
import {Comment} from '../models/comment.models.js'
import {Video} from '../models/video.models.js'
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"

const toggleVideoLike = asyncHandler(async (req, res) => {

    // getting the user
    const user = req.user._id

    // getting the video id
    const {videoId} = req.params

    // now check 
    if(!user || !videoId){
        throw new ApiError(
            400 ,
            "Invalid request"
        )
    }

    // now get the video 

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(
            404 ,
            "Video is not available"
        )
    }

    // getting the existing like 
    const existingLike = await Like.findOne({
        likedBy: user,
        video: videoId
    })

    // now check if it already liked or not 
    if(existingLike){
        // then delete
        await existingLike.deleteOne()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , 
                {liked: false},
                "The like has been removed from the video"
            )
        )
    } else {

        // create thelike 
        await Like.create({
            video: videoId,
            likedBy: user
        })

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {liked: true},
                "The video is liked successfully"
            )
        )
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {

    // getting the user 
    const user = req.user._id

    // getting the comment id 
    const {commentId} = req.params

    if(!user || !commentId){
        throw new ApiError(
            404 , 
            "Invalid request"
        )
    }

    // checking if the comment is available or not
    const comment = await Comment.findById(commentId)

    // check for the comment
    if(!comment){
        throw new ApiError(
            404,
            "Comment not found"
        )
    }

    // checking if it is liked or not
    const existingLike = await Like.findOne({
        likedBy: user,
        comment: commentId
    })

    if(existingLike){
        // deletet the like 
        await existingLike.deleteOne()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 , 
                {liked: false},
                "THe comment like has been removed"
            )
        )
    } else {

        // make it liked 
        await Like.create(
            {
                comment: commentId,
                likedBy: user
            }
        )

        return res
        .status(200)
        .json(
            new ApiResponse(
                200 ,
                {liked: true},
                "The comment is liked successfully"
            )
        )
    }
    

})

const toggleTweetLike = asyncHandler(async (req, res) => {

    // getting user from the database
    const user = req.user._id

    // getting the current user 
    const {tweetId} = req.params

    // checking if the user are same or not
    if(!user || !tweetId){
        throw new ApiError(
            400 , 
            "Invalid Request"
        )
    }

    // checking if the tweet available or not 
    // if not then throw error here only
    const tweet = await Tweet.findById(tweetId)

    // now check if it is present or not 
    if(!tweet){
        throw new ApiError(
            404, 
            "NO tweet available"
        )
    }
    
    const existingLike = await Like.findOne(
        {
            likedBy: user,
            tweet: tweetId
        }
    )

    if(existingLike){
        // remove the like 
        await existingLike.deleteOne()
        return res
        .status(200)
        .json(
            new ApiResponse(
                200 ,
                {liked: false },
                "The Like has been removed successfully"
            )
        )
    } else {
        await Like.create({
            tweet: tweetId ,
            likedBy: user
        })
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {liked: true},
                "The tweet has been liked"
            )
        )
    }


})

const getLikedVideos = asyncHandler(async (req, res) => {
    
    // get the user 
    const userId = req.user._id

    if(!userId){
        throw new ApiError(404 , "The user is not found")
    }

    // find all the liked videos 
    // here we are finding the liked videos by the likedBy user id 
    // and we are not including the videos which are not having the video
    // then 
    const likedVideos = await Like.find(
        {
            likedBy: userId , 
            video: {
                $ne: null
            }
        }
    ).populate('video' , 'title thumbnails views')
    // this populate method is used for getting the whole data in the video instead of onlyid 
    // and the second part help in fixing the values which are required only these 3 values with id is included in the data in the video


    // map on the liked video
    const likedVideo = likedVideos.map(like => like.video)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            likedVideo,
            "The videos are fetched successffully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}