
function addLabel(parent, text) {
	var offerList = document.getElementById(parent);
	var elm = document.createElement("label");
	elm.textContent = text;
	offerList.appendChild(elm);		
};

function addBr(parent) {
	var offerList = document.getElementById(parent);
	var elm = document.createElement("br");
	offerList.appendChild(elm);
};


function addButton(parent,text,action,value) {
	var offerList = document.getElementById(parent);
	var elm = document.createElement("button");
	elm.textContent = text;
	elm.setAttribute("onclick", action);
	elm.setAttribute("value", value);
	offerList.appendChild(elm);
};
