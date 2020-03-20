DROP TABLE IF EXISTS chat;

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id) NOT NULL,
    message TEXT NOT NULL CHECK (message <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
