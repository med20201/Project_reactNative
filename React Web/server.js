import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
const port = 5001;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "sql7.freesqldatabase.com",
  database: "sql7706592",
  user: "sql7706592",
  password: "XVGX8pF1dS",
  port: 3306
});

app.use(express.json());
app.use(cors());

app.get("/db", (req, res) => {
  pool.query("SELECT * FROM gps", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving data");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
