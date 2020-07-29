CREATE TABLE users (
    id serial primary key,
    username VARCHAR,
    email VARCHAR,
    password VARCHAR,
    type CHAR,
    about TEXT
);

CREATE TABLE images (
    user_id INTEGER REFERENCES users (id),
    imgname text
);