
describe 'Biologica Library'
	
  describe '.getSelectedOrganisms(appletId)'
    it 'should add an organism to the applet'
		addAppletFromFixture(fixture('multiple-organism-applet'))
		applet = document.getElementById("multi-org-applet")
      applet.addNewOrganism("abc")
	  org = applet.getOrganisms()[0]
	  org.getName().should.be 'abc'
    end
	it 'should fail to add an organism an invalid organism to the applet'
		addAppletFromFixture(fixture('multiple-organism-applet'))
		applet = document.getElementById("multi-org-applet")
     applet.addNewOrganism("bogus", 10)
	  org = applet.getOrganisms()
	  org.length.should.be 0
    end
    it 'should not get an organism'
      orgs = getSelectedOrganisms("multi-org-applet")
      orgs.should_not.be_null
			orgs.length.should.be 0
    end
    it 'should get an organism from static org applet'
	addAppletFromFixture(fixture('static-organism-applet'))
      orgs = getSelectedOrganisms("static-org-applet")
      orgs.should_not.be_null
			orgs.length.should.be 1
    end
	it 'should transfer an organism between two applets'
		addAppletFromFixture(fixture('multiple-organism-applet') + fixture('breed-offspring-applet'))
		multiOrgApplet = document.getElementById("multi-org-applet")
		breedApplet = document.getElementById("breed-applet")
		multiOrgApplet.addNewOrganism("abc")
		orgs = multiOrgApplet.getOrganisms()
		breedApplet.addOrganisms(orgs)
		breedAppletOrgs = breedApplet.getOrganisms()
		breedAppletOrgs.should_not.be_null
		var containsOrg = false
		for (var i = 0; i < breedAppletOrgs.length; i++){
			var org = breedAppletOrgs[i]
			if (org.getName() == "abc")
				containsOrg = true
		}
		containsOrg.should.be true
    end
  end
end