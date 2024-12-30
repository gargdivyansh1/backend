import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localPath) => {
    try {
        if(!localPath) return null
        // upload on the file on cloudinary
        const response = await cloudinary.uploader.upload(localPath , {
            resource_type: "auto"
        })
        // file has been uploaded successfullay
        console.log("File has been uploaded successfully",
            response.url
        )
        return response;
    } catch (error) {
        fs.unlinkSync(localPath) // this will remove the locally saved temperoary file as the upload operation got failed
        return null;
    }
}

export default uploadOnCloudinary
    
    