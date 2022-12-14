import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "User should have access to Campaign Tools, Vex & WebsiteTools Analystics",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role = {
    roleName: "Analytics Role.Js",
    campaignToolsAnalyticsOverviewView: true,
    campaignToolsAnalyticsAccountView: true,
    campaignToolsAnalyticsVisitorView: true,
    campaignToolsAnalyticsContentView: true,
    //vexAnalysticsView: true,
    WebsiteToolsAnalysticsOverviewView: true,
    WebsiteToolsAnalysticsVisitorView: true,
    WebsiteToolsAnalysticsAccountView: true,
    WebsiteToolsAnalysticsContentView: true,
    vexModuleCRUD: true,
    websiteToolsModuleCRUD: true,
    campaignToolsModuleCRUD: true,

}

const explore = {
    name: 'All Text'
}

const microsite = {
    name: 'DoNotDelete'
}

const virtualEvent = {
    name: 'virtualEventModuleRole.js'
}
const domainName = "pathfactory-qa-wp.com"

describe('Governanace Analytics for Tools', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
        // create user role if do not exist
        authoring.userManagement.addNewUserRole(role.roleName)
        authoring.userManagement.configureUserRole(role)
        // assign that role to the user
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

        // logout 
        authoring.common.logout()
        //login and check permissions
        authoring.common.login(user.userName, user.password)

        cy.get("#content-library").should("not.exist")
        cy.contains('button', "Add Content").should("not.exist")
        cy.get(authoring.common.contentActivation).should("exist")
        cy.get(authoring.common.contentActivation).click()
        cy.get("#campaign-tools").should("exist")
        cy.get("#target").should("not.exist")
        cy.get("#recommend").should("not.exist")
        cy.get("#explore").should("not.exist")
        cy.get("#microsite").should("not.exist")
        cy.get("#website").should("not.exist")
        cy.get("#virtual-events").should("exist")
        cy.get("#website-tools").should("exist")

        authoring.target.visit()
        cy.get(authoring.target.targetAnalytics).should("exist").click()
        cy.wait(3000)
        cy.get(authoring.target.analyticsActivities).should("exist")

        authoring.recommend.visit()
        cy.get(authoring.recommend.recommendAnalytics).should("exist").click()
        cy.wait(3000)
        cy.get(authoring.recommend.analyticsActivities).should("exist")

        authoring.explore.visit()
        cy.wait(5000)
        authoring.explore.goToExplorePage(explore.name)
        cy.get(authoring.explore.titleBar).contains("Analytics").should("exist")
        cy.get(authoring.explore.titleBar).contains("Analytics").click()
        cy.wait(3000)
        cy.get(authoring.explore.titleBar).contains("View the Content Track Analytics").click()

        authoring.microsites.visit()
        cy.wait(1000)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        cy.wait(1000)
        cy.get(authoring.microsites.analyticsButton).contains("Analytics").should("exist")
        cy.get(authoring.microsites.analyticsButton).contains("Analytics").click({force: true})
        cy.wait(5000)
        cy.contains('div', "Legacy Report").should("exist")
        cy.contains('div', "Reach").should("exist")
        cy.contains('div', "Engagement").should("exist")
        cy.contains('div', "Performance").should("exist")

        authoring.website.visit()
        cy.get(authoring.website.websiteAnalytics).should("exist").click()
 
        authoring.vex.visit()
        cy.wait(1000)
        authoring.vex.goToEventConfig(virtualEvent.name)
        cy.wait(3000)
        cy.get(authoring.vex.analyticsButton).contains("Analytics").should("exist")
        cy.get(authoring.vex.analyticsButton).contains("Analytics").click({force: true})
        cy.wait(3000)
        cy.contains('div', "Event Session Overview").should("exist")

        authoring.websiteTools.visit()
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
        cy.contains("button", "Manage").click()
        })
        cy.get(authoring.websiteTools.titleBar).contains("Analytics").should("exist")

    })
})
