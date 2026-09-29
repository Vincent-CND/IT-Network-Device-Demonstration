import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'


dotenv.config({path: envPath})


const app = express()
const port = process.env.port || 5000


app.use(bodyParser.urlencoded({extended: false}))

app.get("/", (req,res) => {
    res.json("hi")
})

app.listen(port, (req,res) => {
    console.log('App is listening to port 3000')
})