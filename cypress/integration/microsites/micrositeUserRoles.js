import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance()
const org = authoring.common.env.orgs[authoring.common.org]

const users = [
    {
        role: 'admin',
        roleDescription: "Admin user should have full access to Microsites",
        username: org.adminUser,
        password: org.adminUserPassword,
        homeAccess: true,
        setupAccess: true,
        editPermission: true
    },
    {
        role: 'author',
        roleDescription: "Author user should have full access to Microsites",
        username: org.authorUser,
        password: org.authorUserPassword,
        homeAccess: true,
        setupAccess: true,
        editPermission: true
    },
    {
        role: 'reporter',
        roleDescription: "Reporter should have no access to Microsites",
        username: org.reporterUser,
        password: org.reporterUserPassword,
        homeAccess: true,
        setupAccess: false,
        editPermission: false
    }
]

const microsite = {
    name: "micrositeUserRoles1.js",
    slug: "micrositeuserroles1-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const microsite2 = {
    name: "micrositeUserRoles2.js",
    slug: "micrositeuserroles2-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

describe("Microsites - User Roles", () => {
    it('Before hook to turn on Microsites as a superuser', () => {
        if(authoring.common.env.TEST_ENV !== 'prod'){
            authoring.common.login()
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'on')
            authoring.microsites.removeMicrosite(microsite.name)
            authoring.microsites.removeMicrosite(microsite2.name)
            authoring.microsites.addMicrosite(microsite.name)
        }
    })

    users.forEach( user => {
        it(user.roleDescription, () => {
            if(authoring.common.env.TEST_ENV !== 'prod') {
                authoring.common.login(user.username, user.password)

                authoring.microsites.visit()
                if(user.homeAccess){
                    cy.contains(authoring.microsites.pageTitleLocator, authoring.microsites.pageTitle).should("exist")
                } else {
                    cy.contains(authoring.microsites.pageTitleLocator, authoring.microsites.pageTitle).should("not.exist")
                }

                authoring.microsites.goToMicrositeConfig(microsite.name, false)
                if(user.setupAccess){
                    cy.contains(authoring.microsites.pageTitleLocator, microsite.name).should("exist")
                } else {
                    cy.get('body').should('contain', "You don't have permission to view this page.")
                    cy.contains(authoring.microsites.pageTitleLocator, microsite.name).should("not.exist")
                }

                authoring.microsites.visit()
                authoring.microsites.addMicrosite(microsite2.name, false)
                if(user.editPermission){
                    cy.contains(authoring.microsites.micrositesPage.cardTitle, microsite2.name, {timeout: 10000}).should('exist')
                    authoring.microsites.removeMicrosite(microsite2.name)
                } else {
                    cy.get('body').should('contain', "You don't have permission to view this page.")
                }
            }
        })
    })

    it('After hook to turn off Microsites', function(){
        if (Cypress.env('TEST_ENV') !== 'prod') {
            authoring.common.login()
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'off')
        }
    })
})