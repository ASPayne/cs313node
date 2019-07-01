const express = require("express");
const path = require('path')
const PORT = process.env.PORT || 5000
var request = require("request");
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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.get("/cardSearch", function(req, res) {
  console.log("recived a request to return the page to search for cards");

  res.render("pages/cardSearch");
  res.end();
});

app.get("/scryfall/cardquery", function(req, res) {
  console.log("recived a request to get card list");
  console.log(req.query);
  var url = "https://api.scryfall.com/cards/search?q=" + req.query["cardnamesearch"];
  console.log("url: " + url);
  
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var importedJSON = JSON.parse(body);
      //console.log(importedJSON);
      res.json(importedJSON);
      res.end();
    }
    if (error) {
      console.log("error in query");
    }
  });
});