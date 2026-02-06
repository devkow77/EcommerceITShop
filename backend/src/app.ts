import express from 'express';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productsRoutes from './routes/productsRoutes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.use(errorHandler);

export default app;
