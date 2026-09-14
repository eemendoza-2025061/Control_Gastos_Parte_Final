import { Pool, types } from 'pg';
import { config } from './env';

// DATE (OID 1082): devolver YYYY-MM-DD y evitar el desfase por zona horaria
types.setTypeParser(1082, (val: string) => val);

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
});

pool.on('error', (err) => {
  console.error('Error inesperado de PostgreSQL', err);
  process.exit(-1);
});
