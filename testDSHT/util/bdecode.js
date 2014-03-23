var ArrayBuilder = require('../util/arraybuilder.js');

function Bdecode() {
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
			case 0x64:
				//d:diction
				return this._decodeDiction(calcParam);
			case 0x69: 
				//i:number
				return this._decodeNumber(calcParam);
			case 0x30:case 0x31:case 0x32:case 0x33:case 0x34:
			case 0x35:case 0x36:case 0x37:case 0x38:case 0x39:
				//0-9:text
				return this._decodeText(calcParam);
			}
		}
	};

	this._decodeDiction = function(calcParam) {
		var buffer = calcParam.builder.getArrayBuffer();
		var ret = {};
		calcParam.i++;//d
		do {
			if(buffer[calcParam.i] ==0x3a) {
				calcParam.i++;//e
				break;
			}
			ret[this._decodeArrayBuilder(calcParam)]
			  = this._decodeArrayBuilder(calcParam);
		} while(true);
		return ret;
	}

	this._decodeNumber = function(calcParam) {
		var buffer = calcParam.builder.getArrayBuffer();
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

	this._decodeText = function(calcParam) {
		var buffer = calcParam.builder.getArrayBuffer();
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

try{module.exports = Bdecode;}catch(e){;}