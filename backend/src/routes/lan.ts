import express from "express";
import { lanValidate } from "../controllers/lanValidate";

const router = express.Router();

router.post("/validate/cable", lanValidate);

export default router;
