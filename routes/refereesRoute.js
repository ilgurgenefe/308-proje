import express from "express"
import * as refereesController from "../controller/refereesController.js"

const router = express.Router()

router.route("/").post(refereesController.createReferees);
router.route("/").get(refereesController.getAllReferees);

router.route("/:id").get(refereesController.getAReferees);

export default router