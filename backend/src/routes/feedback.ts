import  Express  from "express";
import { feedback, drawChart } from "../controllers/feedback";

const router = Express.Router()

router.post("/feedback",feedback)
router.get("/drawChart",drawChart)

export default router
