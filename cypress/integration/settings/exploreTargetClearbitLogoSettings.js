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
    //targetTrack: "https://automation.qa-pathfactory.com/authoring/content-library/target/65338",

    get url(){
    return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}
    
const trackName= target1.name

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Add Appearance", () => {
        authoring.common.login()

        //Explore Target
        authoring.explore.visit() 
        authoring.explore.deleteExplore(exploreTarget.name)
        authoring.explore.addExplore(exploreTarget)
        authoring.explore.configureExplore(exploreTarget)

        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Target Track: ').click();
        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.contains("a", exploreTarget.name).click();
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.get(authoring.common.cookieConsentAcceptButton).click({force: true});

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");    
        cy.go('back');
        cy.go('back');
        
        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
       
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");       
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");     
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');
               
        //uploaded logos:

        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Target Track: ').click();
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Target Track: ').click();
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.go('back');
        cy.visit(exploreTarget.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');;

    })
 })