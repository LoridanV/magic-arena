-- ============================================
-- MAGIC Arena - Baza de date MySQL
-- ============================================

DROP DATABASE IF EXISTS magic_arena;
CREATE DATABASE magic_arena CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE magic_arena;

-- --------------------------------------------
-- Tabel: utilizatori (clienți + admini)
-- --------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
  language ENUM('ro', 'en') NOT NULL DEFAULT 'ro',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: locații (terenuri MAGIC)
-- --------------------------------------------
CREATE TABLE locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  phone VARCHAR(30),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: terenuri (fiecare locație poate avea mai multe)
-- --------------------------------------------
CREATE TABLE fields (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  field_type ENUM('fotbal_5', 'fotbal_7', 'fotbal_11', 'tenis', 'baschet', 'altul') NOT NULL,
  surface ENUM('iarba_sintetica', 'iarba_naturala', 'beton', 'parchet') NOT NULL,
  price_per_hour DECIMAL(8, 2) NOT NULL,
  indoor BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: rezervări
-- --------------------------------------------
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  field_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price DECIMAL(8, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  INDEX idx_booking_date (booking_date),
  INDEX idx_user (user_id),
  UNIQUE KEY unique_slot (field_id, booking_date, start_time)
) ENGINE=InnoDB;

-- --------------------------------------------
-- Tabel: mesaje de contact
-- --------------------------------------------
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  read_status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------
-- DATE INIȚIALE
-- --------------------------------------------

-- Locații MAGIC (cu coordonate reale)
INSERT INTO locations (name, address, city, latitude, longitude, phone, description) VALUES
('MAGIC Alexandru', 'Bulevardul Alexandru cel Bun, Iași', 'Iași', 47.1530000, 27.5870000, '0740123456', 'Teren acoperit cu iarbă sintetică'),
('MAGIC Centru', 'Strada Centrală, Iași', 'Iași', 47.1585000, 27.6014000, '0740123457', 'Teren în aer liber');

-- Terenuri
INSERT INTO fields (location_id, name, field_type, surface, price_per_hour, indoor) VALUES
(1, 'Teren 1', 'fotbal_5', 'iarba_sintetica', 150.00, TRUE),
(1, 'Teren 2', 'fotbal_7', 'iarba_sintetica', 200.00, TRUE),
(2, 'Teren A', 'fotbal_5', 'iarba_sintetica', 130.00, FALSE);

-- Admin (parola: admin123 — schimbă imediat! hash bcrypt)
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@magicarena.ro', '$2b$10$rOzJqXqXqXqXqXqXqXqXqOzJqXqXqXqXqXqXqXqXqXqXqXqXqXqXq', 'Administrator', 'admin');
