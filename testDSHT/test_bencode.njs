var assert = require("assert");
var Bencode = require('./util/bencode.js');

{
	var bencode = new Bencode();
	var _obj = {};
	_obj.test=1;
	var arraybuffer = bencode.encodeObject(_obj);
	console.log(""+arraybuffer.toText());
	assert.equal(5, 5);
}


