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


// routes declaration 
// here we use middleware to connect with the routes 
// try {
//     app.post("/api/v1/users" , userRouter)
// } catch (error) {
//     return res.end(error);
// }
app.use("/api/v1/users" , userRouter)

// it will create the url like this
//https://localhost:8000/api/v1/users/and now which route method we arre calling which we have deffined in the user router 
//or can export in this way also 
export {app} 

 
// getting the cookies-parser 
// and the cors
