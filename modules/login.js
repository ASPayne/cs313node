function login() {
	var email = $("#email").val();
	var password = $("#password").val();

	console.log("in function\n" + email +"\n"+password);
	var params = {
		useremail: email,
		password: password
	};

	$.post("/login", params, function(result) {
		if (result && result.success) {
			$("#status").text("Successfully logged in.");
			window.location.href = "/queue";
		} else {
			$("#status").text("Error logging in.");
		}
	});
}

function logout() {
	$.post("/logout", function(result) {
		if (result && result.success) {
			$("#status").text("Successfully logged out.");
		} else {
			$("#status").text("Error logging out.");
		}
	});
}

function getServerTime() {
	$.get("/getServerTime", function(result) {
		if (result && result.success) {
			$("#status").text("Server time: " + result.time);
		} else {
			$("#status").text("Got a result back, but it wasn't a success. Your reponse should have had a 401 status code.");
		}
	}).fail(function(result) {
		$("#status").text("Could not get server time.");
	});
}