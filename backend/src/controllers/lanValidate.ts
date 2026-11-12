import prisma from "../prisma/prisma";
import { Request, Response } from "express";

// The LAN hidden challenge uses ID 2; the builder challenge uses ID 1.
const LAN_CHALLENGE_ID = 2;

export const lanValidate = async (req: Request, res: Response): Promise<void> => {
    const userAnswer: unknown = req.body?.userAnswer;

    if (!Array.isArray(userAnswer)) {
        res.status(400).json({ message: "userAnswer must be an array" });
        return;
    }

    try {
        const queryData = await prisma.challenge.findUnique({
            where: { id: LAN_CHALLENGE_ID }
        });

        if (!queryData) {
            res.status(404).json({ message: "Challenge not found" });
            return;
        }

        const correctAnswer = queryData.correctAnswer;
        if (!Array.isArray(correctAnswer)) {
            res.status(500).json({ message: "Challenge answer must be an array" });
            return;
        }

        if (userAnswer.length < correctAnswer.length) {
            res.json({ message: "Your answer seems to be missing something!" });
            return;
        }

        const isCorrect = userAnswer.length === correctAnswer.length
            && userAnswer.every((answer, index) => answer === correctAnswer[index]);

        res.json({
            message: isCorrect ? "CONGRATULATIONS !!!" : "WRONG ANSWER FROM USER"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error from server" });
    }
};
