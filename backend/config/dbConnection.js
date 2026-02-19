const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        console.log("MongoDB connected: ", connect.connection.host, connect.connection.name);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);  
        process.exit(1);
    }
};

module.exports = connectDb;