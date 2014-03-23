var ArrayBuilder = require('../util/arraybuilder.js');

function Bencode() {
	this.root = {};

	this.decodeArrayBuffer = function(builder, start, length) {
		var obj = {};
		var buffer = builder.getArrayBuffer();
		for(var i=start;i<length;i++) {
			switch(buffer[i]) {
			case 0x64:{ //d:diction
				obj.content = {};
				i++;//d
				do {
					if(buffer[j] ==0x3a) {
						j++;
						break;
					}
					var key = this.decodeArrayBuffer(builder, i, length);
					var o = this.decodeArrayBuffer(builder, key.i, length);
					obj.content[key.content] = o.content;
					obj.i = o.i;
					i = obj.i;
				} while(true);
				i++;
				//e
				return obj;
			}
			case 0x69: { //i:number
				i++;
				var j=i;
				var len =0;
				for(;j<length;j++) {
					if(buffer[j] ==0x3a) {
						j++;
						break;
					}
					len++;
				}
				obj.content = parseInt(builder.subString(i,len));i++
				i++;//e
				obj.i =i;
				break;				
			}
			case 0x30:case 0x31:case 0x32:case 0x33:case 0x34:
			case 0x35:case 0x36:case 0x37:case 0x38:case 0x39: {
				var len = "";
				var j=i;
				for(;j<length;j++) {
					if(buffer[j] ==0x3a) {
						j++;
						break;
					}
					len += (buffer[j]-48);
				}
				obj.content = builder.subString(j,parseInt(len));
				obj.i = j+parseInt(len);
				return obj;
			}
			}
		}
		return obj;
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