import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/ApiError.js'

// for checking if the user is existed or not
import { User } from '../models/user.models.js'

// for uploading on the cloudinary 
import { uploadOnCloudinary } from '../utils/cloudinary.js'

import { ApiResponse } from '../utils/ApiResponse.js'

import jwt from 'jsonwebtoken'
import mongoose from 'mongoose' 


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        // now while saving it includes all the factors which are used while checking or not 
        // then for dealing with this we use validateBeforeSave as false
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens ")
    }
}

const registerUser = asynchandler(async (req, res) => {
    // res.status(200).json({ 
    //     message: "ok"
    // }) 

    // here we have to get the 
    // user details from frontend
    // validation - not empty
    // check if user already exists
    // check for images check for avatar
    // upload them to cloudinary 
    // create user object - create entry in db
    // remove password and reference token field from response
    // return response 

    // step 1 taking the data from user 

    // data could be taken from 2 forms 
    // 1 is from body aur the json data 
    // 2 is from the url 
    // here we are dealing with the body data 

    const { username, fullname, email, password } = req.body
    //console.log("email: " , email);

    // now here we can check for every single entity 
    // but we can also use the some method of javascript for 
    // checking of the multiple field togther

    // validation of the non empty
    if (
        [fullname, email, password, username].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // for checking if the user existed or not
    // this could be used when we only want to eheck one
    //User.findOne({email})

    // BUT IF  want to check if the any of the desired is existed or not then ...
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already existed")
    }




    // now we are checking for the images
    // now we use the multer funcionlity of the file 

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImagePath = req.files?.coverImage[0]?.path;


    // when in the case 
    // if the any object is unchecked then we need to check by the basic if else statement only 
    // like if we uncheck the cover image then 

    // now in this case it will not the show the error 
    // it will simply show the coverimage path as empty string
    let coverImagePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImagePath = req.files.coverImage[0].path
    }


    // now we can check if the path is presnet or absent
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }




    // now we have to upload it to the cloudinary
    // and this method will take time thats why we used the await 

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)



    // now will check the avatar here only to stop
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }


    // now we will create the user inthe database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        // now here we don't have checked for the coverImage if it is available or not 
        // then here we will apply the check 
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    // now we do the check if the user is created or not 
    // then we can check by the id which is auto assigned to the objects 

    const createdUser = await User.findById(user._id).select(
        // here we will write those which we do not require
        // by putting minus sign and space between other
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }



    // now sending the response 
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )


})

const loginUser = asynchandler(async (req, res) => {

    // sabse pehele to request body se data loo 
    // fir batao kisse login karna hai username se ya email ya aur koi bhi jisse karana ho
    // find the user 
    // password check 
    // access and refresh token and send to user 
    // send cookies 

    const { email, username, password } = req.body

    // here we are relying on the fact that in this the user can login by the username or email any 
    // if we want both then simply use and 
    // or if you want to check one then only write one 
    if (!(username || email)) {
        throw new ApiError(400, "username or password is required");
    }

    // now we have to find the username or the email in the database

    // this way we are finding the user with the given email 
    //User.findOne({email})

    // if we want to do like the user could be found by using the email or the username then 
    const user = await User.findOne({
        $or: [{ username, email }]
    })

    // if we do not find the user
    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    // now we will find the password
    // here we will not use User and use user instaed
    // because the User is set for the mongoose 
    // for accessing the methods made here we will use the user that we created 
    const isPasswordValid = await user.isPasswordCorrect(password)

    // if the password is incorrect 
    if (!isPasswordValid) {
        throw new ApiError(401, "Wrong password")
    }

    // now refresh token and access token 
    // we are going to use them many times hence making the mehods 

    // now calling this method 
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // now dealing with the cookies 
    const options = {
        httpOnly: true,
        secure: true
    }

    // returning response 
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )

})

const logoutUser = asynchandler(async (req, res) => {

    // here we have to remove the cookies
    // and also had to delete the access tokens and the refresh tokens 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined
            }
        }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully !!!"))
})

const refrestAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorised request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
    
        // now we have to find the user 
        const user = await User.findById(decodedToken?._id)
    
        // now check for the user
        if (!user) {
            throw new ApiError(401, " invalid refresh token")
        }
    
        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "invalid refresh token or it is expired")
        }
    
        // now generate the new if it is destroyed
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { newaccessToken, newrefreshToken } = await generateAccessAndRefereshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken", newaccessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newaccessToken,
                        refreshToken: newrefreshToken
                    },
                    "New access and refresh tokens are generated successfully !!!"
                )
            )
    } catch (error) {
        throw new ApiError(401 , "invalid refresh token or it is expired")
    }
})

const changeCurrentPassword = asynchandler(async (req,res) => {
    const {oldPassword , newPassword} = req.body

    // now we habe to find the user 
    // for this we make the auth middleware which gives us the user 
    const user = awati User.findBtId(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(401 , "old password you entered is incorrect")
    }

    // now set the password
    user.password = newPassword
    await user.save({validateBeforeSave = false})

    return res.status(200).json(new ApiResponse(200 , {} , "Password changed successfully"))
})

const currentUser = asynchandler(asynch (req,res) => {
    return res
    .status(200)
    .json(
        200,
        req.user,
        "The current user is fetched successfully"
    )
})

// now if the user wants to update the profile
const updateProfile = asynchandler(async (req,res) => {
    const{fullname , email , username} = req.body

    if(!fullname || !email || !username){
        throw new ApiError(400 , "enter all fields.")
    }

    cont user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            fullname,
            username,
            email
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password ")

    // now return 
    return res
    .status(200)
    .json(new ApiResponse(200 , user , "The user has been updated succesfully"))

    // could also be done in this way also 
    // const user = await User.findById(req.user?._id)

    // if(!user){
    //     throw new ApiError(404, "Error while finding the user")
    // }

    // if(user.email === email || user.username === username || user.fullname === fullname){
    //     throw new ApiError(409 , "User with this email or username or fullname already exists")
    // }

    // user.fullname = fullname
    // user.email = email
    // user.username = username

    // await user.save({validateBeforeSave = false})

    // return res
    // .status(200)
    // .json(
    //     200 ,
    //     user,
    //     "The user details are updated successfully"
    // )
})

// now updating the avatar
const updateAvatar = asynchandler(async (req,res) => {

    // first take the local path of the avatar
    const avatarPath = req.file?.path
    
    if(!avatarPath){
        throw new ApiError(400 , "Avatar file is missing")
    }

    // abb jb humhare pass file hai too isse upload karo cloudinary pr
    const avatar = await uploadOnCloudiary(avatarPath)

    if(!avatar.url){
        throw new ApiError(500 , "Error while uploading the avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            avatar : avatar.url
        },
        {
            new:true,
            runValidators: true
        }.select("-password")
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200 ,
            user,
            "The avatar file has been updated successfully"
        )
    )

})

const updateCoverImage = asynchandler(async (req,res) => {

    // take the path 
    cosnt coverPath = req.file?.path

    if(!coverPath){
        throw new ApiError(400 , "the cover image file is missing")
    }

    // upload it to the cloudinary
    const coverImage = await uploadOnCloudinary(coverPath)


    if(!coverImage.url){
        throw new ApiError(500 , "Error while uploading the cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            coverImage: coverImage.url
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        200 , 
        user,
        "The cover image has been updated successfully"
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refrestAccessToken,
    changeCurrentPassword,
    currentUser,
    updateProfile,
    updateAvatar,
    updateCoverImage
}