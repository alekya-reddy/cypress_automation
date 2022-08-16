import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "WebsiteTools Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role = {
    roleName: "Custom",
    websiteToolsModuleCRUD: false,
    websiteToolsView: true,
    WebsiteToolsAnalysticsOverviewView: true,
    WebsiteToolsAnalysticsAccountView: true,
    WebsiteToolsAnalysticsVisitorView: true,
    WebsiteToolsAnalysticsContentView: true
}

const domainName = "pathfactory-qa-wp.com"

describe("WT View Only Permissions", () => {
    it("Vex View Only Permissions", () => {
    authoring.common.login()
    cy.visit(authoring.userManagement.userRoles.pageURL)
    authoring.userManagement.configureUserRole(role)
    authoring.userManagement.visitUserListPage()
    authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

    // logout 
    authoring.common.logout()
    // login and check permissions
    authoring.common.login(user.userName, user.password)
    authoring.websiteTools.visit()
    cy.wait(200)
    cy.get(authoring.websiteTools.viewOnlyLocators.searchWT).should("exist")
    cy.contains('a', "Sort by: ").should("exist")
    cy.contains('span', "Add Property").should("not.exist")
    cy.contains('span', "Copy Tracking Script").should("not.exist")
    cy.contains('label', "Website Journey Tracking:").should("exist")
    cy.contains('label', "Content Analysis Service:").should("exist")
    cy.contains('label', "Recommendation Service:").should("exist")
    cy.contains('label', "Website Components:").should("exist")
    cy.contains('label', "Last updated: ").should('be.visible')
    cy.contains('span', "Delete").should("not.exist")
    cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
        cy.contains('span', "Manage").should("exist").click()
    })

    cy.get(authoring.websiteTools.viewOnlyLocators.titlebar).should("exist").click()
    cy.get(authoring.websiteTools.viewOnlyLocators.domainCardInput).should("exist")
    authoring.common.togglemethod(authoring.websiteTools.viewOnlyLocators.domainCardInput)

    cy.contains('span', "Save").should("not.exist")
    cy.contains('span', "Close").should("exist").click()

    cy.contains('span', "Add Website Path").should("not.exist")
    cy.contains('span', "Website Path").should("exist")
    cy.contains('span', "Components Displayed").should("exist")
    cy.contains('th', "Last Updated").should("exist")
    cy.contains('span', "Delete").should("not.exist")

    authoring.common.togglemethod(authoring.websiteTools.viewOnlyLocators.inpageEnabled)
    cy.contains('th', "Last Updated").should("exist")
    cy.contains('span', "Delete").should("not.exist")
    cy.contains('a', "Edit").should("not.exist")
    cy.contains('a', "View").should("exist").click()

    cy.get('input[id="websitePath"]').should("exist")
    cy.contains('div', "Appearance").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('div', "Language").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('div', "CTA").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('div', "Type").should("exist")
    cy.contains('div', "Destination").should("exist")
    cy.contains('div', "Button Label").should("exist")
    cy.contains('div', "Trigger").should("exist")
    
    cy.contains('span', "+ Add Concierge").should("not.exist")
    cy.contains('div', "Concierge 1").should("exist")

    cy.get(authoring.websiteTools.targetElementID).should("exist")

    cy.contains('button', "Featured Content").should("exist").click()
    cy.contains('h3', "Edit Featured Content").should("not.exist")
    cy.contains('span', "Add Featured Content Items").should("not.exist")
    cy.contains('span', "Remove").should("not.exist")
    cy.contains('button', "Set Featured Content").should("not.exist")
    cy.contains('button', "Cancel").should("not.exist")
    cy.get(authoring.common.closeModal).click()

    cy.contains('div', "Preview:").should("exist")
    cy.contains('div', "Display on Page").should("exist").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('span', "Close").should("exist")
    cy.contains('span', "Save").should("not.exist")

    cy.get(authoring.websiteTools.leftNevigationSection).should("exist")

    cy.go("back")
    cy.contains('a', "Form Strategy").should("exist").click()
    cy.contains('span', "Add Form Strategy").should("not.exist")
    cy.contains('span', "Website Path").should("exist")
    cy.contains('th', "Last Updated").should("exist")
    cy.contains('span', "Delete").should("not.exist")
    cy.contains('span', "Save").should("not.exist")
    cy.contains('a', "Analytics").should("exist").click()

  })
})
