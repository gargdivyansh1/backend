import mongoose from 'mongoose'
import {asynchandler} from '../utils/asynchandler.js'
import {Video} from '../models/video.models.js'
import {Comment} from '../models/comment.models.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {ApiError} from '../utils/ApiError.js'

const getVideoComment = asynchandler(async (req,res) => {

    const {videoId} = req.params
    if(!videoId){
        throw new ApiError(
            400 , "Invalid request"
        )
    }

    const {page = 1 , limit = 10} = req.query // here we are using the aggregate pipelines 

    // find the video 
    const videoFound = await Video.findById(videoId)

    if(!videoFound){
        throw new ApiError(
            404 , "The video is not found"
        )
    }

    // now we will use the aggregate pipelines for fetching the comment of the video 
    const aggregateQuery = Comment.aggregate([
        {
            $match: {
                video : mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        { $unwind: '$ownerDetails' },
        {
            $project: {
                content: 1,
                createdAt: 1 ,
                'ownerDetails.username': 1,
                'ownerDetails.profilePicture': 1,
            }
        }
    ])

    const options = {
        page : parseInt(page, 10),
        limit : Math.min(parseInt(limit, 10) , 100),
        customLabels: {
            totalDocs: 'totalComments',
            docs: 'comments'
        }
    }

    const result = await Comment.aggregatePaginate(aggregateQuery , options)

    if(!result.comments.length){
        throw new ApiError(
            400 , "The comments are not found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            {
                success: true,
                message: "The commets are feteched",
                data: result
            }
        )
    )
})

const addComment = asynchandler(async (req,res) => {

    // sabse pehele jiss video pe comment add krnahia 
    const {videoId} = req.params
    // check validation
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(
            400 , "Invalid request"
        )
    }

    // fir kya add krna hai 
    const {content} = req.body
    if(!content || content.trim().length === 0){
        throw new ApiError(
            400 , "The content is empty"
        )
    }

    // check if the video is available or not
    const videoFound = await Video.findById(videoId)
    if(!videoFound){
        throw new ApiError(
            404 , "The video is not found"
        )
    }

    // now getting the user 
    const user_id = req.user._id

    // now add comment 
    const newComment = new Comment({
        content,
        video: mongoose.Types.ObjectId(videoId),
        owner: mongoose.Types.ObjectId(user_id)
    })

    // now save it 
    const saved = await newComment.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            {data: saved},
            "The new comment is added successfully"
        )
    )

})

const updateComment = asynchandler(async (req,res) => {

    // get the comment id
    const {commentId} = req.params
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(
            400 , "The invalid request"
        )
    }

    // get the new comment which is to be updated
    const {content} = req.body
    if(!content || content.trim().length === 0){
        throw new ApiError(
            400 , "the contnet is empty"
        )
    }

    // now get the comment 
    // see if there is any comment to update or not 
    const commentFound = await Comment.findById(commentId)
    if(!commentFound){
        throw new ApiError(
            404 , "The comment is not found"
        )
    }

    // we can also check if the user is same or differnt 
    if(!commentFound.owner.equals(user_id)){
        throw new ApiError(
            403 , "You are not allowed to make changes to the comment"
        )
    }

    commentFound.content = content
    // now save it 
    const updatedcomment = await commentFound.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            {data: updatedcomment},
            "The comment has been successfully updated"
        )
    )


})

const deleteComment = asynchandler(async (req,res) => {

    // for deleting comment get the comment id first 
    const {commentId} = req.params
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(
            400 , "Invalid request"
        )
    }

    // now check if the comment is present or not 
    const commentFound = await Comment.findById(commentId)
    if(!commentFound){
        throw new ApiError(
            404 , "There is no comment available"
        )
    }

    // now check the user 
    if(!commentFound.owner.equals(req.user._id)){
        throw new ApiError(
            403 , "Unauthorised access, You are not allowed to make changes "
        )
    }

    // now delete the comment 
    await commentFound.deleteOne()
    //const deleted = await commentFound.save()
    // no need of this as the commentFound is already deleted

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            null,
            "The comment is deleted successfully"
        )
    )
})

export {
    getVideoComment,
    addComment,
    updateComment,
    deleteComment
}