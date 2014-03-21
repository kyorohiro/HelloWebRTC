var SignalClient = function SignalClient(url) {
	this.ws = new WebSocket(url);
	this.mList = new Array();

	this.mPeer = new (function() {
		this.onReceiveAnswer = function(v) {
			console.log("+++onReceiveAnswer()\n");}
		this.addIceCandidate = function(v) {
			console.log("+++addIceCandidate()\n");}
		this.startAnswerTransaction = function(v) {
			console.log("+++startAnswerTransaction()\n");}
		this.onJoinNetwork = function(v) {
			console.log("+++onJoinNetwork()\n");}
	});

	this.setPeer = function(peer) {
		this.mPeer = peer;
	};

	this.onReceiveMessage = function(message) {
		var v = {};
		v.contentType = message["_contentType"];
		v.content     = message["_content"];
		v.from        = message["_from"];
		v.to          = message["_to"];
		console.log("###################init sv:"+v.contentType+","+v.from);
		if ("join" === v.contentType) {
			this.mPeer.onJoinNetwork(v);
		} else if ("answer"=== v.contentType) {
			this.mPeer.onReceiveAnswer(v)
		} else if ("offer" === v.contentType) {
			this.mPeer.startAnswerTransaction(v, this.mPeer.getSignalClient());
		} else if("candidate" == v.contentType){
			this.mPeer.addIceCandidate(v);
		}
	};

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

	SignalClient.prototype.sendCandidate = function(to, from, content) {
		var v = {};
		v["_to"]          = to;
		v["_from"]        = from;
		v["_messageType"] = "unicast";
		v["_contentType"] = "candidate";
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
		_own.onReceiveMessage(parsedData);
	};

	this.ws.onclose = function(m) {
		console.log("--onClose()"+m);
	};
};

