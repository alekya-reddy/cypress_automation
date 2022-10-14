import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()
import { constants } from '../../support/constants.js';

const user = {
    role: 'qa-multiuser',
    roleDescription: "User should have access to Redirect Rules Tab",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role1 = {
    roleName: "Redirect Role",
    redirectRulesCRUD: true,
    organizationSettingsCRUD: true,
}

const role2 = {
    roleName: "Redirect Role",
    redirectRulesCRUD: false,
    organizationSettingsCRUD: true,
}

const incomingPath = "/l/newtrack$"
const redirectPath = "/l/newtrack123$"
const incomingPathEdited = "/l/newtrack$Edit"

describe("Redirect should appear as a new tab within organization settings", () => {
    it("verify add, edit and delete functionality for redirect rules", () => {
        authoring.common.login()
        cy.visit(authoring.settings.redirectRules.pageUrl)
        cy.get(authoring.common.pageTitleBar).contains('Redirect Rules').should("exist")
        //verify edit functionality
        cy.contains(authoring.settings.redirectCells,incomingPath).within(()=>{
            cy.contains('a', "Edit").should("exist").click()          
        })

        cy.get(authoring.settings.incomingPath, {timeout: 2000}).clear().type(incomingPathEdited + "\n")
        cy.contains('button', "Submit").click()
        cy.contains(authoring.settings.redirectCells, incomingPathEdited, {timeout: 2000}).within(()=>{
            cy.wait(2000)
            cy.contains('a', "Edit").should("exist").click()          
        })

        cy.get(authoring.settings.incomingPath, {timeout: 2000}).clear().type(incomingPath + "\n")
        cy.contains('button', "Submit").click()
       
         //verify delete functionality
       cy.wait(2000)
        cy.contains(authoring.settings.redirectCells, incomingPath, {timeout: 4000}).within(()=>{
            cy.contains('span', "Delete").should("exist").click()          
        })

        cy.get(authoring.common.contentModal).within(()=>{
            cy.contains('span', "Delete").should("exist").click()            
        })
        
         //verify add functionality
        cy.contains('tr', "/l/newtrack$").should("not.exist")
        cy.contains('span', "+ Add Redirect Rule").should("exist").click()
        cy.get(authoring.settings.incomingPath).type(incomingPath+ "\n")
        cy.get(authoring.settings.redirectPath).type(redirectPath + "\n")
        cy.contains('button', "Submit").click()

    })

    it("verify  Admin, and custom role  permission", function(){
    authoring.common.login()
    // create user role if do not exist
    authoring.userManagement.addNewUserRole(role1.roleName)
    authoring.userManagement.configureUserRole(role1)
    // assign that role to the user
    authoring.userManagement.visitUserListPage()
    authoring.userManagement.assignUserRoles(user.userName, [role1.roleName])

    // logout 
    authoring.common.logout()
    //login and check permissions
    authoring.common.login(user.userName, user.password)
    cy.visit(authoring.settings.redirectRules.pageUrl)
    //verify that when redirect tab enables user has CRUD access and also super user can asses CRUD
    cy.get(authoring.common.pageTitleBar).contains('Redirect Rules').should("exist")
    cy.contains('span', "+ Add Redirect Rule").should("exist")

    })
     
    it("verify Governance create/ edit / delete  permission", function(){
        authoring.common.login()
        // create user role if do not exist
        authoring.userManagement.addNewUserRole(role2.roleName)
        authoring.userManagement.configureUserRole(role2)
        // assign that role to the user
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role2.roleName])
    
        // logout 
        authoring.common.logout()
        //login and check permissions
        authoring.common.login(user.userName, user.password)
        cy.visit(authoring.settings.redirectRules.pageUrl)
        //verify that when redirect tab disabled user does not have CRUD access 
        cy.get(authoring.common.pageTitleBar).contains('Redirect Rules').should("exist")
        cy.contains('span', "+ Add Redirect Rule").should("not.exist")
        
        })

})