import express, {Request,Response} from "express";
import prisma from "../prisma/prisma";

const router = express.Router()


router.get("/step/:id", async (req: Request,res: Response) => {
    const {id} = req.params
    
    try {
        const queryStep = Number(id)
        const data = await prisma.instruction.findUnique({
            where: {id : queryStep}
        }) 
        if(data) {
            res.json({message: data.step})
        } else {
            console.log("No data")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
})

export default router