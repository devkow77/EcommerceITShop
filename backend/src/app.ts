import express from 'express';
import authRoutes from './routes/authRoutes';
import productsRoutes from './routes/productsRoutes';
import adminRoutes from './routes/adminRoutes';
import ordersRoutes from './routes/ordersRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
