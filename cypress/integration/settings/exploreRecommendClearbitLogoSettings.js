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
   // recommendTrack: "https://automation.qa-pathfactory.com/authoring/content-library/recommend/65326",
    
   get url(){
    return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}
    
const trackName= recommend1.name

describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Add Appearance", () => {
        authoring.common.login()

        //Explore Recommend
        authoring.explore.visit() 
        authoring.explore.deleteExplore(exploreRecommend.name)
        authoring.explore.addExplore(exploreRecommend)
        authoring.explore.configureExplore(exploreRecommend)

        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Recommend Track: ').click();
        cy.contains('uploadedLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('companyLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.contains("a", exploreRecommend.name).click();
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.get(authoring.common.cookieConsentAcceptButton).click()

        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");    
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();

        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");       
        cy.go('back');
        cy.go('back');
      
        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");     
        cy.go('back');
        cy.go('back');
       
        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
                
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should("exist");
        cy.go('back');
        cy.go('back');

        //uploaded logos

        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.contains('Recommend Track: ').click();
        cy.contains('companyLogos.js').click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('uploadedLogos.js').click();
        cy.contains('button', 'Update').click();

        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
   
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should("exist");
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.headerToggle).click();
        cy.get(authoring.recommend.pageSidebar.cookieConsentToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        
        cy.get(authoring.configurations.appearances.clearbitLogo.headerLogoVisible).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerTitle).should('have.text', 'Recommended Content');
        cy.get(authoring.configurations.appearances.clearbitLogo.headerCookieConsentButton).should('not.exist')
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
        cy.go('back');
        cy.go('back');

        cy.contains('Recommend Track: ').click();
        cy.get(authoring.recommend.pageSidebar.topicSidebarToggle).click();
        cy.go('back');
        cy.visit(exploreRecommend.url);
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
   
        cy.get(authoring.configurations.appearances.clearbitLogo.flowLogo).should('be.visible');
        cy.get(authoring.configurations.appearances.clearbitLogo.cookieConsentButton).should('not.exist');
        cy.get(authoring.configurations.appearances.clearbitLogo.clearbitText).should('not.exist');
 
    })
})