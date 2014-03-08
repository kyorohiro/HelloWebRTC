var HTTP = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');
var UserInfo = require("./userinfo.njs");

var SignalServer = function SignalServer() {
	this.httpServer = null;
	this.wsserverSocket = null;	
	this.userInfos = new UserInfo();

	SignalServer.prototype.startServer = function(host, port) {
		this.httpServer = HTTP.createServer(function (req, res) {
			console.log("onRequest="+req.url);
			try {
				var file = Fs.readFileSync(req.url.substring(1));
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(file);
			} catch(e) {
				console.log(""+e);
			}
		}).listen(port, host);
		console.log("Server running at http://"+host+":"+port);
	};

	SignalServer.prototype.startWSServer = function() {
		this.wsserverSocket = new WSServer({httpServer: this.httpServer});
		this.wsserverSocket.on('request', function(req){
			console.log("on:"+req);
			var websocket = req.accept(null, req.origin);
			websocket.on('message', function(mes) {
				console.log("mes:"+mes.utf8Data);
				websocket.send("s hello");
			});
		});
	};
};

module.exports = SignalServer;