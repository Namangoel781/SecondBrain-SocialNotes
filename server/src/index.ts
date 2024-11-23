import express, {Request, Response, Application} from "express"
import cors from "cors"
import userRoutes from "./routes/userRoutes"
import connectDb from "./db";
import contentRoutes from "./routes/contentRoutes"
import tweetRoutes from "./routes/tweetRoutes"
import { errorHandler } from "./Middleware/errorHandler";
import dotenv from "dotenv"

dotenv.config()

const app: Application = express();

app.use(cors({
    origin: process.env.FRONTEND_URL ||"http://localhost:5173",
    credentials: true
}))


app.use(express.json()); 

app.use("/api/v1/auth", userRoutes)

app.use('/api/v1', contentRoutes)

app.use("/api/v1", tweetRoutes)

app.use(errorHandler);





const PORT = 5000

const startServer = async () => {
    try {
        await connectDb()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Server failed to start:', error);
    }
}

startServer();
