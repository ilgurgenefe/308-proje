import Players from "../models/playersModel.js";
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";

const createPlayers = async (req,res) => {

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: "team_38",
        }
    );
    

    try {
        await Players.create({
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

const getAllPlayers = async (req,res) => {
    
    try {
        const players = await Players.find({})
        res.status(200).render("players",  {
            players,
            link: "players",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getAPlayers = async (req,res) => {
    
    try {
        const a_players = await Players.findById ({_id: req.params.id}).populate("user");


        let isOwner = false

        if(res.locals.user) {
            isOwner= a_players.user.equals(res.locals.user._id)
        }

        res.status(200).render("a_players",  {
            a_players,
            link: "players",
            isOwner,
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const deletePlayers = async (req,res) => {
    
    try {
        
        const players= await Players.findById(req.params.id)
        const playersId= players.image_id

        await cloudinary.uploader.destroy(playersId)
        await Players.findOneAndRemove({_id: req.params.id})

        res.status(200).redirect("/user/dashboard");
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const updatePlayers = async (req,res) => {
    
    try {

        const players= await Players.findById(req.params.id)

        if(req.files) {
            const playersId= players.image_id
            await cloudinary.uploader.destroy(playersId);

            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                {
                    use_filename: true,
                    folder: "team_38",
                }
            );
            
            players.url= result.secure_url
            players.image_id= result.public_id

            fs.unlinkSync(req.files.image.tempFilePath);

        }

        players.name= req.body.name;
        players.description = req.body.description;

        players.save();

        res.status(200).redirect(`/players/${req.params.id}`)
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

export {createPlayers, getAllPlayers, getAPlayers, deletePlayers, updatePlayers};