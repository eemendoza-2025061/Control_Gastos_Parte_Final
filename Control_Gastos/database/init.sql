CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  picture TEXT,
  ahorro_meta NUMERIC(12, 2) NOT NULL DEFAULT 10000,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion VARCHAR(255) NOT NULL,
  monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Fijo', 'Variable')),
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ahorros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion VARCHAR(255) NOT NULL,
  monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
  categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('Emergencia', 'Inversión', 'Retiro')),
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role) VALUES
('Administrador', 'admin@example.com', '$2b$10$JJoFh2gmOK2QV/OeBf4uq.Z..c4HPr0xBE7rHyWflz3OA19TW.N9O', 'admin'),
('Usuario', 'user@example.com', '$2b$10$JJoFh2gmOK2QV/OeBf4uq.Z..c4HPr0xBE7rHyWflz3OA19TW.N9O', 'user')
ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS egresos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion VARCHAR(255) NOT NULL,
  monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Fijo', 'Variable')),
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS egresos_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion VARCHAR(255) NOT NULL,
  monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
  categoria VARCHAR(20) NOT NULL CHECK (categoria IN ('Servicios', 'Transporte', 'Alimentación')),
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deudas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  acreedor VARCHAR(255) NOT NULL,
  monto_total NUMERIC(12,2) NOT NULL CHECK (monto_total >= 0),
  cuota_mensual NUMERIC(12,2) NOT NULL CHECK (cuota_mensual >= 0),
  tasa_interes NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (tasa_interes >= 0),
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('Activa', 'Pagada')),
  fecha_inicio DATE NOT NULL,
  vencimiento DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagos_deuda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deuda_id UUID NOT NULL REFERENCES deudas(id) ON DELETE CASCADE,
  monto NUMERIC(12,2) NOT NULL CHECK (monto >= 0),
  fecha DATE NOT NULL,
  nota TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);