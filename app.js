import express from "express"
import dotenv from "dotenv"
import conn from "./db.js"
import require from "requirejs"
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import pageRoute from "./routes/pageRoute.js"
import newsRoute from "./routes/newsRoute.js"
import userRoute from "./routes/userRoute.js"
import teamsRoute from "./routes/teamsRoute.js"
import refereesRoute from "./routes/refereesRoute.js"
import playersRoute from "./routes/playersRoute.js"

import { checkUser } from "./middlewares/authMiddleware.js";
import fileUpload from "express-fileupload";
import { v2 as cloudinary} from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})
//connection to DB
conn();

const app = express()
const port = process.env.PORT || 3000;

//ejs template engine
app.set('view engine', 'ejs')


//static files middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload({useTempFiles: true}));
app.use(methodOverride("_method", {
    methods: ["POST", "GET"],
})
);

//routes
app.use("*", checkUser);
app.use('/', pageRoute);
app.use('/news', newsRoute);
app.use('/user', userRoute);
app.use('/teams', teamsRoute);
app.use('/referees',refereesRoute);
app.use('/players', playersRoute);

var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.collectapi.com",
  "port": null,
  "path": "/football/results?data.league=super-lig",
  "headers": {
    "content-type": "application/json",
    "authorization": "apikey 32sRUqY3rmiqQBnl8rnOTi:3l6wBeO2SZmJsmcOc68idF"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();

app.listen (port, ()=> {
    console.log(`running on: ${port}`);
})