import mongoose from "mongoose"

export const connectDb = async () =>{
    const URL = "mongodb://localhost:27017/brainly";
    try {
        await mongoose.connect(URL)
        console.log("Connection Established")
    } catch (error) {
        console.error("database fail", error);
        process.exit(1);
    }
}

export default connectDb