goog.provide('hetima.util.BencodeTest');
goog.require('hetima.util.Bencode');
goog.require('hetima.util.Bdecode');
goog.require('hetima.util.ArrayBuilder');
goog.require('goog.testing.jsunit');

function testS() {
    var bencode = new hetima.util.Bencode();
    var _obj = {};
    _obj.test=10;
    _obj.test2=100;
    _obj.test3="abc";
    var arraybuilder = bencode.encodeObject(_obj);
    assertEquals("d4:testi10e5:test2i100e5:test33:abce", arraybuilder.toText());


    { //number
	var decode = new hetima.util.Bdecode();
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("i3e");
	var ret = decode.decodeArrayBuffer(builder, 0, builder.getLength());	
	assertEquals(3,ret);
    }
    { //number
	var decode = new hetima.util.Bdecode();
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("i30e");
	var ret = decode.decodeArrayBuffer(builder, 0, builder.getLength());	
	assertEquals(30,ret);
    }
    { //text
	var decode = new hetima.util.Bdecode("text");
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("1:a");
	var ret = decode.decodeArrayBuffer(builder, 0, builder.getLength());	
	assertEquals("a",ret);
    }
    { //text
	var decode = new hetima.util.Bdecode("text");
	var builder = new hetima.util.ArrayBuilder(100);
	builder.appendText("7:abcdefg");
	var ret = decode.decodeArrayBuffer(builder, 0, builder.getLength());	
	assertEquals("abcdefg",ret);
    }
    { //diction
	var decode = new hetima.util.Bdecode("text");
    var ret = decode.decodeArrayBuffer(arraybuilder, 0, arraybuilder.getLength());
    assertEquals(10, ret.test);
    assertEquals(100, ret.test2);
    assertEquals("abc", ret.test3);

    }
}

