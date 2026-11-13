import Express from "express";
import {hiddenHint} from "../controllers/hiddenhint"

const router = Express.Router()

router.get("/hint/cable/:id",hiddenHint)

export default router