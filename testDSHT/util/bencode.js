var ArrayBuilder = require('../util/arraybuilder.js');

function Bencode() {
	this.root = {};

	this.decodeArrayBuffer = function(builder, start, length) {
		var calcParam = {};
		calcParam.i = start;
		calcParam.length = length;
		calcParam.builder = builder;
		return this._decodeArrayBuilder(calcParam);
	};
	this._decodeArrayBuilder = function(calcParam) {
		var buffer = calcParam.builder.getArrayBuffer();
		for(;calcParam.i<calcParam.length;calcParam.i++) {
			switch(buffer[calcParam.i]) {
			case 0x64:{ //d:diction
				var ret = {};
				calcParam.i++;//d
				do {
					if(buffer[calcParam.i] ==0x3a) {
						calcParam.i++;//e
						break;
					}
					var key = this._decodeArrayBuilder(calcParam);
					var o = this._decodeArrayBuilder(calcParam);
					ret[key] = o;
				} while(true);
				return ret;
			}
			case 0x69: { //i:number
				calcParam.i++;//i
				var len =0;
				var j=calcParam.i;
				for(;j<calcParam.length;j++) {
					if(buffer[j] ==0x3a) {
						j++;
						break;
					}
					len++;
				}
				var ret = parseInt(calcParam.builder.subString(calcParam.i,len));
				calcParam.i++;//e
				return ret;
			}
			case 0x30:case 0x31:case 0x32:case 0x33:case 0x34:
			case 0x35:case 0x36:case 0x37:case 0x38:case 0x39: {
				var len = "";
				for(;calcParam.i<calcParam.length;calcParam.i++) {
					if(buffer[calcParam.i] ==0x3a) {
						calcParam.i++;//:
						break;
					}
					len += (buffer[calcParam.i]-48);
				}
				var ret = calcParam.builder.subString(calcParam.i,parseInt(len));
				calcParam.i = calcParam.i+parseInt(len);
				return ret;
			}
			}
		}
	};

	this.encodeObject = function(_obj) {
		var builder = new ArrayBuilder();
		this.__encode(_obj, builder)
		return builder;
	};

	this.__encode = function(_obj, builder) {
		var type = Object.prototype.toString.apply(_obj);
		if( type == "[object String]") {
			builder.appendText(""+_obj.length+":"+_obj);
		}
		else if( type == "[object Number]") {
			builder.appendText("i"+_obj+"e");
		}
		else if( type == "[object Array]") {
			builder.appendText("l");
			for(key in _obj) {
				this.__encode(_obj[jey],builder);
			}
			builder.appendText("e");
		}
		else if( type == "[object Object]") {
			builder.appendText("d");
			for(key in _obj) {
				builder.appendText(""+key.length+":"+key);
				this.__encode(_obj[key],builder);
			}
			builder.appendText("e");
		}
	}	
}

try{module.exports = Bencode;}catch(e){;}