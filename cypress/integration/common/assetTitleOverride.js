import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

//const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const authoring = createAuthoringInstance()

const content = {
    internalTitle: "assetTitleOverride.js",
    publicTitle: "assetTitleOverride.js",
    url: "https://en.wikipedia.org/wiki/Common_fig",
}

const target = {
    name: "assetTitleOverride.js",
    slug: "titleoverride-js",
    contents: [content.internalTitle],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const seoTitle = "SEO TITLE TEST";
const trackTitleOverride = "TRACK TITLE OVERRIDE";

describe('Content Asset Title Override', function() {
    it("Setup target track if not already done", ()=>{
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.contentLibrary.delete({url: content.url, wait: 1000})
                authoring.contentLibrary.addContentByUrl(content)
                authoring.contentLibrary.sideBarEdit(content)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })
    })
    it('Page Title Override', function() {
        //<title> and <og:title> will be set using the following order:
        //1. Content asset SEO title
        //2. Content track asset title override
        //3. Content asset title
        
        authoring.common.login();
        // add SEO Title 
        authoring.contentLibrary.openPreview(content)
        authoring.contentLibrary.addSEOTitle(seoTitle)
        cy.get(authoring.contentLibrary.sidebarComponent.usedInSectionArrow).click()
        // add track content title override
        cy.get(authoring.contentLibrary.sidebarComponent.previewTargetTracks).within(()=>{
            cy.contains(authoring.contentLibrary.sidebarComponent.experienceTagsLocator, target.name).click()
        })
        cy.containsExact("strong", content.publicTitle, {timeout: 3000}).click()
        authoring.target.addContentTitleOverride(trackTitleOverride)

        // go to consumption and check that <title> and <og:title> are set to SEO Title
        cy.visit(target.url)
        cy.title().should('eq', seoTitle)
        cy.get('meta[property="og:title"]').should("have.attr", "content", seoTitle);

        // go back to authoring and remove seoTitle
        authoring.common.login();
        authoring.contentLibrary.openPreview(content)
        authoring.contentLibrary.removeSEOTitle()

        // go to consumption and check that <title> and <og:title> are set to Content track asset title override
        cy.visit(target.url)
        cy.title().should('eq', trackTitleOverride)
        cy.get('meta[property="og:title"]').should("have.attr", "content", trackTitleOverride);

        // go back to authoring and remove track asset title
        authoring.common.login();
        //go to the target track 
        authoring.target.visit();
        authoring.target.goToTrack(target.name);
        cy.containsExact("strong", content.publicTitle, {timeout: 3000}).click()
        authoring.target.removeContentTitleOverride()

        // go to consumption and check that <title> and <og:title> are set to asset title
        cy.visit(target.url)
        cy.title().should('eq', content.publicTitle)
        cy.get('meta[property="og:title"]').should("have.attr", "content", content.publicTitle);
    })
})