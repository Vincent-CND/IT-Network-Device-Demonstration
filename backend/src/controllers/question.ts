import { Response,Request } from "express";
import prisma from "../prisma/prisma";

interface data {
    id: number,
    question: string,
    type: string
}

export const fetchQuestion  = async (req: Request,res: Response): Promise<void> => {
    const {id} = req.params

    const queryQuestion = Number(id)

    try {
        const fetchData: data | null = await prisma.question.findFirst({
            where: {id: queryQuestion},
            select: {
                id: true,
                question: true,
                type: true
            }
        })

        if (fetchData) { 
            res.status(200).json({data: fetchData})
        } 

        if (!fetchData || fetchData === null) { 
            console.log("Doen't have any data from db")
            res.json({message: "Invalid question request"})
        } 
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
}
