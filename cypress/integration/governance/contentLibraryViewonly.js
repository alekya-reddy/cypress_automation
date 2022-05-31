import { createAuthoringInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';
import { Common } from '../../support/authoringClasses/Common.js';

const authoring = createAuthoringInstance()

const user = {
    role: 'qa-multiuser',
    roleDescription: "contentLibrary Permissions",
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
        cy.get(authoring.contentLibrary.sidebarComponent.addedByDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.languageDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.topicDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.contentTypeDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.funnelStageDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.businessUnitDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.personaDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.industryDropDown).should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.estimatedCostDropDown).should('be.visible');
        cy.get(authoring.common.pageSearch).should('be.visible').click();
        cy.get(authoring.common.pageSearch).type('12 Factor App{enter}');
        cy.wait(2000);
        cy.get(authoring.common.pageBody).should('contain', '12 Factor App');
        cy.get(authoring.common.pageSearch).clear();
        cy.wait(1000);
        cy.get(authoring.contentLibrary.sidebarComponent.summaryAll).should('be.visible').should('contain','Content in Library');
        cy.get(authoring.contentLibrary.sidebarComponent.summaryInTrack).should('be.visible').should('contain','In Content Track');
        cy.get(authoring.contentLibrary.sidebarComponent.summaryNotInTrack).should('be.visible').should('contain','Not in Content Track');
        cy.get(authoring.contentLibrary.sidebarComponent.summaryNew).should('be.visible').should('contain','New');
        cy.get(authoring.contentLibrary.sidebarComponent.summaryExpiring).should('be.visible').should('contain','Expiring');
        cy.get(authoring.contentLibrary.sidebarComponent.summaryExpired).should('be.visible').should('contain','Expired');
        cy.contains('span','Internal Name').should('be.visible');
        cy.contains('span','External ID').should('be.visible');
        cy.contains('span','Updated').should('be.visible');
        cy.contains('span','Updated By').should('be.visible');
        cy.contains('span','Language').should('be.visible');
        cy.contains('span','Source URL').should('be.visible');
        cy.contains('span','Custom URL Slug').should('be.visible');
        cy.contains('span','Media Type').should('be.visible');
        cy.contains('span','Topics').should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.tableBody).scrollTo('right', {ensureScrollable: false} );
        cy.contains('span','Content Type').should('be.visible');
        cy.contains('span','Include in Recommend Service').should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.tableBody).scrollTo('left', {ensureScrollable: false} );
        cy.get(authoring.common.table.internalTitleCell, { timeout : 1000}).eq(0).should('be.visible').click();
        cy.get(authoring.common.previewSideBar).should('be.visible');
        cy.get(authoring.common.previewSideBar).find('#content-sidebar-preview-content').contains('Preview Content');
        cy.contains('Public Configuration').should('be.visible');
        cy.get(authoring.contentLibrary.sidebarComponent.seoTitle).should('be.visible');
        // cy.get(authoring.contentLibrary.sidebarComponent.contentType).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        // cy.get(authoring.contentLibrary.sidebarComponent.topics).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        // cy.get(authoring.contentLibrary.sidebarComponent.previewThumbnail).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        // cy.get(authoring.contentLibrary.sidebarComponent.sourceUrl).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        // cy.get(authoring.contentLibrary.sidebarComponent.slug).should('be.visible').children().should('not.have.class', 'Icon__fa-pencil');
        cy.get(authoring.contentLibrary.sidebarComponent.contentTypeEditIcon).should('not.exist');
        cy.get(authoring.contentLibrary.sidebarComponent.topicsEditIcon).should('not.exist');
        cy.get(authoring.contentLibrary.sidebarComponent.previewThumbnailEditIcon).should('not.exist');
        cy.get(authoring.contentLibrary.sidebarComponent.sourceUrlEditIcon).should('not.exist');
        cy.get(authoring.contentLibrary.sidebarComponent.slugEditIcon).should('not.exist');
        cy.contains('Internal Configuration');
        cy.scrollTo('bottom', { ensureScrollable: false});
        cy.get(authoring.contentLibrary.sidebarComponent.funnelStage).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.estimatedCost).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.language).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.businessUnit).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.persona).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.industry).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.expiry).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.externalID).should('exist').trigger('mouseover');
        cy.get(authoring.contentLibrary.sidebarComponent.scoreThreshold).should('exist').trigger('mouseover');
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
            cy.wait(1000);
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
        cy.get(authoring.common.deleteIcon).should('not.exist');
        cy.get('[href*="/csv_download"]').should('be.visible');
    })
})