import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "featuredContentLayout.js",
    slug: "featuredcontentlayout-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const targetTrack = {
    trackType: "target",
    name: "featuredContentLayout.js",
    slug: "fc_layout",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/`
    },
    contents: ["Youtube Shared Resource", "1-featuredContentLayout.js", "2-featuredContentLayout.js", "3-featuredContentLayout.js"]
}


const recommend = {
    trackType: "recommend",
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/openai`
    },
    contents: ["Website Common Resource"]
}

const featuredBlockCarousel = {
    id: "featured-block-carousel",
    type: "featured",
    name: "The Featured Content Block Carousel",
    layout: "Carousel",
    contents: [
        {
            trackType: targetTrack.trackType,
            track: targetTrack.name,
            name: targetTrack.contents[0]
        },
        {
            trackType: targetTrack.trackType,
            track: targetTrack.name,
            name: targetTrack.contents[1]
        },
        {
            trackType: targetTrack.trackType,
            track: targetTrack.name,
            name: targetTrack.contents[2]
        },
        {
            trackType: targetTrack.trackType,
            track: targetTrack.name,
            name: targetTrack.contents[3]
        },
        {
            trackType: recommend.trackType,
            track: recommend.name,
            name: recommend.contents[0]
        }
    ]
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
        featuredBlockCarousel
    ]
}

describe("Microsites - Landing page featured content block setup", () => {
    // Note: landingPageSetup.js is already so long that I decided to create a separate file for featured content blocks
    // Cypress slows down significantly if tests are too long, so it's important not to go over ~3 minutes/file
    it("Setup target track if not already done", ()=>{
        cy.request({url: targetTrack.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.target.addTrack(targetTrack)
                authoring.target.configure(targetTrack)
            }
        })
    })

    it("Verify Carousel layout for Featured Content", () => {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)
        authoring.microsites.addTracks({target: [ targetTrack.name], recommend: recommend.name})
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage({...landingPage, stayInEditor: true}) // Includes verification that block configuration is correct
        cy.contains(" The assets will render in a carousel in the live experience").should("exist")

        // Check consumption
        cy.visit(landingPage.url)
        consumption.microsites.verifyLandingPageBlock(featuredBlockCarousel)

        // Verify carousel layout
        cy.containsExact("h4", featuredBlockCarousel.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle).eq(0).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(1).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(2).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(3).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(4).should("not.be.visible")
            cy.get(consumption.microsites.arrowLeft).should("not.be.visible")
            cy.get(consumption.microsites.arrowRight,{timeout:10000}).click({force: true})
            cy.get(consumption.microsites.cardTitle,{timeout:10000}).eq(0).should("not.be.visible")
            cy.get(consumption.microsites.cardTitle).eq(1).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(2).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(3).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(4).should("be.visible")
            cy.get(consumption.microsites.arrowRight).should("not.be.visible")
            cy.get(consumption.microsites.arrowLeft).should("exist")
        })

    })

    it("Verify Grid layout for Featured Content", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)
        cy.containsExact("h4", featuredBlockCarousel.name).click({force: true})
        cy.get(authoring.microsites.landingPages.editorMenu).within(()=>{
            cy.get(authoring.microsites.landingPages.menuBlock).eq(3).click({force: true}) // This opens up the block editor modal 
        })
        cy.get(authoring.microsites.landingPages.landingPageLayout).select("Grid")
        cy.contains("button", "Confirm").click({force: true})
        cy.contains(" The assets will render in a carousel in the live experience").should("not.exist")
        cy.contains("button", "Save").click()

        // Check consumption
        cy.visit(landingPage.url)
        cy.get(consumption.microsites.arrowRight).should("not.exist")

        // Verify Grid layout
        cy.containsExact("h4", featuredBlockCarousel.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle).eq(0).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(1).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(2).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(3).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(4).should("be.visible")
        })
    })
})