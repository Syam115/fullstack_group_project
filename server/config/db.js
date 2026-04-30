const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doctor_appointments');
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
//connects to the MongoDB database using Mongoose. 
// It uses the connection string from the environment variable
//  MONGO_URI, or defaults to a local MongoDB instance if not provided.
//  If the connection is successful, it logs a success message; otherwise, 
// it logs the error and exits the process.