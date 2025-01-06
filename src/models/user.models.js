import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // when we want to enable the searchig field to any option then we use the index true
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // will use the cloudinary url
            required: true
        },
        coverImage: {
            type: String, // couldinary url 
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'password is required']
        },
        refreshToken: {
            type: String
        }
    },{timestamps: true}
)

// THESE ARE HOOKS
// do not use the arrow function as we can not use the this method in the arrow function
userSchema.pre("save" , async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password , 10)
    next()
})

// we can also make our custom methods
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

// NOW HERE WE WILL MAKE  TWO METHODS FOR MAKING TWO DIFFERNET TOKENS

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            emails : this.email,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema)