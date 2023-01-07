import mongoose from "mongoose";

const { Schema} = mongoose

const refereesSchema = new Schema ({
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

const Referees = mongoose.model("Refeeres", refereesSchema)

export default Referees;