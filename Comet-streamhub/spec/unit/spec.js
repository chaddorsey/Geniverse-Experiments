
describe 'Biologica Library'
  after_each
	document.getElementById("applets").innerHTML = ""
  end
  describe '.getSelectedOrganisms(appletId)'
    it 'should add an organism to the applet'
		addAppletFromFixture(fixture('multiple-organism-applet'))
		applet = document.getElementById("multi-org-applet")
      applet.addNewOrganism("abc")
	  org = getOrganisms("multi-org-applet")[0]
	  org.getName().should.be 'abc'
    end
	it 'should fail to add an invalid organism to the applet'
		addAppletFromFixture(fixture('multiple-organism-applet'))
		applet = document.getElementById("multi-org-applet")
      applet.addNewOrganism("bogus", 10)
	  org = applet.getOrganisms()
	  org.length.should.be 0
    end
    it 'should not get any organism from a newly-created multi-org-applet'
		addAppletFromFixture(fixture('multiple-organism-applet'))
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
		multiOrgApplet.addNewOrganism("abc")
		orgs = multiOrgApplet.getOrganisms()
		addOrganisms("breed-applet", orgs)
		breedAppletOrgs = getOrganisms("breed-applet")
		breedAppletOrgs.should_not.be_null
		var containsOrg = false
		for (var i = 0; i < breedAppletOrgs.length; i++){
			var org = breedAppletOrgs[i]
			if (org.getName() == "abc")
				containsOrg = true
		}
		containsOrg.should.be true
    end
	it 'should be able to create an organism from allele string'
		addAppletFromFixture(fixture('static-organism-applet'))
		var org = createOrganismWithAlleleString("static-org-applet", "a:h,b:h")
		org.should_not.be_null
		var characteristic = org.getCharacteristicOfTrait("Horns")
		var name = characteristic.getName();
		name.should.be "No Horns"
	end
	it 'should be able to create copies of organisms'
		addAppletFromFixture(fixture('multiple-organism-applet') + fixture('static-organism-applet'))
		multiOrgApplet = document.getElementById("multi-org-applet")
		staticApplet = document.getElementById("static-org-applet")
		var org = multiOrgApplet.addNewOrganism("test")
		var orgFromMulti = multiOrgApplet.getOrganisms()
		orgFromMulti.length.should.be 1
		addOrganismsAsCopies("static-org-applet", orgFromMulti)
		var newOrg = getOrganisms("static-org-applet")
		newOrg.should_not.be_null
		newOrg.length.should.be 1
		orgFromMulti[0].should_not.be newOrg[0]
	end
  end
end