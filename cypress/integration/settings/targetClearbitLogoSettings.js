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

// const exploreRecommend = {
//     name: 'clearbit logoo',
//     experienceType: 'Recommend',
//     trackName: recommend1.name,
//     slug: 'clearbit-logo-7',
    
//     get url(){
//         return `${authoring.common.baseUrl}/l/${this.slug}`
//     }
// }

const trackName= target1.name

const webContent = ["Website Common Resource", "Youtube Shared Resource","Bay cat Wikipedia","Texas Wikipedia","Pilgrimage - Wikipedia"]

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
        let a = [],b=[],c=[],d=[];
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
            cy.wait(1000);
        

// // //         //Campaign tools - target
        
        authoring.target.visit();
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.wait(5000);
        cy.contains('Default').eq(0).click();
        cy.get(authoring.common.selectAppearence).click();
        cy.contains('appearanceclearbit.js').click();
        cy.contains('button', 'Update').click();

// //     Add contents
        authoring.target.addContent([webContent[0]])
        cy.wait(3000)
        cy.get(authoring.target.pageContents).each(content => {
        b.push(content.text().trim())
        }).then(() => {
        expect(b.indexOf(webContent[0])).to.equal(0)
        })

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.targetContent).click();

        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
        cy.wait(10000)
        cy.get(authoring.target.pagePreview.cookieConsentAcceptButton).click()
        cy.wait(5000)

        cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
        cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
        cy.contains('Cookie Settings').should("exist");
        cy.contains('Logos Provided by Clearbit').should("exist");     
        cy.go('back');
        cy.wait(10000);

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
        cy.wait(5000)

        cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
        cy.contains('Cookie Settings').should("exist");
        cy.contains('Logos Provided by Clearbit').should("exist");       
        cy.go('back');
        cy.wait(10000);

        cy.get(authoring.target.pageSidebar.headerToggle).click();
        cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
        cy.wait(5000)

        cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
        cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
        cy.contains('Cookie Settings').should('not.exist');
        cy.contains('Logos Provided by Clearbit').should("exist");     
        cy.go('back');
        cy.wait(10000);

        cy.get(authoring.target.pageSidebar.flowToggle).click();
        cy.get(authoring.target.targetContent).click();
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
        cy.wait(5000)

        cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
        cy.contains('Cookie Settings').should('not.exist');
        cy.contains('Logos Provided by Clearbit').should("exist");
        cy.go('back');
        cy.wait(1000);

// // //       uploaded logos
     
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

           
            authoring.target.visit();
            authoring.target.goToTrack(target.name)
            cy.wait(10000);

            cy.get(authoring.target.pageSidebar.headerToggle).click();
            cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
            cy.get(authoring.target.targetContent).click();
            cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
            cy.wait(5000)

            cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
            cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
            cy.contains('Cookie Settings').should("exist");
            cy.contains('Logos Provided by Clearbit').should('not.exist');
            cy.go('back');
            cy.wait(10000);

            cy.get(authoring.target.pageSidebar.flowToggle).click();
            cy.get(authoring.target.targetContent).click();
            cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
            cy.wait(5000)

            cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
            cy.contains('Cookie Settings').should("exist");
            cy.contains('Logos Provided by Clearbit').should('not.exist');
            cy.go('back');
            cy.wait(15000)

            cy.get(authoring.target.pageSidebar.headerToggle).click();
            cy.get(authoring.target.pageSidebar.cookieConsentToggle).click();
            cy.get(authoring.target.targetContent).click();
            cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
            cy.wait(5000)

            cy.get(authoring.configurations.appearances.accessProtection.headerLogoVisibleLP).should('be.visible');
            cy.get(authoring.configurations.appearances.accessProtection.headerTitleLP).should('have.text', 'Recommended Content');
            cy.contains('Cookie Settings').should('not.exist')
            cy.contains('Logos Provided by Clearbit').should('not.exist');
            cy.go('back');
            cy.wait(10000)

            cy.get(authoring.target.pageSidebar.flowToggle).click();
            cy.get(authoring.target.targetContent).click();
            cy.get(authoring.target.previewClick).invoke('removeAttr', 'target').click();
            cy.wait(5000)

            cy.get(authoring.configurations.appearances.accessProtection.flowLogoLP).should('be.visible');
            cy.contains('Cookie Settings').should('not.exist')
            cy.contains('Logos Provided by Clearbit').should('not.exist');
            cy.go('back');

        })
    })