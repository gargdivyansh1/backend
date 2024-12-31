//require('dotenv').config({path: './env'})
//console.log(process.env) // remove this after you find its working great 
// instead of using the require we can also use the modules like import

import dotenv from "dotenv"
//import app from "app.js"

// here somtimes it is not importing internal file 
// hence we have to add the full address 
// which is ./db/index.js
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './.env'
})

// here we can also use the then catch for the promises
// here we can also use the other listeners 
connectDB()
.then(() => {

    app.listen(process.env.PORT || 7000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGO db connection failed !!! " , error);
})






 









// step first import the mongoose

//import mongoose from "mongoose";
//import {DB_NAME} from './constants'

/*
this is little more messed up code ... so we learn another way of writing the code
import express from 'express'

const app = express()

// then we will use the iffe for the betterment of code
// always use the semi-colon in front of the iffee
;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // now we can also apply the listeners in it of the express
        app.on("error" ,(error) => {
            console.log("ERROR: " , error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: " , error)
        throw error
    }
})()
    */
