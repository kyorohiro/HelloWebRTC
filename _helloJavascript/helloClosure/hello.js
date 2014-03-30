goog.require("goog.dom");
goog.require("hetima.util");

function sayHi() {
    var newHeader = goog.dom.createDom("h1", {"style":"background-color:#EEE"},"Hello world!"+hetima.util.UUID.getID());
    goog.dom.appendChild(document.body, newHeader);
}