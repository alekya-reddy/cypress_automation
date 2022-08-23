import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

let role = {
    roleName: "Merchandising Role.Js",
    campaignToolsModuleCRUD: true,
}

// **** NOTE: This test is lables as Z-userR...js so this will always run at the end of all tests.
//  we are disabling modules in this test, in case if it fail it will not impact other usermangemnet tests 

describe('Merchandise info and module Links when users has access/no access and when Modules on/off', function() {
    // 1. when user has access to module and module in client hq is enabled - show the link and 
    //    will have access to all actions ( Covered in other user management tests )
    // 2. when User has no access to module and module enabled in client hq - Do not show link and 
    //    show no permission page ( Covered in other user management tests )
    
    // 3. User has access to module and module not enabled in client HQ - Show link, show merchandising info
    it(" User has access to module and module not enabled in client HQ ", function(){
        if(authoring.common.env.TEST_ENV !== 'prod'){ // No superuser access on prod
            authoring.common.login()
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.targetToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.recommendToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.targetExploreToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.recommendExploreToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteJourneyTrackingToggle, 'off');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, 'off');
            
            // create user role if do not exist
            authoring.userManagement.addNewUserRole(role.roleName)
            authoring.userManagement.configureUserRole(role)
            // assign that role to the user
            authoring.userManagement.visitUserListPage()
            authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

            // // logout 
            authoring.common.logout()
            // // login and check Merchandising info for modules 
            authoring.common.login(user.userName, user.password)    
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").should("exist")
            cy.get("#campaign-tools").click()
            cy.get("#target").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#recommend").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#explore").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#microsite").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#website").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#virtual-events").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#website-tools").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
        }    
    })
    
    // 4. User has no access to module and module not enabled in client hq - Show link, show merchandizing info 
    it(" User has no access to module and module not enabled in client HQ ", function(){
        role = {
            roleName: "Merchandising Role.Js",
            campaignToolsModuleCRUD: false,
            userManagementCRUD: true // enabled this as we need to enable atleast one permission to save userrole 
        }    
           
        if(authoring.common.env.TEST_ENV !== 'prod'){ // No superuser access on prod  
            authoring.common.login()
            authoring.userManagement.visitUserRolesPage()
            // cy.visit("https://automation.pathfactory-development.com/authoring/content-library/settings/user-management/user-roles")
            authoring.userManagement.configureUserRole(role)
            // // logout 
            authoring.common.logout()
            // // login and check Merchandising info for modules 
            authoring.common.login(user.userName, user.password)
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").should("exist")
            cy.get("#campaign-tools").click()
            cy.get("#target").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#recommend").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#explore").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#microsite").should("exist").click()
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#campaign-tools").click()
            cy.get("#website").should("not.exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#virtual-events").should("exist")
            cy.contains('a',"Take a Demo").should("exist")
            cy.get(authoring.common.contentActivation).click()
            cy.get("#website-tools").should("exist")
            cy.contains('a',"Take a Demo").should("exist")
        }
    })      
    
    //  enable all the modules again in client HQ 
    it(" enable all the modules again in client HQ  ", function(){
        if(authoring.common.env.TEST_ENV !== 'prod'){ // No superuser access on prod
            authoring.common.login()
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.targetToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.recommendToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.targetExploreToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.recommendExploreToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteJourneyTrackingToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, 'on');
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsV2Toggle, 'on'); 
        }
    })        
})    



