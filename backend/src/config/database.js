import mongoose from 'mongoose';
import env from './env.js';
import dns from 'dns';

// Override DNS servers to support SRV record lookup for MongoDB Atlas
// (local routers often block SRV queries)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDatabase = async () => {
    try {
        await mongoose.connect(env.mongoUri);

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDatabase;