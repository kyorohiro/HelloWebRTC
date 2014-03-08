function MSClient() {
	this.ws = new WebSocket("ws://localhost:1337");
	
	MSClient.prototype.send = function() {
		this.ws.send("hello");
	};
	this.ws.onmessage = function(m) {
		console.log("--onMessage()"+m.data);
	};
	this.ws.onclose = function(m) {
		console.log("--onClose()"+m/data);
	}
}

