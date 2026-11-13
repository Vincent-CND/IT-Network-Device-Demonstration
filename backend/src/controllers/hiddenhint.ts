import prisma from "../prisma/prisma";
import { Response,Request } from "express";

interface hidden {
    hint: string
}

export const hiddenHint = async(req: Request,res: Response) : Promise<void> => {
    const {id} = req.params
    console.log(id)

    try {
        const queryHint = Number(id)
        const data: hidden | null = await prisma.lAN_hint.findFirst({
            where: {id : queryHint}
        }) 
        if(data) {
            res.json({message: data.hint})
        } else {
            res.json({message: "There are no more hint"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
}