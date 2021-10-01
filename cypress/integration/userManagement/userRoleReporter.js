import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "Reporter Permissions",
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

const errorMsg = "You don't have permission to view this page."

describe('Reporter Role Permissions', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
       cy.get(authoring.common.nameSetting).click()
       cy.get("#user-management").should("exist").click()
       cy.contains('span', "qa-multiuser@pathfactory.com").click()
       cy.contains('h5', "User Role").next().click()
       cy.get(authoring.common.editIconUserRoles).click()
       cy.get(authoring.common.userRolename).click().type("Reporter"+ "\n")
       cy.contains('button', "Save").click()

       authoring.common.logout()
       //login and check permissions
       authoring.common.login(user.userName, user.password)
       cy.contains('a', "Content Library Insights").should("not.exist")
       cy.contains('button', "Add Content").should("not.exist")
       cy.get("#configurations").should("not.exist")

       authoring.target.visit()
       cy.get("#AddTrackLink").should("not.exist")
       cy.contains('button', "Add Folder").should("not.exist")
       cy.get(authoring.target.editTrack).should("not.exist")
       cy.get("#TrackAnalyticsLink").should("exist")
       cy.contains('a', target.name).should("exist").click()
       cy.contains('h5',"Audience Filters").should("exist")
       cy.contains('button',"Add Content").should("not.exist")
       cy.contains('div', "Track Settings").should("not.exist")

       authoring.recommend.visit()
       cy.get("#AddTrackLink").should("not.exist")
       cy.contains('button', "Add Folder").should("not.exist")
       cy.get(authoring.recommend.editTrack).should("not.exist")
       cy.get("#TrackAnalyticsLink").should("exist")
       cy.contains('a', recommend.name).should("exist").click()
       cy.contains('h5',"Audience Filters").should("exist")
       cy.contains('button',"Add Content").should("not.exist")
       cy.contains('div', "Track Settings").should("not.exist")
       cy.contains('div', "Visitors").should("exist")
       cy.get('[role="menuitem"]:nth-of-type(6) div').trigger('mouseover')
       cy.contains('li', "Visitor Engagement Summary").should("exist").click()
       cy.contains("No items found.").should("exist")

       authoring.explore.visit()
       cy.contains('button', "Create Explore Page").should("not.exist")
       cy.contains('button', "Add Folder").should("not.exist")
       cy.get(authoring.explore.editFolder).should("not.exist")
       cy.wait(2000)
       cy.contains('a', explore.name).click()
       cy.contains('label', "External Code").should("not.exist")
       cy.contains('a', "Analytics").should("exist").click()
       cy.contains('a', "View the Content Track Analytics").should("exist")
       cy.contains('h5', "Visitors").should("exist")
       cy.contains('h5', "Sessions").should("exist")
       cy.contains('h5', "Page Views").should("exist")
       cy.contains('h5', "Click to Content").should("exist")
       cy.contains('h5', "Bounce Rate").should("exist")

       authoring.website.visit()
       cy.wait(2000)
       cy.contains('h1', "Website Campaigns").should("exist")
       cy.contains('button',"Add Website URL").should("not.exist")
       cy.contains('span', "Website Script Tag").should("not.exist")
       cy.wait(25000)
       cy.contains('div',"Clicks").should("exist")
       cy.contains('div',"Promoter Impressions").should("exist")
       cy.contains('div',"Content Impressions").should("exist")
       cy.contains('div',"Promoter Click Rate").should("exist")
       cy.contains('div',"Content Click Rate").should("exist")

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