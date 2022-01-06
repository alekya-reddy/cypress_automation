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
        authoring.target.visit()
        cy.contains('span', "Root").should('be.visible')
        cy.contains('a', "Flow Promoter").click()
        cy.wait(2000)
        cy.contains('label', "Custom URL").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Search Engine Directive").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Language").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Appearance").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "External Code").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('div', "Track ID:").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "External ID").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Explore Page: ").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Access Protection").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")

        cy.contains('h5', "Flow").should('be.visible')
        cy.get(authoring.target.pageSidebar.flowToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.flowToggle).click()
            cy.get(authoring.target.pageSidebar.flowToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains('label', "CTA").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('div', "no overrides").should('be.visible').click()
        cy.get(authoring.common.popover).should("not.exist")

        cy.contains('h5', "Signposts").should('be.visible')
        cy.get(authoring.target.pageSidebar.signpostsToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.signpostsToggle).click()
            cy.get(authoring.target.pageSidebar.signpostsToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "Bottom bar").should('be.visible')
        cy.get(authoring.target.pageSidebar.bottombarToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.bottombarToggle).click()
            cy.get(authoring.target.pageSidebar.bottombarToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "Exit").should('be.visible')
        cy.get(authoring.target.pageSidebar.exitToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.exitToggle).click()
            cy.get(authoring.target.pageSidebar.exitToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "Inactivity").should('be.visible')
        cy.get(authoring.target.pageSidebar.inactivityToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.inactivityToggle).click()
            cy.get(authoring.target.pageSidebar.inactivityToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains('h5', "Forms Strategy").should('be.visible')
        cy.get(authoring.target.pageSidebar.formsStrategyToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.formsStrategyToggle).click()
            cy.get(authoring.target.pageSidebar.formsStrategyToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "Cookie Message").should('be.visible')
        cy.get(authoring.target.pageSidebar.cookieMessageToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.cookieMessageToggle).click()
            cy.get(authoring.target.pageSidebar.cookieMessageToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.contains('h5', "Cookie Consent").should('be.visible')
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.cookieConsentToggle).click()
            cy.get(authoring.target.pageSidebar.cookieConsentToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains('h5', "End Promoter").should('be.visible')
        cy.get(authoring.target.pageSidebar.endPromoterToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.endPromoterToggle).click()
            cy.get(authoring.target.pageSidebar.endPromoterToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains('h5', "Header").should('be.visible')
        cy.get(authoring.target.pageSidebar.headerToggle).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.pageSidebar.headerToggle).click()
            cy.get(authoring.target.pageSidebar.headerToggle).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })
        cy.contains(authoring.target.editTrack).should("not.exist")
        cy.contains(authoring.target.deleteTrackIcon).should("not.exist")
        cy.contains(authoring.target.cloneTrack).should("not.exist")
        cy.contains(authoring.target.shareUrl).should("not.exist")
        cy.contains('span', "Add Content").should("not.exist")
        cy.contains('div', "Track Settings").should("exist")

        cy.contains('a', "Analytics").should("exist").click()
        cy.pause()
        cy.contains('div', "Only from Explore Page").should("exist")
        cy.contains('div', "Visitors").should("exist")
        cy.contains('div', "Last 30 Days").should("exist")
        cy.contains('h5', "Audience Filters").should("exist")
        cy.go("back")
        cy.contains('button', "View Form Strategy").should("exist")
        cy.contains('span', "Add Rule").should("not.exist")
        cy.contains('h3', "Add Content Rule").should("not.exist")
        cy.contains('h3', "Edit Track Rule").should("not.exist")
        cy.contains('h3', "Edit Exclusions").should("not.exist")

        cy.contains('div', "Youtube Video Sample").should("exist").click()
        cy.contains('h5', "Internal Name").should("exist")
        cy.contains('h5', "Public Title").should("exist")
        cy.contains('div', "Thumbnail Image Override:").should("exist")
        cy.contains(authoring.target.thumbnailSelect).should("not.exist")
        cy.contains('label', "Content Title Override").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Content Description Override").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Canonical Url Override").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Engagement Score").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('label', "Next Promoter Headline Override").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")
        cy.contains('a', "Website Overlay Embed").should("exist")
        cy.contains('span', "Share").should("not.exist")
        cy.contains('span', "Preview").should("not.exist")
        cy.contains(authoring.target.deleteContent).should("not.exist")
        cy.contains('button', "Open in Cont. Library ").should("not.exist")
        cy.contains('label', "PDF Start Page").should("not.exist")
        cy.contains('label', "Open In New Page").should("not.exist")

        cy.contains('label', "Video Start Time").should('be.visible').next().click()
        cy.get(authoring.common.popover).should("not.exist")


        cy.contains('div', "AutoPlay").should('be.visible')
        cy.contains('div', "Show Same Channel Video").should('be.visible')
        cy.get(authoring.target.relatedVideos).invoke('attr', 'class').then(beforeclick => {
            cy.log(beforeclick)
            cy.get(authoring.target.relatedVideos).click()
            cy.get(authoring.target.relatedVideos).invoke('attr', 'class').then(afterclick => {
                cy.log(afterclick)
                expect(afterclick).to.be.equal(beforeclick)
            })
        })

        cy.go("back")
        cy.contains('div', "Added By").should('be.visible')
        cy.contains('div', "Label").should('be.visible')
        cy.get(authoring.common.orgSearch).should("exist")
        cy.contains('button', "Create Target Track").should("not.exist")
        cy.get(authoring.target.targetAnalytics).should("exist").click()
        cy.contains('div', "Visitors").should("exist")
        cy.contains('div', "Last 30 Days").should("exist")
        cy.contains('a', " Tracks").should("exist")
        cy.go("back")
        cy.contains('button', "Add Folder").should("not.exist")
        cy.contains('button', "Create Target Track").should("not.exist")
        cy.get(authoring.target.editFolder).should("not.exist")
        cy.get(authoring.target.deleteFolder).should("not.exist")
        cy.get(authoring.target.recentUpdateTab).should("exist")
        cy.get(authoring.common.pageBody).within(() => {
            cy.contains(authoring.target.editFolder).should("not.exist")
            cy.contains(authoring.target.editTrack).should("not.exist")
        })

        cy.contains('span', "Name").should("exist")
        cy.contains('span', "Added By").should("exist")
        cy.contains('span', "Updated").should("exist")
        cy.contains('span', "Assets").should("exist")
        cy.contains('span', "Forms").should("exist")
        cy.contains('span', "Folder").should("exist")
        cy.contains('span', "Labels").should("exist")

    })
})