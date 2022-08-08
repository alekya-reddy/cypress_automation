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

const target = {
    name: 'clearbit logo',
}

const target1 = {
    name: 'clearbit logo',
}

const exploreTarget = {
    name: 'clearbit logo',
    experienceType: 'Target',
    trackName: target1.name,
    slug: 'clearbit-logo-7',
    
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}
const trackName= target1.name

const webContent = ["Website Common Resource", "Youtube Shared Resource","Bay cat Wikipedia","Texas Wikipedia","Pilgrimage - Wikipedia"]

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Add Appearance", () => {
        authoring.common.login()
       
        //Campaign tools - target
        authoring.target.visit();
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)

        cy.contains('Default').eq(0).click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        //Add contents
        authoring.target.addContent([webContent[0]])

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
        cy.get(authoring.common.cookieConsentAcceptButton).click()

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
      
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.flowCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");       
        cy.go('back');

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");     
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.flowCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');

        //uploaded logos
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.flowCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.flowCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');

        })
    })