import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()
import { constants } from '../../support/constants.js';

const webContent = ["Website Common Resource"]

const user = {
    role: 'qa-multiuser',
    roleDescription: "User should have access to Redirect Rules Tab",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role1 = {
    roleName: "Redirect Role",
    organizationSettingsCRUD: true,
}

const role2 = {
    roleName: "Redirect Role",
    organizationSettingsCRUD: true,
}

const target = {
    name: "redirectTest",
    slug: "target-slug",
    redirectedslug: 'target-slugRedirect',
    incomingPath: '/target-slug/openai',
    redirectPath: '/target-slugRedirect/openai',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}

const explore = {
    name: 'redirectTest',
    experienceType: 'Target',
    trackName: 'redirectTest(Automation)',
    slug: 'exploreslugtest1',
    redirectedslug: 'exploreslugtest2',
    incomingPath: '/l/exploreslugtest1',
    redirectPath: '/l/exploreslugtest2',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const microsite = {
    name: 'redirectTest',
    slug: 'micrositeslug1',
    redirectedslug: 'micrositeslug2',
    incomingPath: '/micrositeslug1',
    redirectPath: '/micrositeslug2',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome : true,
    blocks: [
        {
            id: "Target Block Grid",
            type: "track",
            track: "redirectTest(Automation)"
        },
    ]
}

const vex = {
    name: 'redirectTest',
    slug: 'vexslugtest1',
    redirectedslug: 'vexslugtest2',
    incomingPath: '/vexslugtest1',
    redirectPath: '/vexslugtest2',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
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
        cy.reload()
        cy.contains(authoring.settings.redirectCells, incomingPathEdited, {timeout: 2000}).within(()=>{
            cy.contains('a', "Edit").click()          
        })

        cy.get(authoring.settings.incomingPath, {timeout: 2000}).clear().type(incomingPath + "\n")
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
    cy.contains('a', "Edit").should("exist")
    cy.contains('button', "Delete").should("exist")

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

        it("redirect target", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(target.incomingPath)
            authoring.target.visit()
            authoring.target.deleteTrack(target.name)
            authoring.target.addTrack(target)
            cy.wait(1000)
            authoring.target.configure(target)
            authoring.target.addContent([webContent[0]])

            cy.visit(target.url + "/openai")
            cy.contains('span', "Website Common Resource").should("exist")

            authoring.target.visit()
            authoring.target.goToTrack(target.name)
            cy.wait(1000)
            cy.get(authoring.target.pageSidebar.customUrlLabel).siblings("span").click()
            cy.get(authoring.common.popover).get(authoring.target.popoverElements.customUrlInput).clear().type(target.redirectedslug + "\n")
            cy.ifElementWithExactTextExists("button", "Change", 1000, () => {
            cy.contains("button", "Change").click()
        })
      
        cy.request({ url: target.url + "/openai", failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })
 })

           it("redirect target", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(target.incomingPath)
            cy.contains('span', "+ Add Redirect Rule").should("exist").click()
            cy.get(authoring.settings.incomingPath).type(target.incomingPath+ "\n")
            cy.get(authoring.settings.redirectPath).type(target.redirectPath + "\n")
            cy.contains('button', "Submit").click()

            cy.visit(target.url + "/openai")
            cy.url().should('contain', target.redirectPath)
            cy.contains('span', "Website Common Resource").should("exist")
        
           })

           it("redirect explore", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(explore.incomingPath)
            authoring.explore.visit()
            authoring.explore.deleteExplore(explore.name)
            authoring.explore.addExplore(explore)
            cy.wait(1000)
            authoring.explore.configureExplore(explore)
            cy.wait(1000)
            cy.visit(explore.url)
            cy.get(consumption.explore.exploreTitle).should("exist")

            authoring.explore.visit()
            authoring.explore.goToExplorePage(explore.name)
            cy.wait(1000)
            cy.get(authoring.explore.pageSidebar.customUrlLabel).siblings("span").click()
            cy.get(authoring.common.popover).get(authoring.explore.popoverElements.customUrlInput).clear().type(explore.redirectedslug + "\n")
            cy.ifElementWithExactTextExists("button", "Change", 1000, () => {
            cy.contains("button", "Change").click()
        })
           cy.wait(1000)
           cy.request({ url: explore.url, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.equal(404)
        })
 })

           it("redirect explore", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(explore.incomingPath)
            cy.contains('span', "+ Add Redirect Rule").should("exist").click()
            cy.get(authoring.settings.incomingPath).type(explore.incomingPath+ "\n")
            cy.get(authoring.settings.redirectPath).type(explore.redirectPath + "\n")
            cy.contains('button', "Submit").click()
            cy.clearCookies()
            cy.visit(explore.url)
            cy.url().should('contain', explore.redirectPath)
            cy.get(consumption.explore.exploreTitle).should("exist")

    })


           it("redirect microsite", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(microsite.incomingPath)
            authoring.microsites.visit()
            authoring.microsites.removeMicrosite(microsite.name)
            authoring.microsites.addMicrosite(microsite)
            authoring.microsites.setup(microsite)
            authoring.microsites.addTracks({ target: 'redirectTest(Automation)' })
            authoring.microsites.addLandingPages(landingPage.name)
            authoring.microsites.configureLandingPage(landingPage)
            cy.wait(1000)
            cy.visit(microsite.url)
            cy.url().should('contain', microsite.slug)
            cy.contains('div', "12 Factor App").click
            cy.wait(1000)
            cy.url().should('contain', microsite.slug)

            authoring.microsites.visit()
            authoring.microsites.goToMicrositeConfig(microsite.name)
            cy.get(authoring.microsites.setupPage.slugInput).clear().type(microsite.redirectedslug)
            cy.contains('button', 'Save').click()
            cy.wait(1000)
            cy.request({ url: microsite.url, failOnStatusCode: false }).then((response) => {
                expect(response.status).to.equal(404)
            })
      })


           it("redirect microsite", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(microsite.incomingPath)
            cy.contains('span', "+ Add Redirect Rule").should("exist").click()
            cy.get(authoring.settings.incomingPath).type(microsite.incomingPath+ "\n")
            cy.get(authoring.settings.redirectPath).type(microsite.redirectPath + "\n")
            cy.contains('button', "Submit").click()

            cy.clearCookies()
            cy.visit(microsite.url)
            cy.url().should('contain', microsite.redirectPath)
            cy.contains('div', "12 Factor App").click
            cy.wait(1000)
            cy.url().should('contain', microsite.redirectPath)
        
           })

           it("redirect vex", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(vex.incomingPath)
            authoring.vex.visit()
            authoring.vex.deleteVirtualEvent(vex.name);
            authoring.vex.addVirtualEvent(vex)
            authoring.vex.configureEvent(vex)
            cy.wait(1000)
            cy.visit(vex.url)
            cy.url().should('contain', vex.slug)

            authoring.vex.visit()
            cy.get("a[id='configure-redirectTest']").should('exist').click()
            cy.get(authoring.vex.eventSlugInput, { timeout: 20000 }).clear().type(vex.redirectedslug)
            cy.contains('button', 'Save').click()
            cy.wait(1000)
            cy.request({ url: vex.url, failOnStatusCode: false }).then((response) => {
                expect(response.status).to.equal(404)
            })
      })


           it("redirect vex", () => {
            authoring.common.login()
            authoring.settings.deleteRedirectRule(vex.incomingPath)
            cy.contains('span', "+ Add Redirect Rule").should("exist").click()
            cy.get(authoring.settings.incomingPath).type(vex.incomingPath+ "\n")
            cy.get(authoring.settings.redirectPath).type(vex.redirectPath + "\n")
            cy.contains('button', "Submit").click()

            cy.clearCookies()
            cy.visit(vex.url)
            cy.url().should('contain', vex.redirectPath)
        
           })

})