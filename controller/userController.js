import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import News from "../models/newsModel.js";


/** @function create User
*  This function create a user with request
*  @param {*} req Request object of user
*  @param {*} res Response to send a boolean according to check if user is equal or not to user._id
*  @returns errors if it is not
*/
const createUser = async (req,res) => {
    
    try {
        const user = await User.create(req.body)
        res.status(201).json({user: user._id})
        
    } catch (error) {

        let errors = {}

        if(error.code === 11000) {
            errors.email = "This email is already registered"
        }

        if(error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
            });
        }


        res.status(400).json(errors);
    }
};

/** @function login User
*  This function logged in a user with request
*  @param {*} req Request object of user with username and password
*  @param {*} res Response to send a boolean according to check if there is a user or not and redirect dashboard page
*  @returns error if there is, else return user
*/

const loginUser = async (req,res) => {
    
    try {
        const {username, password} = req.body;

  

        const user = await User.findOne({username})

        let same = false;

        if(user) {
            same = await bcrypt.compare(password, user.password)
        }
        else {
            return res.status(401).json ({
                succeded: false,
                error: "There is no such user!"
            });
        }

        if(same) {

            const token = createToken(user._id)
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 1000*60*60*24,
            })

            res.redirect("/user/dashboard");
            
        } else {
            res.status(401).json ({
                succeded: false,
                error: "Wrong password",
            });
        }
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const createToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    }); 
};

const getDashboardPage = async (req,res) => {
    const news= await News.find({user: res.locals.user._id});
    const user= await User.findById({_id: res.locals.user._id}).populate([
        "followings", 
        "followers",
    ])
    res.render("dashboard", {
        link: "dashboard",
        news,
        user,
    })
}

const getAllUsers = async (req,res) => {
    
    try {
        const users = await User.find({ _id: {$ne: res.locals.user._id}})
        res.status(200).render("users",  {
            users,
            link: "users",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getAUser = async (req,res) => {
    
    try {
        const user = await User.findById ({_id: req.params.id});

        const inFollowers = user.followers.some((follower)=> {
            return follower.equals(res.locals.user._id) 
        });

        const news = await News.find ({user: user._id});
        res.status(200).render("user",  {
            user,
            news,
            link: "user",
            inFollowers,
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const follow = async (req,res) => {
    
    try {

        let user = await User.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $push: {followers: res.locals.user._id}
            },
            {new: true},
            )

            user = await User.findByIdAndUpdate(
                {_id: res.locals.user._id},
                {
                    $push: {followings: req.params.id},
                },
                {new: true},
            );

            res.status(200).redirect(`/user/${req.params.id}`)
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const unfollow = async (req,res) => {
    
    try {

        let user = await User.findByIdAndUpdate(
            {_id: req.params.id},
            {
                $pull: {followers: res.locals.user._id}
            },
            {new: true},
            )

            user = await User.findByIdAndUpdate(
                {_id: res.locals.user._id},
                {
                    $pull: {followings: req.params.id},
                },
                {new: true},
            );

            res.status(200).redirect(`/user/${req.params.id}`)
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};





export {createUser, loginUser, getDashboardPage, getAllUsers, getAUser, follow, unfollow};
