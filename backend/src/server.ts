import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

const allowedOrigins = process.env.CORS_URL
  ? process.env.CORS_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.use('/api/products', productRoutes);
app.use(errorHandler);

let cachedDb: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    cachedDb = conn;
    console.log('Connected to MongoDB');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default async function handler(req: express.Request, res: express.Response) {
  try {
    await connectToDatabase();
    app(req, res);
  } catch (err) {
    console.error('Failed to handle request:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  connectToDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server', error);
      process.exit(1);
    });
}
