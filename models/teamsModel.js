import mongoose from "mongoose";

const { Schema} = mongoose

const teamsSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    url: {
        type : String,
        required: true,
        trim: true
    },
});

const Teams = mongoose.model("Teams", teamsSchema)

export default Teams;