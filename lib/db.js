import mongoose from "mongoose";

const connectionToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MongoURL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log("MongoDB Error:", err);
  }
};

export default connectionToDatabase;
