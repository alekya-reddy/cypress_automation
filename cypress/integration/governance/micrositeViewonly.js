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
           authoring.microsites.visit()
           cy.contains('div', "Added By").should('be.visible')
           cy.get(authoring.common.orgSearch).should("exist")
           cy.contains('span', "Add Microsite").should("not.exist")
           cy.contains('button', "Add Folder").should("not.exist")
           cy.get(authoring.microsites.editFolder).should("not.exist")
           cy.get(authoring.microsites.deleteFolder).should("not.exist")
           cy.get(authoring.common.pageBody).should("exist").within(() => {
            cy.contains(authoring.microsites.editFolder).should("not.exist")
           })

           cy.contains('span', "Name").should("exist")
           cy.contains('span', "Added By").should("exist")
           cy.contains('span', "Updated").should("exist")
           cy.contains('th', "Folder").should("exist")
           cy.contains('span', "Number of Tracks").should("exist")
           cy.contains('span', "Edit Folder").should("not.exist")
           cy.contains('span', "Delete").should("not.exist")
           cy.contains('a', "DoNotDelete").should("exist").click()
           cy.contains(authoring.microsites.trashIcon).should("not.exist")
           cy.contains(authoring.microsites.cloneIcon).should("not.exist")
           cy.contains('span', "Preview Microsite").should("not.exist")
           cy.get(authoring.microsites.copyIcon).should("not.exist")
           cy.get(authoring.microsites.sharebutton).should("not.exist")

           cy.get(authoring.microsites.setupPage.nameInput).should('be.visible')
           cy.get(authoring.microsites.inputDisable).should("exist")
           cy.get(authoring.microsites.setupPage.slugInput).should('be.visible')
           cy.get(authoring.microsites.inputDisable).should("exist")

           cy.get('span[title="Default"]').click()
           cy.get(authoring.microsites.editmodal).should("not.exist")

           cy.get('input[name="externalId"]').click({force:true})
           cy.get(authoring.microsites.inputDisable).should("exist")

           cy.contains('span', "English").should("exist").click()
           cy.get(authoring.microsites.editmodal).should("not.exist")
        
           cy.contains('span', "None").should("exist").click()
           cy.get(authoring.microsites.editmodal).should("not.exist")

           cy.contains('span', "Select...").should("exist").click()
           cy.get(authoring.microsites.editmodal).should("not.exist")

           cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).click({force: true})
           cy.get('span[class*="ant-checkbox-checked"]').should("not.exist")
           cy.get(authoring.microsites.setupPage.contentTypeCheckbox).click({force: true})
           cy.get('span[class*="ant-checkbox-checked"]').should("not.exist")
           cy.get(authoring.microsites.setupPage.topicTagsCheckbox).click({force: true})
           cy.get('span[class*="ant-checkbox-checked"]').should("not.exist")
           cy.get(authoring.microsites.setupPage.showDescriptionCheckbox).click({force: true})
           cy.get('span[class*="ant-checkbox-checked"]').should("not.exist")
           cy.contains('button', "Save").should("not.exist")
           cy.contains('button', "Reset").should("not.exist")

           cy.contains('a', "Tracks").should("exist").click()
           cy.contains('span', "Assign Tracks").should("not.exist")
           cy.contains('th', "Name").should("exist")
           cy.contains('th', "Experience Type").should("exist")
           cy.contains('span', "Remove").should("not.exist")

           cy.contains('a', "Landing Pages").should("exist").click()
           cy.contains('span', "Add Page").should("not.exist")
           cy.contains('span', "Name").should("exist")
           cy.contains('th', "Visibility").should("exist")
           cy.contains('th', "Slug").should("exist")
           cy.contains('th', "URL").should("not.exist")
           cy.contains('th', "Page Title").should("exist")
           cy.contains('th', "External ID").should("exist")
           cy.contains('th', "Home Page").should("exist")
           cy.contains('span', "Modify Page").should("not.exist")
           cy.contains('button', "Edit").should("not.exist")
           cy.contains('button', "Clone").should("not.exist")
           cy.contains('button', "Remove").should("not.exist")

           cy.contains('a', "Navigation").should("exist").click()
           cy.contains('span', "Add Navigation Item").should("not.exist")
           cy.get(authoring.microsites.navigation.navEdit).should("not.exist")
           cy.get(authoring.microsites.navigation.navDelete).should("not.exist")

           cy.contains('a', "Search & Filter").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")
        
           cy.contains('div', "Topic").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('div', "Business Unit").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('div', "Persona").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('div', "Industry").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('div', "Content Type").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('div', "Funnel Stage").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('div', "Language").should("exist").click()
           cy.get(authoring.microsites.filtersToggle).eq(0).should("be.disabled")

           cy.contains('button', "Save All Settings").should("not.exist")

           cy.contains('a', "Analytics").should("exist").click()
           cy.contains('div', "Overview").should("exist")   

    })
})