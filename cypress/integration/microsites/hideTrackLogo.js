import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "micrositeHideTrackLogo.js",
    slug: "micrositehidetracklogo-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: "micrositeHideTrackLogo.js"
}
const target = {
    name: "micrositeHideTrackLogoTarget.js",
    slug: "target-logo",
    contents: ["Website Common Resource","Wiki-1 Shared Resource", "Wiki-2 Shared Resource"],
    appearance: "micrositeHideTrackLogo.js",
    flow: "on",
    get url(){
     return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const recommend = {
    name: 'MicrositeHideTrackLogoReco.js',
    slug: 'recommend-logo',
    contents: ["Website Common Resource","Wiki-1 Shared Resource", "Wiki-2 Shared Resource"],
    appearance: "micrositeHideTrackLogo.js",
    topicSidebar: "on",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}
const newAppearanceSetting = {
    name:"micrositeHideTrackLogo.js", 
    primaryColor: {r: 106, g: 171, b: 233, a: 100},
    titleAppearanceFont: "Overpass",
    titleAppearancecolor: {r: 255, g: 255, b: 255, a: 100},
    bodyTextFont: "Overpass",
    bobyTextcolor: {r: 180, g: 74, b: 13, a: 100}
}
const headerAppearance = {
    appearance: "micrositeHideTrackLogo.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/brother-sister-hug-coast.jpg",
    }
   
}
const flowAppearance = {
    appearance: "micrositeHideTrackLogo.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }   
}
const topicSidebarAppearance = {
    appearance: "micrositeHideTrackLogo.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/bench-forest-trees-path.jpg",
    }   
}
const micrositeAppearanceSettings = {
    appearance: "micrositeHideTrackLogo.js",
    hideNavigation: true,
    verify: true
}
const micrositeAppearanceSettings1 = {
    appearance: "micrositeHideTrackLogo.js",
    hideNavigation: false,
    verify: true
}
const targetSetup = {
    name: "micrositeHideTrackLogoTarget.js",
    slug: "micrositeHideTrackLogo-target",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource","Wiki-1 Shared Resource", "Wiki-2 Shared Resource"],
}
const recommendSetup = {
    name: "MicrositeHideTrackLogoReco.js",
    slug: "MicrositeHideTrackLogo-reco",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource","Wiki-1 Shared Resource", "Wiki-2 Shared Resource"],
}
const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            id: "Target Block Grid",
            type: "track",
            track: target.name,
            layout: "Grid",
            expectContents: target.contents,
            heading: {
                color: {r: "0", g: "255", b: "255"},
                textAlign: 'center'
            },
        },
        {
            id: "Recommend Block",
            type: "track",
            track: recommend.name,
            layout: "Grid",
            expectContents: recommend.contents,
            heading: {
                color: {r: "0", g: "255", b: "255"},
                textAlign: 'center'
            },
        }
    ]}

describe("Microsite: Hide the track logo", () => {
    it("Set up Tracks,Appearance and Microsites if doesn't exist", ()=>{
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.configurations.deleteAppearance(newAppearanceSetting.name)
                authoring.configurations.addNewAppearance(newAppearanceSetting)
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.configurations.configureFlowAppearance(flowAppearance)
                authoring.configurations.configuretopicSidebarAppearance(topicSidebarAppearance)
                //configure Target and Recommend Track 
                authoring.target.deleteTrack(target.name)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
                authoring.recommend.deleteTrack(recommend.name)
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
                authoring.microsites.removeMicrosite(microsite.name)
                authoring.microsites.addMicrosite(microsite)  
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({target: targetSetup.name})
                authoring.microsites.addTracks({recommend: recommendSetup.name})
                authoring.microsites.tabToLandingPages()
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
                
            }
        }) 
    }) 

    //1.Verify 'Target track – Flow promoter logo' and 'Recommend track – Topic sidebar logo' is hidden when  microsite navigation logo is rendered.
    //"Hide Default Navigation Bar" always remains in disable(unchecked)state when ever we create a new appearance
    it("Microsite : Validate the track logos with 'Hide Default Navigation Bar' Enabled & Disabled", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        //Verify the header logo is visible and track promotor logo is invisible, when "Hide Default Navigation Bar" is Disabled/Unchecked
        cy.visit(landingPage.url)
        //Verify for Target Track
        consumption.microsites.clickContent({track: target.name, content: target.contents[0]})
        // Microsite navigation header logo should be visible 
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })
        //Target track – Flow promoter logo should be hidden 
        cy.get(consumption.common.header.locator).should("not.exist")
        //Verify for Recommend Track
        cy.wait(2000)
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: recommend.name, content: recommend.contents[0]})
        // Microsite navigation header logo should be visible 
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })
        //Recommend Track – Topic Sidebar logo should be hidden 
        cy.get(consumption.common.header.locator).should("not.exist")
        cy.wait(2000)
       //2.Verify the header logo and track promotor logo is invisible, when "Hide Default Navigation Bar" is Enabled/Checked
        authoring.configurations.visit.appearances()
        authoring.configurations.configureMicrositesAppearance(micrositeAppearanceSettings)
        //Verify for Target Track
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: target.name, content: target.contents[0]})
        // Microsite navigation header logo & Target track – Flow promoter logo should be hidden 
        cy.get(consumption.microsites.navigation.header).should("not.exist")
        cy.get(consumption.common.header.locator).should("not.exist")
        //Verify for Recommend Track
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: recommend.name, content: recommend.contents[0]})
        // Microsite navigation header logo & Recommend-Topic Sidebar logo should be hidden 
        cy.get(consumption.microsites.navigation.header).should("not.exist")
        cy.get(consumption.common.header.locator).should("not.exist")
        //3.Verify track promotor logo is shown, when the header logo is not selected/not available from appearances
        //Go back to appearance and and delete the header logo
        authoring.configurations.visit.appearances()
        authoring.configurations.clickAppearance(newAppearanceSetting.name)
        authoring.configurations.gotoAppearanceTab("header")
        cy.contains('a', "Clear").click()
        cy.contains("button", "Save Header Settings").click()
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: target.name, content: target.contents[0]})
        cy.get(consumption.microsites.navigation.header).should("not.exist")
        cy.get(consumption.common.flowHeader).within(() => {
            cy.get(`img[src*="${flowAppearance.thumbnail.url}"]`).should("exist")
        })
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: recommend.name, content: recommend.contents[0]})
        cy.get(consumption.microsites.navigation.header).should("not.exist")
        cy.get(consumption.common.flowHeader).within(() => {
            cy.get(`img[src*="${topicSidebarAppearance.thumbnail.url}"]`).should("exist")
        }) 
        //Resetting "Hide Default Navigation Bar" and Header values, as we are adding appearance in one time setup block 
        authoring.configurations.visit.appearances()
        authoring.configurations.configureMicrositesAppearance(micrositeAppearanceSettings1)
        authoring.configurations.configureHeaderAppearance(headerAppearance)
    })
})
