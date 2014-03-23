var assert = require("assert");
var Bencode = require('./util/bencode.js');
var Bdecode = require('./util/bdecode.js');

{
	var bencode = new Bencode();
	var _obj = {};
	_obj.test=10;
	_obj.test2=100;
	_obj.test3="abc";
	var arraybuilder = bencode.encodeObject(_obj);
	console.log(""+arraybuilder.toText());
	assert.equal(5, 5);

	var decode = new Bdecode();
	var ret = decode.decodeArrayBuffer(arraybuilder, 0, arraybuilder.getLength());
	assert.equal(10, ret.content.test);
	assert.equal(100, ret.content.test2);
	assert.equal("abc", ret.content.test3);
}


