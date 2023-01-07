import News from "../models/newsModel.js";
import { v2 as cloudinary} from "cloudinary";
import fs from "fs";

const createNews = async (req,res) => {

    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: "team_38",
        }
    );
    

    try {
        await News.create({
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

const getAllNews = async (req,res) => {
    
    try {
        const news = await News.find({})
        res.status(200).render("news",  {
            news,
            link: "news",
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const getANews = async (req,res) => {
    
    try {
        const a_news = await News.findById ({_id: req.params.id}).populate("user");


        let isOwner = false

        if(res.locals.user) {
            isOwner= a_news.user.equals(res.locals.user._id)
        }

        res.status(200).render("a_news",  {
            a_news,
            link: "news",
            isOwner,
        })
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const deleteNews = async (req,res) => {
    
    try {
        
        const news= await News.findById(req.params.id)
        const newsId= news.image_id

        await cloudinary.uploader.destroy(newsId)
        await News.findOneAndRemove({_id: req.params.id})

        res.status(200).redirect("/user/dashboard");
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

const updateNews = async (req,res) => {
    
    try {

        const news= await News.findById(req.params.id)

        if(req.files) {
            const newsId= news.image_id
            await cloudinary.uploader.destroy(newsId);

            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,
                {
                    use_filename: true,
                    folder: "team_38",
                }
            );
            
            news.url= result.secure_url
            news.image_id= result.public_id

            fs.unlinkSync(req.files.image.tempFilePath);

        }

        news.name= req.body.name;
        news.description = req.body.description;

        news.save();

        res.status(200).redirect(`/news/${req.params.id}`)
        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};

export {createNews, getAllNews, getANews, deleteNews, updateNews};
