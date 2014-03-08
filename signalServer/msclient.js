function MSClient() {
	this.ws = new WebSocket("ws://localhost:8080");

	MSClient.prototype.send = function() {
		this.ws.send("hello");
	};

	MSClient.prototype.sendOffer = function(uuid, sdp) {
		var v = {};
		v["_type"] = "offer";
		v["_sdp"] = sdp;
		v["_uuid"] = uuid;
		
		this.ws.send(JSON.stringify(v));
	};

	MSClient.prototype.sendAnswer = function(uuid, sdp, touuid) {
		var v = {};
		v["_type"] = "answer";
		v["_sdp"] = sdp;
		v["_uuid"] = uuid;
		v["_touuid"] = touuid;
		this.ws.send(JSON.stringify(v));
	};

	this.ws.onmessage = function(m) {
		console.log("--onMessage()"+m.data);
	};

	this.ws.onclose = function(m) {
		console.log("--onClose()"+m);
	};
}
