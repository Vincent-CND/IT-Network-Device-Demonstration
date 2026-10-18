import  express  from "express";
import {questionFetch} from "../controllers/question"

const router = express.Router();

router.get("/question/:id",questionFetch)
// router.post("/answer",compareAnswer)

export default router
