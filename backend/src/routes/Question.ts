import  express  from "express";
import {fetchQuestion} from "../controllers/question"

const router = express.Router();

router.get("/question/:id",fetchQuestion)
// router.post("/answer",compareAnswer)

export default router
