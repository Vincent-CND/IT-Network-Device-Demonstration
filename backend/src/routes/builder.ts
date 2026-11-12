import  express  from "express";
import {builderValidate} from "../controllers/builderValidate"

const router = express.Router()

router.post("/validate/builder",builderValidate)

export default router