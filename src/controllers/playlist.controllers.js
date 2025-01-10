import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {Video} from "../models/video.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const createPlaylist = asynchandler(async (req, res) => {

    const {name, description , videos} = req.body

    if(!name || !description){
        throw new ApiError(
            404 , "All fields are required"
        )
    }

    // getting the user 
    const user = req.user._id

    // check if the playlist is already available somehow 
    const existing = await Playlist.findOne({name , owner: user})
    if(existing){
        throw new ApiError(
            400 , "The playlist is already available"
        )
    }


    // getting if all the videos are present or not 
    if(videos && videos.length > 0){
        const requiredVideo = await Video.find({_id : {$in: videos}})
        // now check if the same amount of the videos are found or not 
        // if someone is missing then throw error
        if(requiredVideo.length !== videos.length){
            throw new ApiError(400, "Error in finding all the videos which you are demanding")
        }
    }


    const playlist = new Playlist({
        name ,
        description,
        videos: videos || [],
        owner: user
    })

    // mistake done 
    // not save it earlier 
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            playlist ,
            "The videos are added to the playlist "
        )
    )

})

const getUserPlaylists = asynchandler(async (req, res) => {

    // getting user
    const {userId} = req.params

    // find the playlist by this id 
    const playlists = await Playlist.find({
        owner: userId,
    })

    if(!playlists || playlists.length === 0){
        throw new ApiError(
            404 , "The playlist is not found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            playlists,
            "The playlist is finded"
        )
    )
})

const getPlaylistById = asynchandler(async (req, res) => {

    // getting the list id form the params
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(
            400, "Invalid request"
        )
    }

    const playlists = await Playlist.findById(playlistId).populate('videos' , 'title thumbnails views')

    if(!playlists){
        throw new ApiError(
            400 ,
            "No playlist is found"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            playlists,
            "The playlist is found"
        )
    )
})

const addVideoToPlaylist = asynchandler(async (req, res) => {

    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400, "playlist ID and VIdeo ID are required")
    }

    // find the video 
    // find the playlist 
    // check if the video already present in the playlist 
    // then add to it
    // in last save

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(
            400 , "The playlist is not found "
        )
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(
            400 , "The video is not found"
        )
    }

    if(playlist.videos.includes(videoId)){
        throw new ApiError(
            400 , "The video is already present in the playlist "
        )
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            playlist,
            "The video is added successfully"
        )
    )
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {

    const {playlistId, videoId} = req.params
    if(!playlistId || !videoId){
        throw new ApiError(
            400 , "Invalid request"
        )
    }

    // get the playlist 
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(
            400 , "The playlist is not found"
        )
    }

    // now check if the video present in the list or not 
    // and getting the index of the video
    const videoIndex = playlist.videos.findIndex((video) => video.toString() === videoId)
    if(videoIndex === -1){
        throw new ApiError(
            404 , "The video is not present in the playlist for deleting "
        )
    }


    // now deletet the video 
    // the pop method will be not true as it delete the last index not the particular index
    playlist.videos.splice(videoIndex, 1)

    // save 
    await playlist.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            playlist,
            "The video has been deleted"
        )
    )
    

})

const deletePlaylist = asynchandler(async (req, res) => {

    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(
            400 ,"Invalid request"
        )
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(
            400 , "The playlist is not found"
        )
    }

    // if found then delete 
    await Playlist.findByIdAndDelete(playlistId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            null ,
            "The playlist has been deleted"
        )
    )
})

const updatePlaylist = asynchandler(async (req, res) => {

    const {playlistId} = req.params
    if(!playlistId){
        throw new ApiError(
            400 , "Invalid request"
        )
    }

    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(
            400 , "All fields are required"
        )
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {name , description},
        {new: true} // for returning the updated playlist instead of the old one 
    )

    if(!playlist){
        throw new ApiError(
            400 , "the playlist is not found !!"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 , 
            playlist,
            "The playlist has been updated"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}