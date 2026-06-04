import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const connUri = process.env.MONGODB_URI;
  if (!connUri) {
    console.error("CRITICAL ERROR: MONGODB_URI environment variable is not defined.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    });
    console.log(`SUCCESS: Connected to MongoDB Database: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err: any) {
    console.error("ERROR: Failed to connect to MongoDB Atlas database.");
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
