// to be run when script is loaded

// Execute a function when the user releases a key on the keyboard
document.getElementById("cardsearch").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    submitQuery();
  }
});


//to be called upon at other times
function displaylist(arr) {
  console.log("\n\nUpdateResultList");
  var out = "";
  var i;

  out += '<table id="cardlist" style="width:auto">';
  out += "<th>Card Name</th>";
  out += "<th>ManaCost</th>";

  for (i in arr.data) {
    out += "<tr class='cardData'>";
    out += "<td>" + arr.data[i].name + "</td>";
    out += "<td>" + arr.data[i].mana_cost + "</td>";
    out += "</tr>";
  }
  out += "</table>";
  return out;
}

function submitQuery() {
  document.getElementById("cardSearchList").innerHTML = "";
  toggleSpinner(); //turn on the spinner
  var query = document.getElementById("cardsearch").value;
  console.log("trying to query for " + query);
  fetch("/scryfall/cardquery?cardnamesearch=" + query, {
    method: "GET"
  })
    .then(response => {
      if (!response.ok) {
        throw response;
      }
      // fetch also returns a stream as the result...we have to tell it
      // how to format the stream...our choices are: json, text, or blob (binary data)
      return response.json();
      // the json() method also returns a promise...so we need
      //to call .then() on it as well (shown on the next line)
    })
    .then(function(data) {
      // we now have our data and can use it to update our page.
      toggleSpinner(); //turn off the spinner
      document.getElementById("cardSearchList").innerHTML = displaylist(data);
      addRowHandlers();
    })
    .catch(err => {
      console.log(err);
    });
}

function addRowHandlers() {
  var table = document.getElementById("cardlist");
  var rows = table.getElementsByTagName("tr");
  for (i = 0; i < rows.length; i++) {
    var currentRow = table.rows[i];
    var createClickHandler = function(row) {
      return function() {
        var cell = row.getElementsByTagName("td")[0];
        var id = cell.innerHTML;
        showCardInfo(id);
      };
    };
    currentRow.onclick = createClickHandler(currentRow);
  }
}

function displaycard(arr) {
  var out = "";
  out +=
    "<img src=" +
    arr.image_uris.small +
    " alt=" +
    arr.name +
    " style='float:left;margin-right:15px;width:20%'>";
  out += "<h1 id='cardname'>" + arr.name + "</h1>";
  out += "<p>" + arr.oracle_text + "</p>";

  document.getElementById("cardview").innerHTML = out;
}

function showCardInfo(cardname) {
  if (cardname == "") {
    document.getElementById("cardview").innerHTML =
      "Search for a card on the left to view.";
    return;
  }
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myArr = JSON.parse(this.responseText);
      displaycard(myArr);
      /*document.getElementById("cardview").innerHTML = this.responseText;*/
    }
  };
  xmlhttp.open(
    "GET",
    "https://api.scryfall.com/cards/named?fuzzy=" + cardname,
    true
  );
  //xmlhttp.open("GET", "cardInfoDisplay.php?id=" + cardid, true);
  xmlhttp.send();
}

function toggleSpinner() {
  var element = document.getElementById("spinner");

  if (element.classList) {
    element.classList.toggle("active");
  } else {
    // For IE9
    var classes = element.className.split(" ");
    var i = classes.indexOf("active");

    if (i >= 0) classes.splice(i, 1);
    else classes.push("active");
    element.className = classes.join(" ");
  }
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
