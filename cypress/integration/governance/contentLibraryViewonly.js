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
    contentLibraryFeatureAccessCRUD: false,
    contentLibraryView: true,
    }

describe("View Only Permissions", () => {

    it("contentLibrary View Only Permissions", () => {
        authoring.common.login()
        cy.visit(authoring.userManagement.userRoles.pageURL)
        authoring.userManagement.configureUserRole(role)
        authoring.userManagement.visitUserListPage()
        authoring.userManagement.assignUserRoles(user.userName, [role.roleName])

        // logout 
        authoring.common.logout()
        // login and check permissions
        authoring.common.login(user.userName, user.password)
        authoring.contentLibrary.visit()
       
        cy.get(authoring.common.pageControls).contains('Content Library');
        cy.get(authoring.common.pageTitleBar).should('not.have.text', 'Add Content');
        cy.get(authoring.common.pageTitleBar).should('not.have.text', 'Content Library insights');
        cy.get(authoring.common.pageSidebar).should('not.exist');
        cy.get(authoring.common.pageBody).should('be.visible');
        cy.contains('Internal Name').should('be.visible');
        cy.contains('External ID').should('be.visible');
        cy.contains('Updated').should('be.visible');
        cy.contains('Updated By').should('be.visible');
        cy.contains('Language').should('be.visible');
        cy.contains('Source URL').should('be.visible');
        cy.contains('Custom URL Slug').should('be.visible');
        cy.contains('Media Type').should('be.visible');
        cy.contains('Topics').should('be.visible');
        cy.contains('Content Type').should('be.visible');
        cy.get(authoring.common.table.internalTitleCell, { timeout : 1000}).eq(0).should('be.visible').click();
        cy.get(authoring.common.previewSideBar).should('be.visible');
        cy.get(authoring.common.previewSideBar).find('#content-sidebar-preview-content').contains('Preview Content');
        cy.contains('Public Configuration').should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.publicTitle).should('have.text', ':: Web Page Password Protect  ::  Free PHP Scripts');
        cy.get(authoring.contentLibrary.sidebarComponent.description).should('have.text', 'Password protect your web pages by just adding one line of  PHP  code. Visitor will not have to re-login to each protected page if one has cookies enabled.');
        cy.get(authoring.contentLibrary.sidebarComponent.seoTitle).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.contentType).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        cy.get(authoring.contentLibrary.sidebarComponent.topics).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        cy.get(authoring.contentLibrary.sidebarComponent.previewThumbnail).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        cy.get(authoring.contentLibrary.sidebarComponent.sourceUrl).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        cy.get(authoring.contentLibrary.sidebarComponent.slug).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        cy.contains('Internal Configuration');
        cy.scrollTo('bottom', { ensureScrollable: false});
        cy.get(authoring.contentLibrary.sidebarComponent.funnelStage).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.estimatedCost).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.language).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.businessUnit).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.persona).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.industry).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.expiry).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.externalID).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.scoreThreshold).should('exist');
        cy.get(authoring.contentLibrary.sidebarComponent.iFrameSandbox).eq(0).trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.iFrameSandboxToggle).should('be.visible').contains('OFF');
        cy.get(authoring.contentLibrary.sidebarComponent.usedInDownArrow).should('be.visible').contains('Used In');
        cy.wait(1000);
        cy.get(authoring.contentLibrary.sidebarComponent.usedInDownArrow).should('be.visible').click();
        cy.wait(1000);
        cy.get(authoring.contentLibrary.sidebarComponent.usedInUpArrow).should('be.visible');
        cy.contains('Recommend Tracks');
        cy.get(authoring.contentLibrary.sidebarComponent.usedInDownArrow).click();
        cy.get('[href*="/authoring/content-library/recommend/"]').then(($href) => {
            cy.get($href).should('be.visible').click( {force:true} );
            cy.url().should('include', '/authoring/content-library/recommend/');
            cy.get(authoring.common.pageControls).should('be.visible').contains('#all');
            cy.go('back');
        });
        cy.wait(1000);
        cy.get(authoring.common.table.internalTitleCell, { timeout : 1000}).eq(0).should('be.visible').click();
        cy.get(authoring.contentLibrary.sidebarComponent.usedInDownArrow).click();
        cy.wait(1000);
        cy.get(authoring.contentLibrary.sidebarComponent.usedInUpArrow).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.usedInDownArrow).click();
        cy.get(authoring.contentLibrary.sidebarComponent.previewTargetTracks).should('be.visible');
        cy.contains('Explore Pages').should('be.visible');
        cy.contains('Microsites').should('be.visible');
        cy.contains('Virtual Sessions').should('be.visible');
        cy.get(authoring.common.previewSideBar).should('not.have.text', 'Advanced Edit');
    })
})