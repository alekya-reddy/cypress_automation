import { createAuthoringInstance } from '../../support/pageObject.js';
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance(); 

const users = [
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
        roleDescription: "Reporter should have no access to VEX",
        username: constants.orgs[authoring.common.org].reporterUser,
        password: constants.orgs[authoring.common.org].reporterUserPassword,
        vexHomeAccess: true,
        eventsPageAccess: false,
        editPermission: false
    }
]

const event = 'User Roles'

// Bare bones test for now. Will update as user roles become more defined. 
describe('VEX - User roles', function() {
    it('Before hook to turn on VEX', function(){
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'on')
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on')
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event)
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

            authoring.vex.goToEventConfig(event)
            if(user.eventsPageAccess){
                cy.containsExact(authoring.vex.pageTitleLocator, event).should('exist')
            } else {
                cy.get('body').should('contain', "You don't have permission to view this page.")
                cy.containsExact(authoring.vex.pageTitleLocator, event).should('not.exist')
            }

            authoring.vex.visit()
            authoring.vex.addVirtualEvent("User Added Event", undefined, false)
            if(user.editPermission){
                cy.containsExact(authoring.vex.eventCardTitle, "User Added Event").should('exist')
                authoring.vex.deleteVirtualEvent("User Added Event")
            } else {
                cy.get('body').should('contain', "You don't have permission to view this page.")
            }

        })
    })

    it('After hook to turn off VEX', function(){
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'off')
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off')
    })
})