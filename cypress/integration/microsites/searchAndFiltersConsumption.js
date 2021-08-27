import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-microsites", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-microsites', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-microsites"].resources

const microsite = {
    name: "searchAndFilters.js",
    slug: "searchandfilters-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target = {
    name: "Consumption SearchAndFilters",
    slug: "search-and-filters-consumption",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const contentPages = {
    contentWithTopicContentTypePersona: {
        name: "Canada",
        slug: "canada",
        get url() {
            return `${microsite.url}/${this.slug}`
        },
        topics: "Canada",
        contentType: "Article",
        persona: "automation"
    },
    contentWithTopicFunnelBusinessUnit: {
        name: "Beaver",
        slug: "ecozones_of_canada",
        get url() {
            return `${microsite.url}/${this.slug}`
        },
        description: "This is description for beaver",
        topics: "Canada",
        funnelStage: "Top of Funnel",
        businessUnit: "BUautomation"

    },
    contentWithTContentTypeIndustryBusinessUnit: {
        name: "Shelf",
        slug: "scotian_shelf",
        get url() {
            return `${microsite.url}/${this.slug}`
        },
        contentType: "Article",
        industry: "Automation Industry",
        businessUnit: "BUautomation"
    }
}

const landingPage = {
    name: "Search and Filter",
    slug: "search_and_filter",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Filters Block",
            type: "track",
            track: target.name,
            searchConfiguration: {
                enableToggle: true
            },
            topicFilter: {
                enableToggle: true
            },
            contentTypeFilter: {
                enableToggle: true
            },
            funnelStageFilter: {
                enableToggle: true
            },
            industryFilter: {
                enableToggle: true
            },
            personaFilter: {
                enableToggle: true
            },
            businessUnitFilter: {
                enableToggle: true
            }
        }
    ]
}


describe("Microsites - Search and Filter Content", () => {

    it("Set up if not already done", () => {
        cy.request({ url: microsite.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({ target: target.name })
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)

                cy.visit(microsite.url)
                landingPage.blocks.forEach((block) => {
                    consumption.microsites.verifyLandingPageBlock(block)
                })
            }
        })
    })

    it("Content can be searched by using filters and search functionality", () => {
        cy.visit(microsite.url)
        // Select Topic Filter
        cy.containsExact(consumption.microsites.topicFilterLocator + " > span:nth-child(1)", "Topic Filter").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicContentTypePersona.topics).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicContentTypePersona.topics)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Topic Filter: " + contentPages.contentWithTopicContentTypePersona.topics).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Select Content Type filter withour removing Topic filter
        cy.containsExact(consumption.microsites.contentTypeFilterLocator + " > span:nth-child(1)", "Content Type").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicContentTypePersona.contentType).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicContentTypePersona.contentType)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Content Type: " + contentPages.contentWithTopicContentTypePersona.contentType).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Remove Topic Filter so we have only Content Type filter selected
        cy.get(consumption.microsites.topicFilterLocator + " > span:nth-child(2)").click()
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")

        // Remove Content Type and apply Funnel Stage filter
        cy.get(consumption.microsites.contentTypeFilterLocator + " > span:nth-child(2)").click()
        cy.containsExact(consumption.microsites.funnelStageFilterLocator + " > span:nth-child(1)", "Funnel Stage").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicFunnelBusinessUnit.funnelStage).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicFunnelBusinessUnit.funnelStage)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Funnel Stage: " + contentPages.contentWithTopicFunnelBusinessUnit.funnelStage).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Remove Funnel Stage and apply Industry filter
        cy.get(consumption.microsites.funnelStageFilterLocator + " > span:nth-child(2)").click()
        cy.containsExact(consumption.microsites.industryFilterLocator + " > span:nth-child(1)", "Industry").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.industry).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.industry)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Industry: " + contentPages.contentWithTContentTypeIndustryBusinessUnit.industry).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")

        // Remove Industry and apply Persona filter
        cy.get(consumption.microsites.industryFilterLocator + " > span:nth-child(2)").click()
        cy.containsExact(consumption.microsites.personaFilterLocator + " > span:nth-child(1)", "Persona").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicContentTypePersona.persona).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicContentTypePersona.persona)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Persona: " + contentPages.contentWithTopicContentTypePersona.persona).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Remove Persona and apply Business Unit filter
        cy.get(consumption.microsites.personaFilterLocator + " > span:nth-child(2)").click()
        cy.containsExact(consumption.microsites.businessUnitFilterLocator + " > span:nth-child(1)", "Business Unit").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.businessUnit).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.businessUnit)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Business Unit: " + contentPages.contentWithTContentTypeIndustryBusinessUnit.businessUnit).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")

        // Search by Description with Business Unit filter on
        consumption.microsites.searchMicrositeCard(contentPages.contentWithTopicFunnelBusinessUnit.description)
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Select axtra Topic Filter
        cy.containsExact(consumption.microsites.topicFilterLocator + " > span:nth-child(1)", "Topic Filter").click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicContentTypePersona.topics).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicContentTypePersona.topics)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains("Topic Filter: " + contentPages.contentWithTopicContentTypePersona.topics).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Search by pressing Enter keyboard
        // Remove filters applied 
        cy.get(consumption.microsites.topicFilterLocator + " > span:nth-child(2)").click()
        cy.get(consumption.microsites.businessUnitFilterLocator + " > span:nth-child(2)").click()
        cy.get("input").clear().type("this is \n")

        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

    })

})