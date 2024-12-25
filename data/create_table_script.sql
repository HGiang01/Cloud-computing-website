-- Products
CREATE TABLE products (
    product_id integer PRIMARY KEY,
    product_name varchar,
    price integer,
    quantity integer,
    image_path varchar
);

-- Users
CREATE TABLE users (
    name varchar PRIMARY KEY,
    password varchar,
    email varchar UNIQUE,
    address varchar
);

-- Orders
CREATE TABLE orders (
    user_name varchar,
    price int,
    status varchar,
    date timestamp
)