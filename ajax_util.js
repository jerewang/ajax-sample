function ajaxFailed(ajax, exception) {
	var errorMessage = "Error making Ajax request:\n\n";
	if (exception) {
		errorMessage += "Exception: " + exception.message;
	} else {
		errorMessage += "Server status:\n" + ajax.status + " " + ajax.statusText + 
		                "\n\nServer response text:\n" + ajax.responseText;
	}
	alert(errorMessage);
}

function dump(obj, verbose) {
	var dumpTarget = $("dumptarget");
	if (dumpTarget) {
		setTextContent(dumpTarget, getDumpText(obj, verbose));
		dumpTarget.style.display = "block";
		scrollTo(dumpTarget);
	} else {
		alert(getDumpText(obj, verbose));
	}
}

// returns text of all properties of the given object
function getDumpText(obj, verbose) {
	var text = "";
	if (obj === undefined) {
		text = "undefined";
	} else if (obj === null) {
		text = "null";
	} else if (typeof(obj) == "string") {
		var result = "string(length=" + obj.length + "): \n\"" + obj + "\"";
		if (verbose) {
			// display details about each index and character
			for (var i = 0; i < Math.min(10000, obj.length); i++) {
				if (i % 5 == 0) {
					 result += "\n";
				}
				result += "  " + padL("" + i, 3) + ": " + padL(toPrintableChar(obj.charAt(i)), 2) + "    ";
			}
		}
		return result;
	} else if (typeof(obj) != "object") {
		return typeof(obj) + ": " + obj;
	} else {
		text = "object {";
		var props = [];
		for (var prop in obj) {
			props.push(prop);
		}
		props.sort();
		
		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			try {
				if (prop == prop.toUpperCase()) { continue; }  // skips constants; dom objs have lots of them
				text += "\n  " + prop + "=";
				if (prop.match(/innerHTML/)) {
					text += "[inner HTML, omitted]";
				} else if (obj[prop] && ("" + obj[prop]).match(/function/)) {
					text += "[function]";
				} else {
					text += obj[prop];
				}
			} catch (e) {
				text += "error accessing property '" + prop + "': " + e + "\n";
			}
		}
		
		if (text[text.length - 1] != "{") {
			text += "\n";
		}
		text += "}";
	}
	return text;
}
