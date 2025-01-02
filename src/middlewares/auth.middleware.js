import { ApiError } from "../utils/ApiError"
import { asynchandler } from "../utils/asynchandler"
import { User } from "../models/user.models"

export const verifyJWT = asynchandler(async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer " , "")
    
        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
    
        const decodedToken = jwt.verifyJWT(token , process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user 
        next()
    } catch (error) {
        throw new ApiError(401 , error?.message || "Invaliid Access")
    }
})
