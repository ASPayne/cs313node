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
			$("#status").text("Successfully logged out.");
		} else {
			$("#status").text("Error logging out.");
		}
    });
}