import mongoose from "mongoose";

const conn = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: "fff_db",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("connected to the DB")
    }).catch ((err)=> {
        console.log(`DB connection err, ${err}`)
    });
};

export default conn