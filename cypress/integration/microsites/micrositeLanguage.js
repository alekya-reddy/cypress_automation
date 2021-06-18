import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: 'automation-microsites', tld: 'lookbookhq' });
const consumption = createConsumptionInstance({ org: 'automation-microsites', tld: 'lookbookhq' })

const microsite = {
    name: 'micrositesLanguage.js',
    slug: 'micrositeslanguage-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: 'micrositesLanguage.js',
}
const language = {
    name: 'micrositesLanguage.js',
    code: 'ml123',
}

const customMicrositeLanguage = {
    name: language.name,
    search: 'Microsite Search',
    searchInputFieldPlaceholder: "Microsite Search Input",
    filterByContentTypeTitle: "Microsite ContentType",
    filterByLanguageTitle: "Microsite Language",
    filterByFunnelStageTitle: "Microsite FunnelStage",
    filterByBusinessUnitTitle: "Microsite BusinessUnit",
    filterByPersonaTitle: "Microsite Persona",
    filterByIndustryTitle: "Microsite Industry",
    filterByTopicTitle: "Microsite Topic",
}

const defaultMicrositeLanguage = {
    name: language.name,
    search: 'Search',
    searchInputFieldPlaceholder: "Search",
    filterByContentTypeTitle: "Filter by Content Type",
    filterByLanguageTitle: "Filter by Language",
    filterByFunnelStageTitle: "Filter by Funnel Stage",
    filterByBusinessUnitTitle: "Filter by Business Unit",
    filterByPersonaTitle: "Filter by Persona",
    filterByIndustryTitle: "Filter by Industry",
    filterByTopicTitle: "Filter by topic",
}

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
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
        }

    ]

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Target Block Grid",
            type: "track",
            track: target.name,
            titleOverride: "Track Grid",
            layout: "Grid",
            expectContents: target.contents
        },
    ]
}

describe("Microsites - Language Configuration for Microsite", () => {

    it("Set up Language and Microsites if doesn't exist", () => {
        cy.request({ url: microsite.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.configurations.addNewLanguage(language)
                authoring.microsites.removeMicrosite(microsite.name)
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({ target: target.name })
                authoring.microsites.addSearchAndFilterOptions(searchAndFilterOptions);
                authoring.microsites.saveSearchAndFiltersSettings();
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)

            }
        })
    })

    it("Verify Customize Microsite Language fields in Microsite builder page and consumption ", () => {
        authoring.common.login()
        authoring.configurations.visit.languages()
        authoring.configurations.clicklanguage(language.name)
        authoring.configurations.gotoLanguageTab("microsite-builder")
        cy.get(authoring.configurations.languages.micrositeBuilder.searchButtonTitle).clear().type(customMicrositeLanguage.search)
        cy.get(authoring.configurations.languages.micrositeBuilder.searchInputFieldPlaceholder).clear().type(customMicrositeLanguage.searchInputFieldPlaceholder)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByContentTypeTitle).clear().type(customMicrositeLanguage.filterByContentTypeTitle)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByLanguageTitle).clear().type(customMicrositeLanguage.filterByLanguageTitle)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByFunnelStageTitle).clear().type(customMicrositeLanguage.filterByFunnelStageTitle)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByBusinessUnitTitle).clear().type(customMicrositeLanguage.filterByBusinessUnitTitle)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByPersonaTitle).clear().type(customMicrositeLanguage.filterByPersonaTitle)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByIndustryTitle).clear().type(customMicrositeLanguage.filterByIndustryTitle)
        cy.get(authoring.configurations.languages.micrositeBuilder.filterByTopicTitle).clear().type(customMicrositeLanguage.filterByTopicTitle)
        cy.contains("button", "Save Microsite Builder Settings").click()
        cy.contains(authoring.common.messages.recordSaved, { timeout: 1000 }).should("exist")

        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)

        //Verify the custom language configurations in Microsite Landing page builder/Authoring side 
        cy.get(authoring.microsites.landingPages.blockContainer).eq(0).within(() => {
            cy.contains("option", customMicrositeLanguage.filterByContentTypeTitle).should("exist")
            cy.contains("option", customMicrositeLanguage.filterByLanguageTitle).should("exist")
            cy.contains("option", customMicrositeLanguage.filterByFunnelStageTitle).should("exist")
            cy.contains("option", customMicrositeLanguage.filterByBusinessUnitTitle).should("exist")
            cy.contains("option", customMicrositeLanguage.filterByPersonaTitle).should("exist")
            cy.contains("option", customMicrositeLanguage.filterByIndustryTitle).should("exist")
            cy.contains("option", customMicrositeLanguage.filterByTopicTitle).should("exist")
            cy.contains("button", customMicrositeLanguage.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", customMicrositeLanguage.searchInputFieldPlaceholder)
        })

        //Verify the custom language configurations in Microsite consumption side 
        cy.visit(landingPage.url)
        cy.contains("div", customMicrositeLanguage.filterByContentTypeTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.filterByLanguageTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.filterByFunnelStageTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.filterByBusinessUnitTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.filterByPersonaTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.filterByIndustryTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.filterByTopicTitle).should("exist")
        cy.contains("div", customMicrositeLanguage.search).should("exist")
        cy.get('input:visible').should("have.attr", "placeholder", customMicrositeLanguage.searchInputFieldPlaceholder)

    })

    it("Verify Default Microsite Language fields in Microsite builder page and consumption and no results message", () => {
        authoring.common.login()
        authoring.configurations.visit.languages()
        authoring.configurations.clicklanguage(language.name)
        authoring.configurations.resetLanguageSetting({ name: language.name, tab: 'microsite-builder' })
        cy.get(authoring.configurations.languages.micrositeBuilder.noResultsMessage).should('exist')
        cy.get(authoring.configurations.languages.micrositeBuilder.noResultsMessage).invoke('attr', 'value').as('text');
         cy.get('@text').then(text => {
            cy.get(authoring.configurations.languages.micrositeBuilder.noResultsMessage).clear().type(text+" Edited");
        })
        cy.wait(2000)
        cy.get(authoring.configurations.languages.micrositeBuilder.saveSettings).click()
        cy.contains(authoring.configurations.messages.recordSaved, {timeout: 10000}).should("exist")
        cy.get(authoring.configurations.languages.micrositeBuilder.noResultsMessage).invoke('attr', 'value').as('text');
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        authoring.microsites.goToPageEditor(landingPage.name)

        //Verify the default language configurations in Microsite Landing page builder/Authoring side 
        cy.get(authoring.microsites.landingPages.blockContainer).eq(0).within(() => {
            cy.contains("option", defaultMicrositeLanguage.filterByContentTypeTitle).should("exist")
            cy.contains("option", defaultMicrositeLanguage.filterByLanguageTitle).should("exist")
            cy.contains("option", defaultMicrositeLanguage.filterByFunnelStageTitle).should("exist")
            cy.contains("option", defaultMicrositeLanguage.filterByBusinessUnitTitle).should("exist")
            cy.contains("option", defaultMicrositeLanguage.filterByPersonaTitle).should("exist")
            cy.contains("option", defaultMicrositeLanguage.filterByIndustryTitle).should("exist")
            cy.contains("option", defaultMicrositeLanguage.filterByTopicTitle).should("exist")
            cy.contains("button", defaultMicrositeLanguage.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", defaultMicrositeLanguage.searchInputFieldPlaceholder)
        })

        //Verify the default language configurations in Microsite consumption side
        cy.visit(landingPage.url)
        cy.contains("div", defaultMicrositeLanguage.filterByContentTypeTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.filterByLanguageTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.filterByFunnelStageTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.filterByBusinessUnitTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.filterByPersonaTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.filterByIndustryTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.filterByTopicTitle).should("exist")
        cy.contains("div", defaultMicrositeLanguage.search).should("exist")
        cy.get('input:visible').should("have.attr", "placeholder", defaultMicrositeLanguage.searchInputFieldPlaceholder)

        //Validate no results message which is set at language configuration in consumption page
        cy.get(consumption.microsites.searchInputLocator).clear().type("Sample text");
        cy.get(consumption.microsites.searchButton).click();
        cy.get('@text').then(text => {
            cy.contains('div', text, { timeout: 10000 }).should("exist");
        })
    })
})