import express from "express"
import {answerValid} from "../controllers/answer"

const router = express.Router()

router.post("/answer", answerValid)

export default router