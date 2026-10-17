import express from "express";
import {fetchStep} from "../controllers/step"


const router = express.Router()
router.get("/step/:id", fetchStep )
export default router