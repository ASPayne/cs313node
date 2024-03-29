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
  res.render("pages/home", {username: ""});
  res.end();
});

app.get("/home", function() {
  res.render("pages/home");
  res.end();
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
  var sql = "SELECT * FROM requests";
  var data = pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
      console.log("Error in query: ");
      console.log(err);
    }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    console.log(result.rows);
    res.json(data);
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

app.get("/HelpQueueList", function(req, res) {
  var sql = "SELECT r.id, u.first_name, u.last_name, r.issue_description, ";
  sql += "r.lab_number, r.request_timestamp ";
  sql +=
    "FROM public.requests r inner join public.user u on r.helped_status = 'no' ";
  sql += "and u.id = r.request_by";
  var data = pool.query(sql, function(err, result) {
    if (err) {
      console.log("Error in query: ");
      console.log(err);
    }

    console.log("Back from DB with result:");
    console.log(result.rows);
    var returndata = { assistant: req.session.assistant, queue: result.rows };

    res.json(returndata);
  });
});

app.get("/helprequest", function(req, res) {
  res.render("pages/helprequest");
  res.end();
});

app.post("/helprequestsubmit", verifyLogin, function(req, res) {
  console.log(req.body);
  console.log(req.session);

  var userid = req.session.username;
  var issue = req.body.helpDescription;
  var labnum = req.body.labnumber;

  var sql = "INSERT INTO public.requests(";
  sql += " id, request_by, issue_description, lab_number, ";
  sql += "helped_status, request_timestamp) ";
  sql += "VALUES (DEFAULT, ";
  sql +=
    " (select u.id from public.user u where u.email = '" + userid + "'), ";
  sql += "'" + issue + "',";
  sql += labnum + ", ";
  sql += "'no', now())";
  console.log("query = " + sql);
  pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
      console.log("Error in query: ");
      console.log(err);
      res.json({ success: false });
    }
    // Log this to the console for debugging purposes.
    console.log("Inserted values with no errors");
    res.json({ success: true });
  });
});

app.post("/helprequestremove", verifyLogin, function(req, res) {

  var sql = "UPDATE public.requests ";
  sql += "set request_closed_timestamp = now(), helped_status = 'yes' ";
  sql += "where id = " + req.body.requestID +";";
  console.log("query = " + sql);
  pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
      console.log("Error in query: ");
      console.log(err);
      res.json({ success: false });
    }
    // Log this to the console for debugging purposes.
    console.log("Inserted values with no errors");
    res.json({ success: true });
  });
});

app.post("/login", function(req, res) {
  console.log(req.body);
  var username = req.body.useremail;
  var password = req.body.password;
  var success = false;
  console.log(
    "recived data\nUsername: " + username + "\nPassword: " + password
  );

  var sql = "SELECT * FROM public.user";
  sql += " WHERE email = '" + username + "'";
  sql += " and password = '" + password + "';";

  console.log(sql);
  var data = pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
      console.log("Error in query: ");
      console.log(err);
    } else if (isEmpty(result) || result == '[]') {
      console.log("No rows selected");
    } else {
      console.log("Back from DB with result:");
      console.log(result.rows);
      success = true;
      req.session.username = result.rows[0].email;
      req.session.flname =
        result.rows[0].first_name + " " + result.rows[0].last_name;
      if (result.rows[0].usertype == "assistant") {
        req.session.assistant = true;
      }
    }
  res.json({ success: success });
  });
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

app.post("/createuser", function(req, res) {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.useremail;
  var password = req.body.password;

  var sql = "INSERT INTO public.user(\n";
  sql += "id, first_name, last_name, email, password, usertype\n)\n";
  sql += "VALUES(DEFAULT, '" + fname + "', '" + lname + "', '" + email + "', '" + password + "', 'student');";
  console.log("query = " + sql);
  pool.query(sql, function(err, result) {
    // If an error occurred...
    if (err) {
      console.log("Error in query: ");
      console.log(err);
      res.json({ success: false });
    }
    // Log this to the console for debugging purposes.
    console.log("Inserted values with no errors");
    res.json({ success: true });
  });
});

app.get("/getServerTime", verifyLogin, getServerTime);

function getServerTime(request, response) {
  var time = new Date();

  var result = { success: true, time: time };
  response.json(result);
}
function verifyLogin(request, response, next) {
  if (request.session.username) {
    next();
  } else {
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
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
