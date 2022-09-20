import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-explore", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-explore', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-explore"].resources
const content1 = contents["Automation B2 Bpdf"]
const content2 = contents["2-featuredContentLayout.js"]
const content3 = contents["Website Common Resource"]

const recommend = {
    name: 'topicSortingRec',
    contents: ["Automation B2 Bpdf", "2-featuredContentLayout.js", "Website Common Resource"]
};

const topics = ["Topic1-featuredCarousel.js", "Topic2-featuredCarousel.js", "Topic3-featuredCarousel.js"]

const exploreRecommend = {
    name: 'sorting asset carousel',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'carousel-sorting',
    appearance: 'carouselview',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Topic Carousel - asset sorting", () => {

    it("Add Explore and topic carousel", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommend.name)
        authoring.explore.addExplore(exploreRecommend)
        authoring.explore.configureExplore(exploreRecommend)
        topics.forEach((topic) => {
            authoring.explore.addTopicCarousel(topic)
        })
        cy.contains('button', "Save Topic Carousels").click()

        authoring.explore.TopicCarouselSorting({ topicName: "Topic1-featuredCarousel.js", type: "Alphabetical Z -> A" })
        authoring.explore.TopicCarouselSorting({ topicName: "Topic2-featuredCarousel.js", type: "Alphabetical A -> Z" })
        authoring.explore.TopicCarouselSorting({ topicName: "Topic3-featuredCarousel.js", type: "Added by Date ascending" })

    })

    it("Verify orders for contents", () => {
        cy.visit(exploreRecommend.url)
        cy.get('#explore-carousel-0').within(() => {
            cy.get('#qa-explore-asset-title-carousel-0-0').should("contain", "Website Common Resource")
            cy.get('#qa-explore-asset-title-carousel-0-1').should("contain", "Automation B2 Bpdf")
            cy.get('#qa-explore-asset-title-carousel-0-2').should("contain", "2-featuredContentLayout.js")

        })

        cy.get('#explore-carousel-1').within(() => {
            cy.get('#qa-explore-asset-title-carousel-1-0').should("contain", "2-featuredContentLayout.js")
            cy.get('#qa-explore-asset-title-carousel-1-1').should("contain", "Automation B2 Bpdf")
            cy.get('#qa-explore-asset-title-carousel-1-2').should("contain", "Website Common Resource")

        })

        cy.get('#explore-carousel-2').within(() => {
            cy.get('#qa-explore-asset-title-carousel-2-0').should("contain", "Website Common Resource")
            cy.get('#qa-explore-asset-title-carousel-2-1').should("contain", "2-featuredContentLayout.js")
            cy.get('#qa-explore-asset-title-carousel-2-2').should("contain", "Automation B2 Bpdf")

        })

    })

    it("Go to explore and change order", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(exploreRecommend.name)

        authoring.explore.TopicCarouselSorting({ topicName: "Topic1-featuredCarousel.js", type: "Added by Date descending" })
        authoring.explore.TopicCarouselSorting({ topicName: "Topic2-featuredCarousel.js", type: "Updated by Date descending" })
        authoring.explore.TopicCarouselSorting({ topicName: "Topic3-featuredCarousel.js", type: "Updated by Date ascending" })

    })

    it("Veerify orders for contents", () => {
        cy.visit(exploreRecommend.url)
        cy.get('#explore-carousel-0').within(() => {
            cy.get('#qa-explore-asset-title-carousel-0-0').should("contain", "Automation B2 Bpdf")
            cy.get('#qa-explore-asset-title-carousel-0-1').should("contain", "2-featuredContentLayout.js")
            cy.get('#qa-explore-asset-title-carousel-0-2').should("contain", "Website Common Resource")

        })

        cy.get('#explore-carousel-1').within(() => {
            cy.get('#qa-explore-asset-title-carousel-1-0').should("contain", "Automation B2 Bpdf")
            cy.get('#qa-explore-asset-title-carousel-1-1').should("contain", "Website Common Resource")
            cy.get('#qa-explore-asset-title-carousel-1-2').should("contain", "2-featuredContentLayout.js")

        })

        cy.get('#explore-carousel-2').within(() => {
            cy.get('#qa-explore-asset-title-carousel-2-0').should("contain", "2-featuredContentLayout.js")
            cy.get('#qa-explore-asset-title-carousel-2-1').should("contain", "Website Common Resource")
            cy.get('#qa-explore-asset-title-carousel-2-2').should("contain", "Automation B2 Bpdf")

        })

    })

    it("Verify deleting topic carousel will also delete whole raw", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(exploreRecommend.name)
        cy.get(authoring.explore.editTopicCaousel).eq(0).click({ force: true })
        cy.contains('tr', "Topic1-featuredCarousel.js").within(() => {
            cy.get(authoring.explore.carouselTopicDelete).click()

        })
        cy.contains('tr', "Topic1-featuredCarousel.js").should("not.exist")

    })

})