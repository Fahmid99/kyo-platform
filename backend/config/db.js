const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URI;
if (!connectionString) {
  throw new Error(
    "MongoDB connection string is not set in environment variables."
  );
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
