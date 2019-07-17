function queueDisplay(jsonData) {
  var outHTML = "";
  outHTML += "<table>\n";
  outHTML +=
    "<tr>\n<th>Student Name</th>\n<th>lab #</th>\n<th>Description</th>\n<th>requested time</th>\n";
    outHTML += "<th>remove?</th>\n";
    outHTML += "</tr>";
  for (i in jsonData.queue) {
    outHTML += "<tr>\n";
    outHTML += "   <td>";
    outHTML += jsonData.queue[i].first_name + " " + jsonData.queue[i].last_name;
    outHTML += "   </td>";
    outHTML += "   <td>\n";
    outHTML += jsonData.queue[i].lab_number;
    outHTML += "   </td>\n";
    outHTML += "   <td>";
    outHTML += jsonData.queue[i].issue_description;
    outHTML += "   </td>\n";
    outHTML += "   <td>";
    outHTML += jsonData.queue[i].request_timestamp;
    outHTML += "   </td>\n";

if (jsonData.assistant){

    outHTML += "   <td>";
    outHTML += '<a class="btn red col s2 m2 l2" onclick="removefromqueue('+ jsonData.queue[i].id +')">X</a>';
    outHTML += "   </td>\n";
}

    outHTML += "</tr>\n";
  }
  outHTML += "</table>";
  return outHTML;
}

function getQueueJsonList() {
  var json = $.get("/HelpQueueList", function(result) {
    console.log("temp display2 \n " + result);
    if (result) {
      $("#queueView").html(queueDisplay(result));
    }
  }).fail(function(result) {
    $("#status").text("Could not get help queue.");
  });
  console.log(json);
}

function loadQueue() {
  var jsonQueueList = getQueueJsonList();
  var htmlQueueList = queueDisplay(jsonQueueList);
  document.getElementById("queueView").innerHTML = htmlQueueList;
}
