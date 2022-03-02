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

const virtualEvent = {
    name: 'virtualEventModuleRole.js'
}
const domainName = "pathfactory-qa-wp.com"
const errorMsg = "You don't have permission to view this page."
const userName1 = "admin-user"
const userName2 = "admin-useradmin-useradmin-useradmin-useradmin-useradmin-useradmin-user" //username longer than 20 char
const userName3 = "qa13-()_ 123a uto" //usename with permission to add spaces and brackets

describe('Admin Role Permissions', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
       cy.get(authoring.common.nameSetting).click()
       cy.get("#user-management").should("exist").click()
       cy.contains('span', "qa-multiuser@pathfactory.com").click()

    //Verify that admin can edit username and updated username appears as a hover text in campaignTools and vex added by column including content library
       cy.contains('h5', "Username").next().click()
       cy.get('input[name="username"]').click().type(userName1+ "\n")
       cy.contains('button', "Save").click()
       cy.contains('div', "has already been taken").should("exist")
       cy.contains('button', "Cancel").click()
       
       cy.contains('h5', "Username").next().click()
       cy.get('input[name="username"]').click().type(userName2+ "\n")
       cy.wait(200)

       cy.contains('h5', "Username").next().click()
       cy.get('input[name="username"]').click().type(userName3+ "\n")
       cy.wait(200)

       cy.contains('h5', "Username").next().click()
       cy.get('input[name="username"]').click().type("qa-multiuser"+ "\n")

       cy.contains('h5', "User Role").next().click()
       cy.get(authoring.common.editIconUserRoles).click()
       cy.get(authoring.common.userRolename).click().type("Admin"+ "\n")
       cy.contains('button', "Save").click()

        // logout 
        authoring.common.logout()
        //login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.contains('div', "qa-automation").trigger('mouseover').should('have.text', "qa-automation")
        cy.contains('div', "Added By").click()
        cy.contains('span',"qa-automation").should("exist")
        cy.contains('a', "Content Library Insights").should("exist")
        cy.contains('button', "Add Content").should("exist")
        cy.get("#configurations").should("exist").should("exist")

        authoring.target.visit()
        cy.contains('div', "qa-automation").trigger('mouseover').should('have.text', "qa-automation")
        cy.get("#AddTrackLink").should("exist")
        cy.contains('button', "Add Folder")
        cy.get(authoring.target.editTrack).should("exist")
        cy.contains('a', target.name).click()
        cy.contains('button',"Add Content to Track").should("exist")
        cy.contains('div', "Track Settings").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.get(authoring.target.analyticsButton, {timeout: 1000}).eq(1).click()
        cy.get(authoring.target.visitorRows).trigger('mouseover')
        cy.contains('li', "Visitor Engagement Summary").should("exist")
        cy.get(authoring.target.visitorActivities).should("exist").click()

        authoring.recommend.visit()
        cy.wait(1000)
        cy.contains('div', "qa-automation").trigger('mouseover').should('have.text', "qa-automation")
        cy.get("#AddTrackLink").should("exist")
        cy.contains('button', "Add Folder")
        cy.get(authoring.recommend.editTrack).should("exist")
        cy.contains('a', recommend.name).click()
        cy.contains('button',"Add Content to Track").should("exist")
        cy.contains('div', "Track Settings").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.get(authoring.target.analyticsButton, {timeout: 1000}).eq(1).click()
        cy.get(authoring.target.visitorRows).trigger('mouseover')
        cy.contains('li', "Visitor Engagement Summary").should("exist")
        cy.get(authoring.target.visitorActivities).should("exist").click()
     
        authoring.explore.visit()
        cy.wait(2000)
        cy.contains('div', "qa-automation").trigger('mouseover').should('have.text', "qa-automation")
        cy.contains('button', "Create Explore Page", {timeout: 6000}).should("exist")
        cy.contains('button', "Add Folder").should("exist")
        cy.get(authoring.explore.editFolder).should("exist")
        cy.contains('a', explore.name).click()
        cy.get("#explore-show-analytics-button", {timeout: 15000}).should("exist").click()
        cy.contains("SESSIONS").should("not.exist")
        cy.contains('a', "Page Settings").should("exist")
        cy.contains('a', "View the Content Track Analytics").should("exist")
        
        authoring.microsites.visit()
        cy.contains('div', "qa-automation", {timeout: 15000}).trigger('mouseover').should('have.text', "qa-automation")

        authoring.vex.visit()
        cy.contains('div', "qa-automation", {timeout: 15000}).trigger('mouseover').should('have.text', "qa-automation")

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


    it('Make admin user to custom and verify they can edit username', function(){
        authoring.common.login()
        cy.get(authoring.common.nameSetting).click()
        cy.get("#user-management").should("exist").click()
        cy.contains('span', "qa-multiuser@pathfactory.com").click()

        cy.contains('h5', "User Role").next().click()
        cy.get(authoring.common.editIconUserRoles).click()
        cy.get(authoring.common.userRolename).click().type("Custom"+ "\n")
        cy.contains('button', "Save").click()
 
         // logout 
         authoring.common.logout()
         //login and check permissions
         authoring.common.login(user.userName, user.password)
         cy.get(authoring.common.nameSetting).click()
         
        cy.get("#user-management").should("exist").click()
        cy.contains('span', "customrole@gmail.com", {timeout: 15000}).click()

        cy.contains('h5', "Username").next().click()
        cy.get('input[name="username"]').click().type("customcanedit"+ "\n")
        cy.wait(200)
        cy.contains('h5', "Username").next().click()
        cy.get('input[name="username"]').click().type("Customrole"+ "\n")
        
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