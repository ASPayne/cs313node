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
});

app.listen(5000, function() {
  console.log("test");
});

function doMath(num1, num2, opp) {
  switch (opp) {
    case "*":
      return (num1 * num2);
      break;
    case "/":
      return (num1 / num2);
      break;
    case "+":
      return (num1 + num2);
      break;
    case "-":
      return (num1 - num2);
      break;
    default:
      break;
  }
}
