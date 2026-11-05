import Express from "express";
import {builderHint} from "../controllers/builderhint"

const router = Express.Router()

router.get("/hint/builder/:id",builderHint)

export default router