import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

// we take the help of .use for configuring the middlewares
app.use(cors({
    // origin is used for setting the frontend which can access our backend
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))

app.use(express.json({limit: "16kb"})) //  for the accesing of the data which is in json format
app.use(express.urlencoded({extended: true, limit: "16kb"})) // for accessing the data which is in url integrated
app.use(express.static("public"))
app.use(cookieParser())


// routes import 

import userRouter from './routes/user.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import videoRouter from './routes/video.routes.js'
import playlistRouter from './routes/playlist.routes.js'


// routes declaration 
// here we use middleware to connect with the routes 
// try {
//     app.post("/api/v1/users" , userRouter)
// } catch (error) {
//     return res.end(error);
// }
app.use("/api/v1/users" , userRouter)
app.use("/api/v1/likes" , likeRouter)
app.use("/api/v1/tweets" , tweetRouter)
app.use("/api/v1/playlist" , playlistRouter)
app.use("/api/v1/comments" , commentRouter)
app.use("/api/v1/video" , videoRouter)
app.use("/api/v1/subscription" , subscriptionRouter)

// it will create the url like this
//https://localhost:8000/api/v1/users/and now which route method we arre calling which we have deffined in the user router 
//or can export in this way also 
export {app} 

 
// getting the cookies-parser 
// and the cors
