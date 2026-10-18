import { Response,Request } from "express";
import prisma from "../prisma/prisma";

interface question {
    id: number,
    question: string,
    type: string,
    hint: string
}


export const questionFetch  = async (req: Request,res: Response): Promise<void> => {
    const {id} = req.params

    const convertId = Number(id)

    try {
        const fetchQuestion: question | null = await prisma.question.findFirst({
            where: {id: convertId},
            select: {
                id: true,
                question: true,
                type: true,
                hint: true
            }
        })

        if (fetchQuestion) { 
            res.status(200).json({data: fetchQuestion})
        } 

        if (!fetchQuestion || fetchQuestion === null) { 
            console.log("Doen't have any data from db")
            res.json({message: "Invalid question request"})
        } 
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
}

