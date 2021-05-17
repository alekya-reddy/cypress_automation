import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})


const microsite = {
    name: "micrositeSEO.js",
    slug: "micrositeSEO-js",
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
        
        authoring.configurations.addNewAppearance(newAppearanceSetting)
        authoring.configurations.configureHeaderAppearance(headerAppearance)
        authoring.configurations.configureMicrositesAppearance({
            appearance: "SEOAppearance.js",
            hideNavigation: true,
            layout: "Carousel"
        })
       
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.goToMicrositeConfig(microsite.name)
        cy.get(authoring.microsites.setupPage.slugInput).clear().type(microsite.slug)
        cy.contains(authoring.microsites.antRow,'Appearance').within(()=>{
            cy.get(authoring.microsites.setupPage.appearanceInput).clear({force: true}).type(microsite.appearance +'\n', {force: true})   
        })
        cy.wait(1000)
        cy.contains('button', 'Save').click()
        authoring.microsites.addTracks({target: target.name})
        authoring.microsites.tabToLandingPages()
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)
        
        cy.visit(landingPage.url)

        cy.get('meta[property="og:site_name"]').should("have.attr", "content", "automation-microsites");
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[property="og:description"]').should("have.attr", "content", landingPage.name); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingPage.name);
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576");  
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[name="description"]').should("have.attr", "content", landingPage.name); 
       
       
        

    })
})
