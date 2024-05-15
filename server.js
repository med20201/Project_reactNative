const axios = require('axios');
const mysql = require('mysql');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: "sql7.freesqldatabase.com",
  name: "sql7706592",
  user: "sql7706592",
  password: "XVGX8pF1dS",
  number: 3306
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// Fetch data from the old endpoint
axios.get('http://localhost:3000/gps')
  .then(response => {
    const data = response.data;
    // Insert data into MySQL database
    data.forEach(item => {
      const { id, latitude, longitude, ipAddress } = item;
      const sql = 'INSERT INTO gps (id, latitude, longitude, ipAddress) VALUES (?, ?, ?, ?)';
      connection.query(sql, [id, latitude, longitude, ipAddress], (err, result) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err.message);
          return;
        }
        console.log('Data inserted into MySQL successfully');
      });
    });
  })
  .catch(error => {
    console.error('Error fetching data from the old endpoint:', error.message);
  });
