import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "Author Permissions",
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

const virtualEvent = {
    name: 'virtualEventModuleRole.js'
}
const domainName = "pathfactory-qa-wp.com"
const errorMsg = "You don't have permission to view this page."

describe('Author Role Permissions', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
       cy.get(authoring.common.nameSetting).click()
       cy.get("#user-management").should("exist").click()
       cy.contains('span', "qa-multiuser@pathfactory.com").click()
       cy.contains('h5', "User Role").next().click()
       cy.get(authoring.common.editIconUserRoles).click()
       cy.get(authoring.common.userRolename).click().type("Author"+ "\n")
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
        cy.contains('button', "Add Folder").should("exist")
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
        cy.contains('button', "Add Folder").should("exist")
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
        cy.contains('button', "Create Explore Page", {timeout: 8000}).should("exist")
        cy.contains('button', "Add Folder").should("exist")
        cy.get(authoring.explore.editFolder).should("exist")
        cy.contains('a', explore.name).click()
        cy.get("#explore-show-analytics-button", {timeout: 9000}).should("exist").click()
        cy.contains("SESSIONS").should("not.exist")
        cy.contains('a', "Page Settings").should("exist")
        cy.contains('a', "View the Content Track Analytics").should("exist")

        authoring.website.visit()
        cy.contains('h1', "Website Campaigns").should("exist")
        cy.contains('button',"Add Website URL").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.contains('span', "Website Script Tag").should("exist")

        cy.get(authoring.common.nameSetting).click()
        cy.get(authoring.common.clientHq).should("not.exist")
        cy.get("#user-management").should("not.exist")
        cy.get("#organization").should("not.exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization-management")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/settings")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/user-management")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/analytics")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/eloqua-account")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/api-configurations")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/single-sign-on")
        cy.contains(errorMsg).should("exist")

        cy.visit("https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com"+"/authoring/content-library/settings/organization/cookie-consent")
        cy.contains(errorMsg).should("exist")

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
