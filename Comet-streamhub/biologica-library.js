function getSelectedOrganisms(appletId){
	return document.getElementById(appletId).getSelectedOrganisms();
}

function addOrganisms(appletId, orgs){
	document.getElementById(appletId).addOrganisms(orgs);
}

function transferSelectedOrganisms(fromAppletId, toAppletId){
	var orgs = getSelectedOrganisms(fromAppletId);
	addOrganisms(toAppletId, orgs);
}