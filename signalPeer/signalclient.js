var SignalClient = function SignalClient(url) {
	this.ws = new WebSocket(url);
	this.mList = new Array();
	SignalClient.prototype.send = function() {
		this.ws.send("hello");
	};

	SignalClient.prototype.join = function(to) {
		var v = {};
		v["_from"]        = to;
		v["_messageType"] = "broadcast";
		v["_contentType"] = "join";
		v["_content"]     = "hello";
		this.ws.send(JSON.stringify(v));
	};

	SignalClient.prototype.sendOffer = function(to, from, content) {
		var v = {};
		v["_to"]          = to;
		v["_from"]        = from;
		v["_messageType"] = "unicast";
		v["_contentType"] = "offer";
		v["_content"]     = content;
		this.ws.send(JSON.stringify(v));
	};

	SignalClient.prototype.sendAnswer = function(to, from, content) {
		var v = {};
		v["_to"]          = to;
		v["_from"]        = from;
		v["_messageType"] = "unicast";
		v["_contentType"] = "answer";
		v["_content"]     = content;
		this.ws.send(JSON.stringify(v));
	};

	this.mOnMessage = null;
	SignalClient.prototype.setOnMessage = function(f) {
		this.mOnMessage = f;
	}

	var _own = this;
	this.ws.onmessage = function(m) {
		var parsedData = JSON.parse(m.data);
		var contentType = parsedData["_contentType"];
		var uuid = parsedData["_from"];
		console.log("--onSignalClient#WS#OnMessage():"+contentType+","+uuid);
		if("join" === contentType) {
			var v={};
			v.name = "dummy";
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

