import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';
import { Common } from '../../support/authoringClasses/Common.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "CI Permissions",
    userName: constants.orgs[authoring.common.org].multiUser,
    password: constants.orgs[authoring.common.org].multiUserPassword
}

const role = {
    roleName: "Custom",
    campaignToolsModuleCRUD: false,
    campaignToolsModuleView: true,
    campaignToolsAnalyticsOverviewView: true,
    campaignToolsAnalyticsAccountView: true,
    campaignToolsAnalyticsVisitorView: true,
    campaignToolsAnalyticsContentView: true,
}

describe("View Only Permissions", () => {

    it("Explore View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        authoring.explore.visit()

        cy.contains('div', "Added By", { timeout: 30000 }).should('be.visible')
        cy.contains('div', "Label").should('be.visible')
        cy.get(authoring.common.orgSearch).should("exist")
        cy.contains('button', "Create Explore Page").should("not.exist")
        cy.contains('button', "Add Folder").should("not.exist")
        cy.get(authoring.target.editFolder).should("not.exist")
        cy.get(authoring.target.deleteFolder).should("not.exist")
        cy.get(authoring.explore.recentUpdateTab).should("exist")
        cy.get(authoring.common.pageBody).within(() => {
            cy.contains(authoring.target.editFolder).should("not.exist")
            cy.contains(authoring.target.editTrack).should("not.exist")
        })

        cy.contains('span', "Name").should("exist")
        cy.contains('span', "Added By").should("exist")
        cy.contains('span', "Updated").should("exist")
        cy.contains('th', "Folder").should("exist")
        cy.contains('th', "Labels").should("exist")
        cy.get(authoring.explore.editExplorePageIcon).should("not.exist")
        cy.get(authoring.explore.deleteExplorePageIcon).should("not.exist")
        cy.viewport(1000, 4500)
        cy.contains('a', "viewOnlyExplore").should("exist").click()
        cy.viewport(2000, 2500)
        cy.get(authoring.explore.cloneExploreIcon).should("not.exist")
        cy.get(authoring.explore.sitemapUrl).should("not.exist")

        cy.get(authoring.explore.emailIcon).should("not.exist")
        cy.get(authoring.explore.shareExplore).should("not.exist")
        cy.get(authoring.explore.previewExplore).should("not.exist")
        cy.get(authoring.explore.titleBar).contains("Analytics").should("exist")
        cy.get(authoring.explore.titleBar).contains("Analytics").click()
        cy.wait(3000)
        cy.get(authoring.explore.titleBar).contains("View the Content Track Analytics").should("exist")
        cy.go("back")
        cy.contains('label', "Folder: ").should('be.visible').next().click()
        cy.get(authoring.common.pageBody).should("exist")
        cy.contains('a', "viewOnlyExplore").should("exist").click()
        cy.contains('label', "Target Track: ").should('be.visible')
        cy.contains('div', "Signpost Promoter").should('be.visible').click()
        cy.contains('div', "Track Settings").should("exist")
        cy.go("back")
        cy.contains('label', "Appearance").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")

        cy.get(authoring.explore.pageSidebar.customUrlLabel).siblings("span").click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('span', "Index, Follow").should('be.visible').click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('span', "Title").should('be.visible').click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('span', "None").should('be.visible').click()
        cy.get(authoring.common.popover).should("not.exist")

        cy.contains('h5', "CTAs").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.ctaToggle)

        //if hero toggle is off then it won't show this fields and sometimes it is off because this explore page has been used by other tc too
        // cy.contains('label', "Hero").should('be.visible').siblings().click()
        // cy.get(authoring.common.popover).should("not.exist")
        // cy.contains('label', "Body").should('be.visible').siblings().click()
        // cy.get(authoring.common.popover).should("not.exist")
        // cy.contains('label', "Footer").should('be.visible').siblings().click()
        // cy.get(authoring.common.popover).should("not.exist")
        // cy.get(authoring.explore.header.headerNoOverrides).should("exist").click()
        // cy.contains('h3', "Header Overrides for this Track").should("not.exist")
        //cy.get(authoring.explore.header.headerNoOverrides).should("exist").click()
 
        cy.wait(2000)
        cy.contains('h5', "Hero").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.heroToggle)

        cy.contains('div', "Show Text").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.showTextToggle)
       
        cy.contains('h5', "Header").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.headerToggle)

        cy.contains('h5', "Featured Content").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.featuredContent)

        cy.contains('div', "no image overrides").should("not.exist")
        cy.contains('h5', "Search Function").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.searchToggle)

        cy.contains('h5', "FILTERS").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.filtersToggle)

        cy.contains('h5', "Advanced Customization").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.advanceCustomization) 

        cy.contains('div', "Show Content Type").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.contentType)

        cy.contains('div', "Show Topics").should('be.visible')
        authoring.common.togglemethod(authoring.explore.pageSidebar.showTopics)
     
        cy.contains('div', "scale image").should("not.exist")
        cy.get(authoring.explore.heroSubtitleLocatorDefault).should('be.visible').click()
        cy.get(authoring.explore.heroSubtitleInput).should("not.exist")
        cy.get(authoring.explore.headerTitle).should('be.visible').click()
        cy.get(authoring.explore.heroTitleInput).should("not.exist")
        cy.contains('div', "Add Description").should('be.visible').click()
        cy.contains(authoring.explore.contentDescription).should("not.exist")

    })
})