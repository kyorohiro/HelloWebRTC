var assert = require("assert");
var Bencode = require('./util/bencode.js');

{
	var bencode = new Bencode();
	var _obj = {};
	_obj.test=1;
	var arraybuilder = bencode.encodeObject(_obj);
	console.log(""+arraybuilder.toText());
	assert.equal(5, 5);

	var decode = new Bencode();
	var ret = decode.decodeArrayBuffer(arraybuilder, 0, arraybuilder.getLength());
	assert.equal(1, ret.content.test);
}


