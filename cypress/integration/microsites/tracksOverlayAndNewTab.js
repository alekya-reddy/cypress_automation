import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "tracksOverlayAndNewTab.js",
    slug: "track-ol-nt-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target = {
    trackType: "target",
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/openai`
    },
    contents: ["Website Common Resource"]
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

const featureBlock = {
    name: "The Featured Content Block"
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
            id: "Target Block",
            type: "track",
            track: target.name,
            layout: "Carousel",
        },
        {
            id: "Recommend Block",
            type: "track",
            track: recommend.name,
        },
        {
            id: "Featured-Content-block",
            type: "featured",
            name: featureBlock.name,
            contents: [
                {
                    trackType: target.trackType,
                    track: target.name,
                    name: target.contents[0]
                },
            ],
        },
    ]
}

describe("Microsites - open content tracks - overlay , newtab , sametab", () => {
    it("Setup Microsite if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)

                cy.visit(microsite.url)
                landingPage.blocks.forEach((block) => {
                    consumption.microsites.verifyLandingPageBlock(block)
                })
            }
        })
    })

    it("Open content track using Overlay, NewTab , SameTab", () =>{
        
        const blockNames = [featureBlock.name, recommend.name, target.name ]
        let selectOption = null
        // // Go to langing page and change  Open content track is set to 'Overlay on the same window' option
        authoring.common.login()
        authoring.microsites.visit() 
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)      
        
        blockNames.forEach((blockName) => {
            cy.contains("h4", blockName).parents(authoring.microsites.landingPages.blockContainer).within(() => {
                cy.get(authoring.microsites.landingPages.menuBlock).eq(3).click({force: true}) // This opens up the block editor modal 
            }) 
            cy.get(authoring.microsites.landingPages.openCard).invoke("val").then(($option) => { 
                selectOption = $option  
            })
            cy.do(() => { 
                if(selectOption == 'overlay'){
                    cy.contains("button", "Cancel").click({force: true})
                    cy.containsExact("h2", "Settings").should("not.exist")
                }
                else {
                    cy.get(authoring.microsites.landingPages.openCard).select("Overlay on the same window")
                    cy.contains("button", "Confirm").click({force: true})
                    cy.containsExact("h2", "Settings").should("not.exist")
                }
            })    
        })
        cy.contains("button", "Save").click({force: true})

        // verify consumption, clicking on any feature , track content should open as overlay in the same tab
        cy.visit(microsite.url)
        // verify overlay on feature content 
        cy.containsExact("h4", featureBlock.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle, {timeout: 2000}).eq(0).click()
        }) 
        cy.get(consumption.microsites.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.microsites.overlay.iframe, consumption.target.flowSidebar, 10000)
        cy.getIframeBody(consumption.microsites.overlay.iframe).within(() => {
            cy.get(consumption.target.flowSidebar).should("exist")
        })
        cy.get(consumption.microsites.overlay.close).click()
        cy.get(consumption.microsites.overlay.modal).should("not.exist")
        
        // // verify overlay on track content block - grid layout 
        cy.containsExact("h4", recommend.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle, {timeout: 2000}).eq(0).click()
        }) 
        cy.get(consumption.microsites.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.microsites.overlay.iframe, consumption.target.flowSidebar, 10000)
        cy.getIframeBody(consumption.microsites.overlay.iframe).within(() => {
            cy.get(consumption.recommend.sidebar).should("exist")
        })
        cy.get(consumption.microsites.overlay.close).click()
        cy.get(consumption.microsites.overlay.modal).should("not.exist")

        //  verify overlay track content block - carousel layout 
        cy.containsExact("h4", target.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle, {timeout: 2000}).eq(0).click()
        }) 
        cy.get(consumption.microsites.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.microsites.overlay.iframe, consumption.target.flowSidebar, 10000)
        cy.getIframeBody(consumption.microsites.overlay.iframe).within(() => {
            cy.get(consumption.target.flowSidebar).should("exist")
        })
        cy.get(consumption.microsites.overlay.close).click()
        cy.get(consumption.microsites.overlay.modal).should("not.exist")


        // // go to Authoring and change the settings to open content in new Tab 
        //  As we cannot test open new tab in cypress as a work around we are going to verify that content has the correct href link
        //  but when clicked on it should not change the current page url  
        cy.go("back")
        cy.contains("button", "Save").should("exist")
        // Open content track is set to 'Open in a new tab' opttion
        blockNames.forEach((blockName) => {
            cy.contains("h4", blockName).parents(authoring.microsites.landingPages.blockContainer).within(() => {
                cy.get(authoring.microsites.landingPages.menuBlock).eq(3).click({force: true}) // This opens up the block editor modal 
            }) 
            cy.get(authoring.microsites.landingPages.openCard).invoke("val").then(($option) => { 
                selectOption = $option  
            })
            cy.do(() => { 
                if(selectOption == 'newTab'){
                    cy.contains("button", "Cancel").click({force: true})
                    cy.containsExact("h2", "Settings").should("not.exist")
                }
                else {
                    cy.get(authoring.microsites.landingPages.openCard).select("Open in a new tab")
                    cy.contains("button", "Confirm").click({force: true})
                    cy.containsExact("h2", "Settings").should("not.exist")
                }
            })    
        })
        cy.contains("button", "Save").click({force: true})

        // verify consumption, clicking on any feature , track content should open in new tab
        cy.visit(microsite.url)
        // verify featured content block
        cy.containsExact("h4", featureBlock.name).should("exist").parent().within(()=>{
            cy.get("a", {timeout: 2000}).eq(0).should("have.attr", "href", target.micrositeUrl).click()
            cy.url().should("contain", microsite.url)
        }) 
        // verify track content block - grid 
        cy.containsExact("h4", recommend.name).should("exist").parent().within(()=>{
            cy.get("a", {timeout: 2000}).eq(0).should("have.attr", "href", recommend.micrositeUrl).click()
            cy.url().should("contain", microsite.url)
        }) 
        // verify track content block - carousel
        cy.containsExact("h4", target.name).should("exist").parent().within(()=>{
            cy.get("a", {timeout: 2000}).eq(0).should("have.attr", "href", target.micrositeUrl).click()
            cy.url().should("contain", microsite.url)
        }) 
        
        // // go to Authoring and change the settings back to default      
        cy.go("back")
        cy.contains("button", "Save").should("exist")       
        // Open content track is set to 'Redirect in the same window' option
        blockNames.forEach((blockName) => {
            cy.contains("h4", blockName).parents(authoring.microsites.landingPages.blockContainer).within(() => {
                cy.get(authoring.microsites.landingPages.menuBlock).eq(3).click({force: true}) // This opens up the block editor modal 
            }) 
            cy.get(authoring.microsites.landingPages.openCard).invoke("val").then(($option) => { 
                selectOption = $option  
            })
            cy.do(() => { 
                if(selectOption == 'redirect'){
                    cy.contains("button", "Cancel").click({force: true})
                    cy.containsExact("h2", "Settings").should("not.exist")
                }
                else {
                    cy.get(authoring.microsites.landingPages.openCard).select("Redirect in the same window")
                    cy.contains("button", "Confirm").click({force: true})
                    cy.containsExact("h2", "Settings").should("not.exist")
                }
            })    
        })
        cy.contains("button", "Save").click({force: true})

        // Open content track is set to 'Redirect in the same window' opttion
        // verify consumption to show open content in same window
        // verify featured content block
        cy.visit(microsite.url)
        cy.containsExact("h4", featureBlock.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle, {timeout: 2000}).eq(0).click()
        }) 
        cy.get(consumption.target.flowSidebar, {timeout: 2000}).should("exist") 
        cy.url().should("contain", target.micrositeUrl)
        cy.go("back")
        // verify track content block - grid 
        cy.containsExact("h4", recommend.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle, {timeout: 2000}).eq(0).click()
        }) 
        cy.get(consumption.recommend.sidebar, {timeout: 2000}).should("exist") 
        cy.url().should("contain", recommend.micrositeUrl)
        cy.go("back")
        // verify track content block - carousel 
         cy.containsExact("h4", target.name).should("exist").parent().within(()=>{
            cy.get(consumption.microsites.cardTitle, {timeout: 2000}).eq(0).click()
        }) 
        cy.get(consumption.target.flowSidebar, {timeout: 2000}).should("exist") 
        cy.url().should("contain", target.micrositeUrl)
    })    
})