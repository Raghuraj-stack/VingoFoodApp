import mongoose from "mongoose";

const connectDb = async () => {
    try {
        console.log("MONGODB_URL:", process.env.MONGODB_URL);

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Database Connected..");
    } catch (error) {
        console.log("DB ERROR:", error);
    }
};

export default connectDb;