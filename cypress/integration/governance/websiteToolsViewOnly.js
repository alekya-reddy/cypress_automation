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
    websiteToolsModuleCRUD: false,
    websiteToolsView: true,
    WebsiteToolsAnalysticsView: true,
    contentconfigurationsCRUD: false,
    contentConfigurationView: true

}

const domainName = "pathfactory-qa-pf.com"

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
    cy.contains('span', "Content Intelligence").should('be.visible').click()
    cy.contains('a', "Content Configurations").should('be.visible').click()
    cy.contains('h1', "Content Configurations").should("exist")
    cy.contains('span', "+ Add Content Source").should("not.exist")
    cy.contains('span', "Add Segment").should("not.exist")
    cy.get('div[class="ant-row"]>span>i').should("not.exist")
    cy.contains('th', "Segment Name").should("exist")
    cy.contains('th', "Path").should("exist")
    cy.contains('a[qa-data-hook="show-edit-content-segment-modal-button"]').should("not.exist")
    cy.contains('span', "Delete").should("not.exist")
    
    cy.contains('div', "Content Pools").should("exist").click()
    cy.contains('span', "+ Add Content Pool").should("not.exist")
    cy.contains('span', "Analyze Content Pool").should("not.exist")
    cy.get('div[class="ant-row"]>span>i').should("not.exist")
    cy.get('svg[data-icon="copy"]').should("exist")
    cy.contains('span', "Manage Segments").should("not.exist")
    cy.contains('th', "Order").should("exist")
    cy.contains('th', "Segment").should("exist")
    cy.contains('th', "Content Source").should("exist")
    cy.contains('span', "Delete").should("not.exist")
    
    cy.contains('a', "Website Tools").should("exist").click()
    cy.wait(200)
    cy.get('input[placeholder="Search for existing property"]').should("exist")
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

    cy.get('div[data-qa-hook="title-bar"]>div>span').should("exist").click()
    cy.get('input[id="domain-card-edit-input"]').should("exist")
    authoring.common.togglemethod('input[name="enabled"]')

    cy.contains('div', "Load Eloqua Tracking Script").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    authoring.common.togglemethod('input[name="recommendationsEnabled"]')

    cy.contains('div', "External Link Action").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('span', "Save").should("not.exist")
    cy.contains('span', "Close").should("exist").click()


    cy.contains('span', "Add Website Path").should("not.exist")
    cy.contains('span', "Website Path").should("exist")
    cy.contains('span', "Components Displayed").should("exist")
    cy.contains('th', "Last Updated").should("exist")
    cy.contains('span', "Delete").should("not.exist")

    authoring.common.togglemethod('button[data-qa-hook="toggle-websiteToolsInPageEnabled"]')
    cy.contains('th', "Last Updated").should("exist")
    cy.contains('span', "Delete").should("not.exist")
    cy.contains('a', "Edit").should("not.exist")
    cy.contains('a', "View").should("exist").click()


    cy.get('input[id="websitePath"]').should("exist")

    cy.get('div[id="promoterConfig"]>label>span').invoke('attr', 'class').then(val => {
        expect(val).to.be.equal('ant-checkbox ant-checkbox-checked ant-checkbox-disabled')
    })
    
    cy.contains('div', "Appearance").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('div', "Language").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")

    cy.contains('div', "Content Pool ").siblings('div').click()
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

    // authoring.common.togglemethod(cy.contains('span', "Recommended For You"))
    // authoring.common.togglemethod(cy.contains('span', "Related Content"))
    // authoring.common.togglemethod(cy.contains('span', "Recently Visited"))
    // authoring.common.togglemethod(cy.contains('span', "Featured"))

    //authoring.common.togglemethod('input[name="generalCarouselTypeList"]')

    // cy.contains('span', "Featured Content").should("exist").click()
    // cy.contains('h3', "Edit Featured Content").should("not.exist")
    // cy.contains('span', "Add Featured Content Items").should("not.exist")
    // cy.contains('span', "Remove").should("not.exist")
    // cy.contains('button', "Set Featured Content").should("not.exist")
    // cy.contains('button', "Cancel").should("not.exist")
    // cy.contains('button', "Close").should("exist").click()


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
    //authoring.common.togglemethod('button[data-qa-hook="toggle-form-enabled-true"]')
    cy.contains('th', "Last Updated").should("exist")
    cy.contains('span', "Delete").should("not.exist")
    cy.contains('span', "View").should("exist").click()

    cy.contains('label', "Form").should("exist").siblings('div').click()
    cy.get(authoring.websiteTools.dropDownModal).should("not.exist")
  
    cy.get('span[class*="NumberInput__decrementButton"]').click()
    cy.get('span[class*="NumberInput__decrementButton"]').invoke('attr', 'value').then(val => {
        expect(val).to.be.equal('10')
    })

    authoring.common.togglemethod('button[id="unknown"]')
    authoring.common.togglemethod('button[id="known"]')
    authoring.common.togglemethod('button[id="submitted"]')
    authoring.common.togglemethod('button[id="isDismissable"]')
    cy.contains('span', "Save").should("not.exist")
    cy.contains('span', "Close").should("exist").click()

    cy.contains('a', "Analytics").should("exist").click()

  })
})