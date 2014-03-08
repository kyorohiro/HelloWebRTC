window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

function a() {
    console.log("-----a()------");
    requestFileSystem(TEMPORARY, 1024*1024, function(fileSystem) {
            console.log("--request--");
	    
	    // load file
	    fileSystem.root.getFile("sample.01.txt", {create:true, exclusive: false}, function(fileEntry) {
		    console.log("--getFile--");
		    var d = document.getElementById("download");
		    d.href = fileEntry.toURL();
		    fileEntry.createWriter(function(fileWriter) {
			    fileWriter.onwriteend = function(e) {
				console.log("-end-"+e);
			    };
			    fileWriter.onerror = function(e) {
				console.log("-e-"+e.message);
			    }
			    var bb = new Blob(["xxxxx"],{"type":"text/plain"});
			    fileWriter.write(bb);
			},function(e) {console.log("--error--"+e.message);});
		}
            );
	}, function(e) {console.log("--error--"+e.message);}
    );
};