CREATE TABLE users (
    id serial primary key,
    username VARCHAR UNIQUE,
    email VARCHAR UNIQUE,
    password VARCHAR,
    mentor BOOLEAN,
    about TEXT,
    zipcode INTEGER
);

-- add expertise tages --> Tech, Finance/consulting, University, Life