import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org

const user = {
    role: 'qa-multiuser',
    roleDescription: "CI Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}
const role1 = {
    roleName: "Admin",
}

const role2 = {
    roleName: "Author",
}

const role3 = {
    roleName: "Custom",
    contentconfigurationsCRUD : false,
    contentstrategyCRUD : false
}

const role4 = {
    roleName: "Custom",
    contentconfigurationsCRUD : true,
    contentstrategyCRUD : false
}

const role5 = {
    roleName: "Custom",
    contentconfigurationsCRUD : false,
    contentstrategyCRUD : true
}

describe("Content Intelligence", () => {

    it("Content Intelligence tab and its options availability", () => {
        // Content intelligence & website tools are Enabled: show both Content configurations and Content strategy
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "ON")
        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('exist')

        cy.visit(authoring.contentIntelligence.contentStrategy)
        cy.contains("Content Strategy Overview", { timeout: 10000 }).should('exist')
        
        // Content intelligence & website tools are disabled: Don't show both Content configurations and Content strategy
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "OFF")

        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('not.exist')

        cy.request({ url: authoring.contentIntelligence.contentConfigurations, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })

        cy.request({ url: authoring.contentIntelligence.contentStrategy, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })

        //Content Intelligence is enabled and website tools is disabled: Show both Content configurations and Content strategy
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "OFF")

        cy.visit(authoring.contentIntelligence.contentStrategy)
        cy.contains("Content Strategy Overview", { timeout: 20000 }).should('exist')

        // Content Intelligence is disabled and Website tools is enabled: Show only Content configurations
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "OFF")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, "ON")
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, "ON")

        cy.visit(authoring.contentIntelligence.contentConfigurations)
        cy.contains("You don't have permission to view this page.", { timeout: 10000 }).should('not.exist')

        //Content Intelligence is disabled and if the user directly open the content-starategy url, redirect to forbidden page
        cy.request({ url: authoring.contentIntelligence.contentStrategy, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })

    })

it("Verify Admin have Content Configuration and Strategy create/edit/delete permission", () => {
        authoring.common.login()
        authoring.common.login()
        authoring.clientHQ.visitOrgConfig()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.contentIntelligence, "ON")
        // assign that role to the user
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role1.roleName])
        
          // logout 
          authoring.common.logout()
          // login and check permissions
          authoring.common.login(user.userName, user.password)
          cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('exist')
          cy.visit(authoring.contentIntelligence.contentStrategy)
          cy.contains("Content Strategy Overview", { timeout: 10000 }).should('exist')
          cy.contains('span', "Key Marketing Topics").should('exist').click()
          cy.contains('button', "Add Topics", { timeout: 20000 }).should('exist')

        })

        it("Verify Author have Content Configuration and Strategy create/edit/delete permission", () => {
                
            authoring.common.login()
            // assign that role to the user
            authoring.userManagement.visitUserListPage()
            authoring.userManagement.assignUserRoles(user.userName, [role2.roleName])
            
            // logout 
          authoring.common.logout()
          // login and check permissions
          authoring.common.login(user.userName, user.password)
          cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('exist')
          cy.visit(authoring.contentIntelligence.contentStrategy)
          cy.contains("Content Strategy Overview", { timeout: 10000 }).should('exist')
          cy.contains('span', "Key Marketing Topics").should('exist').click()

        })

    it("Custom role permission with ContentIntelligence checkbox disable", () => {
                
            authoring.common.login()
            cy.visit(authoring.userManagement.userRoles.pageURL)
            authoring.userManagement.configureUserRole(role3)
            authoring.userManagement.visitUserListPage()
            authoring.userManagement.assignUserRoles(user.userName, [role3.roleName])

            // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('not.exist')
            
        })

        it("Custom role permission with ContentIntelligence checkbox enable", () => {
            authoring.common.login()
            cy.visit(authoring.userManagement.userRoles.pageURL)
            authoring.userManagement.configureUserRole(role4)
            authoring.userManagement.visitUserListPage()
            authoring.userManagement.assignUserRoles(user.userName, [role4.roleName])

            // logout 
            authoring.common.logout()
        // login and check permissions

        })

        it("Custom role permission with ContentIntelligence checkbox enable", () => {
            authoring.common.login()
            cy.visit(authoring.userManagement.userRoles.pageURL)
            authoring.userManagement.configureUserRole(role5)
            authoring.userManagement.visitUserListPage()
            authoring.userManagement.assignUserRoles(user.userName, [role5.roleName])

            // logout 
            authoring.common.logout()
        // login and check permissions
            authoring.common.login(user.userName, user.password)
            cy.get(authoring.contentIntelligence.contentIntelligenceTab).should('exist')
            cy.visit(authoring.contentIntelligence.contentStrategy)
            cy.contains("Content Strategy Overview", { timeout: 20000 }).should('exist')
            
        })
})