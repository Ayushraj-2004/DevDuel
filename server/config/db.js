const mongoose = require("mongoose");
const dns = require("dns");

// Force Node to use public DNS resolvers for SRV lookups used by Atlas
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {
    console.warn("Could not set DNS servers:", err.message);
}

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env file");
        }
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

