function helpRequestSubmit(){
    var labnumber = $("#labselector").val();
	var helpDescription = $("#helpdescription").val();

	console.log("there was a request for lab " + labnumber +"\nInfo: "+helpDescription);
	var params = {
		labnumber: labnumber,
		helpDescription: helpDescription
	};
    console.log(params);
	$.post("/helprequestsubmit", params, function(result) {
        if (result && result.success) {
            window.location.href = "/queue";
			$("#status").text("Help request made");
		} else {
			$("#status").text("Error putting request on queue.");
		}
    });
}


function removefromqueue(help_id){
	var params = {requestID: help_id}
	$.post("/helprequestremove", params, function(result) {
        if (result && result.success) {
			getQueueJsonList();
			/* window.location.href = "/queue"; */
			$("#status").text("Removed from queue.");
		} else {
			$("#status").text("Error removing from queue.");
		}
    });
}