import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "Admin Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const recommend = {
    name: 'Automation'
}

const target = {
    name: ' Automation'
}

const explore = {
    name: 'GDPR T2 explore'
}

const microsite = {
    name: 'DoNotDelete'
}

const virtualEvent = {
    name: 'virtualEventModuleRole.js'
}
const domainName = "pathfactory-qa-wp.com"
const errorMsg = "You don't have permission to view this page."

describe('Admin Role Permissions', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
       cy.get(authoring.common.nameSetting).click()
       cy.get("#user-management").should("exist").click()
       cy.contains('span', "qa-multiuser@pathfactory.com").click()
       cy.contains('h5', "User Role").next().click()
       cy.get(authoring.common.editIconUserRoles).click()
       cy.get(authoring.common.userRolename).click().type("Admin"+ "\n")
       cy.contains('button', "Save").click()

        // logout 
        authoring.common.logout()
        //login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.contains('a', "Content Library Insights").should("exist")
        cy.contains('button', "Add Content").should("exist")
        cy.get("#configurations").should("exist").should("exist")

        authoring.target.visit()
        cy.get("#AddTrackLink").should("exist")
        cy.contains('button', "Add Folder")
        cy.get(authoring.target.editTrack).should("exist")
        cy.contains('a', target.name).click()
        cy.contains('button',"Add Content").should("exist")
        cy.contains('div', "Track Settings").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.get(authoring.target.analyticsButton, {timeout: 1000}).eq(1).click()
        cy.get(authoring.target.visitorRows).trigger('mouseover')
        cy.contains('li', "Visitor Engagement Summary").should("exist")
        cy.get(authoring.target.visitorActivities).should("exist").click()

        authoring.recommend.visit()
        cy.get("#AddTrackLink").should("exist")
        cy.contains('button', "Add Folder")
        cy.get(authoring.recommend.editTrack).should("exist")
        cy.contains('a', recommend.name).click()
        cy.contains('button',"Add Content").should("exist")
        cy.contains('div', "Track Settings").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.get(authoring.target.analyticsButton, {timeout: 1000}).eq(1).click()
        cy.get(authoring.target.visitorRows).trigger('mouseover')
        cy.contains('li', "Visitor Engagement Summary").should("exist")
        cy.get(authoring.target.visitorActivities).should("exist").click()
     
        authoring.explore.visit()
        cy.reload()
        cy.wait(4000)
        cy.contains('button', "Create Explore Page").should("exist")
        cy.contains('button', "Add Folder").should("exist")
        cy.get(authoring.explore.editFolder).should("exist")
        cy.contains('a', explore.name).click()
        cy.wait(4000)
        cy.get("#explore-show-analytics-button").should("exist").click()
        cy.contains("SESSIONS").should("not.exist")
        cy.contains('a', "Page Settings").should("exist")
        cy.contains('a', "View the Content Track Analytics").should("exist")

        authoring.website.visit()
        cy.contains('h1', "Website Campaigns", {timeout: 3000}).should("exist")
        cy.contains('button',"Add Website URL").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.contains('span', "Website Script Tag").should("exist")

        cy.get(authoring.common.nameSetting).click()
        cy.get(authoring.common.clientHq).should("not.exist")
        cy.get("#user-management").should("exist")
        cy.get("#organization").should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization-management")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/settings")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/user-management")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/analytics")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/eloqua-account")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/api-configurations")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/crm-integration")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/single-sign-on")
        cy.contains(errorMsg).should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/cookie-consent")
        cy.contains(errorMsg).should("not.exist")

    })

    it('Change User Role back to Original', function(){
        authoring.common.login()
       cy.get(authoring.common.nameSetting).click()
       cy.get("#user-management").should("exist").click()
       cy.contains('span', "qa-multiuser@pathfactory.com").click()
       cy.contains('h5', "User Role").next().click()
       cy.get(authoring.common.editIconUserRoles).click()
       cy.get(authoring.common.userRolename).click().type("Merchandising Role.Js"+ "\n")
       cy.contains('button', "Save").click()
    })
})