import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-microsites', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const micrositeApp = {
    name: 'micrositesAppearence.js',
    slug: 'micrositesappearence-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: "micrositesAppearance.js"
}

const newAppearanceSetting = {
    name:"micrositesAppearance.js", 
    primaryColor: {r: 106, g: 171, b: 233, a: 100},
    titleAppearanceFont: "Overpass",
    titleAppearancecolor: {r: 255, g: 255, b: 255, a: 100},
    bodyTextFont: "Overpass",
    bobyTextcolor: {r: 180, g: 74, b: 13, a: 100}
}

const colorConfigToCSS = (colorConfig) => {
    const { r, g, b, a } = colorConfig
    const CSS = a == 100 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    return CSS;
}

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"],
    firtContentSlug: "openai"
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"],
    firtContentSlug: "openai"
}

const landingPage = {
    name: "Home Page",
    slug: "landing-page-home-pa",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            id: "Target Block",
            type: "track",
            track: target.name,
            expectContents: target.contents,
        },
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>Landing Page Appearence</h1>`,
            checkContent: {
                text: ["Landing Page Appearence"],
                locators: ["h1"]
            }
        }
    ]
}

const gridCarouselLandingPage = {
    name: "Grid Carousel LP",
    slug: "grid-carousel-lp",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    blocks: [
        {
            type: "track",
            track: target.name,
        },
    ]
} 

const editLandingPage = {
    name: "Grid Carousel LP",
    visibility: "public"
} 

const navigation = {
    landingPage: {
        label: "landingPage",
        type: "Landing Page",
        source: landingPage.name,
        reference: landingPage
    },
    target: {
        label: "targetTrack",
        type: "Track",
        source: target.name,
        reference: target
    },
    recommend: {
        label: "recTrack",
        type: "Track",
        source: recommend.name,
        reference: recommend
    }
}    

const editCardConfiguration = {
    heading: {
        fontSize: "50px"
    }
} 
describe("Microsites - Appeararnace", () => {
    it("Set up microsites with tracks, landing page, navigation and microsite appearance if doesn't exist", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(micrositeApp.name)
        cy.request({url: micrositeApp.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.configurations.addNewAppearance(newAppearanceSetting)
                authoring.microsites.addMicrosite(micrositeApp.name)
                authoring.microsites.setup(micrositeApp)
                authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
                authoring.microsites.configureLandingPage(landingPage)
                Object.values(navigation).forEach((navItem) => {
                   authoring.microsites.addNavItem(navItem)   
                })    
            }
        }) 
    }) 

    it("Configure Appearance setting in microsites and appearence and verify consumption", ()=>{
        // configure appearence in microsite setup and verify 
        authoring.common.login()

        // Verify header navigation checkbox in appearence setting and also verify on consumption
        // Turn off and hide navigation header in the Appearences > Microsite settings
        authoring.configurations.configureMicrositesAppearance({
            appearance: "micrositesAppearance.js",
            hideNavigation: true,
            layout: "Carousel"
        })

        // Verify that landing page will add carousel blocks by default
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(micrositeApp.name)
        authoring.microsites.removeLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.addLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.goToPageEditor(gridCarouselLandingPage.name)
        cy.wait(1000) // need hard wait for landing page configurations to load from back-end. It's a blank page initially, so there is no UI indication when this is done.
        authoring.microsites.addAdvancedBlock(gridCarouselLandingPage.blocks[0])
        cy.contains(authoring.microsites.landingPages.trackRow, target.name).within(() => {
            cy.get(authoring.microsites.landingPages.carouselArrow).should("exist")
        })

        // Verify on consumption that navigation header no longer exists
        cy.visit(micrositeApp.url)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
        cy.visit(`${micrositeApp.url}/${navigation.target.reference.slug}/${navigation.target.reference.firtContentSlug}`)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
        cy.visit(`${micrositeApp.url}/${navigation.recommend.reference.slug}/${navigation.recommend.reference.firtContentSlug}`)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
          
        // Turn on and show navigation header in the Appearences > Microsite settings
        authoring.configurations.visit.appearances()
        authoring.configurations.configureMicrositesAppearance({
            appearance: "micrositesAppearance.js",
            hideNavigation: false,
            layout: "Grid"
        }) 

        // Verify that landing page will add grid blocks by default
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(micrositeApp.name)
        authoring.microsites.removeLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.addLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.goToPageEditor(gridCarouselLandingPage.name)
        cy.wait(1000) // need hard wait for landing page configurations to load from back-end. It's a blank page initially, so there is no UI indication when this is done.
        authoring.microsites.addAdvancedBlock(gridCarouselLandingPage.blocks[0])
        cy.contains(authoring.microsites.landingPages.trackRow, target.name).within(() => {
            cy.get(authoring.microsites.landingPages.carouselArrow).should("not.exist")
        })

        // verify on consumption that navigation header appears on top 
        cy.visit(micrositeApp.url)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label).click()
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.recommend.label).click()
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
       
        //  Verify Header, Tracks and landing page appearence are inherited from microsite appearences 
        cy.visit(micrositeApp.url) 
        
        // Check the header appearance settings 
        cy.get(consumption.microsites.navigation.header).should("have.css", "background-color", colorConfigToCSS(newAppearanceSetting.primaryColor)).within(()=>{  
            cy.contains('a', navigation.landingPage.label).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor))
            cy.contains('a', navigation.target.label).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor))
            cy.contains('a', navigation.recommend.label).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor))
        }) 
         
        //go to target track and verify appearance setting 
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label).click()
        cy.get(consumption.target.flowActiveItem).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.primaryColor))        
        cy.get(consumption.target.flowHeaderShare).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.primaryColor))

        //go to Reccomand track and verify appearance setting 
        cy.contains(consumption.microsites.navigation.menuItem, navigation.recommend.label).click()
        cy.get(consumption.recommend.sidebarTitle).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor)) 
        cy.get(consumption.recommend.sidebarBackground).should("have.css", "background-color", colorConfigToCSS(newAppearanceSetting.primaryColor))             
    })    

    it("Verify Font size over ride option availability at block level", ()=>{
        // configure appearence in microsite setup and verify 
        authoring.common.login()

        authoring.configurations.configureMicrositesAppearance({
            appearance: "micrositesAppearance.js",
            hideNavigation: true,
            layout: "Carousel"
        })
        
        cy.get(authoring.configurations.appearances.microsites.heading).invoke('attr','font-size').as('fontSize')
        cy.get('@fontSize').then(fontSize => {
             cy.log(fontSize)
        })

        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(micrositeApp.name)
        authoring.microsites.addMicrosite(micrositeApp.name)
        authoring.microsites.setup(micrositeApp)
        authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
        authoring.microsites.goToMicrositeConfig(micrositeApp.name)
        authoring.microsites.addLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.editLandingPage(editLandingPage)
        authoring.microsites.setToHomePage(gridCarouselLandingPage.name)
        authoring.microsites.goToPageEditor(gridCarouselLandingPage.name)
        cy.wait(1000) // need hard wait for landing page configurations to load from back-end. It's a blank page initially, so there is no UI indication when this is done.
        authoring.microsites.addAdvancedBlock(gridCarouselLandingPage.blocks[0])

        cy.get('h4').invoke('css','font-size').then(builderFontSize=>{
            cy.get('@fontSize').then(fontSize => {
                expect(fontSize).to.equal(builderFontSize);
           })
        })

        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        // Verify on consumption page has default heading font size value
        cy.visit(micrositeApp.url)

        cy.get('h4').invoke('css','font-size').then(builderFontSize=>{
            cy.get('@fontSize').then(fontSize => {
                expect(fontSize).to.equal(builderFontSize);
           })
        })

        //Navigate to builder page and override the heading font style
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(micrositeApp.name)
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(gridCarouselLandingPage.name)
        authoring.microsites.editExistingCard(editCardConfiguration)

        cy.get('h4').invoke('css','font-size').then(builderFontSize=>{
                expect(builderFontSize).to.equal(editCardConfiguration.heading.fontSize);
        })

        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        // Verify on consumption page has override heading font size value
        cy.visit(micrositeApp.url)

        cy.get('h4').invoke('css','font-size').then(builderFontSize=>{
            expect(builderFontSize).to.equal(editCardConfiguration.heading.fontSize);
        })
    })    
})

      