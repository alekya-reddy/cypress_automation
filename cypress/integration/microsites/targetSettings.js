import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const tracks = {
    config1: {
        // Testing Flow promoter, cta forms, form strategy, and end promoter 
        name: "targetSettings.js 1",
        slug: "target-config-1",
        contents: [webContent.title, youtubeContent.title],
        flow: "on",
        flowCTA: "Shared Resource Email Only",
        endPromoter: "on",
        endPromoterOptions: {
            link: "https://www.google.com"
        },
        formsStrategy: "on",
        formsStrategyOptions: {
            trackRule: {
                form: "Shared Resource Email Only",
                timeOnTrack: '0',
                showToUnknown: "on",
                showToKnown: "on",
                dismissable: "on"
            }
        }
    },
    config2: {
        // Testing signposts, exit and header promoters
        name: "targetSettings.js 2",
        slug: "target-config-2",
        contents: [webContent.title, youtubeContent.title],
        signposts: "on",
        exit: "on",
        exitOptions: {
            delay: "0"
        },
        header: "on"
    },
    config3: {
        // Testing bottombar promoter
        name: "targetSettings.js 3",
        slug: "target-config-3",
        contents: [webContent.title],
        bottombar: "on",
        header: "on"
    }
}

const microsite = {
    name: "targetSettings.js",
    slug: "targetsettings-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    blocks: [
        {
            type: "track",
            track: tracks.config1.name
        },
        {
            type: "track",
            track: tracks.config2.name
        },
        {
            type: "track",
            track: tracks.config3.name
        }
    ]
}

describe("Microsites - Target Settings", () => {
    it("Setup Microsite and target tracks if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()

                Object.values(tracks).forEach(track => {
                    authoring.target.addTrack(track)
                    authoring.target.configure(track)
                })

                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                const allTracks = Object.values(tracks).map((track) => { return track.name })
                authoring.microsites.addTracks({target: allTracks})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Visit config 1 target track and verify flow and end promoters, and forms and ctas", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config1.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config1.slug}/${webContent.slug}`)

        // Verify the form strategy and then dismiss the form
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.microsites.closeModalButton).click({force: true})
        })
        cy.contains(consumption.target.modal, "Fill This Out to Continue").should("not.be.visible")

        // Click the cta and verify it pops up, then dismiss it 
        cy.get(consumption.target.flowHeader).within(() => {
            cy.get(consumption.target.ctaButton).click()
        })
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.microsites.closeModalButton).click({force: true})
        })

        // Microsite navigation header should always be visible even though no header configured for the track
        cy.get(consumption.microsites.navigation.header).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", microsite.url)
        })

        // Verify flow promoter 
        cy.get(consumption.target.flowSidebar).should("exist")

        // Click to last content to verify end promoter 
        cy.get(consumption.target.flowContent).should("exist").within(() => {
            cy.containsExact("span", youtubeContent.title).click()
        })
        cy.url().should("eq", `${microsite.url}/${tracks.config1.slug}/${youtubeContent.slug}`)

        // https://lookbookhq.atlassian.net/browse/DEV-12066 - end promoter not showing up 
    })

    it("Visit config 2 target track and verify signposts, exit and header promoters", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config2.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config2.slug}/${webContent.slug}`)

        // Verify signpost promoter 
        cy.get(consumption.target.signpostContainer).should("exist")

        // Verify header promoter
        cy.get(consumption.target.header.locator).should("not.exist") // The track's header is no longer used 
        cy.get(consumption.microsites.navigation.header).should("exist") // The microsite navigation header is used instead 
        cy.get(consumption.target.header.facebookIcon).should("exist") // But the track's sharing icons should still be present 

        // Trigger exit promoter and verify it exists
        cy.wait(2000)
        cy.get("body").trigger("mouseleave")
        cy.contains(consumption.target.endPromoterTitle, "Before you go...").should("exist")
    })

    it("Visit config 3 target track and verify bottombar promoter", () => {
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.config3.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.config3.slug}/${webContent.slug}`)

        // Verify the bottombar promoter
        cy.get(consumption.target.bottombarTitle).should("exist")
    })
})