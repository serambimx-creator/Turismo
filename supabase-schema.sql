-- Esquema de Supabase para SERAMBI

-- Habilitar la extensión pgcrypto para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabla: administradores
CREATE TABLE administradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: asistentes
CREATE TABLE asistentes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo TEXT NOT NULL,
    whatsapp TEXT UNIQUE NOT NULL,
    ciudad_salida TEXT CHECK (ciudad_salida IN ('CDMX', 'Pachuca')) NOT NULL,
    hospedaje TEXT CHECK (hospedaje IN ('Cabaña', 'Camping')) NOT NULL,
    notas_salud TEXT,
    estatus_pago TEXT DEFAULT 'Pendiente' CHECK (estatus_pago IN ('Pendiente', 'Liquidado')),
    passcode TEXT NOT NULL,
    acceso_validado BOOLEAN DEFAULT FALSE,
    es_admin BOOLEAN DEFAULT FALSE,
    acompanantes JSONB DEFAULT '[]'::jsonb,
    opciones_viaje JSONB DEFAULT '{}'::jsonb,
    costo_total NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: logistica_viaje
CREATE TABLE logistica_viaje (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hora TEXT NOT NULL,
    actividad TEXT NOT NULL,
    descripcion_biologica TEXT,
    enlace_maps_waze TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: avisos_vivo
CREATE TABLE avisos_vivo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mensaje TEXT NOT NULL,
    urgencia TEXT CHECK (urgencia IN ('Baja', 'Media', 'Alta')) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla: proveedores
CREATE TABLE proveedores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    servicio TEXT NOT NULL,
    contacto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuración de Row Level Security (RLS)

-- Habilitar RLS en todas las tablas
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistica_viaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos_vivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Ajustar según autenticación real)
-- Por ahora, permitimos lectura pública para logistica y avisos (útil para el portal del explorador)
-- y permitimos inserción pública en asistentes (para el pre-registro).

-- Asistentes: Permitir inserción anónima (pre-registro)
CREATE POLICY "Permitir pre-registro anónimo" ON asistentes FOR INSERT WITH CHECK (true);
-- Asistentes: Permitir lectura si conocen su whatsapp y passcode (se manejará en la app, pero a nivel DB podemos dejarlo abierto o restringido)
CREATE POLICY "Permitir lectura pública de asistentes" ON asistentes FOR SELECT USING (true);
CREATE POLICY "Permitir actualización pública de asistentes" ON asistentes FOR UPDATE USING (true);

-- Logística y Avisos: Lectura pública
CREATE POLICY "Permitir lectura pública de logistica" ON logistica_viaje FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de avisos" ON avisos_vivo FOR SELECT USING (true);
CREATE POLICY "Permitir inserción pública de avisos" ON avisos_vivo FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización pública de logistica" ON logistica_viaje FOR UPDATE USING (true);

-- Proveedores y Administradores: Lectura pública (simplificado para MVP)
CREATE POLICY "Permitir lectura pública de proveedores" ON proveedores FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de administradores" ON administradores FOR SELECT USING (true);

-- Insertar datos de prueba para administradores
INSERT INTO administradores (nombre, email, rol) VALUES 
('Karla', 'karla@serambi.mx', 'Admin'),
('Luis', 'luis@serambi.mx', 'Admin'),
('Viky', 'viky@serambi.mx', 'Admin'),
('Octavio', 'octavio@serambi.mx', 'Admin'),
('Alexa', 'alexa@serambi.mx', 'Admin'),
('Chepe', 'chepe@serambi.mx', 'Admin'),
('Wendy', 'wendy@serambi.mx', 'Admin');

-- Tabla: configuracion_finanzas
CREATE TABLE configuracion_finanzas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    renta_van NUMERIC NOT NULL DEFAULT 6510,
    rendimiento_km_l NUMERIC NOT NULL DEFAULT 7.5,
    factor_terreno NUMERIC NOT NULL DEFAULT 1.15,
    precio_gasolina NUMERIC NOT NULL DEFAULT 23.99,
    distancia_estimada NUMERIC NOT NULL DEFAULT 360,
    comida_llegada NUMERIC NOT NULL DEFAULT 130,
    comida_regreso NUMERIC NOT NULL DEFAULT 130,
    entrada_turista NUMERIC NOT NULL DEFAULT 250,
    entrada_staff NUMERIC NOT NULL DEFAULT 150,
    camping NUMERIC NOT NULL DEFAULT 120,
    cabana_3 NUMERIC NOT NULL DEFAULT 1000,
    cabana_4 NUMERIC NOT NULL DEFAULT 1500,
    cabana_6 NUMERIC NOT NULL DEFAULT 1800,
    foto_dron NUMERIC NOT NULL DEFAULT 500,
    materiales NUMERIC NOT NULL DEFAULT 450,
    modificadores NUMERIC NOT NULL DEFAULT 1.20, -- 20% resverva
    organizadores INTEGER NOT NULL DEFAULT 5,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE configuracion_finanzas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública de finanzas" ON configuracion_finanzas FOR SELECT USING (true);
CREATE POLICY "Permitir actualización pública de finanzas" ON configuracion_finanzas FOR UPDATE USING (true);
CREATE POLICY "Permitir inserción pública de finanzas" ON configuracion_finanzas FOR INSERT WITH CHECK (true);

-- Agregar campo precio_ticket_base si no existe
ALTER TABLE configuracion_finanzas 
  ADD COLUMN IF NOT EXISTS precio_ticket_base NUMERIC NOT NULL DEFAULT 980,
  ADD COLUMN IF NOT EXISTS camping_renta_extra NUMERIC NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS buffet_extra NUMERIC NOT NULL DEFAULT 150;

-- Insertar valores iniciales
INSERT INTO configuracion_finanzas (
    renta_van, rendimiento_km_l, factor_terreno, precio_gasolina, distancia_estimada,
    comida_llegada, comida_regreso, entrada_turista, entrada_staff, camping,
    cabana_3, cabana_4, cabana_6, foto_dron, materiales, modificadores, organizadores,
    precio_ticket_base, camping_renta_extra, buffet_extra
) VALUES (
    6510, 7.5, 1.15, 23.99, 360,
    130, 130, 250, 150, 120,
    1000, 1500, 1800, 500, 450, 1.20, 5,
    980, 100, 150
);

-- =============================================
-- Tabla: cabanas_inventario
-- Gestiona el inventario y ocupación de cabañas
-- =============================================
CREATE TABLE IF NOT EXISTS cabanas_inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,                       -- "Cabaña Séxtuple #1", "Cabaña Triple #2"
    tipo TEXT NOT NULL CHECK (tipo IN ('sextuple', 'cuadruple', 'triple')),
    capacidad INTEGER NOT NULL,                 -- 6, 4, 3
    precio_total NUMERIC NOT NULL,              -- 1800, 1500, 1000
    descripcion TEXT,                           -- "2 matrimoniales + 2 individuales"
    ocupantes JSONB DEFAULT '[]'::jsonb,        -- [{reserva_id, nombre_titular, nombres_en_cabana, lugares}]
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE cabanas_inventario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de cabañas" ON cabanas_inventario FOR SELECT USING (true);
CREATE POLICY "Actualización pública de cabañas" ON cabanas_inventario FOR UPDATE USING (true);
CREATE POLICY "Inserción admin cabañas" ON cabanas_inventario FOR INSERT WITH CHECK (true);

-- Seed: Inventario inicial de cabañas
-- 3 Cabañas Séxtuples (estilo hostal: 2 matrimoniales + 2 individuales)
INSERT INTO cabanas_inventario (nombre, tipo, capacidad, precio_total, descripcion) VALUES
  ('Cabaña Séxtuple #1', 'sextuple', 6, 1800, '2 camas matrimoniales y 2 camas individuales (estilo hostal)'),
  ('Cabaña Séxtuple #2', 'sextuple', 6, 1800, '2 camas matrimoniales y 2 camas individuales (estilo hostal)'),
  ('Cabaña Séxtuple #3', 'sextuple', 6, 1800, '2 camas matrimoniales y 2 camas individuales (estilo hostal)'),
  -- 1 Cabaña Cuádruple
  ('Cabaña Cuádruple #1', 'cuadruple', 4, 1500, 'Cabaña privada para hasta 4 personas'),
  -- 4 Cabañas Triples
  ('Cabaña Triple #1', 'triple', 3, 1000, 'Cabaña privada para hasta 3 personas'),
  ('Cabaña Triple #2', 'triple', 3, 1000, 'Cabaña privada para hasta 3 personas'),
  ('Cabaña Triple #3', 'triple', 3, 1000, 'Cabaña privada para hasta 3 personas'),
  ('Cabaña Triple #4', 'triple', 3, 1000, 'Cabaña privada para hasta 3 personas');
