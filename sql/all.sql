
------------------------USERS TABLE--------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      image_url TEXT,
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

------------------------RESET PASSWORD TABLE--------------------
DROP TABLE IF EXISTS password_reset_codes;

CREATE TABLE password_reset_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
