import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import egresoRoutes from './routes/egreso.routes';
import deudaRoutes from './routes/deuda.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/egresos', egresoRoutes);
app.use('/api/deudas', deudaRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint no encontrado' });
});

export default app;