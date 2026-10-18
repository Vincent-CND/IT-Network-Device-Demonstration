import { Request,Response } from "express";
import prisma from "../prisma/prisma";

interface step  {
    step: string
}

export const fetchStep = async (req:Request, res: Response): Promise<void> => {
    const {id} = req.params
    
    try {
        const queryStep = Number(id)
        const data: step | null = await prisma.instruction.findFirst({
            where: {id : queryStep}
        }) 
        if(data) {
            res.json({message: data.step})
        } else {
            res.json({message: "There are no more steps"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
}