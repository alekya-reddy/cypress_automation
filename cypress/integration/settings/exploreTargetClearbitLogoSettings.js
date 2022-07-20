import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import{Explore}from '../../support/authoringClasses/Explore'
const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()
const appearance = {

    name: "appearanceclearbit.js"
}
const recommend = {
    name: 'clearbit logo',
}
const target = {
    name: 'clearbit logo',
}
const target1 = {
    name: 'clearbit logo',
}
const recommend1 = {
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

const microsites = {
    name: 'clearbit logo',
    appearance: 'appearanceclearbit.js'
}
const website = {
    url: "http://google.com/languages",
    enabled: "on"
}
const vex = {
    name: 'clearbit logo'
}
describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Add Appearance", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.appearances)
        cy.wait(2000);
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.appearances).should("exist")
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)
        cy.wait(7000)
        cy.contains('a', 'Header', { timeout: 10000 }).click({ force: true })
        cy.get(authoring.configurations.appearances.imagePicker).should('be.visible').click();
        cy.wait(1000);
        cy.contains('Company Logos').click();
        cy.wait(1000);
        cy.get(authoring.configurations.appearances.selectCompanyImage).click();
        cy.wait(1000);
        cy.get(authoring.common.thumbnailSelector).within(()=>{
        cy.contains('button', 'Save').click({ force: true });
        cy.wait(1000);
        })
        cy.contains('button', 'Save').click({ force: true });
      
        //Campaign Tools - Flow
        
    cy.get(authoring.configurations.languages.secondaryNav).contains('Campaign Tools').click();
            cy.contains('a', 'Flow').click();
            cy.contains('Flow Settings').should('be.visible');
            cy.get(authoring.configurations.appearances.imagePicker).should('be.visible').click();
            cy.wait(1000);
            cy.contains('Company Logos').click();
            cy.get(authoring.configurations.appearances.selectCompanyImage).click();
            cy.wait(1000);
            cy.get(authoring.common.thumbnailSelector).within(()=>{
                cy.contains('button', 'Save').click({ force: true });
                cy.wait(1000);
            })
            cy.wait(1000);
            cy.contains('Clear').should('be.visible');
            cy.contains('span', 'Sidebar Background Color').should('be.visible');
             cy.get(authoring.configurations.appearances.colorPicker).eq(1).should('be.visible');
            cy.contains('span', 'Sharing Icon Color').should('be.visible');
            cy.get(authoring.configurations.appearances.colorPicker).eq(1).should('be.visible');
            cy.contains('span', 'Content Background Color').should('be.visible');
            cy.get(authoring.configurations.appearances.colorPicker).eq(1).should('be.visible');
            cy.contains("button", "Save Flow Settings").click();
            cy.wait(10000);

//         //Target
        authoring.explore.visit() 
        authoring.explore.deleteExplore(exploreTarget.name)
        authoring.explore.addExplore(exploreTarget)
        authoring.explore.configureExplore(exploreTarget)
        cy.wait(10000)
        cy.contains('Default').eq(0).click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('appearanceclearbit.js').click();
        cy.contains('button', 'Update').click();
        cy.wait(2000)
        cy.contains('Target Track: ').click();
        cy.wait(10000);

        cy.contains('Default').eq(0).click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('appearanceclearbit.js').click();
        cy.contains('button', 'Update').click();
        cy.wait(10000);

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click();
        // cy.get(authoring.explore.pageSidebar.headerToggle).click();
        cy.wait(5000);
        cy.visit(exploreTarget.url);
        
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);
        cy.get(authoring.explore.cookieConsentButton).click();
        cy.wait(1000);

        cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
        cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
        cy.contains('Cookie Settings').should("exist");
        cy.contains('Logos Provided by Clearbit').should("exist");     
        cy.go('back');
        cy.go('back');
        cy.wait(10000);

        cy.contains('Target Track: ').click();
        cy.wait(10000);
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);

        cy.visit(exploreTarget.url)
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);
                
        cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
        cy.contains('Cookie Settings').should("exist");
        cy.contains('Logos Provided by Clearbit').should("exist");       
        cy.go('back');
        cy.go('back');
        cy.wait(10000);

        cy.contains('Target Track: ').click();
        cy.wait(10000);
        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);

        cy.visit(exploreTarget.url)
        cy.wait(10000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);

        cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
        cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
        cy.contains('Cookie Settings').should('not.exist');
        cy.contains('Logos Provided by Clearbit').should("exist");     
        cy.go('back');
        cy.go('back');
        cy.wait(10000);    
                
        cy.contains('Target Track: ').click();
        cy.wait(10000);
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);
        
        cy.visit(exploreTarget.url)
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);

        cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
        cy.contains('Cookie Settings').should('not.exist');
        cy.contains('Logos Provided by Clearbit').should("exist");       
        cy.go('back');
        cy.go('back');
        cy.wait(10000);
                
//  //       //uploaded logos:
 
cy.visit(authoring.configurations.pageUrls.appearances)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.appearances).should("exist")
        cy.get(authoring.configurations.appearances. sidebar).contains('appearanceclearbit.js').click()
        cy.contains('a', 'Header', { timeout: 10000 }).click({ force: true })
        cy.get(authoring.configurations.appearances.imagePicker).should('be.visible').click();
        cy.wait(1000);
        cy.contains('Uploaded Logos').click();
        cy.wait(1000);
        cy.get(authoring.configurations.appearances.selectUploadedImage).click({force: true})
        cy.wait(1000);
        cy.get(authoring.common.thumbnailSelector).within(()=>{
        cy.contains('button', 'Save').click({ force: true });
        cy.wait(1000);
        })
        cy.contains('button', 'Save').click({ force: true });

// //     Campaign Tools - Flow
cy.get(authoring.configurations.languages.secondaryNav).contains('Campaign Tools').click();
        cy.contains('a', 'Flow').click();
        cy.contains('Flow Settings').should('be.visible');
        cy.get(authoring.configurations.appearances.imagePicker).should('be.visible').click();
        cy.wait(1000);
        cy.contains('Uploaded Logos').click();
        cy.get(authoring.configurations.appearances.selectUploadedImage).click({force: true})
        cy.wait(1000);
        cy.get(authoring.common.thumbnailSelector).within(()=>{
        cy.contains('button', 'Save').click({ force: true });
        cy.wait(1000);
        })
        cy.contains("button", "Save Flow Settings").click();
        cy.wait(1000);

        authoring.explore.visit() 
        cy.wait(5000);
        authoring.explore.goToExplorePage(exploreTarget.name) 
        cy.wait(10000);

        cy.contains('Target Track: ').click();
        cy.wait(10000);

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);;

        cy.visit(exploreTarget.url)
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);

        cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
        cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
        cy.contains('Cookie Settings').should("exist");
        cy.contains('Logos Provided by Clearbit').should('not.exist');     
        cy.go('back');
        cy.go('back');
        cy.wait(10000);

        cy.contains('Target Track: ').click();
        cy.wait(10000);
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);

        cy.visit(exploreTarget.url)
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);
        
        cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
        cy.contains('Cookie Settings').should("exist");
        cy.contains('Logos Provided by Clearbit').should('not.exist');       
        cy.go('back');
        cy.go('back');
        cy.wait(10000);

        cy.contains('Target Track: ').click();
        cy.wait(10000);
        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);

        cy.visit(exploreTarget.url)
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);

        cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
        cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
        cy.contains('Cookie Settings').should('not.exist');
        cy.contains('Logos Provided by Clearbit').should('not.exist');     
        cy.go('back');
        cy.go('back');
        cy.wait(15000);    
                
        cy.contains('Target Track: ').click();
        cy.wait(10000);
        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.wait(5000);
        cy.contains("a", exploreTarget.name).click()
        cy.wait(5000);
        
        cy.visit(exploreTarget.url)
        cy.wait(5000); 
        cy.get(authoring.explore.exploreContent).invoke('removeAttr', 'target').click();
        cy.wait(5000);

        cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
        cy.contains('Cookie Settings').should('not.exist');
        cy.contains('Logos Provided by Clearbit').should('not.exist');       
        
    })
})
