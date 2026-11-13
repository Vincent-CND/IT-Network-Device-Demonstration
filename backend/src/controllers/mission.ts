import prisma from "../prisma/prisma";
import { Response,Request } from "express";

interface missionStep {
    mission: string
}

export const gameMission = async(req: Request,res: Response) : Promise<void> => {
    const {id} = req.params
    console.log(id)

    try {
        const queryMission = Number(id)
        const data: missionStep | null = await prisma.game_instruction.findFirst({
            where: {id : queryMission}
        }) 
        if(data) {
            res.json({message: data.mission})
        } else {
            res.json({message: "There are no more mission for you :D"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
}