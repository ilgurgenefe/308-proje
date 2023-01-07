import express from "express"
import * as newsController from "../controller/newsController.js"


const router = express.Router()

router.route("/").post(newsController.createNews);
router.route("/").get(newsController.getAllNews);

router.route("/:id").get(newsController.getANews);
router.route("/:id").delete(newsController.deleteNews);
router.route("/:id").put(newsController.updateNews);

export default router