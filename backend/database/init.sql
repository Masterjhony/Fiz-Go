-- Fiz-Go Database Initialization Script
-- This script sets up the initial database and creates extensions

-- Create database if not exists
CREATE DATABASE fizgo;

-- Connect to the database
\c fizgo;

-- Create UUID extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create PostGIS extension for geolocation support (optional)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Create indexes for commonly queried fields
-- These will be created automatically by TypeORM, but we can pre-create them

-- Function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    RETURN (
        6371 * acos(
            cos(radians(lat1)) * cos(radians(lat2)) *
            cos(radians(lon2) - radians(lon1)) +
            sin(radians(lat1)) * sin(radians(lat2))
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Create service categories lookup table (optional, for better normalization)
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default service categories
INSERT INTO service_categories (name, description) VALUES
    ('Limpeza', 'Serviços de limpeza residencial e comercial'),
    ('Jardinagem', 'Cuidados com jardim e plantas'),
    ('Pintura', 'Serviços de pintura interna e externa'),
    ('Eletricista', 'Serviços elétricos residenciais e comerciais'),
    ('Encanador', 'Serviços hidráulicos e encanamento'),
    ('Marcenaria', 'Móveis planejados e reparos em madeira'),
    ('Reforma', 'Reformas e construção civil'),
    ('Tecnologia', 'Suporte técnico e instalação de equipamentos'),
    ('Beleza', 'Serviços de beleza e estética'),
    ('Cuidados', 'Cuidados com idosos, crianças e pets')
ON CONFLICT (name) DO NOTHING;

-- Create admin user (password should be changed in production)
-- This will be handled by the application, but we can create a seed script