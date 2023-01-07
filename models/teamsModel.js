import mongoose from "mongoose";

const { Schema} = mongoose

const teamsSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Teams = mongoose.model("Teams", teamsSchema)

export default Teams;