import mongoose from "mongoose";

const { Schema} = mongoose

const teamsSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: 'User', 
    },
    url: {
        type: String,
        required: true
    },

    image_id: {
        type: String,
    },
});

const Teams = mongoose.model("Teams", teamsSchema)

export default Teams;