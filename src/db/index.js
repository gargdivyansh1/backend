import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// now here what extra we can do is .. 
// we can put the await function in the variable and can return the value 

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected || DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1);
    }
}

export default connectDB