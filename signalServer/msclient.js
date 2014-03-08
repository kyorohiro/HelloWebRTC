function MSClient() {
	this.ws = new WebSocket("ws://localhost:8080");
	
	MSClient.prototype.send = function() {
		this.ws.send("hello");
	};

	MSClient.prototype.sendOffer = function(sdp) {
		this.ws.send(sdp);
	}

	MSClient.prototype.sendAnswer = function(sdp) {
		this.ws.send(sdp);
	}

	this.ws.onmessage = function(m) {
		console.log("--onMessage()"+m.data);
	};

	this.ws.onclose = function(m) {
		console.log("--onClose()"+m);
	}
}
