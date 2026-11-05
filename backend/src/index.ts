import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import instruction from "./routes/instruction"
import question from "./routes/question"
import answer from "./routes/answers"
import gameMission from "./routes/game_mission"
import networkBuilderHint from "./routes/networkBuilder"
import hiddenHint from "./routes/hiddenHint";
dotenv.config()

const app = express();
const port = process.env.PORT


//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan("combine"))
app.use((req,res,next) => {
    console.log(`Method : ${req.method}`)
    console.log(`Path : ${req.path}`)
    next()
})


//routes

//question section
app.use('/',instruction)
app.use('/',question)
app.use('/',answer)

//game section
app.use('/',gameMission)
app.use('/',networkBuilderHint)
app.use('/',hiddenHint)
//server
app.listen(port,() => {
    console.log(`Server is listening to port ${port}`)
})
