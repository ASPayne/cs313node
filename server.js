const express = require("express");
var router = express.Router();
const pg = require('pg')
var conString = "postgres://qofbggsapgbgtx:362d864eeb0f6d8d06b00c1ffda03b81419ebdd21e945acaedb1f9d71b690896@ec2-54-83-1-101.compute-1.amazonaws.com:5432/dcidfrniod064s?ssl=true"

/*
const path = require("path");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
//const connectionString = process.env.DATABASE_URL;

const connectionString = process.env.DATABASE_URL || "postgres://qofbggsapgbgtx:362d864eeb0f6d8d06b00c1ffda03b81419ebdd21e945acaedb1f9d71b690896@ec2-54-83-1-101.compute-1.amazonaws.com:5432/dcidfrniod064s?ssl=true"

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

}); */

router.get('/getperson', function(req, res, next) {
    pg.connect(conString, function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      console.log("connected to database");
      client.query('SELECT * FROM person', function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });