import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "CI Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role = {
    roleName: "Custom",
    imageLibExtCodeAccProtectionAccess: false,
    imageLibExtCodeAccProtectionView:true
}

describe("View Only Permissions", () => {

    it("Microsites View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

           // logout 
           authoring.common.logout()
           // login and check permissions
           authoring.common.login(user.userName, user.password)
           cy.visit(authoring.contentLibrary.pageUrl)
           cy.get("#configurations").should("exist").click()
           cy.contains("a", "Image Library").should("exist").click()
           cy.contains("button", "Add Images").should("not.exist")
           cy.get('div[style*="background-image"]').click()
           cy.contains("h5", "Image Name").should("exist")
           cy.contains("h5", "Image Name").next().click()
           cy.get('textarea[name="name"]').should("not.exist")
           cy.contains("h5", "Alt Text").should("exist")
           cy.contains("h5", "Alt Text").next().click()
           cy.get('textarea[name="altText"]').should("not.exist")
           cy.get('i[title="delete"]').should("not.exist")

           cy.get("#configurations").should("exist").click()
          
           cy.contains("a", "External Code").should("exist").click()
           cy.contains("button", "Add External Code").should("not.exist")
           cy.get(authoring.common.pageBody).should("exist")
           cy.contains('div', "Body Organization Settings").click()

           cy.contains("h5", "External Code Name").should("exist")
           cy.contains("h5", "External Code Name").next().click()
           cy.get('input[name="name"]').should("not.exist")

           cy.contains("h5", "Language Descriptions").next().click()
           cy.contains("h3", "Configure Language Descriptions").should("not.exist")

           cy.contains("h5", "Code Snippet").next().click()
           cy.get(authoring.common.modal).should("exist")
           cy.contains("button", "Close").should("exist").click()

           cy.contains("h5", "Language Descriptions").next().click()
           cy.contains("h3", "Configure Language Descriptions").should("not.exist")

           cy.contains("h5", "Location").should("exist")
           authoring.common.togglemethod(authoring.configurations.externalCode.globalToggleEnabled)
           authoring.common.togglemethod(authoring.configurations.externalCode.thirdPartyCookieToggle)
           cy.get('i[title="Delete External Code"]').should("not.exist")

           cy.get("#configurations").should("exist").click()         
           cy.contains("a", "Access Protection").should("exist").click()

           cy.contains("span", "Add Group").should("not.exist")
           cy.get(authoring.common.pageSidebar).should("exist")
           cy.get(authoring.common.editIcon).should("not.exist")
           cy.get(authoring.common.deleteIcon).should("not.exist")
           cy.contains("button", "Add Domain").should("not.exist")
           cy.contains("button", "Add Email Address").should("not.exist")

           cy.contains("a", "Cisco SSO Visitor Groups").should("exist").click()
           cy.contains("span", "Create Cisco SSO Visitor Group").should("not.exist")
           cy.get('i[title="Delete Segment"]').should("not.exist")
           cy.get('i[title="Edit Segment"]').should("not.exist")
           
           

























    })

})