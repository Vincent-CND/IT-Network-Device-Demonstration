import prisma from "../prisma/prisma";
import { Request, Response } from "express";

interface answerType {
    userAnswer: string | number;
    idAnswer: string | number;
}

export const answerValid = async (req: Request,res: Response): Promise<void> => {
    try {
        const { userAnswer, idAnswer }: answerType = req.body;

        // Check if userAnswer is missing
        if (
            userAnswer === undefined ||
            userAnswer === null ||
            String(userAnswer).trim() === ""
        ) {
            res.status(400).json({ message: "Answer is Missing" });
            return;
        }

        // Check if userAnswer is a string or number
        if (
            typeof userAnswer !== "string" &&
            typeof userAnswer !== "number"
        ) {
            res.status(400).json({ message: "Invalid answer type" });
            return;
        }

        // Validate answer ID
        const answerId = Number(idAnswer);

        if (!Number.isSafeInteger(answerId) || answerId <= 0) {
            res.status(400).json({ message: "Invalid answer ID" });
            return;
        }

        // Fetch answer from database
        const fetchAnswer = await prisma.answer.findUnique({
            where: {
                id: answerId
            }
        });

        // Check if answer exists
        if (!fetchAnswer) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }

        // Convert answers to lowercase strings
        const convertedUserAnswer = String(userAnswer).toLowerCase().trim();
        const correctAnswer = String(fetchAnswer.result).toLowerCase().trim();

        // Compare answers
        if (convertedUserAnswer === correctAnswer) {
            res.status(200).json({ message: "correct" });
        } else {
            res.status(200).json({ message: "incorrect" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error from server" });
    }
};