import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})


const language = {
    name: 'exploreLanguageSettings.js',
    code: '123',
}

const exploreLanguageNew = {
    name: language.name,
    search: 'Search Label',
    searchInputPlaceholder: 'Search Input',
    filterByContentType: 'Content Type Filter',
    filterByFunnelStage: 'Funnel Stage Filter',
    filterByBusinessUnit: 'Business Unit Filter',
    filterByPersona: 'Persona Filter',
    filterByIndustryTitle: 'Industry Filter',
}

const exploreLanguageDefaults = {
    name: language.name,
    search: 'Search',
    searchInputPlaceholder: 'Search',
    filterByContentType: 'Filter by Content Type',
    filterByFunnelStage: 'Filter by Funnel Stage',
    filterByBusinessUnit: 'Filter by Business Unit',
    filterByPersona: 'Filter by Persona',
    filterByIndustryTitle: 'Filter by Industry',
}

const target = {
    name: 'exploreLanguageSettings.js',
    language: language.name,
    slug: 'explorelanguagesettings',
    contents:[
        "Do-Not-Edit Capybara - Shared Resource",
        "Do-Not-Edit Cisco Systems - Shared Resource",
        "Do-Not-Edit Fauna of Australia - Shared Resource",
        "Do-Not-Edit Identify Sales - Shared Resource",
    ],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/capybara`
    }
}

const explore = {
    name: 'exploreLanguageSettings.js',
    experienceType: "Target",
    trackName: target.name,
    slug: 'explorelanguagesettings',
    searchFunction: "on",
    filters: "on",
    selectFilters: { 
        topic: true,
        contentType: true, 
        businessUnit: true,
        funnelStage: true,
        persona: true,
        industry: true,
    },    
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}

describe("Explore - language setting", () => {
    it("Setup language and Traget Track if not already done", () => {
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addNewLanguage({
                    name: exploreLanguageNew.name, 
                    code: language.code
                })
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })
    })

    it("Setup Explore page if not already done", () => {
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Customize Language setting and verify explore preview and consumption ", () => {
        authoring.common.login()
        // Error validation on language customization settings page 
        authoring.configurations.visit.languages()
        authoring.configurations.clicklanguage(language.name)
        authoring.configurations.gotoLanguageTab("explore")
        cy.wait(1000)
        cy.get(authoring.configurations.languages.explore.searchInput).clear()
        cy.get(authoring.configurations.languages.explore.searchPlaceholderInput).clear()
        cy.get(authoring.configurations.languages.explore.contentTypeInput).clear()
        cy.get(authoring.configurations.languages.explore.funnelStageInput).clear()
        cy.get(authoring.configurations.languages.explore.businessUnitInput).clear()
        cy.get(authoring.configurations.languages.explore.personaInput).clear()
        cy.get(authoring.configurations.languages.explore.industryTitleInput).clear()
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Search button title can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.searchInput).clear().type(exploreLanguageNew.search)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Search button title can't be blank").should("not.exist")
        cy.contains("Search input field placeholder can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.searchPlaceholderInput).clear().type(exploreLanguageNew.searchInputPlaceholder)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Search input field placeholder can't be blank").should("not.exist")
        cy.contains("Filter by content type title can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.contentTypeInput).clear().type(exploreLanguageNew.filterByContentType)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Filter by content type title can't be blank").should("not.exist")
        cy.contains("Filter by funnel stage title can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.funnelStageInput).clear().type(exploreLanguageNew.filterByFunnelStage)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Filter by funnel stage title can't be blank").should("not.exist")
        cy.contains("Filter by business unit title can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.businessUnitInput).clear().type(exploreLanguageNew.filterByBusinessUnit)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Filter by business unit title can't be blank").should("not.exist")
        cy.contains("Filter by persona title can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.personaInput).clear().type(exploreLanguageNew.filterByPersona)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Filter by persona title can't be blank").should("not.exist")
        cy.contains("Filter by industry title can't be blank").should("exist")

        cy.get(authoring.configurations.languages.explore.industryTitleInput).clear().type(exploreLanguageNew.filterByIndustryTitle)
        cy.contains("button", "Save Explore Settings").click()
        cy.contains("Filter by industry title can't be blank").should("not.exist")
        cy.contains(authoring.common.messages.recordSaved, {timeout: 10000}).should("exist")

        // Verify New language custumization on explore preview page 
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name) 
        cy.get(authoring.explore.topicFilterDropdown, {timeout: 20000}).within(()=>{
            cy.contains("div", exploreLanguageNew.filterByContentType).should("exist")
            cy.contains("div", exploreLanguageNew.filterByFunnelStage).should("exist")
            cy.contains("div", exploreLanguageNew.filterByBusinessUnit).should("exist")
            cy.contains("div", exploreLanguageNew.filterByPersona).should("exist")
            cy.contains("div", exploreLanguageNew.filterByIndustryTitle).should("exist")
        })       
        cy.get(authoring.explore.topicFilterSection, {timeout: 20000}).within(()=>{
            cy.contains("div", exploreLanguageNew.search).should("exist") 
            cy.get('input').should("have.attr", "placeholder", exploreLanguageNew.searchInputPlaceholder) 
        })    
        // Verify New language custumization on explore consumption 
        cy.visit(explore.url)
        cy.get(consumption.explore.body.topicFilterContainer, {timeout: 20000}).within(()=>{
            cy.contains("span", exploreLanguageNew.filterByContentType).should("exist")
            cy.contains("span", exploreLanguageNew.filterByFunnelStage).should("exist")
            cy.contains("span", exploreLanguageNew.filterByBusinessUnit).should("exist")
            cy.contains("span", exploreLanguageNew.filterByPersona).should("exist")
            cy.contains("span", exploreLanguageNew.filterByIndustryTitle).should("exist")
         })   
        cy.get(consumption.explore.body.topicSearchContainer, {timeout: 20000}).within(()=>{
            cy.contains("div", exploreLanguageNew.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", exploreLanguageNew.searchInputPlaceholder) 
        })

        // Reset language settings and verify the defaults values on preview and consumption page 
        authoring.configurations.visit.languages()
        authoring.configurations.resetLanguageSetting({name: language.name, tab: 'explore'})
        // Verify Default language custumization on explore preview page 
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name) 
        cy.get(authoring.explore.topicFilterDropdown, {timeout: 20000}).within(()=>{
            cy.contains("div", exploreLanguageDefaults.filterByContentType).should("exist")
            cy.contains("div", exploreLanguageDefaults.filterByFunnelStage).should("exist")
            cy.contains("div", exploreLanguageDefaults.filterByBusinessUnit).should("exist")
            cy.contains("div", exploreLanguageDefaults.filterByPersona).should("exist")
            cy.contains("div", exploreLanguageDefaults.filterByIndustryTitle).should("exist")
        })       
        cy.get(authoring.explore.topicFilterSection, {timeout: 20000}).within(()=>{
            cy.contains("div", exploreLanguageDefaults.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", exploreLanguageDefaults.searchInputPlaceholder) 
        })    

        // Verify Default language custumization on explore consumption 
        cy.visit(explore.url)
        cy.get(consumption.explore.body.topicFilterContainer, {timeout: 20000}).within(()=>{
            cy.contains("span", exploreLanguageDefaults.filterByContentType).should("exist")
            cy.contains("span", exploreLanguageDefaults.filterByFunnelStage).should("exist")
            cy.contains("span", exploreLanguageDefaults.filterByBusinessUnit).should("exist")
            cy.contains("span", exploreLanguageDefaults.filterByPersona).should("exist")
            cy.contains("span", exploreLanguageDefaults.filterByIndustryTitle).should("exist")
         })   
        cy.get(consumption.explore.body.topicSearchContainer, {timeout: 20000}).within(()=>{
            cy.contains("div", exploreLanguageDefaults.search).should("exist")
            cy.get('input').should("have.attr", "placeholder", exploreLanguageDefaults.searchInputPlaceholder) 
        })
    })
})   
