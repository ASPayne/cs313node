const express = require("express");
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

app.get("/math", function(req, res) {
  console.log(req.query);

  var firstNum = req.query.num1;
  var secondNum = req.query.num2;
  var opp = req.query.opper;
  var value = doMath(firstNum, secondNum, opp);

  var params = { first: firstNum, second: secondNum, opper: opp, total: value };
  res.render("pages/math", params);
  res.end();
});

app.get("/postal", function(req, res) {
  console.log("recived a request for /postal");

  res.render("pages/postal", params);
  res.end();
});

app.get("/postagecost", function(req, res) {
  console.log(req.query);

  var weight = req.query.weight;
  var mailtype = req.query.mailtype;

  var value = calcpostalcost(weight, mailtype);

  var params = { weight: weight, mailtype: mailtype, total: value };
  res.render("pages/postalcost", params);
  res.end();
});

app.listen(5000, function() {
  console.log("test");
});

function doMath(num1, num2, opp) {
  switch (opp) {
    case "*":
      return num1 * num2;
      break;
    case "/":
      return num1 / num2;
      break;
    case "+":
      return num1 + num2;
      break;
    case "-":
      return num1 - num2;
      break;
    default:
      break;
  }
}

function calcpostalcost(weight, mailtype) {
  switch (mailtype) {
    case "stamped":
      break;
    case "metered":
      break;
    case "Flats":
      break;
    case "retail":
      break;
    default:
      break;
  }
}
