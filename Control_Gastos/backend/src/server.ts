import app from './app';
import { config } from './config/env';
import { pool } from './config/database';

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL establecida.');

    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
};

startServer();