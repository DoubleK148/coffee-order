import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee-order',
  jwtSecret: process.env.JWT_SECRET || 'bcdb3e002c866b83f776eff339e285c348daf58fa5a9a1cfad9e4e76dd0fd65fe828951bcd75c90343fadc5e1a2d73506f3822cae201a35c595b7737e0772675',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  smtp: {
    host: process.env.SMTP_HOST || 'chungbui148@gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};

export const connect = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    process.exit(1);
  }
}; 