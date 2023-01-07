import express from "express"
import * as playersController from "../controller/playersController.js"


const router = express.Router()

router.route("/").post(playersController.createPlayers);
router.route("/").get(playersController.getAllPlayers);

router.route("/:id").get(playersController.getAPlayers);
router.route("/:id").delete(playersController.deletePlayers);
router.route("/:id").put(playersController.updatePlayers);

export default router