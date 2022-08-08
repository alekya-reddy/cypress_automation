import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import{Explore}from '../../support/authoringClasses/Explore'
const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const appearance = {
    name: "companyLogos.js"
}
const appearance2 = {
    name: "uploadedLogos.js"
}

const recommend = {
    name: 'clearbit logo',
}

const recommend1 = {
    name: 'clearbit logo',
}

const exploreRecommend = {
    name: 'clearbit logoo',
    experienceType: 'Recommend',
    trackName: recommend1.name,
    slug: 'clearbit-logo-19',
    
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}   
const trackName= recommend1.name

const webContent = ["Website Common Resource", "Youtube Shared Resource","Bay cat Wikipedia","Texas Wikipedia","Pilgrimage - Wikipedia"]

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Add Appearance", () => {
        authoring.common.login()

        //Campaign tools - Recommend
        authoring.recommend.visit();
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        
        cy.contains('Default').eq(0).click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        //Add contents
        authoring.recommend.addContent([webContent[0]])

        cy.get(authoring.recommend.pageSidebar.sidebarToggle).click();     
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();        
        cy.get(authoring.common.cookieConsentAcceptButton).click()

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");     
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        //uploaded logos
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.get(authoring.recommend.recommendContent).click();
        cy.contains('Preview').invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
       
        })
    })