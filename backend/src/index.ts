import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import instruction from "./routes/instruction"
dotenv.config()

const app = express();
const port = process.env.PORT


//middleware
app.use(cors())
app.use(express.json())
app.use(morgan("combine"))
app.use((req,res,next) => {
    console.log(`Method : ${req.method}`)
    console.log(`Path : ${req.path}`)
    next()
})


//routes

app.use('/',instruction)
// app.use(/,)
// app.use(/,)
// app.use(/,)

//server
app.listen(port,() => {
    console.log(`Server is listening to port ${port}`)
})
