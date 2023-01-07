import Referees from "../models/refereesModel.js";
import {v2 as cloudinary} from "cloudinary";

const createReferees = async (req,res) => {
    
    try {
        const referees = await Referees.create(req.body)
        res.status(201).json({
            succeded: true,
            referees,
        });
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getAllReferees = async (req,res) => {
    
    try {
        const referees = await Referees.find({})
        res.status(200).render("referees",  {
            referees,
            link: "referees",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getAReferees = async (req,res) => {
    
    try {
        const a_referees = await Referees.findById ({_id: req.params.id})
        res.status(200).render("a_referees",  {
            a_referees,
            link: "referees",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

export {createReferees, getAllReferees, getAReferees};