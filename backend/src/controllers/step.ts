import { Request,Response } from "express";
import prisma from "../prisma/prisma";


export const fetchStep = async (req:Request, res: Response): Promise<void> => {
    const {id} = req.params
    
    try {
        const queryStep = Number(id)
        const data = await prisma.instruction.findUnique({
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