import { createAuthoringInstance } from '../../support/pageObject.js';
import { constants } from '../../support/constants.js';

const authoring = Cypress.env('TEST_ENV') == "prod" ? createAuthoringInstance({org: "automation-vex", tld: "lookbookhq"}) : createAuthoringInstance()

let users = [
    {
        role: 'superuser',
        roleDescription: "Superuser should have full access to VEX",
        username: constants.orgs[authoring.common.org].superUser,
        password: constants.orgs[authoring.common.org].superUserPassword,
        vexHomeAccess: true,
        eventsPageAccess: true,
        editPermission: true
    },
    {
        role: 'admin',
        roleDescription: "Admin user should have full access to VEX",
        username: constants.orgs[authoring.common.org].adminUser,
        password: constants.orgs[authoring.common.org].adminUserPassword,
        vexHomeAccess: true,
        eventsPageAccess: true,
        editPermission: true
    },
    {
        role: 'author',
        roleDescription: "Author user should have full access to VEX",
        username: constants.orgs[authoring.common.org].authorUser,
        password: constants.orgs[authoring.common.org].authorUserPassword,
        vexHomeAccess: true,
        eventsPageAccess: true,
        editPermission: true
    },
    {
        role: 'reporter',
        roleDescription: "Reporter should have access to VEX Analytics",
        username: constants.orgs[authoring.common.org].reporterUser,
        password: constants.orgs[authoring.common.org].reporterUserPassword,
        vexHomeAccess: true,
        eventsPageAccess: false,
        editPermission: false
    }
]
if (Cypress.env('TEST_ENV') == 'prod') {
    users.shift() // Need to remove superuser from prod test because there are no super automation users on prod
}

const event = { 
    name: 'vexUserRoles.js'
}


const userAddedEvent = {
name: "User Added Event"
}

// Bare bones test for now. Will update as user roles become more defined. 
describe('VEX - User roles', function() {
    it('Before hook to turn on VEX', function(){
        authoring.common.login()
        if (Cypress.env('TEST_ENV') !== 'prod') {
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on')
        }
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.deleteVirtualEvent(userAddedEvent.name)
        authoring.vex.addVirtualEvent(event)
    })

    users.forEach((user)=>{
        it(user.roleDescription, function(){
            authoring.common.login(user.username, user.password)

            authoring.vex.visit()
            if(user.vexHomeAccess){
                cy.contains(authoring.vex.pageTitleLocator, authoring.vex.virtualEventHomeTitle).should('exist')
            } else {
                cy.contains(authoring.vex.pageTitleLocator, authoring.vex.virtualEventHomeTitle).should('not.exist')
            }

            authoring.vex.goToEventConfig(event.name)
            if(user.eventsPageAccess){
                cy.containsExact(authoring.vex.pageTitleLocator, event.name, {timeout: 20000}).should('exist')
            } else {
                cy.containsExact(authoring.vex.pageTitleLocator, event.name, {timeout: 20000}).should('exist')
                cy.contains("span", "Preview Event").should("not.exist")
                cy.waitFor({element: "#lk-dashboard-container", to: "exist", wait: 10000})
            }

            authoring.vex.visit()
            if(user.editPermission){
                authoring.vex.addVirtualEvent(userAddedEvent, false)
                cy.containsExact(authoring.vex.eventCardTitle, userAddedEvent.name, {timeout: 20000}).should('exist')
                authoring.vex.deleteVirtualEvent(userAddedEvent.name)
            } else {
                cy.contains("span", "Add Virtual Event").should("not.exist")
                cy.contains("span", "More Actions").should("not.exist")
            }
        })
    })
})