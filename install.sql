CREATE TABLE users (
    id serial primary key,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR,
    mentor BOOLEAN,
    about TEXT,
    zipcode INTEGER

);

CREATE TABLE images (
    user_id INTEGER REFERENCES users (id),
    imgname text
);

CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER REFERENCES users (id),
    mentee_id INTEGER REFERENCES users (id)
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sent_message VARCHAR,
    sender VARCHAR,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    chat_id INTEGER REFERENCES chat_rooms (id)
);

CREATE TABLE connections (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER REFERENCES users (id),
    mentee_id INTEGER REFERENCES users (id)
);

CREATE TABLE skills (
    id INTEGER REFERENCES users (id),
    product_management BOOLEAN DEFAULT FALSE,
    design BOOLEAN DEFAULT FALSE,
    machine_learning BOOLEAN DEFAULT FALSE,
    data_science BOOLEAN DEFAULT FALSE,
    software_engineering BOOLEAN DEFAULT FALSE,
    web_development BOOLEAN DEFAULT FALSE
);