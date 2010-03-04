
describe 'Biologica Library'
  describe '.getSelectedOrganisms(appletId)'
    it 'should add an organism to the applet'
			$(applets).append(fixture('multiple-organism-applet'))
			applet = document.getElementById("multi-org-applet")
      applet.addNewOrganism("test")
    end
    it 'should not get an organism'
      orgs = getSelectedOrganisms("multi-org-applet")
      orgs.should_not.be_null
			orgs.length.should.be 0
    end
    it 'should get an applet'
      $(applets).append(fixture('static-organism-applet'))
      orgs = getSelectedOrganisms("static-org-applet")
      orgs.should_not.be_null
			orgs.length.should.be 1
    end
  end
end