function createOrganismWithAlleleString(appletId, string){
	return document.getElementById(appletId).createOrganismWithAlleleString(string)
}

function getSelectedOrganisms(appletId){
	return document.getElementById(appletId).getSelectedOrganisms();
}

function getOrganisms(appletId){
	return document.getElementById(appletId).getOrganisms();
}

function addOrganisms(appletId, orgs){
	document.getElementById(appletId).addOrganisms(orgs);
}

function addOrganismsAsCopies(appletId, orgs){
	var orgCopies = copyOrganisms(orgs);
	document.getElementById(appletId).addOrganisms(orgCopies);
}

function transferSelectedOrganisms(fromAppletId, toAppletId){
	var orgs = getSelectedOrganisms(fromAppletId);
	addOrganisms(toAppletId, orgs);
}

function transferSelectedOrganismsAsCopies(fromAppletId, toAppletId){
	var orgs = getSelectedOrganisms(fromAppletId);
	addOrganismsAsCopies(toAppletId, orgs);
}

function transferOrganisms(fromAppletId, toAppletId){
	var orgs = getOrganisms(fromAppletId);
	addOrganisms(toAppletId, orgs);
}

function transferOrganismsAsCopies(fromAppletId, toAppletId){
	var orgs = getOrganisms(fromAppletId);
	addOrganismsAsCopies(toAppletId, orgs);
}

function copyOrganisms(orgs) {
	var orgCopies = new Array();
	for (var i=0; i<orgs.length; i++) {
		orgCopies.push(orgs[i].copy());
	}
	return orgCopies;
}