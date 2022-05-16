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
    campaignToolsModuleCRUD: false,
    campaignsToolsView : true,
    campaignToolsAnalyticsView: true
}

const website = "http://pathfactory-qa-wp.com/automation-analytics"

describe("View Only Permissions", () => {

    it("Web campaigns View Only Permissions", () => {
        // Content intelligence & website tools are Enabled: show both Content configurations and Content strategy
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

           // logout 
           authoring.common.logout()
           // login and check permissions
           authoring.common.login(user.userName, user.password)
           authoring.website.visit()
           cy.contains('span', "Website Script Tag").should('be.visible')
           cy.contains('div', "Settings").should('be.visible')
           cy.contains('div', "Analytics").should('be.visible')
           cy.contains('button', "Add Website URL").should("not.exist")
           cy.contains('span', "Enabled").should('be.visible')
           cy.contains('span', "Promoters Enabled").should('be.visible')
           cy.contains('a', website).should('be.visible').click()

           cy.contains('h5', "Enabled").should('be.visible')
           authoring.common.togglemethod(authoring.website.enabledToggle)

           cy.contains('h5', "Disable Visitor Tracking").should('be.visible')
           cy.contains(authoring.website.newURLInput).should("not.exist")
           cy.contains('h5', "Enabled").should('be.visible')
           authoring.common.togglemethod(authoring.website.visitorTracking)
       
           cy.contains('h5', "Promoter Settings").should('be.visible')
           cy.contains('label', "Appearance").should('be.visible').next().click()
           cy.get(authoring.common.popover).should("not.exist")

           cy.contains('label', "Language").should('be.visible').next().click()
           cy.get(authoring.common.popover).should("not.exist")
           cy.wait(500)
           cy.contains('div', "Cookie Consent").should('be.visible')
           authoring.common.togglemethod(authoring.website.gdprCookie)
         
           cy.contains('div', "In Page").should('be.visible')
           authoring.common.togglemethod(authoring.website.inpageEnabled)
        
          cy.contains('label', "Add In Page slots").should("not.exist")
          cy.contains('div', "Target Element ID").should("not.exist")
          cy.contains('div', "Title").should("exist")
          cy.contains('div', "Maximum Items").should("exist")
          cy.contains('h5', "In-Page Slots").should("not.exist")

          cy.contains('div', "Bottom Bar").should('be.visible')
          authoring.common.togglemethod(authoring.website.bottombar)
      
          cy.contains('label', "Promoter Headline").should("exist")
          cy.contains('label', "Maximum Items").should("exist")
          cy.contains('label', "Scroll Distance").should("exist")
          cy.contains('h5', "Bottom Bar Slots").should("exist")

          
          cy.contains('div', "Card").should('be.visible')
          authoring.common.togglemethod(authoring.website.cardToggle)
        
          cy.contains('label', "Promoter Headline").should("exist")
          cy.contains('label', "Maximum Items").should("exist")
          cy.contains('label', "Scroll Distance").should("exist")
          cy.contains('h5', "Card Slots").should("not.exist")

          cy.contains('div', "Exit").should('be.visible')
          authoring.common.togglemethod(authoring.website.existToggle)
        
          cy.contains('label', "Promoter Headline").should("exist")
          cy.contains('label', "Message").should("exist")
          cy.contains('label', "Maximum Items").should("exist")
          cy.contains('label', "Delay").should("exist")
          cy.contains('h5', "Exit Slots").should("not.exist")

           cy.contains('div', "Inactivity").should('be.visible')
           authoring.common.togglemethod(authoring.website.inactivity)
      
          cy.contains('label', "Inactive Tab Title").should("exist")
          cy.contains('label', "Delay").should("exist")
          cy.get(authoring.website.deleteButton).should("not.exist")
    })
})

