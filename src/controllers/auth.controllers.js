import {asynchandler} from '../utils/asynchandler.js'

export const verifyJwt = asynchandler(async (req,res,next) => {
    req.cookies.accessToken
})