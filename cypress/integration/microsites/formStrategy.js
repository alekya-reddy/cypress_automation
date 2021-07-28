import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const tracks = {
    // There's a whole bunch of form strategy configuration combinations to test, but 
    // will only test a small sample to verify these work with microsites 
    recommend: {
        name: "rec formStrategy.js",
        slug: "rec-form-strat",
        contents: [webContent.title],
        sidebar: "on",
        sidebarOptions: { cta: "Shared Resource Email Only" },
        formsStrategy: "on",
        formsStrategyOptions: {
            trackRule: {
                form: "Shared Resource Email Only",
                timeOnTrack: '0',
                showToUnknown: "on",
                showToKnown: "off",
                dismissable: "off"
            }
        },
        header: "on"
    },
    target: {
        name: "target formStrategy.js",
        slug: "target-form-strat",
        contents: [webContent.title],
        flow: "on",
        flowCTA: "Shared Resource Email Only",
        formsStrategy: "on",
        formsStrategyOptions: {
            trackRule: {
                form: "Shared Resource Email Only",
                timeOnTrack: '0',
                showToUnknown: "on",
                showToKnown: "off",
                dismissable: "on"
            }
        }
    }
}

const microsite = {
    name: "formStrategy.js",
    slug: "formstrategy-js",
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
    visibility: 'Public',
    blocks: [
        {
            type: "track",
            track: tracks.target.name
        },
        {
            type: "track",
            track: tracks.recommend.name
        }
    ]
}

const visitor = {
    email: "jo@gmail.com"
}

describe("Microsites - Form strategy", () => {
    it("Setup Microsite and target tracks if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.recommend.addTrack(tracks.recommend)
                authoring.recommend.configure(tracks.recommend)
                authoring.target.addTrack(tracks.target)
                authoring.target.configure(tracks.target)
                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({recommend: tracks.recommend.name, target: tracks.target.name})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Visit target and recommend tracks and verify the form strategy settings configured for them", () => {
        // Fill the form on target track - form should show up right away, and should be dismissable
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.target.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.target.slug}/${webContent.slug}`)
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.microsites.closeModalButton).click({force: true})
        })
        cy.contains(consumption.target.modal, "Fill This Out to Continue").should("not.be.visible")

        // Refresh - form should show up again. Then fill the form
        cy.reload()
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            consumption.microsites.fillStandardForm(visitor)
        })

        // Refresh again - form should no longer show up on target track
        cy.reload()
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("not.exist")

        // Visit recommend track - it's form should appear since no form filled out yet on this track. The form should not be dismissable.
        cy.visit(landingPage.url)
        consumption.microsites.clickContent({track: tracks.recommend.name, content: webContent.title})
        cy.url().should("eq", `${microsite.url}/${tracks.recommend.slug}/${webContent.slug}`)
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("exist").within(() => {
            cy.get(consumption.microsites.closeModalButton).should("not.exist")
            consumption.microsites.fillStandardForm(visitor)
        })

        // Refresh. Form should not show up again.
        cy.reload()
        cy.contains(consumption.target.modal + ":visible", "Fill This Out to Continue", {timeout: 10000}).should("not.exist")
    })
})