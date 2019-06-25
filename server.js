const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: connectionString });

var app = express();

app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  console.log("recived a request for /");

  res.write("sending back root");
  res.end();
});

app.get("/home", function() {
  console.log("recived a request for the home page");
});

app.get("/getPerson", function(req, res) {

    var sql = "SELECT first_name FROM person where id = $1";


    pool.query(sql, [req], function(err, result) {
        // If an error occurred...
        if (err) {
          console.log("Error in query: ");
          console.log(err);
        }
      
        // Log this to the console for debugging purposes.
        console.log("Back from DB with result:");
        console.log(result.rows);
        res.send(result.rows);
      })

});