import { request } from "node:http";
import prisma from "../prisma/prisma";
import { Response,Request } from "express";

interface missionStep {
    mission: string
}

export const gameMission = async(req: Request,res: Response) : Promise<void> => {
    const {id} = req.params
    console.log(id)

    // try {
    //     const queryStep = Number(id)
    //     const data: missionStep | null = await prisma.instruction.findFirst({
    //         where: {id : queryStep}
    //     }) 
    //     if(data) {
    //         res.json({message: data.step})
    //     } else {
    //         res.json({message: "There are no more steps"})
    //     }
    // } catch (error) {
    //     console.log(error)
    //     res.status(500).json({message: "Error from server"})
    // }
}