var HTTP = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');
var UserInfo = require("../util/userinfo.njs");
var UUID = require("../util/uuid.njs");

var SignalServer = function SignalServer() {
	this.mHttpServer = null;
	this.mWsserverSocket = null;	
	this.mUserInfos = new UserInfo();

	SignalServer.prototype.startServer = function(host, port) {
		this.mHttpServer = HTTP.createServer(function (req, res) {
			console.log("onRequest="+req.url);
			try {
				var path = req.url.substring(1);
				var file = Fs.readFileSync(path);
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(file);
			} catch(e) {
				console.log(""+e);
			}
		}).listen(port, host);
		console.log("Server running at http://"+host+":"+port);
	};

	SignalServer.prototype.startWSServer = function() {
		var _own = this;
		this.mWsserverSocket = new WSServer({httpServer: this.mHttpServer});
		this.mWsserverSocket.on('request', function(req){
			console.log("on:"+req);
			var websocket = req.accept(null, req.origin);
			websocket.on('message', function(mes) {
				console.log("mes:"+mes.utf8Data);
				var contentType   = JSON.parse(mes.utf8Data)["_contentType"];
				var messageType   = JSON.parse(mes.utf8Data)["_messageType"];
				var content = JSON.parse(mes.utf8Data)["_content"];
				var to      = JSON.parse(mes.utf8Data)["_to"];
				var from    = JSON.parse(mes.utf8Data)["_from"];
				console.log("to:"+to);
				console.log("from:"+from);
				_own.mUserInfos.add(from, websocket)

				if(messageType === "unicast") {
					var v = {}
					v["_contentType"]    = contentType;
					v["_content"] = content;
					v["_to"]      = to;
					v["_from"]    = from;
					_own.uniMessage(to, JSON.stringify(v));
				} else if(messageType =="broadcast") {
					var v = {}
					v["_contentType"] = contentType;
					v["_content"]     = content;
					v["_from"]        = from;
					_own.broadcastMessage(JSON.stringify(v));
				} 
			});
		});
	};

	SignalServer.prototype.broadcastMessage = function(_message) {
		console.log("----broadcast----");
		this.mUserInfos.show();
		var keys = this.mUserInfos.keys();
		while(keys.length != 0) {
			var key = keys.pop();
			var socket = this.mUserInfos.get(key)["socket"];
			socket.send(_message);
			console.log(_message);
		}
		console.log("----//broadcast-----");
	}

	SignalServer.prototype.uniMessage = function(to,_message) {
		console.log("----uni----"+to);
		try {
			var socket = this.mUserInfos.get(to)["socket"];
			socket.send(_message);
			console.log(_message);
		} catch(e) {
			console.log(e);
		}
		console.log("----//uni-----");
	}

};

module.exports = SignalServer;
