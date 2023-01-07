import express from "express"
import * as teamsController from "../controller/teamsController.js"


const router = express.Router()

router.route("/").post(teamsController.createteams);
router.route("/").get(teamsController.getAllteams);

router.route("/:id").get(teamsController.getAteams);
router.route("/:id").delete(teamsController.deleteteams);
router.route("/:id").put(teamsController.updateteams);

export default router