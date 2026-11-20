import { Response, Request } from "express";
import prisma from "../prisma/prisma";

// Return averages in a stable order for the frontend chart.
export const drawChart = async (_req: Request, res: Response): Promise<void> => {
    try {
        const summary = await prisma.feedback.aggregate({
            _count: { _all: true },
            _avg: {
                satisfaction: true,
                enjoyment: true,
                easeOfUse: true,
                learning: true,
                interest: true
            }
        });

        const criteria = [
            { key: "satisfaction", label: "Satisfaction" },
            { key: "enjoyment", label: "Enjoyment" },
            { key: "easeOfUse", label: "Ease of use" },
            { key: "learning", label: "Learning" },
            { key: "interest", label: "Interest" }
        ] as const;

        res.status(200).json({
            totalResponses: summary._count._all,
            metrics: criteria.map(({ key, label }) => ({
                key,
                label,
                average: summary._avg[key]
            }))
        });
    } catch (error) {
        console.error("Could not load feedback statistics:", error);
        res.status(500).json({ message: "Could not load feedback statistics" });
    }
};

interface feedback {
    satisfaction: number,
    enjoyment: number,
    easeOfUse: number,
    learning: number,
    interest: number
}

export const feedback = async (req: Request, res:Response): Promise<void> => {

    //receivedata
    const {satisfaction,enjoyment,easeOfUse,learning,interest} = req.body

    if(!satisfaction || !enjoyment || !easeOfUse || !learning || !interest ){
        res.status(400).json({message: "Missing field"})
    } 

    const insertFeedback : feedback = {
        satisfaction,
        enjoyment,
        easeOfUse,
        learning,
        interest
    } 

    //insert data
    try {
        const insertValue = await prisma.feedback.create({
            data: insertFeedback
        })
    
        if(insertValue){
            res.status(200).json({message: "Thank for your feedback"})
        } else{
            res.json({message: "Sorry We cannot insert these values"})
        }
    } catch (error) {
        console.log(error)
    }
}

