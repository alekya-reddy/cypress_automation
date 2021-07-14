import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { Configurations } from '../../support/authoringClasses/Configurations.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: "vexSearchAndFilter.js",
    slug: "vexsearchandfilter-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: 'Vex-SearchAndFilter'
}

const language = {name: "Vex-SearchAndFilter", code: "VSF"}

const customVEXLanguage = {
    name: language.name,
    search: "VEX Search",
    searchInputFieldPlaceholder : "VEX Search Input",
    filterByAvailabilityTitle: "VEX Availability",
    filterByLanguageTitle: "VEX Language",
    filterByFunnelStageTitle: "VEX FunnelStage",
    filterByBusinessUnitTitle: "VEX BusinessUnit",
    filterByPersonaTitle: "VEX Persona",
    filterByIndustryTitle: "VEX Industry",
    filterByTopicTitle: "VEX Topic",
}

const publicSession = [
    {
    name: "public-session",
    slug: "public-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    topics: "General Use",
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents:['Website - Used by Cypress automation for VEX testing'] 
    },
    {
    name: "Live ended without on-demand",
    slug: "ended",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents:['Website - Used by Cypress automation for VEX testing'] 
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
    get url(){
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
                buttonTextColor: {r: "225", g: "107", b: "140", position: 0},
                inputTextColor: {r: "204", g: "162", b: "162", position: 1},
                buttonBackgroundAndBorderColor: {r: "231", g: "185", b: "141", position: 2}
            },
            topicFilter: {
                enableToggle: true,
                overrideLabel: 'VEX Filter By Topics Here',
                textColor: {r: "43", g: "91", b: "200", position: 0},
                backgroundColor: {r: "87", g: "255", b: "78", position: 1}
            },
            availabilityFilter:{
                enableToggle: true,
                overrideLabel: 'VEX Filter By Availability Here',
                backgroundColor: {r: "184", g: "106", b: "164", position: 1}
            },
            funnelStageFilter:{
                enableToggle: true,
                overrideLabel: 'VEX Filter By Funnel Stage Here'
            },
            industryFilter:{
                enableToggle: true,
                overrideLabel: 'VEX Filter By Industry Here'
            },
            personaFilter:{
                enableToggle: true,
                overrideLabel: 'VEX Filter By Persona Here'
            },
            businessUnitFilter:{
                enableToggle: true,
                overrideLabel: 'VEX Filter By Business Unit Here'
            },
            languageFilter:{
                enableToggle: true,
                overrideLabel: 'VEX Filter By Language Here'
            }
        },
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
        },
    ]}
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
        topics: ['General Use','Aerospace'],
        businessUnits: ['General Use','Matrix'],
        personas: ['Automation Persona','Test Persona'],
        industry: ['Marketing','Test Industry'],
        funnelStages: ['Top of Funnel','Middle of Funnel','Bottom of Funnel']
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

    describe("VEX- Add and configure Search and filters, verify, apply in landing page and verify search and filters are working in consumption page for VEX", () => {

        it("Set up Language and VEX if doesn't exist", ()=>{
            authoring.common.login()
            authoring.configurations.visit.languages()
            cy.wait(4000) //Using this wait because language sidebar takes time to display all the configured languages 
            authoring.configurations.deleteLanguage(language.name)
            authoring.configurations.addNewLanguage(language) 
            authoring.configurations.clicklanguage(language.name)
            authoring.configurations.gotoLanguageTab("virtual-event")
            cy.wait(5000) //Languages-Virtual Event Tab loading wait
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
            authoring.vex.visit();
            authoring.vex.deleteVirtualEvent(event.name)
            authoring.vex.addVirtualEvent(event.name)
            authoring.vex.configureEvent(event)
            publicSession.forEach((session)=>{
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
                authoring.vex.backToEvent(event.name)
            })
            authoring.vex.addSessionGroup(sessionGroupA.name)
            authoring.vex.addSessionGroup(sessionGroupB.name)
            authoring.vex.addToGroup(sessionGroupA)
            authoring.vex.addToGroup(sessionGroupB)
            //Verify Search & Filter tab configurations in VEX Landing page/Authoring
            authoring.vex.tabToSearchAndFilter()
            authoring.vex.addLandingPages(landingPage.name)
            authoring.vex.editLandingPage(landingPage)
            authoring.vex.setToHomePage(landingPage.name)
            authoring.vex.goToPageEditor(landingPage.name)
            authoring.vex.addAdvancedBlock(landingPage.blocks[0]) //Filter configured inside landing page session block
            cy.contains('button', 'Save').click(); 
            //Verify the filter configurations in VEX consumption side
            cy.visit(event.url) 
            consumption.vex.verifyLandingPageBlock(landingPage.blocks[0])
            //Verify VEX authoring and consumption side when Landing page filter configuration made from  VEX- "Search & Filter Tab"
            //Verify if the block has all sessions visible from the event when "￼All Session￼"  has been configured in the dropdown in the landing page builder block
            authoring.vex.visit();
            authoring.vex.goToEventConfig(event.name)
            authoring.vex.addSearchAndFilterOptions(searchAndFilterOptions); // Enabeling filters from "Search & Filter Tab"
            authoring.vex.saveSearchAndFiltersSettings();
            authoring.vex.goToLandingPage() 
            authoring.vex.goToPageEditor(landingPage.name)
            cy.get(authoring.vex.pages.blockContainer).eq(0).click()
            authoring.vex.addAdvancedBlock(landingPage.blocks[1]) //Adding a new block(All Sessions)to verify the configurations
            cy.contains('button', 'Save').click(); 
            //Verify the Search & Filter tab configurations in VEX authoring and consumption side
            //Verify if the default filter and search button, placeholder name  is pulled from the language configuration section if no label override is provided at the block level.
            //VEX Authoring Side
            cy.contains(authoring.vex.pages.sessionGroupRow, landingPage.blocks[1].sessionGroup).within(() => {  
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
            //VEX consumption side
            cy.visit(event.url)
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
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
                cy.get(consumption.vex.topicFilterLocator).click()
                cy.wait(2000)
            })
            cy.get(consumption.vex.checkbox).should('have.length', 1)

            //Verify Funnel stage Filter dropdown 
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.funnelStageFilterLocator).click()
                cy.wait(2000)
            })
            cy.get(consumption.vex.checkbox).should('have.length', 1)

            //Verify Industry Filter dropdown 
             cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.industryFilterLocator).click()
                cy.wait(2000)
            })
            cy.get(consumption.vex.checkbox).should('have.length', 1)

            //Verify Persona Filter dropdown 
             cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.personaFilterLocator).click()
                cy.wait(2000)
            })
            cy.get(consumption.vex.checkbox).should('have.length', 1)

            //Verify Business Units Filter dropdown 
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.businessUnitFilterLocator).click()
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
        
        it("VEX- Update landing page block filter capabilities to be a multi-select format", ()=>{
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
                cy.get(consumption.vex.topicFilterLocator).click()
                cy.wait(1000)
                
            })
            cy.contains('div',multipleSessionTagging.topics[0],{timeout:1000}).parent().should('be.visible').click()
            cy.contains('div',multipleSessionTagging.topics[1],{timeout:1000}).parent().should('be.visible').click()
            cy.get(consumption.vex.topicFilterLocator).should('have.contain', multipleSessionTagging.topics[0])
            cy.get(consumption.vex.topicFilterLocator).should('have.contain', multipleSessionTagging.topics[1])
            cy.get(consumption.vex.cancelFilterbox).click()

            //Multiple Funnel Stages filter applied
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.funnelStageFilterLocator).click()
                cy.wait(1000)
            })
            cy.contains('div',multipleSessionTagging.funnelStages[0],{timeout:1000}).parent().should('be.visible').click()
            cy.contains('div',multipleSessionTagging.funnelStages[1],{timeout:1000}).parent().should('be.visible').click()
            cy.get(consumption.vex.funnelStageFilterLocator).should('have.contain', multipleSessionTagging.funnelStages[0])
            cy.get(consumption.vex.funnelStageFilterLocator).should('have.contain', multipleSessionTagging.funnelStages[1])
            cy.get(consumption.vex.cancelFilterbox).click()

            //Verify the sessions after applying the filters
            cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist") 
            cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist") 

            //Persona filter applied
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.personaFilterLocator).click()
                cy.wait(1000)
            })

            cy.contains('div',multipleSessionTagging.personas[1],{timeout:1000}).parent().should('be.visible').click()
            cy.get(consumption.vex.personaFilterLocator).should('have.contain', multipleSessionTagging.personas[1])
            cy.get(consumption.vex.cancelFilterbox).click()
            
            //Verify the sessions after applying the filters
            cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist") 
            cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("not.exist") 

            //Verify if the Select All(a checkbox on top) option is available in the filter dropdown.(checking for any single filter)
            cy.reload()
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.topicFilterLocator).click()
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
                cy.get(consumption.vex.availabilityFilterLocator).click()
                cy.wait(1000)
            })
            cy.get(consumption.vex.filterSearchBox).should("not.exist")
            cy.get(consumption.vex.cancelFilterbox).click()

            //Funnel stage filter 
            cy.contains(consumption.vex.sessionGroup, landingPage.blocks[1].sessionGroup).within(() => {
                cy.get(consumption.vex.funnelStageFilterLocator).click()
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
       
    })