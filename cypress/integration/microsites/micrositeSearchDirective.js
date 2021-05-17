import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "micrositeSerDir.js",
    slug: "micrositeSerDir-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: "SEOAppearance.js"
}

const newAppearanceSetting = {
    name:"SEOAppearance.js", 
    primaryColor: {r: 106, g: 171, b: 233, a: 100},
    titleAppearanceFont: "Overpass",
    titleAppearancecolor: {r: 255, g: 255, b: 255, a: 100},
    bodyTextFont: "Overpass",
    bobyTextcolor: {r: 180, g: 74, b: 13, a: 100}
}

const headerAppearance = {
    appearance: "SEOAppearance.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
   
}

const target = {
    name: "Target 2 Shared Resource",
    slug: "target-2-shared-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-1 Shared Resource", "Wiki-2 Shared Resource", "Wiki-3 Shared Resource","Wiki-4 Shared Resource","Wiki-5 Shared Resource","Wiki-6 Shared Resource"]
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Target Block Grid",
            type: "track",
            track: target.name,
            titleOverride: "Track Grid",
            layout: "Grid",
            expectContents: target.contents
        },
    ]}

describe("Microsites - main setup", () => {
    it("Add microsite, configure main setup area, clean-up microsite", ()=>{
        authoring.common.login()
        
        // Set up Appearance to check the SEO configuration, og and twitter fields for Microsite Landing page
        // Clean up Appearance
        authoring.configurations.deleteAppearance(newAppearanceSetting.name)
        authoring.configurations.addNewAppearance(newAppearanceSetting)
        authoring.configurations.configureHeaderAppearance(headerAppearance)
        // Set up the microsite test environment and clean-Up
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(microsite.slug)
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(microsite.slug)
        cy.contains(authoring.microsites.antRow,'Appearance').within(()=>{
            cy.get(authoring.microsites.setupPage.appearanceInput).clear({force: true}).type(microsite.appearance +'\n', {force: true})   
        })
        // Validations for search Engine Directive drop down field values
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(`div[label='${"Canonical URL of Microsite"}']`).should('exist')
        cy.get(`div[label='${"Index, Follow"}']`).should('exist')
        cy.get(`div[label='${"Index, No follow"}']`).should('exist')
        cy.get(`div[label='${"No Index, Follow"}']`).should('exist')
        cy.get(`div[label='${"No Index, No Follow"}']`).should('exist')

        // When a canonical URL of Microiste is selected for the microsite, should show the respective URL of the microsite home page/landing page or the microsite track URL in the page source.
        cy.get(authoring.common.antDropSelect.options("Canonical URL of Microsite")).click()
        cy.get(`span[title='${"Canonical URL of Microsite"}']`).should('exist')
        cy.contains('button', 'Save').click()
        authoring.microsites.addTracks({target: target.name})
        authoring.microsites.tabToLandingPages()
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)
        cy.visit(landingPage.url)
        // Verifying canonical URL of microsite
        cy.get('link[rel="canonical"]').should("have.attr", "href", landingPage.url);

        //When no index values are selected for the microsite, show the respective meta tag with robots in the page source.
        //Back in authoring,to modify the 'Search Engine Directive' field value
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        // Set field value to "No Index, Follow" and verify in consumption page
        cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(authoring.common.antDropSelect.options("No Index, Follow")).click()
        cy.get(`span[title='${"No Index, Follow"}']`).should('exist')
        cy.contains('button', 'Save').click()
        authoring.microsites.tabToLandingPages()
        cy.visit(landingPage.url)
        cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, follow");

         // Set field value to "No Index, Follow" and verify in consumption page
         // Microsites landing page: include SEO configuration, og and twitter fields [We can verify SEO configurations with any SED values]
         authoring.microsites.visit()
         authoring.microsites.goToMicrositeConfig(microsite.name)
         cy.contains(authoring.common.antRow, "Search Engine Directive").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(authoring.common.antDropSelect.options("No Index, No Follow")).click()
        cy.get(`span[title='${"No Index, No Follow"}']`).should('exist')
        cy.contains('button', 'Save').click()
        authoring.microsites.tabToLandingPages()
        cy.visit(landingPage.url)
        cy.get('meta[name="robots"]').should("have.attr", "content", "noindex, nofollow");
        cy.get('meta[property="og:site_name"]').should("have.attr", "content", "automation-microsites");
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[property="og:description"]').should("have.attr", "content", landingPage.name); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingPage.name);
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576");  
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", landingPage.name);  
        cy.get('meta[name="description"]').should("have.attr", "content", landingPage.name); 
        cy.get('meta[name="twitter:site"]').should("have.attr", "content", "www_twitter_com"); 
        cy.get('meta[name="twitter:creator"]').should("have.attr", "content", "www_twitter_com"); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", landingPage.name);

    })
})
