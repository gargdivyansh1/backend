import mongoose from "mongoose"
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },{timestamps: true}
)

// for controlling the amount of comments to be shown and the loading comments also 
// same work is done in the video schema 
commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment" , commentSchema)