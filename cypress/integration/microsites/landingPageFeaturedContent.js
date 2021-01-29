import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "landingPageFeaturedContent.js",
    slug: "landingpagefeaturedcontent-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const contentWithTopics = {
    internalTitle: "landingPageFeaturedContent.js",
    publicTitle: "landingPageFeaturedContent.js",
    url: "https://en.wikipedia.org/wiki/Neuralink",
    slug: "lp-fc-js",
    topics: ["Topic Shared Resource"]
}

const trackWithTopics = {
    trackType: "target",
    name: "landingPageFeaturedContent.js",
    slug: "target-lp-fc-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${contentWithTopics.slug}`
    },
    contents: [contentWithTopics.internalTitle]
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

const deleteBlock = {
    id: "featured-content-block to be deleted",
    type: "featured",
    name: "Delete me block",
    contents: [
        {
            trackType: recommend.trackType,
            track: recommend.name,
            name: recommend.contents[0]
        },
    ],
}

const featureBlock = {
    id: "featured-content-block",
    type: "featured",
    name: "The Featured Content Block",
    contents: [
        {
            trackType: trackWithTopics.trackType,
            track: trackWithTopics.name,
            name: trackWithTopics.contents[0]
        },
        {
            trackType: target.trackType,
            track: target.name,
            name: target.contents[0]
        },
        {
            trackType: recommend.trackType,
            track: recommend.name,
            name: recommend.contents[0]
        },
    ],
    heading: {
        color: {r: "0", g: "255", b: "255"},
        textAlign: 'center'
    },
    background: {
        color: {r: "0", g: "200", b: "100"},
        image: {
            category: "Stock Images",
            url: "/stock/sm/bench-forest-trees-path.jpg"
        },
        position: "bottom",
        size: "cover"
    },
    spacing: "91px",
    card: {
        color: {r: "43", g: "91", b: "200"},
        textAlign: "right",
        fontSize: "17px"
    },
    topicFilter: {
        enableToggle: true,
        overrideLabel: 'Filter By Topics Here',
        textColor: {r: "43", g: "91", b: "200", position: 0},
        backgroundColor: {r: "87", g: "255", b: "78", position: 1}
    },
    searchConfiguration: {
        enableToggle: true,
        textColor: {r: "87", g: "255", b: "78", position: 0},
        backgroundColor: {r: "43", g: "91", b: "200", position: 1}
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
        deleteBlock,
        featureBlock, 
    ]
}

describe("Microsites - Landing page featured content block setup", () => {
    it("Setup target track if not already done", ()=>{
        cy.request({url: trackWithTopics.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.contentLibrary.delete({url: contentWithTopics.url, wait: 1000})
                authoring.contentLibrary.addContentByUrl(contentWithTopics)
                authoring.contentLibrary.sideBarEdit(contentWithTopics)
                authoring.target.addTrack(trackWithTopics)
                authoring.target.configure(trackWithTopics)
            }
        })
    })

    it("Test landing page featured content block settings", () => {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.setup(microsite)
        authoring.microsites.addTracks({target: [target.name, trackWithTopics.name], recommend: recommend.name})
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage) // Includes verification that block configuration is correct

        // Verify on consumption that the blocks were set up correctly - do this before any of the blocks get deleted or else can't use verify method
        cy.visit(landingPage.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })

        // Verify that we can remove content from a featured content block
        cy.go("back")
        authoring.microsites.goToPageEditor(landingPage.name)
        cy.contains(authoring.microsites.landingPages.trackRow, featureBlock.name).within(() => {
            cy.get(authoring.microsites.landingPages.micrositeCard + `:contains("${recommend.contents[0]}")`).should("have.length", 2) // There's 2 with same name
        })
        cy.wait(2000)
        authoring.microsites.removeFeaturedContent({
            block: featureBlock.name,
            content: recommend.contents[0],
            index: 1
        }, false)
        cy.contains(authoring.microsites.landingPages.trackRow, featureBlock.name).within(() => {
            cy.get(authoring.microsites.landingPages.micrositeCard + `:contains("${recommend.contents[0]}")`).should("have.length", 1)
        })

        // Verify that featured content blocks can be deleted
        cy.wait(2000)
        authoring.microsites.removeBlock(authoring.microsites.landingPages.trackRow + `:contains('${deleteBlock.name}')`)

        cy.contains("button", "Save").click()

        // VEX's landingPage.js also tests reordering of the blocks
        // We should also do that here since both follow different code paths (despite similar appearance) 
        // I'll leave that as a special project for anyone who's interested in the extra challenge
        // You can refer to landingPage.js to see how I did it in VEX
    })

    it("Verify that the featured content block has the correct settings on consumption", () => {
        // Verify that the cards would redirect to the correct url
        cy.visit(landingPage.url)
        cy.get(`a[href='${trackWithTopics.micrositeUrl}']`).should("exist").contains(trackWithTopics.contents[0]).should("exist")
        cy.get(`a[href='${target.micrositeUrl}']`).should("exist").contains(target.contents[0]).should("exist")
        cy.get(`a[href='${recommend.micrositeUrl}']`).should("not.exist")

        // Basic verification of filters for featured content block
        cy.get(consumption.microsites.topicFilterLocator).click()
        cy.get(consumption.microsites.filterByValue).contains(contentWithTopics.topics[0]).click()
        cy.contains(consumption.microsites.cardTitle, trackWithTopics.contents[0]).should("exist")
        cy.contains(consumption.microsites.cardTitle, target.contents[0]).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, recommend.contents[0]).should("not.exist")

        // Clear filter value
        cy.get(consumption.microsites.topicFilterLocator).within(() => {
            cy.get(consumption.microsites.clearFilterValue).click()
        })
        cy.contains(consumption.microsites.cardTitle, trackWithTopics.contents[0]).should("exist")
        cy.contains(consumption.microsites.cardTitle, target.contents[0]).should("exist")

        // Test search
        consumption.microsites.searchMicrositeCard(trackWithTopics.contents[0])
        cy.contains(consumption.microsites.cardTitle, trackWithTopics.contents[0]).should("exist")
        cy.contains(consumption.microsites.cardTitle, target.contents[0]).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, recommend.contents[0]).should("not.exist")

        // The deleted block should not exist
        cy.contains(deleteBlock.name).should("not.exist")
    })
})