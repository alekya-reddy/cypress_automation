import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: "overlay.js",
    slug: "overlay-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: [webContent.title]
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title]
}

const htmlContent = `
    <script src="https://app.cdn.lookbookhq.com/libraries/overlay/overlay.js"></script>
    <link href="https://app.cdn.lookbookhq.com/libraries/overlay/overlay.css" rel="stylesheet" type="text/css" />
    <a href="#" data-lookbook-overlay-href="${target.url}">target-track-overlay</a>
    <br>
    <a href="#" data-lookbook-overlay-href="${recommend.url}">recommend-track-overlay</a>
`

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
            expectContents: target.contents,
        },
        {
            id: "HTML block",
            type: "HTML",
            content: htmlContent,
            checkContent: {
                locators: [
                    `a[href="#"][data-lookbook-overlay-href="${target.url}"]:contains("target-track-overlay")`,
                    `a[href="#"][data-lookbook-overlay-href="${recommend.url}"]:contains("recommend-track-overlay")`,
                ]
            },
        }
    ]
}

describe("Microsites - Overlay Tracks", () => {
    it("Setup tracks and microsite if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({target: target.name})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Visit the microsite on consumption and verify that the overlay script works", ()=>{
        // Note: an Overlay track is viewing a track inside a modal on a webpage
        // You put the link and script down in the html of your webpage, and it should open the track in a modal
        // This test verifies that you can do this on a microsite landing page
        cy.visit(landingPage.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })

        // Verify that the overlay contains the target track
        cy.wait(1000) // Need a hard wait for the overlay script to load, otherwise clicking too early would take you to authoring page
        cy.contains("a", "target-track-overlay").click()
        cy.get(consumption.microsites.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.microsites.overlay.iframe, consumption.target.flowSidebar, 10000)
        cy.getIframeBody(consumption.microsites.overlay.iframe).within(() => {
            cy.get(consumption.target.flowSidebar).should("exist")
        })

        // Verify that the microsite still exists on the page
        cy.contains(consumption.microsites.cardTitle, target.contents[0]).should("exist")

        // Close the target track overlay and verify the recommend overlay
        cy.get(consumption.microsites.overlay.close).click()
        cy.get(consumption.microsites.overlay.modal).should("not.exist")
        cy.contains("a", "recommend-track-overlay").click()
        cy.get(consumption.microsites.overlay.modal).should("exist")
        cy.waitForIframeToLoad(consumption.microsites.overlay.iframe, consumption.recommend.sidebar, 10000)
        cy.getIframeBody(consumption.microsites.overlay.iframe).within(() => {
            cy.get(consumption.recommend.sidebar).should("exist")
        })
    })
})