import Teams from "../models/TeamsModel.js";
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";

const createTeams = async (req,res) => {

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: "teams",
        }
    );
    

    try {
        await Teams.create({
            name: req.body.name,
            description: req.body.description,
            user: res.locals.user._id,
            url: result.secure_url,
            image_id: result.public_id,
        });

        fs.unlinkSync(req.files.image.tempFilePath);
        res.status(201).redirect("/user/dashboard");
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getAllTeams = async (req,res) => {
    
    try {
        const Teams = await Teams.find({})
        res.status(200).render("Teams",  {
            Teams,
            link: "Teams",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getATeams = async (req,res) => {
    
    try {
        const a_Teams = await Teams.findById ({_id: req.params.id}).populate("user");


        let isOwner = false

        if(res.locals.user) {
            isOwner= a_Teams.user.equals(res.locals.user._id)
        }

        res.status(200).render("a_Teams",  {
            a_Teams,
            link: "Teams",
            isOwner,
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const deleteTeams = async (req,res) => {
    
    try {
        
        const Teams= await Teams.findById(req.params.id)
        const TeamsId= Teams.image_id

        await cloudinary.uploader.destroy(TeamsId)
        await Teams.findOneAndRemove({_id: req.params.id})

        res.status(200).redirect("/user/dashboard");
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const updateTeams = async (req,res) => {
    
    try {

        const Teams= await Teams.findById(req.params.id)

        if(req.files) {
            const TeamsId= Teams.image_id
            await cloudinary.uploader.destroy(TeamsId);

            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                {
                    use_filename: true,
                    folder: "teams",
                }
            );
            
            Teams.url= result.secure_url
            Teams.image_id= result.public_id

            fs.unlinkSync(req.files.image.tempFilePath);

        }

        Teams.name= req.body.name;
        Teams.description = req.body.description;

        Teams.save();

        res.status(200).redirect(`/Teams/${req.params.id}`)
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

export {createTeams, getAllTeams, getATeams, deleteTeams, updateTeams};
