-- Active: 1694423108902@@127.0.0.1@3306@rems
CREATE DATABASE rems;

USE rems;


sql
Copy code

-- CREATE DATABASE IF NOT EXISTS user_auth;

-- Switch to the created database
-- USE user_auth;

-- Create a table for storing user information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

SELECT * from users;