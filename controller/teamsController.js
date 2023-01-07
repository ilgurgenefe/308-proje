import Teams from "../models/teamsModel.js";

const createTeams = async (req,res) => {
    
    try {
        const teams = await Teams.create(req.body)
        res.status(201).json({
            succeded: true,
            teams,
        });
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getAllTeams = async (req,res) => {
    
    try {
        const teams = await Teams.find({})
        res.status(200).render("teams",  {
            teams,
            link: "teams",
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
        const a_teams = await Teams.findById ({_id: req.params.id})
        res.status(200).render("a_teams",  {
            a_teams,
            link: "teams",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

export {createTeams, getAllTeams, getATeams};
