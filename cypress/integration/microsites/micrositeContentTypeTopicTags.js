import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const contentType = "Custom Content Type"
const topicTags = "Custom Topic"

const microsite = {
    name: "micrositeContentTypeTopicTags.js",
    slug: "micrositecontenttypetopictags-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contentType: "on",
    topicTags: "on"
}

const tracks = {
    targetContentTypeTopicTags: {
        name: "micrositeContentTypeTopicTags.js T1",
        slug: "mccttt-1",
        contents: ["ContentTypeTopicsTags-Specific"],
        contentType: "on",
        topicTags: "on"
    },
    recommendContentTypeTopicTags: {
        name: "micrositeContentTypeTopicTags.js R1",
        slug: "mccrtt-1",
        contents: ["ContentTypeTopicsTags-Specific"],
        contentType: "on",
        topicTags: "on"
    }
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
            track: tracks.targetContentTypeTopicTags.name,
            expectContents: tracks.targetContentTypeTopicTags.contents,
        },
        {
            id: "Recommend Block",
            type: "track",
            track: tracks.recommendContentTypeTopicTags.name,
            expectContents: tracks.recommendContentTypeTopicTags.contents,
        }
    ]
}

describe("Microsite - Content Type and Topic Tags", () => {
    it("Setup tracks and microsite if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.recommend.addTrack(tracks.recommendContentTypeTopicTags)
                authoring.recommend.configure(tracks.recommendContentTypeTopicTags)
                authoring.target.addTrack(tracks.targetContentTypeTopicTags)
                authoring.target.configure(tracks.targetContentTypeTopicTags)
                
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({recommend: tracks.recommendContentTypeTopicTags.name, target: tracks.targetContentTypeTopicTags.name})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Microsite Content Type and Topic Tags on - tracks should have Content Type and Topic Tags shown", () => {
        authoring.common.login()
        authoring.microsites.visit()
        //Enable 'Show Content Type Label on Content Thumbnails','Show Topic Tags Below Content Thumbnails' checkboxes in Microsite Setup page and check the landing page and consumption page
        authoring.microsites.setup({
            name: microsite.name,
            contentType: true,
            topicTags: true
        })
        // Visit landing page
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)
        cy.contains(authoring.microsites.landingPages.trackRow, tracks.targetContentTypeTopicTags.name).within(() => {
            cy.contains(contentType).should("exist")
            cy.contains(topicTags).should("exist")
        })
        cy.contains(authoring.microsites.landingPages.trackRow, tracks.recommendContentTypeTopicTags.name).within(() => {
            cy.contains(contentType).should("exist")
            cy.contains(topicTags).should("exist")
        })
        //Visit consumption page
        cy.visit(microsite.url)
        cy.contains("h4", tracks.targetContentTypeTopicTags.name).parent().within(() => {
            cy.contains(contentType).should("exist")
            cy.contains(topicTags).should("exist")
        })
        cy.contains("h4", tracks.recommendContentTypeTopicTags.name).parent().within(() => {
            cy.contains(contentType).should("exist")
            cy.contains(topicTags).should("exist")
        })
        //Disable 'Show Content Type Label on Content Thumbnails','Show Topic Tags Below Content Thumbnails' checkboxes in Microsite Setup page and check the landing and consumption page
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name,
            contentType: false,
            topicTags: false
        })
        // Visit landing page
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)
        cy.contains(authoring.microsites.landingPages.trackRow, tracks.targetContentTypeTopicTags.name).within(() => {
            cy.contains(contentType).should("not.exist")
            cy.contains(topicTags).should("not.exist")
        })
        cy.contains(authoring.microsites.landingPages.trackRow, tracks.recommendContentTypeTopicTags.name).within(() => {
            cy.contains(contentType).should("not.exist")
            cy.contains(topicTags).should("not.exist")
        })
        //Visit consumption page
        cy.visit(microsite.url)
        cy.contains("h4", tracks.targetContentTypeTopicTags.name).parent().within(() => {
            cy.contains(contentType).should("not.exist")
            cy.contains(topicTags).should("not.exist")
        })
        cy.contains("h4", tracks.recommendContentTypeTopicTags.name).parent().within(() => {
            cy.contains(contentType).should("not.exist")
            cy.contains(topicTags).should("not.exist")
        })
    })
})