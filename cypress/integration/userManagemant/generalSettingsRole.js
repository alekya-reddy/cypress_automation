import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

//const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const authoring = createAuthoringInstance()

const user = 
    {
        role: 'qa-multiuser',
        roleDescription: "User should only have access to General Settings",
        userName: constants.orgs[authoring.common.org].multiUser,
        password: constants.orgs[authoring.common.org].multiUserPassword
    }

const role = {
    roleName: "General Settings Role.Js",
    imageLibExtCodeAccProtectionAccess: true,
    contentTagsCreateEditView: true
}

// cy.request({
//     url: '/dashboard',
//     followRedirect: false, // turn off following redirects
//   }).then((response) => {
//     // redirect status code is 302
//     expect(response.status).to.eq(302)
//     expect(response.redirectedToUrl).to.eq('http://localhost:8082/unauthorized')
//   })

describe('General Settings User Role', function() {
    it(user.roleDescription, function(){
        authoring.common.login()
        if (Cypress.env('TEST_ENV') !== 'prod') {
            // create user role if do npt exist
            authoring.userManagement.addNewUserRole(role.roleName)
            authoring.userManagement.configureUserRole(role)
            // assign that role to the user
            authoring.userManagement.visitUserListPage()
            authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

            //login and check permissions



        }

    })

})
