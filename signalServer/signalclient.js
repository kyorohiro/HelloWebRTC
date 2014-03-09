function SignalClient() {
	this.ws = new WebSocket("ws://localhost:8080");

	SignalClient.prototype.send = function() {
		this.ws.send("hello");
	};

	SignalClient.prototype.sendOffer = function(uuid, sdp) {
		var v = {};
		v["_type"] = "offer";
		v["_sdp"] = sdp;
		v["_uuid"] = uuid;
		
		this.ws.send(JSON.stringify(v));
	};

	SignalClient.prototype.sendAnswer = function(uuid, sdp, touuid) {
		var v = {};
		v["_type"] = "answer";
		v["_sdp"] = sdp;
		v["_uuid"] = uuid;
		v["_touuid"] = touuid;
		this.ws.send(JSON.stringify(v));
	};

	this.mOnMessage = null;
	SignalClient.prototype.setOnMessage = function(f) {
		this.mOnMessage = f;
	}

	var _own = this;
	this.ws.onmessage = function(m) {
		console.log("--onMessage()["+"]"+m.data);
		if(_own.mOnMessage != null) {
			_own.mOnMessage(m);
		}
	};

	this.ws.onclose = function(m) {
		console.log("--onClose()"+m);
	};
}
