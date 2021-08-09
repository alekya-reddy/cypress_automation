import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: 'automation-microsites', tld: 'lookbookhq' })
const consumption = createConsumptionInstance({ org: 'automation-microsites', tld: 'lookbookhq' })


const microsite = {
    name: 'micrositeSearchandFilters.js',
    slug: 'micrositesearchandfilters-js',
    get url() {
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
        topics: ["Canada", "Custom Topic"],
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
    contentWithMultiple: {
        name: "Dogs",
        slug: "dogs",
        get url() {
            return `${microsite.url}/${this.slug}`
        },
        funnelStage: "Middle of Funnel",
        industry: "FMCG",
        persona: "automation2",
        businessUnit: "BUautomation2"
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

const defaultLandingPage = {
    name: "Home Page",
    slug: "landing-page-home-pa",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    stayInEditor: true,
    blocks: [
        {
            id: "Target Block",
            type: "track",
            track: target.name
        }
    ]
}

const targetBlock =
{
    id: "Target Block",
    type: "track",
    track: target.name
}

const searchAndFilterOptions =
    [
        {
            label: "Search",
            toggle: true
        },
        {
            label: "Topic",
            toggle: true
        },
        {
            label: "Persona",
            toggle: true
        },
        {
            label: "Industry",
            toggle: true
        },
        {
            label: "Content Type",
            toggle: true
        },
        {
            label: "Funnel Stage",
            toggle: true
        },
        {
            label: "Language",
            toggle: true
        },
        {
            label: "Business Unit",
            toggle: false
        }
    ]
const searchAndFilterOptions2 =
    [
        {
            label: "Business Unit",
            toggle: true
        }
    ]

describe("Microsites - Search & Filters configuration, verification on landing page and consumption", () => {
    it("Set up Microsites if doesn't exist", () => {
        cy.request({ url: microsite.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.microsites.removeMicrosite(microsite.name)
                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({ target: target.name })
            }
        })
    })

    it("Validate if the default value for toggle on the search and each filter tab for new blocks is inherited from Search & Filter tab.", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.addSearchAndFilterOptions(searchAndFilterOptions);
        authoring.microsites.saveSearchAndFiltersSettings();
        authoring.microsites.tabToLandingPages()
        authoring.microsites.configureLandingPage(defaultLandingPage)
        authoring.microsites.verifySearchFilterToggles(searchAndFilterOptions)
        authoring.microsites.deleteBlock(target.name)
    })

    it("Verify multi-selection of Filters and Search functionality on contents on consumption page", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.addSearchAndFilterOptions(searchAndFilterOptions2)
        authoring.microsites.saveSearchAndFiltersSettings();
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(defaultLandingPage.name)

        //Verify Search and Filters Consumption - MultiSelect, Search
        authoring.microsites.addAdvancedBlock(targetBlock)
        cy.contains("button", "Save").click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')
        cy.visit(microsite.url)
        cy.wait(10000)
        cy.get(consumption.microsites.topicFilter).click()
        //Verify Topic Filter
        const content_topics = contentPages.contentWithTopicContentTypePersona.topics
        content_topics.forEach(topic => {
            cy.get(consumption.microsites.filterByValue).contains(topic).then(option => {
                // Confirm have correct option
                cy.wrap(option).contains(topic)
                option[0].click()
                // After click, dropdown should hold the text of the selected option
                cy.contains(consumption.microsites.filterLabel, topic).should("exist")
            })
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")
        cy.containsExact("h4", "Consumption SearchAndFilters").click()

        // Select Content Type filter withour removing Topic filter
        cy.get(consumption.microsites.contentTypeFilter).click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicContentTypePersona.contentType).then(option => {
            //Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicContentTypePersona.contentType)
            option[0].click()
            //After click, dropdown should hold the text of the selected option
            cy.contains(consumption.microsites.filterLabel, contentPages.contentWithTopicContentTypePersona.contentType).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        // Remove Topic Filter so we have only Content Type filter selected
        cy.get(consumption.microsites.topicFilter).click()
        content_topics.forEach(topic => {
            cy.get(consumption.microsites.filterByValueExisting).contains(topic).then(option => {
                cy.wrap(option).contains(topic)
                option[0].click()
            })
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")

        // Remove Content Type and apply Funnel Stage filter
        cy.get(consumption.microsites.removeFilters).click()
        cy.get(consumption.microsites.funnelStageFilter).click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicFunnelBusinessUnit.funnelStage).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicFunnelBusinessUnit.funnelStage).option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains(consumption.microsites.filterLabel, contentPages.contentWithTopicFunnelBusinessUnit.funnelStage).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")
        //When multiple Funnel Stage(Top of Funnel and Middle of Funnel) selected
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithMultiple.funnelStage).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithMultiple.funnelStage)
            option[0].click()
        })
        // After click, dropdown should hold the text of the selected option
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithMultiple.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")


        // Remove Funnel Stage and apply Industry filter
        cy.get(consumption.microsites.removeFilters).eq(1).click()
        cy.get(consumption.microsites.removeFilters).click()
        cy.get(consumption.microsites.industryFilter).click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.industry).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.industry)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains(consumption.microsites.filterLabel, contentPages.contentWithTContentTypeIndustryBusinessUnit.industry).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")

        //When multiple Industry selected
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithMultiple.industry).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithMultiple.industry)
            option[0].click()
         })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithMultiple.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")


        //Remove Industry and apply Persona filter
        cy.get(consumption.microsites.removeFilters).eq(1).click()
        cy.get(consumption.microsites.removeFilters).click()
        cy.get(consumption.microsites.personaFilter).click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTopicContentTypePersona.persona).then(option => {
        // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTopicContentTypePersona.persona)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains(consumption.microsites.filterLabel, contentPages.contentWithTopicContentTypePersona.persona).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        //When multiple Persona is selected
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithMultiple.persona).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithMultiple.persona)
            option[0].click()
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithMultiple.name).should("exist")


        // Remove Persona and apply Business Unit filter
        cy.get(consumption.microsites.removeFilters).eq(1).click()
        cy.get(consumption.microsites.removeFilters).click()
        cy.get(consumption.microsites.businessUnitFilter).click()
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.businessUnit).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithTContentTypeIndustryBusinessUnit.businessUnit)
            option[0].click()
            // After click, dropdown should hold the text of the selected option
            cy.contains(consumption.microsites.filterLabel, contentPages.contentWithTContentTypeIndustryBusinessUnit.businessUnit).should("exist")
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")
        //When multiple Business Unit are selected
        cy.get(consumption.microsites.filterByValue).contains(contentPages.contentWithMultiple.businessUnit).then(option => {
            // Confirm have correct option
            cy.wrap(option).contains(contentPages.contentWithMultiple.businessUnit)
            option[0].click()
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithMultiple.name).should("exist")

        cy.containsExact("h4", "Consumption SearchAndFilters").click()  //click outside to close dropdown
        // Search by Description with Business Unit filter on
        consumption.microsites.searchMicrositeCard(contentPages.contentWithTopicFunnelBusinessUnit.description)
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")

        cy.get(consumption.microsites.topicFilter).click()
        content_topics.forEach(topic => {
            cy.get(consumption.microsites.filterByValue).contains(topic).then(option => {
                // Confirm have correct option
                cy.wrap(option).contains(topic).option[0].click()
                // After click, dropdown should hold the text of the selected option
                cy.contains(consumption.microsites.filterLabel, topic).should("exist")
            })
        })
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("not.exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")


        cy.containsExact("h4", "Consumption SearchAndFilters").click()  //click outside to close dropdown

        // Search by pressing Enter keyboard
        // Remove filters applied 
        cy.get(consumption.microsites.removeFilters).eq(1).click()
        cy.get(consumption.microsites.removeFilters).eq(1).click()
        cy.get(consumption.microsites.removeFilters).eq(1).click()
        cy.get(consumption.microsites.removeFilters).click()
        cy.get(consumption.microsites.searchInput).clear().type("this is \n")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicContentTypePersona.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTopicFunnelBusinessUnit.name).should("exist")
        cy.contains(consumption.microsites.cardTitle, contentPages.contentWithTContentTypeIndustryBusinessUnit.name).should("not.exist")


        //Verify search within Filters dropdown
        cy.get(consumption.microsites.topicFilter).click()
        cy.get(consumption.microsites.searchWithinFilterDropdown).should("exist")
        cy.get(consumption.microsites.searchWithinFilterDropdown).type("a")
        cy.contains(consumption.microsites.searchAndFiltersDDOptionText, 'a').should("exist")


        //Funnel stage filter should not show a search bar DEV-13700
        cy.get(consumption.microsites.funnelStageFilter).click()
        //search should not exist
        cy.get(consumption.microsites.searchWithinFilterDropdown).should("not.exist")
        cy.containsExact("h4", "Consumption SearchAndFilters").click()  //click outside to close dropdown
        cy.get(consumption.microsites.contentTypeFilter).click()
        cy.get(consumption.microsites.searchWithinFilterDropdown).should("exist")

        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(defaultLandingPage.name)
        authoring.microsites.deleteBlock(target.name)
    })
})
