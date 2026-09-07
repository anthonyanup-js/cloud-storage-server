import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import {connectDB} from "./config/db.config.js"
import authRouter from "./routes/auth.Route.js"
import fileRouter from "./routes/file.Route.js"
import folderRouter from "./routes/folder.Route.js"
import errorMiddleware from "./middlewares/error.middleware.js"
const app=express()

app.use(cors({
    origin:"http://localhost:5173"
}))

app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api/files",fileRouter)
app.use("/api/folder",folderRouter)
app.use(errorMiddleware)




try {
    await connectDB()
    app.listen(3000,()=>{
        console.log("Server running on port",process.env.PORT)
    })
} catch (error) {
    console.log(error)
    process.exit(1)
    
}
