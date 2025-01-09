import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import asynchandler from '../utils/asynchandler.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {User} from '../models/user.models.js'
import {Video} from '../models/video.models.js'

const getAllVideos = asynchandler( async (req,res) => {
    const {page = 1 , limit = 10 , sortBy = 'createdAt' , order = "desc" , isPublished , search} = req.query

    const match = {}
    if(isPublished !== undefined){
        match.isPublished = isPublished === 'true'
    }
})

const publishAVideo = asynchandler(async (req,res) => {

})

const getvideosById = asynchandler(async (req,res) => {

})

const updateVideo = asynchandler(async (req,res) => {

})

const deleteVideo = asynchandler( async (req,res) => {

})

const togglePublishStatus = asynchandler(async (req,res) => {

})

export {
    getAllVideos,
    publishAVideo,
    getvideosById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}