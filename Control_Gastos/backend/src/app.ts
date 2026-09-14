import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import egresoRoutes from './routes/egreso.routes';
import deudaRoutes from './routes/deuda.routes';
import ingresoRoutes from './routes/ingreso.routes';
import ahorroRoutes from './routes/ahorro.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/egresos', egresoRoutes);
app.use('/api/deudas', deudaRoutes);
app.use('/api/ingresos', ingresoRoutes);
app.use('/api/ahorros', ahorroRoutes);
app.use('/api/users', userRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint no encontrado' });
});

export default app;