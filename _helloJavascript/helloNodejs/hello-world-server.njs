var Http = require('http');
var WSServer = require('websocket').server;
var Fs = require('fs');

var server = Http.createServer(function (req, res) {
	console.log("a="+req.url);
	try {
		var file = Fs.readFileSync(req.url.substring(1));
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(file);
	} catch(e) {
		console.log(""+e);
	}
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

var wsserversocket = new WSServer({httpServer: server});

wsserversocket.on('request', function(req){
	console.log("on:"+req);
	var websocket = req.accept(null, req.origin);
	websocket.on('message', function(mes) {
		console.log("mes:"+mes.utf8Data);
		websocket.send("s hello");
	});
});

