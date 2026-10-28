import Express from "express";
import {gameMission} from "../controllers/mission"

const router = Express.Router()

router.get("/mission/:id",gameMission)

export default router