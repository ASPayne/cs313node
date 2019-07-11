const express = require("express");
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const { Pool, Client } = require("pg");
const connectionString =
  process.env.DATABASE_URL ||
  "postgres://weriedohmhfwpa:8bab081cfd18c0e50ab68d99d3bfb881324cbbd110d7ead55427ddedcfc63293@ec2-54-83-201-84.compute-1.amazonaws.com:5432/denom11ufb5bl9?ssl=true";
const pool = new Pool({ connectionString: connectionString });
var bodyparse = require("body-parser");
var request = require("request");
var session = require("express-session");
var app = express();

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "modules")));

app.use(bodyparse.urlencoded({ extended: false }));
app.use(
  session({
    secure: true,
    secret: "Canada: America's hat"
  })
);

app.set("views", "views");
app.set("view engine", "ejs");

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get("/", function(req, res) {
  res.write("sending back root");
  res.end();
});

app.get("/home", function() {
  //console.log("recived a request for the home page");
});

app.get("/cardSearch", function(req, res) {
  console.log("recived a request to return the page to search for cards");
  res.render("pages/cardSearch");
  res.end();
});

app.get("/scryfall/cardquery", function(req, res) {
  console.log("recived a request to get card list");
  console.log(req.query);
  var url =
    "https://api.scryfall.com/cards/search?q=" + req.query["cardnamesearch"];
  console.log("url: " + url);

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      //console.log(importedJSON);
      res.json(importedJSON);
      req.session.lastcardsearchlist = importedJSON;
      res.end();
    }
    if (error) {
      console.log("error in query");
    }
  });
});

app.get("/testquery", function(req, res) {
  var sql = "SELECT * FROM person";
  var data = pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
      console.log("Error in query: ");
      console.log(err);
    }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows);
  });
  res.json(data);
  res.end();
});

app.get("/test", function(req, res) {
  res.render("pages/test");
  res.end();
});

app.get("/login", function(req, res) {
  res.render("pages/login");
  res.end();
});

app.get("/queue", function(req, res) {
  res.render("pages/queue");
  res.end();
});

app.get("/helprequest", function(req, res) {
  res.render("pages/helprequest");
  res.end();
});

app.post("/helprequestsubmit", function(req, res) {
  console.log(req.body);
  if (req.body) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/login", function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var success = false;
  console.log(
    "recived data\nUsername: " + username + "\nPassword: " + password
  );

  if (username == "admin" && password == "password") {
    success = true;
    req.session.username = username;
  }

  res.json({ success: success });
});

app.post("/logout", function(req, res) {
  if (req.session.username) {
    console.log("logging out " + req.session.username);
    req.session.destroy();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/getServerTime", verifyLogin, getServerTime);

function getServerTime(request, response) {
  var time = new Date();

  var result = { success: true, time: time };
  response.json(result);
}

// This is a middleware function that we can use with any request
// to make sure the user is logged in.
function verifyLogin(request, response, next) {
  if (request.session.username) {
    // They are logged in!

    // pass things along to the next function
    next();
  } else {
    // They are not logged in
    // Send back an unauthorized status
    var result = { success: false, message: "Access Denied" };
    response.status(401).json(result);
  }
}

// This middleware function simply logs the current request to the server
function logRequest(request, response, next) {
  console.log("Received a request for: " + request.url);

  // don't forget to call next() to allow the next parts of the pipeline to function
  next();
}
