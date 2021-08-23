import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { Configurations } from '../../support/authoringClasses/Configurations.js'

const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' })
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' })

const event = {
    name: "vexSearchAndFilter.js",
    slug: "vexsearchandfilter-js",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: 'Vex-SearchAndFilter'
}

const event2 = {
    name: "searchAndFilters2.js",
    slug: "searchandfilters2-js",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const language = { name: "Vex-SearchAndFilter", code: "VSF" }

const languageOverrideForFilters = {
    language: language.name,
    searchButton: "VEX Search",
    searchInput: "VEX Search Input",
    availability: "VEX Availability",
    topics: "VEX Topic",
}

const publicSession = [
    {
        name: "public-session",
        slug: "public-session",
        get url() {
            return `${event.url}/${this.slug}`
        },
        topics: "General Use",
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        contents: ['Website - Used by Cypress automation for VEX testing']
    },
    {
        name: "Live ended without on-demand",
        slug: "ended",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        contents: ['Website - Used by Cypress automation for VEX testing']
    }
]

const sessionGroupA = {
    name: "Group A",
    sessions: [publicSession[0].name]
}

const sessionGroupB = {
    name: "Group B",
    sessions: publicSession[1].name
}

const landingPage = {
    name: "Test Landing Page",
    slug: "test-landing-page",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroupA.name,
            searchConfiguration: {
                enableToggle: true,
                searchButtonTitle: "Test Search",
                buttonTextColor: { r: "225", g: "107", b: "140", position: 0 },
                inputTextColor: { r: "204", g: "162", b: "162", position: 1 },
                buttonBackgroundAndBorderColor: { r: "231", g: "185", b: "141", position: 2 }
            },
            topicFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Topics Here',
                textColor: { r: "43", g: "91", b: "200", position: 0 },
                backgroundColor: { r: "87", g: "255", b: "78", position: 1 }
            },
            availabilityFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Availability Here',
                backgroundColor: { r: "184", g: "106", b: "164", position: 1 }
            },
            funnelStageFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Funnel Stage Here'
            },
            industryFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Industry Here'
            },
            personaFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Persona Here'
            },
            businessUnitFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Business Unit Here'
            },
            languageFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Language Here'
            }
        },
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
        },
    ]
}

const landingPage2 = {
    name: "Test Landing Page2",
    slug: "test-landing-page2",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroupA.name,
            searchConfiguration: {
                enableToggle: true,
                searchButtonTitle: "Test Search",
            },
            topicFilter: {
                overrideLabel: 'VEX Filter By Topics Here',
                enableToggle: true
            },
            availabilityFilter: {
                overrideLabel: 'VEX Filter By Availability Here',
                enableToggle: true
            },
            funnelStageFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Funnel Stage Here'
            },
            industryFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Industry Here'
            },
            personaFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Persona Here'
            },
            businessUnitFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Business Unit Here'
            },
            languageFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Language Here'
            }
        },
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
        },
    ]
}

const landingPage3 = {
    name: "Test Landing Page",
    slug: "test-landing-page",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
        },
    ]
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
            label: "Business Unit",
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
            label: "Availability",
            toggle: true
        },
        {
            label: "Funnel Stage",
            toggle: true
        },
        {
            label: "Language",
            toggle: true
        }

    ]

const multipleSessionTagging = {
    sessionName: publicSession[0].name,
    language: 'Vex-SearchAndFilter',
    topics: ['General Use', 'Aerospace'],
    businessUnits: ['General Use', 'Matrix'],
    personas: ['Automation Persona', 'Test Persona'],
    industry: ['Marketing', 'Test Industry'],
    funnelStages: ['Top of Funnel', 'Middle of Funnel', 'Bottom of Funnel']
}

const singleSessionTagging = {
    sessionName: publicSession[1].name,
    language: 'Vex-SearchAndFilter',
    topics: ['Aerospace'],
    businessUnits: ['Product'],
    personas: ['Automation Persona'],
    industry: ['Marketing'],
    funnelStages: ['Top of Funnel']
}

const filterOptions = [
    {
        filtername: "topics",
        index: ["1", "2"],
        exist: true
    },
    {
        filtername: "sessionTypes",
        index: ["1"],
        exist: true
    },
    {
        filtername: "funnelStages",
        index: ["1"],
        exist: true
    },
    {
        filtername: "industries",
        index: ["1"],
        exist: true
    },
    {
        filtername: "personas",
        index: ["1"],
        exist: true
    },
    {
        filtername: "businessUnits",
        index: ["1"],
        exist: true
    },
    {
        filtername: "languages",
        index: ["1"],
        exist: true
    }
]

const filterOptionsWithMultipleBlocks = [
    {
        filtername: "topics",
        index: ["1"],
        exist: false
    },
    {
        filtername: "sessionTypes",
        index: ["1"],
        exist: false
    },
    {
        filtername: "funnelStages",
        index: ["1"],
        exist: false
    },
    {
        filtername: "industries",
        index: ["1"],
        exist: false
    },
    {
        filtername: "personas",
        index: ["1"],
        exist: false
    },
    {
        filtername: "businessUnits",
        index: ["1"],
        exist: false
    },
    {
        filtername: "languages",
        index: ["1"],
        exist: false
    }
]

const filterOptions2 =
    [
        {
            label: "Topic",
            toggle: true
        },
        {
            label: "Business Unit",
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
            label: "Availability",
            toggle: true
        },
        {
            label: "Funnel Stage",
            toggle: true
        },
        {
            label: "Language",
            toggle: true
        }

    ]
describe("Add and configure Search and filters, verify, apply in landing page and verify search and filters are working in consumption page", () => {

    it("Set up VEX if doesn't exist", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.configurations.visit.languages()
                cy.wait(4000) //Using this wait because language sidebar takes time to display all the configured languages 
                authoring.configurations.deleteLanguage(language.name)
                authoring.configurations.addNewLanguage(language)
                authoring.configurations.configureLanguageOverride(languageOverrideForFilters)
                authoring.vex.visit();
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                publicSession.forEach((session) => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
                authoring.vex.addSessionGroup(sessionGroupA.name)
                authoring.vex.addSessionGroup(sessionGroupB.name)
                authoring.vex.addToGroup(sessionGroupA)
                authoring.vex.addToGroup(sessionGroupB)

            }
        })
    })

    it("Filter configurations in VEX consumption side", () => {
        authoring.common.login()
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        //Verify Block level Search & Filter tab configurations 
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.editLandingPage(landingPage)
        authoring.vex.setToHomePage(landingPage.name)
        authoring.vex.goToPageEditor(landingPage.name)
        authoring.vex.addAdvancedBlock(landingPage.blocks[0]) //Block level filter configuration
        cy.contains('button', 'Save').click();
        cy.visit(event.url)
        cy.wait(5000)
        consumption.vex.verifyLandingPageBlock(landingPage.blocks[0]) // consumption verification for block level search and filters
        //Verify VEX authoring and consumption side when Landing page filter configuration made from  VEX- "Search & Filter Tab"
        //Verify if the block has all sessions visible from the event when "￼All Session￼"  has been configured in the dropdown in the landing page builder block
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.addSearchAndFilterOptions(searchAndFilterOptions); // Enabeling filters from "Search & Filter Tab"
        authoring.vex.saveSearchAndFiltersSettings();
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)
        cy.wait(2000)
        cy.get(authoring.vex.pages.sessionCardTitle).eq(0).click({force:true})
        authoring.vex.addAdvancedBlock(landingPage.blocks[1]) //Adding a new block(All Sessions)to verify the configurations
        cy.contains('button', 'Save').click();
        //Verify the Search & Filter tab configurations for VEX
        //Verify if the default filter and search button, placeholder name  is pulled from the language configuration section if no label override is provided at the block level.[This functionality is separately covered in vexLanguage.js file]
        //Search and filter tab configurations in VEX Authoring Side
        cy.contains(authoring.vex.pages.sessionGroupRow, landingPage.blocks[1].sessionGroup).within(() => {
            //language override
            cy.contains("option", languageOverrideForFilters.availability).should("exist")
            cy.contains("option", languageOverrideForFilters.topics).should("exist")
            cy.contains("button", languageOverrideForFilters.searchButton).should("exist")
            cy.get('input').should("have.attr", "placeholder", languageOverrideForFilters.searchInput)
            //filter configurations value
            cy.get(authoring.vex.topicFilter).should("exist")
            cy.get(authoring.vex.availabilityFilter).should("exist")
            cy.get(authoring.vex.funnelStageFilter).should("exist")
            cy.get(authoring.vex.industryFilter).should("exist")
            cy.get(authoring.vex.personaFilter).should("exist")
            cy.get(authoring.vex.businessUnitFilter).should("exist")
            cy.get(authoring.vex.languageFilter).should("exist")
            cy.get(authoring.vex.searchInputText).should("exist")
            cy.get(authoring.vex.searchButton).should("exist")
        })
        //Search and filter tab configurations in VEX Consumption Side
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            //language override
            cy.contains("div", languageOverrideForFilters.availability).should("exist")
            cy.contains("div", languageOverrideForFilters.topics).should("exist")
            cy.contains("div", languageOverrideForFilters.searchButton).should("exist")
            cy.get('input:visible').should("have.attr", "placeholder", languageOverrideForFilters.searchInput)
            //filter configurations value
            cy.get(consumption.vex.topicFilter).should("exist")
            cy.get(consumption.vex.availabilityFilter).should("exist")
            cy.get(consumption.vex.funnelStageFilter).should("exist")
            cy.get(consumption.vex.industryFilter).should("exist")
            cy.get(consumption.vex.personaFilter).should("exist")
            cy.get(consumption.vex.businessUnitFilter).should("exist")
            cy.get(consumption.vex.languageFilter).should("exist")
            cy.get(consumption.vex.searchInput).should("exist")
            cy.get(consumption.vex.searchButton).should("exist")
        })
        //Verify content tags filter dropdown in VEX consumption, when there are no values configured in "Search & Filter Tab"
        //[Note : Filter dropdown should display with no value in this scenario]
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.removeSearchAndFilterValues(searchAndFilterOptions);
        authoring.vex.saveSearchAndFiltersSettings();
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)
        cy.visit(event.url)
        //Verify Topic Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.topicFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Funnel stage Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.funnelStageFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Industry Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.industryFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Persona Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.personaFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Business Units Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.businessUnitFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Language Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.languageFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)

    })

    it.only("Update landing page block filter capabilities to be a multi-select format", () => {
        authoring.common.login()
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        authoring.vex.configureSessionTagging(singleSessionTagging)
        authoring.vex.configureSessionTagging(multipleSessionTagging)
        authoring.vex.addSearchAndFilterOptions(searchAndFilterOptions)
        authoring.vex.saveSearchAndFiltersSettings();
        //Visit Consumption page
        cy.visit(event.url)
        //Validate if sessions are filtered based on the multi-selection in a virtual event landing page
        //In Group A Block : Multiple Topics Filter applied
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.topicFilter).click()
            cy.wait(1000)

        })
        cy.contains('div', multipleSessionTagging.topics[0], { timeout: 1000 }).parent().should('be.visible').click()
        cy.contains('div', multipleSessionTagging.topics[1], { timeout: 1000 }).parent().should('be.visible').click()
        cy.get(consumption.vex.topicFilter).should('have.contain', multipleSessionTagging.topics[0])
        cy.get(consumption.vex.topicFilter).should('have.contain', multipleSessionTagging.topics[1])
        cy.get(consumption.vex.cancelFilterbox).click()
        //Multiple Funnel Stages filter applied
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.funnelStageFilter).click()
            cy.wait(1000)
        })
        cy.contains('div', multipleSessionTagging.funnelStages[0], { timeout: 1000 }).parent().should('be.visible').click()
        cy.contains('div', multipleSessionTagging.funnelStages[1], { timeout: 1000 }).parent().should('be.visible').click()
        cy.get(consumption.vex.funnelStageFilter).should('have.contain', multipleSessionTagging.funnelStages[0])
        cy.get(consumption.vex.funnelStageFilter).should('have.contain', multipleSessionTagging.funnelStages[1])
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify the sessions after applying the filters
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        //Persona filter applied
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.personaFilter).click()
            cy.wait(1000)
        })
        cy.contains('div', multipleSessionTagging.personas[1], { timeout: 1000 }).parent().should('be.visible').click()
        cy.get(consumption.vex.personaFilter).should('have.contain', multipleSessionTagging.personas[1])
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify the sessions after applying the filters
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("not.exist")
        //Verify if the Select All(a checkbox on top) option is available in the filter dropdown.(checking for any single filter)
        cy.reload()
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.topicFilter).click()
            cy.wait(1000)
        })
        cy.get(consumption.vex.filterBoxheader).within(() => {
            cy.get(consumption.vex.selectAllFilterCheckbox).click()
        })
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify the "Select All" filter result
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        //Funnel stage & Availability filter should not show a search bar
        //Availability filter 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.availabilityFilter).click()
            cy.wait(1000)
        })
        cy.get(consumption.vex.filterSearchBox).should("not.exist")
        cy.get(consumption.vex.cancelFilterbox).click()
        //Funnel stage filter 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.funnelStageFilter).click()
            cy.wait(1000)
        })
        cy.get(consumption.vex.filterSearchBox).should("not.exist")
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify search functionality for VEX sessions
        cy.reload()
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.searchInputField).type(publicSession[0].name)
            cy.get(consumption.vex.searchFilter).click()
        })
        //Verify the sessions after applying the search filter
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")


        cy.get(authoring.vex.pages.sessionCardTitle).eq(0).click()
        authoring.vex.addAdvancedBlock(landingPage.blocks[1]) //Adding a new block(All Sessions)to verify the configurations
        cy.contains('button', 'Save').click();
        //Verify the Search & Filter tab configurations for VEX
        //Verify if the default filter and search button, placeholder name  is pulled from the language configuration section if no label override is provided at the block level.[This functionality is separately covered in vexLanguage.js file]
        //Search and filter tab configurations in VEX Authoring Side
        cy.contains(authoring.vex.pages.sessionGroupRow, landingPage.blocks[1].sessionGroup).within(() => {
            //language override
            cy.contains("option", languageOverrideForFilters.availability).should("exist")
            cy.contains("option", languageOverrideForFilters.topics).should("exist")
            cy.contains("button", languageOverrideForFilters.searchButton).should("exist")
            cy.get('input').should("have.attr", "placeholder", languageOverrideForFilters.searchInput)
            //filter configurations value
            cy.get(authoring.vex.topicFilter).should("exist")
            cy.get(authoring.vex.availabilityFilter).should("exist")
            cy.get(authoring.vex.funnelStageFilter).should("exist")
            cy.get(authoring.vex.industryFilter).should("exist")
            cy.get(authoring.vex.personaFilter).should("exist")
            cy.get(authoring.vex.businessUnitFilter).should("exist")
            cy.get(authoring.vex.languageFilter).should("exist")
            cy.get(authoring.vex.searchInputText).should("exist")
            cy.get(authoring.vex.searchButton).should("exist")
        })
        //Search and filter tab configurations in VEX Consumption Side
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            //language override
            cy.contains("div", languageOverrideForFilters.availability).should("exist")
            cy.contains("div", languageOverrideForFilters.topics).should("exist")
            cy.contains("div", languageOverrideForFilters.searchButton).should("exist")
            cy.get('input:visible').should("have.attr", "placeholder", languageOverrideForFilters.searchInput)
            //filter configurations value
            cy.get(consumption.vex.topicFilter).should("exist")
            cy.get(consumption.vex.availabilityFilter).should("exist")
            cy.get(consumption.vex.funnelStageFilter).should("exist")
            cy.get(consumption.vex.industryFilter).should("exist")
            cy.get(consumption.vex.personaFilter).should("exist")
            cy.get(consumption.vex.businessUnitFilter).should("exist")
            cy.get(consumption.vex.languageFilter).should("exist")
            cy.get(consumption.vex.searchInput).should("exist")
            cy.get(consumption.vex.searchButton).should("exist")
        })
        //Verify content tags filter dropdown in VEX consumption, when there are no values configured in "Search & Filter Tab"
        //[Note : Filter dropdown should display with no value in this scenario]
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.removeSearchAndFilterValues(searchAndFilterOptions);
        authoring.vex.saveSearchAndFiltersSettings();
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)
        cy.visit(event.url)
        //Verify Topic Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.topicFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Funnel stage Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.funnelStageFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Industry Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.industryFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Persona Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.personaFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Business Units Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.businessUnitFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)
        //Verify Language Filter dropdown 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.languageFilter).click()
            cy.wait(2000)
        })
        cy.get(consumption.vex.checkbox).should('have.length', 1)

    })

    it.only("Update landing page block filter capabilities to be a multi-select format", () => {
        authoring.common.login()
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        authoring.vex.configureSessionTagging(singleSessionTagging)
        authoring.vex.configureSessionTagging(multipleSessionTagging)
        authoring.vex.addSearchAndFilterOptions(searchAndFilterOptions)
        authoring.vex.saveSearchAndFiltersSettings();
        //Visit Consumption page
        cy.visit(event.url)
        //Validate if sessions are filtered based on the multi-selection in a virtual event landing page
        //In Group A Block : Multiple Topics Filter applied
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.topicFilter).click()
            cy.wait(1000)

        })
        cy.contains('div', multipleSessionTagging.topics[0], { timeout: 1000 }).parent().should('be.visible').click()
        cy.contains('div', multipleSessionTagging.topics[1], { timeout: 1000 }).parent().should('be.visible').click()
        cy.get(consumption.vex.topicFilter).should('have.contain', multipleSessionTagging.topics[0])
        cy.get(consumption.vex.topicFilter).should('have.contain', multipleSessionTagging.topics[1])
        cy.get(consumption.vex.cancelFilterbox).click()
        //Multiple Funnel Stages filter applied
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.funnelStageFilter).click()
            cy.wait(1000)
        })
        cy.contains('div', multipleSessionTagging.funnelStages[0], { timeout: 1000 }).parent().should('be.visible').click()
        cy.contains('div', multipleSessionTagging.funnelStages[1], { timeout: 1000 }).parent().should('be.visible').click()
        cy.get(consumption.vex.funnelStageFilter).should('have.contain', multipleSessionTagging.funnelStages[0])
        cy.get(consumption.vex.funnelStageFilter).should('have.contain', multipleSessionTagging.funnelStages[1])
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify the sessions after applying the filters
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        //Persona filter applied
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.personaFilter).click()
            cy.wait(1000)
        })
        cy.contains('div', multipleSessionTagging.personas[1], { timeout: 1000 }).parent().should('be.visible').click()
        cy.get(consumption.vex.personaFilter).should('have.contain', multipleSessionTagging.personas[1])
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify the sessions after applying the filters
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("not.exist")
        //Verify if the Select All(a checkbox on top) option is available in the filter dropdown.(checking for any single filter)
        cy.reload()
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.topicFilter).click()
            cy.wait(1000)
        })
        cy.get(consumption.vex.filterBoxheader).within(() => {
            cy.get(consumption.vex.selectAllFilterCheckbox).click()
        })
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify the "Select All" filter result
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        //Funnel stage & Availability filter should not show a search bar
        //Availability filter 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.availabilityFilter).click()
            cy.wait(1000)
        })
        cy.get(consumption.vex.filterSearchBox).should("not.exist")
        cy.get(consumption.vex.cancelFilterbox).click()
        //Funnel stage filter 
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.funnelStageFilter).click()
            cy.wait(1000)
        })
        cy.get(consumption.vex.filterSearchBox).should("not.exist")
        cy.get(consumption.vex.cancelFilterbox).click()
        //Verify search functionality for VEX sessions
        cy.reload()
        cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
            cy.get(consumption.vex.searchInputField).type(publicSession[0].name)
            cy.get(consumption.vex.searchFilter).click()
        })
        //Verify the sessions after applying the search filter
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
    })

    it("Verify applied landing page block filters as query strings in URL", () => {
        authoring.common.login()
        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage2.name)
        authoring.vex.addLandingPages(landingPage2.name)
        authoring.vex.editLandingPage(landingPage2)
        authoring.vex.setToHomePage(landingPage2.name)
        authoring.vex.goToPageEditor(landingPage2.name)
        authoring.vex.addAdvancedBlock(landingPage2.blocks[0]) //Block level filter configuration
        cy.contains('button', 'Save').click();
        cy.visit(event.url)

        //Select Filter options and verify applied filters showing as query strings in URL when one block present
        filterOptions.forEach((filters) => {
            consumption.vex.SelectFiltersAndVerifyAsQueryStringInURL(filters);
        })

        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()

        authoring.vex.goToPageEditor(landingPage2.name)
        cy.wait(3000)
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        cy.wait(2000)
        authoring.vex.addAdvancedBlock(landingPage2.blocks[0]) //Block level filter configuration
        cy.contains('button', 'Save').click();
        cy.visit(event.url)

        //  If multiple blocks are availble in a page applied filters shpould not show as querystring in url
        cy.wait(3000)
        cy.get('h2').parent('div').should('have.length', 2)

        filterOptionsWithMultipleBlocks.forEach((filters) => {
            consumption.vex.SelectFiltersAndVerifyAsQueryStringInURL(filters);
        })

        authoring.vex.visit();
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage2.name)
    })

    it("Verify content tags filter values are arranged in alphabetical order for VEX", () => {
        authoring.common.login()
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.addVirtualEvent(event2)
        authoring.vex.configureEvent(event2)
        publicSession.forEach((session) => {
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            authoring.vex.backToEvent(event2.name)
        })

        authoring.vex.tabToSearchAndFilter()
        cy.wait(3000)
        //validating the values of each filter are arranged in alphabetical order inside VEX Setup->Search & Filter tab
        authoring.vex.verifyFilterOptionsAlphabeticalOrder(filterOptions2)
        authoring.vex.saveSearchAndFiltersSettings()

        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage3.name)
        authoring.vex.addLandingPages(landingPage3.name)
        authoring.vex.editLandingPage(landingPage3)
        authoring.vex.setToHomePage(landingPage3.name)
        authoring.vex.goToPageEditor(landingPage3.name)
        authoring.vex.addAdvancedBlock(landingPage3.blocks[0]) //Block level filter configuration
        cy.contains('button', 'Save').click();
        cy.visit(event2.url)

        //validating the values of each filter are arranged in alphabetical order in the consumption page
        filterOptions.forEach((filters) => {
            consumption.vex.SelectFiltersAndVerifyAlphabeticalOrder(filters)
        })
    })

})
