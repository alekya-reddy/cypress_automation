import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' })

const event = {
    name: 'vexLanguage.js',
    slug: 'vexlanguage-js',
    trackProtection: "vexTrackProtection2",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const event1 = {
    name: 'vexLanguage1.js',
    slug: 'vexlanguage1-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: 'vexLanguage3'
}

const lang1 = {name: "vexLanguage1", title: "vexLanguage1", helper: "vexLanguage1"}
const lang2 = {name: "vexLanguage2", title: "vexLanguage2", helper: "vexLanguage2"}
const lang3 = {name: "vexLanguage3", code: "vex"}

const defaultVEXLanguage = {
    name: lang3.name,
    search: 'Search',
    searchInputFieldPlaceholder : "Search",
    filterByAvailabilityTitle: "Filter by Availability",
    filterByLanguageTitle: "Filter by Language",
    filterByFunnelStageTitle: "Filter by Funnel Stage",
    filterByBusinessUnitTitle: "Filter by Business Unit",
    filterByPersonaTitle: "Filter by Persona",
    filterByIndustryTitle: "Filter by Industry",
    filterByTopicTitle: "Filter by Topic",
}

const customVEXLanguage = {
    name: lang3.name,
    search: 'VEX Search',
    searchInputFieldPlaceholder : "VEX Search Input",
    filterByAvailabilityTitle: "VEX Availability",
    filterByLanguageTitle: "VEX Language",
    filterByFunnelStageTitle: "VEX FunnelStage",
    filterByBusinessUnitTitle: "VEX BusinessUnit",
    filterByPersonaTitle: "VEX Persona",
    filterByIndustryTitle: "VEX Industry",
    filterByTopicTitle: "VEX Topic",
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

const sessions = [
    {
        name: "On-demand",
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
]

const sessionGroup = {
    name: "GroupA",
    sessions: sessions[0].name
}

const landingPage = {
    name: "Landing Page",
    slug: "landing-page",
    get url(){
        return `${event1.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroup.name,
            verify: false
        }
    ]
}

describe("VEX - Language Settings", ()=>{
    it("Should set language", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)

        // Set the first language 
        authoring.vex.setLanguage(lang1.name) 
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.reload()
        cy.wait(2000)
        cy.get(`span[title='${lang1.name}']`).should('exist')

        // Go to consumption side and verify the language on the track protection message 
        cy.visit(event.url)
        cy.contains("h5", lang1.title).should('exist')
        cy.contains(lang1.helper).should('exist')

        // Set the second language to verify can change the language once it is set 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.setLanguage(lang2.name)
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')

        // Go to consumption and verify second language 
        cy.visit(event.url)
        cy.contains("h5", lang2.title).should('exist')
        cy.contains(lang2.helper).should('exist')
    })
    it("Setup language for VEX if doesn't exists", ()=>{
        cy.request({url: event1.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.common
                authoring.configurations.addNewLanguage(lang3)
                authoring.vex.visit()
                authoring.vex.deleteVirtualEvent(event1.name)
                authoring.vex.addVirtualEvent(event1)
                authoring.vex.configureEvent(event1)
                sessions.forEach((session)=>{
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event1.name)
                })
                //add session group
                authoring.vex.addSessionGroup(sessionGroup.name)
                // Add sessions to the groups
                authoring.vex.addToGroup(sessionGroup)
                //Enable all search and filters under Search & Filter tab
                authoring.vex.addSearchAndFilterOptions(searchAndFilterOptions);
                authoring.vex.saveSearchAndFiltersSettings();
                //add and configure landing page
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })
    it("Verify customized VEX Language fields in VEX landing page and consumption", () => {
        authoring.common.login()
        authoring.configurations.visit.languages()
        authoring.configurations.clicklanguage(lang3.name)
        authoring.configurations.gotoLanguageTab("virtual-event")
        cy.wait(3000)
        cy.get(authoring.configurations.languages.vex.searchButtonTitle).clear().type(customVEXLanguage.search)
        cy.get(authoring.configurations.languages.vex.searchInputFieldPlaceholder).clear().type(customVEXLanguage.searchInputFieldPlaceholder)
        cy.get(authoring.configurations.languages.vex.filterByAvailabilityTitle).clear().type(customVEXLanguage.filterByAvailabilityTitle)
        cy.get(authoring.configurations.languages.vex.filterByLanguageTitle).clear().type(customVEXLanguage.filterByLanguageTitle)
        cy.get(authoring.configurations.languages.vex.filterByFunnelStageTitle).clear().type(customVEXLanguage.filterByFunnelStageTitle)
        cy.get(authoring.configurations.languages.vex.filterByBusinessUnitTitle).clear().type(customVEXLanguage.filterByBusinessUnitTitle)
        cy.get(authoring.configurations.languages.vex.filterByPersonaTitle).clear().type(customVEXLanguage.filterByPersonaTitle)
        cy.get(authoring.configurations.languages.vex.filterByIndustryTitle).clear().type(customVEXLanguage.filterByIndustryTitle)
        cy.get(authoring.configurations.languages.vex.filterByTopicTitle).clear().type(customVEXLanguage.filterByTopicTitle)
        cy.contains("button", "Save Virtual Event Settings").click()
        cy.contains(authoring.common.messages.recordSaved, {timeout: 1000}).should("exist")

        authoring.vex.visit()
        authoring.vex.goToEventConfig(event1.name)
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)
        //Verify the custom language configurations in VEX Landing page
        cy.get(authoring.vex.pages.sessionGroupRow).eq(0).within(()=>{
            cy.contains("option", customVEXLanguage.filterByAvailabilityTitle).should("exist")
            cy.contains("option", customVEXLanguage.filterByLanguageTitle).should("exist")
            cy.contains("option", customVEXLanguage.filterByFunnelStageTitle).should("exist")
            cy.contains("option", customVEXLanguage.filterByBusinessUnitTitle).should("exist")
            cy.contains("option", customVEXLanguage.filterByPersonaTitle).should("exist")
            cy.contains("option", customVEXLanguage.filterByIndustryTitle).should("exist")
            cy.contains("option", customVEXLanguage.filterByTopicTitle).should("exist")
            cy.contains("button", customVEXLanguage.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", customVEXLanguage.searchInputFieldPlaceholder)
        })
        //Verify the custom language configurations in VEX consumption side
        cy.visit(event1.url)
        cy.contains("div", customVEXLanguage.filterByAvailabilityTitle).should("exist")
        cy.contains("div", customVEXLanguage.filterByLanguageTitle).should("exist")
        cy.contains("div", customVEXLanguage.filterByFunnelStageTitle).should("exist")
        cy.contains("div", customVEXLanguage.filterByBusinessUnitTitle).should("exist")
        cy.contains("div", customVEXLanguage.filterByPersonaTitle).should("exist")
        cy.contains("div", customVEXLanguage.filterByIndustryTitle).should("exist")
        cy.contains("div", customVEXLanguage.filterByTopicTitle).should("exist")
        cy.contains("div", customVEXLanguage.search).should("exist")
        cy.get('input:visible').should("have.attr", "placeholder", customVEXLanguage.searchInputFieldPlaceholder)
    })
    it("Verify default VEX Language fields in VEX landing page and consumption and no results message", () => {
        authoring.common.login()
        authoring.configurations.visit.languages()
        authoring.configurations.clicklanguage(lang3.name)
        authoring.configurations.resetLanguageSetting({name: lang3.name, tab: 'virtual-event'})
        cy.get(authoring.configurations.languages.vex.noResultsMessage).should('exist')
        cy.get(authoring.configurations.languages.vex.noResultsMessage).invoke('attr', 'value').as('text');
         cy.get('@text').then(text => {
            cy.get(authoring.configurations.languages.vex.noResultsMessage).clear().type(text+" Edited");
        })
        cy.wait(2000)
        cy.get(authoring.configurations.languages.vex.saveSettings).click()
        cy.contains(authoring.configurations.messages.recordSaved, {timeout: 10000}).should("exist")
        cy.get(authoring.configurations.languages.vex.noResultsMessage).invoke('attr', 'value').as('text');
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event1.name)
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)
        //Verify the default language configurations in VEX Landing page
        cy.get(authoring.vex.pages.sessionGroupRow).eq(0).within(()=>{
            cy.contains("option", defaultVEXLanguage.filterByAvailabilityTitle).should("exist")
            cy.contains("option", defaultVEXLanguage.filterByLanguageTitle).should("exist")
            cy.contains("option", defaultVEXLanguage.filterByFunnelStageTitle).should("exist")
            cy.contains("option", defaultVEXLanguage.filterByBusinessUnitTitle).should("exist")
            cy.contains("option", defaultVEXLanguage.filterByPersonaTitle).should("exist")
            cy.contains("option", defaultVEXLanguage.filterByIndustryTitle).should("exist")
            cy.contains("option", defaultVEXLanguage.filterByTopicTitle).should("exist")
            cy.contains("button", defaultVEXLanguage.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", defaultVEXLanguage.searchInputFieldPlaceholder)
        })
        //Verify the default language configurations in VEX consumption side
        cy.visit(event1.url)
        cy.contains("div", defaultVEXLanguage.filterByAvailabilityTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.filterByLanguageTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.filterByFunnelStageTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.filterByBusinessUnitTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.filterByPersonaTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.filterByIndustryTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.filterByTopicTitle).should("exist")
        cy.contains("div", defaultVEXLanguage.search).should("exist")
        cy.get('input:visible').should("have.attr", "placeholder", defaultVEXLanguage.searchInputFieldPlaceholder)

        //Validate no results message which is set at language configuration in consumption page
        cy.get(consumption.vex.searchInput).clear().type("Sample text");
        cy.get(consumption.vex.searchButton).click();
        cy.get('@text').then(text => {
            cy.contains('div', text, { timeout: 10000 }).should("exist");
        })
    })
})