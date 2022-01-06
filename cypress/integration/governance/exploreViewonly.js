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
    campaignsToolsView: true,
    campaignToolsAnalyticsView: true
}

describe("View Only Permissions", () => {

    it("Target View Only Permissions", () => {
        // Content intelligence & website tools are Enabled: show both Content configurations and Content strategy
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
        cy.get('input[name="page-search"]').should("exist")
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
        cy.contains('span', "Forms").should("exist")
        cy.contains('span', "Folder").should("exist")
        cy.contains('span', "Labels").should("exist")
        cy.get(authoring.explore.editExplorePageIcon).should("not.exist")
        cy.get(authoring.explore.deleteExplorePageIcon).should("not.exist")
        cy.contains('a', "Header").should("exist").click()
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
        cy.contains('a', "Header").should("exist").click()
        cy.contains('label', "Target Track: ").should('be.visible')
        cy.contains('div', "Signpost Promoter").should('be.visible').click()
        cy.contains('h5', "Track Settings").should("exist")
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
        cy.get(authoring.explore.pageSidebar.ctaToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.ctaToggle).click()
            cy.get(authoring.explore.pageSidebar.ctaToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.wait(2000)
        cy.contains('h5', "Hero").should('be.visible')
        cy.get(authoring.explore.pageSidebar.heroToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.heroToggle).click()
            cy.get(authoring.explore.pageSidebar.heroToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('div', "Show Text").should('be.visible')
        cy.get(authoring.explore.pageSidebar.showTextToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.showTextToggle).click()
            cy.get(authoring.explore.pageSidebar.showTextToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains('h5', "Header").should('be.visible')
        cy.get(authoring.explore.pageSidebar.headerToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.headerToggle).click()
            cy.get(authoring.explore.pageSidebar.headerToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains('h5', "Featured Content").should('be.visible')
        cy.get(authoring.explore.pageSidebar.featuredContent).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.featuredContent).click()
            cy.get(authoring.explore.pageSidebar.featuredContent).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('div', "no image overrides").should("not.exist")
        cy.contains('h5', "Search Function").should('be.visible')
        cy.get(authoring.explore.pageSidebar.searchToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.searchToggle).click()
            cy.get(authoring.explore.pageSidebar.searchToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "FILTERS").should('be.visible')
        cy.get(authoring.explore.pageSidebar.filtersToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.filtersToggle).click()
            cy.get(authoring.explore.pageSidebar.filtersToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "Advanced Customization").should('be.visible')
        cy.get(authoring.explore.pageSidebar.advanceCustomization).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.advanceCustomization).click()
            cy.get(authoring.explore.pageSidebar.advanceCustomization).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('div', "Show Content Type").should('be.visible')
        cy.get(authoring.explore.pageSidebar.contentType).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.contentType).click()
            cy.get(authoring.explore.pageSidebar.contentType).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('div', "Show Topics").should('be.visible')
        cy.get(authoring.explore.pageSidebar.showTopics).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.explore.pageSidebar.showTopics).click()
            cy.get(authoring.explore.pageSidebar.showTopics).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.viewport(2000, 2500)
        cy.contains('div', "scale image").should("not.exist")
        cy.get(authoring.explore.heroSubtitleLocatorDefault).should('be.visible').click()
        cy.get(authoring.explore.heroSubtitleInput).should("not.exist")
        cy.get(authoring.explore.headerTitle).should('be.visible').click()
        cy.get(authoring.explore.heroTitleInput).should("not.exist")
        cy.contains('div', "Add Description").should('be.visible').click()
        cy.contains(authoring.explore.contentDescription).should("not.exist")

    })
})









