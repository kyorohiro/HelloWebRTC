var SignalClient = function SignalClient(url) {
	this.ws = new WebSocket(url);
	this.mList = new Array();
	SignalClient.prototype.send = function() {
		this.ws.send("hello");
	};

	SignalClient.prototype.join = function(uuid, sdp) {
		var v = {};
		v["_type"] = "join";
		v["_uuid"] = uuid;
		this.ws.send(JSON.stringify(v));
	};

	SignalClient.prototype.sendOffer = function(uuid, sdp, touuid) {
		var v = {};
		v["_type"] = "offer";
		v["_sdp"] = sdp;
		v["_uuid"] = uuid;
		v["_touuid"] = touuid;
		
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
		console.log("--onMessage()["+"]"+m);
		var parsedData = JSON.parse(m.data);
		var type = parsedData["_type"];
		if("join" === type) {
			var uuid = parsedData["_uuid"];
			var v={};
			v.name = parsedData["_name"];
			_own.mList[uuid] = v;
		}
		if(_own.mOnMessage != null) {
			_own.mOnMessage(m);
		}
	};

	this.ws.onclose = function(m) {
		console.log("--onClose()"+m);
	};
};
try{module.exports = SignalClient;} catch(e){}