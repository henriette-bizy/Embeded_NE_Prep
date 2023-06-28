const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 4000;

const mysqlHost = 'localhost'; // Replace with your MySQL host
const mysqlUser = 'root'; // Replace with your MySQL username
const mysqlPassword = '12345qwerty'; // Replace with your MySQL password
const mysqlDatabase = 'nesa_embedded'; // Replace with your database name

const connection = mysql.createConnection({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Handle the API endpoint for receiving data
app.get('/api/display-data', (req, res) => {
  const query = 'SELECT * FROM data';

  // Retrieve all data from MySQL
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving data from MySQL:', err);
      return res.sendStatus(500); // Send an error response
    }

    return res.json(results);
  });
});

// Handle the API endpoint for receiving data
app.get('/api/data', (req, res) => {
  const { temperature, humidity } = req.query;
  console.log('Received data - Temperature:', temperature, '°C, Humidity:', humidity, '%');

  const query = 'INSERT INTO data (temperature, humidity) VALUES (?, ?)';
  const values = [parseFloat(temperature), parseFloat(humidity)];

  // Save the data to MySQL
  connection.query(query, values, (err) => {
    if (err) {
      console.error('Error saving data to MySQL:', err);
      return res.sendStatus(500); // Send an error response
    }

    console.log('Data saved to MySQL');
    return res.sendStatus(200); // Send a success response
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
