import express from "express"
import * as teamsController from "../controller/teamsController.js"


const router = express.Router()

router.route("/").post(teamsController.createTeams);
router.route("/").get(teamsController.getAllTeams);

router.route("/:id").get(teamsController.getATeams);
router.route("/:id").delete(teamsController.deleteTeams);
router.route("/:id").put(teamsController.updateTeams);

export default router