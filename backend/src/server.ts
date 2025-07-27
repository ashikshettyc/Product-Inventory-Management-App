import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CORS_URL || 'http://localhost:3000'], 
  })
);

app.use(express.json());

app.use('/api/products', productRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
};

start();
