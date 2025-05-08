const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('Warning: MONGODB_URI environment variable is not set. Using default connection string.');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sst:<db_password>@cluster0.mcuiej0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 
