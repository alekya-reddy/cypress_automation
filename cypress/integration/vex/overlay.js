import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-vex", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

const event = {
    name: "overlay.js",
    slug: "overlay-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: "Session overlay",
    slug: "session-overlay",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const sessionGroupA = {
    name: "Group A",
    sessions: [session.name]
}

// The contents, target and recommend tracks are pulled from the qa microsite organization.
// We only need the urls for these tracks. As long as the urls are valid, it doesn't matter 
// where they are coming from - any org on any env would do
const targetUrl = "https://automation-microsites.qa-pathfactory.com/target-common-resource/openai"

const recommendUrl = "https://automation-microsites.qa-pathfactory.com/recommend-common-resource/openai"

const htmlContent = `
    <script src="https://app.cdn.lookbookhq.com/libraries/overlay/overlay.js"></script>
    <link href="https://app.cdn.lookbookhq.com/libraries/overlay/overlay.css" rel="stylesheet" type="text/css" />
    <a href="#" data-lookbook-overlay-href="${targetUrl}">target-track-overlay</a>
    <br>
    <a href="#" data-lookbook-overlay-href="${recommendUrl}">recommend-track-overlay</a>
`

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroupA.name,
        },
        {
            id: "HTML block",
            type: "HTML",
            content: htmlContent,
            checkContent: {
                locators: [
                    `a[href="#"][data-lookbook-overlay-href="${targetUrl}"]:contains("target-track-overlay")`,
                    `a[href="#"][data-lookbook-overlay-href="${recommendUrl}"]:contains("recommend-track-overlay")`,
                ]
            },
        }
    ]
}

describe("VEX - Overlay Tracks", () => {
    it("Setup if not already done", () => {
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
                authoring.vex.backToEvent(event.name)
                authoring.vex.addSessionGroup(sessionGroupA.name)
                authoring.vex.addToGroup(sessionGroupA)
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })

    it("Visit VEX on consumption and verify that the overlay script works", ()=>{
        // Note: an Overlay track is viewing a track inside a modal on a webpage
        // You put the link and script down in the html of your webpage, and it should open the track in a modal
        // This test verifies that you can do this on a vex landing page
        cy.visit(landingPage.url)
        landingPage.blocks.forEach((block) => {
            consumption.vex.verifyLandingPageBlock(block)
        })

        // Verify that the overlay contains the target track
        cy.wait(1000) // Need a hard wait for the overlay script to load, otherwise clicking too early would take you to authoring page
        cy.contains("a", "target-track-overlay").click()
        cy.get(consumption.vex.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.vex.overlay.iframe, consumption.target.flowSidebar, 10000)
        cy.getIframeBody(consumption.vex.overlay.iframe).within(() => {
            cy.get(consumption.target.flowSidebar).should("exist")
        })

        // Verify that VEX landing page still exists on the page
        cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist")

        // Close the target track overlay and verify the recommend overlay
        cy.get(consumption.vex.overlay.close).click()
        cy.get(consumption.vex.overlay.modal).should("not.exist")
        cy.contains("a", "recommend-track-overlay").click()
        cy.get(consumption.vex.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.vex.overlay.iframe, consumption.recommend.sidebar, 10000)
        cy.getIframeBody(consumption.vex.overlay.iframe).within(() => {
            cy.get(consumption.recommend.sidebar).should("exist")
        })
    })
})