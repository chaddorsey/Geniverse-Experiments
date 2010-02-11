var applet = document.getElementById("applet");

function getApplet() {
	applet = document.getElementById("applet");
}
function printEnumeration(enum) {
	var out = ""
	while (enum.hasMoreElements()) {
		var e = enum.nextElement();
		if (out != "") {
			out += ", ";
		}
		out += e.getName();
	}
	return out;
}

function getPhenoStr(org) {
	var out = ""
	var chars = org.getCharacteristics();
	while (chars.hasMoreElements()) {
		var c = chars.nextElement();
		if (out != "") {
			out += ", ";
		}
		out += c.getName();
	}
	return out;
}

function displayChildInfo() {
	getApplet();
	var child = applet.getChildOrg();
	var disp = document.getElementById("child-info");
	disp.innerHTML = "... Calculating child information ...";
	disp.innerHTML = "Name: " + child.getName() + "<br/>" +
	  "Sex: " + child.getSexAsString() + "<br/>" +
	  "Alleles: " + child.getAlleleString() + "<br/>" +
	  "Pheno: " + getPhenoStr(child) + "<br/>";
	  //"Geno: " + child.getGenotypeAsString() + "<br/>";
}

function getImages(org) {
	var imageArray = [];
	var i = 0;
	var imgs = org.getOrganismImages();
	while (imgs.hasMoreelements()) {
		imageArray[i] = imgs.nextElement();
		i++;
	}
	return imageArray;
}

function breedOrganism() {
	getApplet();
	applet.breedOrganism();
}

function breedAndNotify() {
	getApplet();
	applet.breedOrganism();
	var child = applet.getChildOrg();
	var notifymessage = "<br/><b>New Child</b> <br/> <em>Sex</em>: " + child.getSexAsString() +
	  " <em>Alleles</em>: " + child.getAlleleString() + "<br/>" +
	  "<em>Pheno</em>: " + getPhenoStr(child) + "<br/>";
	var json = "{'message':'" + escapeQuotes(notifymessage) + "'}";
	hub.publish("chat",json);
}