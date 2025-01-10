import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {asynchandler} from '../utils/asynchandler.js'
import {Video} from '../models/video.models.js'

const getAllVideos = asynchandler( async (req,res) => {
    const {page = 1 , limit = 10 , sortBy = 'createdAt' , order = "desc" , isPublished , search} = req.query

    let query = {}
    if (owner) query.owner = owner
    if (search) query.title = {
        $regex: search , // for avoiding the case sensitive 
        $options: 1
    }

    const aggregateQuery = [
        {
            $match: query,
        },
        {
            $sort: {
                [sortBy]: order === 'desc' ? -1 : 1,
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                videofile: 1,
                thumbnails: 1,
                duration: 1,
                views: 1,
                isPublished: 1
            }
        }
    ]

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit , 10)
    }

    // now call the aggregate function 
    const result = await Video.aggregatePaginate(aggregateQuery , options)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            {
                data: result.docs,
                totalPages: result.totalDocs,
                currentPage: result.currentPage,
                totalResults: result.totalDocs
            },
            "The all videos has been fetched "
        )
    )
})

const AddAVideo = asynchandler(async (req,res) => {

    // for adding we need all the entries 
    const {title , description , thumbnails, duration, owner, videofile} = req.body

    if(!title || !description || !thumbnails || !duration || !owner || !videofile){
        throw new ApiError(
            400 , "All data entries are required"
        )
    }

    // now create the video 
    const video = new Video({
        title,
        description,
        thumbnails,
        videofile,
        duration,
        owner
    })

    // now save it 
    const savedVideo = await video.save()

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            savedVideo,
            "The video has been added successfully"
        )
    )
})

const getvideosById = asynchandler(async (req,res) => {

    // get the video id first
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(
            400 , "Invalid video id"
        )
    }

    // now get the video 
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(
            404, "The video is not found"
        )
    }

    // now retun the video 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                title: video.title,
                description: video.description,
                isPublished: video.isPublished,
                duration: video.duration,
                views: video.views,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt,
                thumbnails: video.thumbnails,
                videofile: video.videofile,
            },
            "The video is fetched successfully"
        )
    )
})

const updateVideo = asynchandler(async (req,res) => {

    //have to get the video id
    // and the things which are need to be get updated
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(
            400 , "The invalid video id"
        )
    }

    // and the required information which is need to be changed 
    const {title , description , isPublished} = req.body
    if(!title || !description || !isPublished){
        throw new ApiError("ALl fields are required")
    }

    // now find the video 
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(
            404 , "The video is not found"
        )
    }

    // now update the fields
    video.title = title
    video.description = description
    video.isPublished = isPublished

    // save the video 
    await video.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            {   
                title: video.title,
                description: video.description,
                isPublished: video.isPublished,
                updatedAt: video.updatedAt,
            },
            "The video has been updated successfully"
        )
    )
})

const deleteVideo = asynchandler( async (req,res) => {

    // for deleting the video get the video id first 
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(
            400 , "It is an invalid request"
        )
    }

    // now get the video 
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(
            404, "the video is not found"
        )
    }

    // one getting the video delete it 
    await video.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            null ,
            "The video is deleted successfully"
        )
    )
})

const togglePublishStatus = asynchandler(async (req,res) => {

    // for toggling the video publish status we neet the videoid 
    const {videoId} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(
            400 , "Invalid request !!"
        )
    }

    // now see if there is video avaible or not 
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(
            404 , "The video is not found"
        )
    }

    // now toggling the status 
    video.isPublished = !video.isPublished

    // now save it 
    await video.save()

    // here we are doing the soft deletion 
    // as we are making it marked as unpublished and not deleting it 
    // but if we want to delete the video then we can simply call the deleteOne method

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            {
                title: video.title,
                description: video.description,
                isPublished: video.isPublished,
                updatedAt: video.updatedAt
            },
            "The publish status is successfully toggled"
        )
    )

})

export {
    getAllVideos,
    AddAVideo,
    getvideosById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}