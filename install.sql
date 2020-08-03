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