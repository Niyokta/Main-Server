import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import mainRouter from "./Routes";

const app = express();

app.use(express.json())

const cookieparser = cookieParser()

app.use(cookieparser)

app.use(cors({
    origin: ["http://localhost:3000/*","*",],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'user-agent', 'X-Client-Type']
}))

const mainroute=mainRouter
app.use("/api/v1",mainroute)

const PORT=process.env.PORT||3000;
app.listen(PORT, () => {
    console.log("Listening on port",PORT)
})


