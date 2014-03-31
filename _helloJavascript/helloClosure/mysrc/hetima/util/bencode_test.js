goog.provide('hetima.util.BencodeTest');
goog.require('hetima.util.Bencode');
goog.require('goog.testing.jsunit');

function testS() {
    var bencode = new hetima.util.Bencode();
    var _obj = {};
    _obj.test=10;
    _obj.test2=100;
    _obj.test3="abc";
    var arraybuilder = bencode.encodeObject(_obj);
    assertEquals("d4:testi10e5:test2i100e5:test33:abce", arraybuilder.toText());
   /*
    var decode = new hetima.util.Bdecode();
    var ret = decode.decodeArrayBuffer(arraybuilder, 0, arraybuilder.getLength());
    assertEquals(10, ret.content.test);
    assertEquals(100, ret.content.test2);
    assertEquals("abc", ret.content.test3);
    */
}

