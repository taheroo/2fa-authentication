import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri: string = process.env.MONGODB_URI || "";

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
};

export default connectDB;
