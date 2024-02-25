// server.js
const cors = require('cors'); // Import the cors package
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');


const app = express();
const port = 5000;


// Enable CORS for all routes
app.use(cors());


// Create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql1234',
    database: 'rems'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Registration failed' });
            } else {
                res.status(200).json({ message: 'Registration successful' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed' });
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        db.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password],
            (error, results, fields) => {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    req.session.userID = results[0].id;
                    res.send({ success: true, message: 'Login successful' });
                } else {
                    res.send({ success: false, message: 'Invalid username or password' });
                }
                res.end();
            }
        );
    } else {
        res.send({ success: false, message: 'Please enter username and password' });
        res.end();
    }
});


app.post('/logout', (req, res) => {
    if (req.session.loggedin) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Failed to logout' });
            } else {
                res.status(200).json({ success: true, message: 'Logout successful' });
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'User is not logged in' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
