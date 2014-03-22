// ref http://note19.com/2007/05/27/javascript-guid-generator/
var UUID = function UUID() {
}
UUID.getId = _getId;

function s4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

function _getId() {
	return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4();
}

try{module.exports = UUID;}catch(e){;}
