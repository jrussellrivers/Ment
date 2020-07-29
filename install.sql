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