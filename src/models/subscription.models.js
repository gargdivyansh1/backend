import mongoose from 'mongoose'

const subsctiptionSchema = new mongoose.Schema(
    {
        subscriber: {
            // one who is subscribing
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        channel: {
            // to whom subscriber is subscribing
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },{
        timestamps: true
    }
)

export const Subscription = mongoose.model("Subscription", subsctiptionSchema)