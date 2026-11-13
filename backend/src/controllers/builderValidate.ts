import prisma from "../prisma/prisma";
import { Response,Request } from "express";

// interface standardTopo {
//     correctAnswer: 
// }

export const builderValidate = async(req: Request, res: Response): Promise<void> => {
    //from user
    const userAnswer = [...req.body.userAnswer]
    const Answerlength = userAnswer.length

    //from database
    const queryData = await prisma.challenge.findUnique({
        where: {id: 1}
    })

    //checkList
    const checkList = []
    //

    if (!queryData) {
        res.status(404).json({ message: "Challenge not found" });
        return;
    }

    const correctAnswer = queryData.correctAnswer;
    if (!Array.isArray(correctAnswer)) {
        res.status(500).json({ message: "Challenge answer must be an array" });
        return;
    }

    // console.log(correctAnswer[0]);
    // console.log(typeof correctAnswer)


    try {
        const totalDeviceCheck = Answerlength >= 9 ? "Enough" : ""

        if (totalDeviceCheck) {
            // console.log(true)

            for(let i = 0 ; i <= Answerlength ; i++){
                if(userAnswer[i] === correctAnswer[i]){
                    checkList.push(true)
                } else{
                    checkList.push(false)
                }
            }

            if (checkList.includes(false) === true) {
                res.json({message: "WRONG ANSWER FROM USER" })
            } else{
                res.json({message: "CONGRATULATIONS !!!"})
            }


        } else{
            res.json({message: "Your topology seem like missing something ?! "})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Error from server"})
    }
}
