import { createAuthoringInstance } from '../../support/pageObject.js';
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance(); 

const users = [
    {
        role: 'superuser',
        roleDescription: "Superuser should have full access to VEX",
        username: constants.orgs[authoring.common.org].superUser,
        password: constants.orgs[authoring.common.org].superUserPassword,
        eventsPageAccess: true
    },
    {
        role: 'admin',
        roleDescription: "Admin user should have full access to VEX",
        username: constants.orgs[authoring.common.org].adminUser,
        password: constants.orgs[authoring.common.org].adminUserPassword,
        eventsPageAccess: true
    },
    {
        role: 'author',
        roleDescription: "Author user should have full access to VEX",
        username: constants.orgs[authoring.common.org].authorUser,
        password: constants.orgs[authoring.common.org].authorUserPassword,
        eventsPageAccess: true
    },
    {
        role: 'reporter',
        roleDescription: "Reporter should have no access to VEX",
        username: constants.orgs[authoring.common.org].reporterUser,
        password: constants.orgs[authoring.common.org].reporterUserPassword,
        eventsPageAccess: false
    }
]

// Bare bones test for now. Will update as user roles become more defined. 
describe('VEX - User roles', function() {
    it('Before hook to turn on VEX', function(){
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'on')
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on')
    })

    users.forEach((user)=>{
        it(user.roleDescription, function(){
            authoring.common.login(user.username, user.password)
            authoring.vex.visit()
            if(user.eventsPageAccess){
                cy.contains(authoring.vex.pageTitleLocator, authoring.vex.virtualEventHomeTitle).should('exist')
            } else {
                cy.contains(authoring.vex.pageTitleLocator, authoring.vex.virtualEventHomeTitle).should('not.exist')
            }
        })
    })

    it('After hook to turn off VEX', function(){
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'off')
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off')
    })
})