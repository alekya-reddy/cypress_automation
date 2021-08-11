import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { Configurations } from '../../support/authoringClasses/Configurations.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: "vexQueryString.js",
    slug: "vexquerystring-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: 'Vex-QueryString'
}
const language = {name: "Vex-QueryString", code: "VQS"}
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
    const singleSessionTagging = {
        sessionName: publicSession[1].name,
        language: 'Vex-SearchAndFilter',
        topics: ['Aerospace'],
        businessUnits: ['Product'],
        personas: ['Automation Persona'],
        industry: ['Marketing'],
        funnelStages: ['Top of Funnel']
    }
    const multipleSessionTagging = {
        sessionName: publicSession[0].name,
        language: 'Vex-SearchAndFilter',
        topics: ['General Use','Aerospace'],
        businessUnits: ['General Use','Matrix'],
        personas: ['Automation Persona','Test Persona'],
        industry: ['Marketing','Test Industry'],
        funnelStages: ['Top of Funnel','Middle of Funnel','Bottom of Funnel']
    }
    describe("VEX- Multiple Query strings support on filters for VEX", () => {
        it("Set up Language and VEX if doesn't exist", ()=>{
            cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
                if(response.status == 404){
                    authoring.common.login()
                    authoring.configurations.visit.languages()
                    cy.wait(3000) //Using this wait because language sidebar takes time to display all the configured languages 
                    authoring.configurations.deleteLanguage(language.name)
                    authoring.configurations.addNewLanguage(language) 
                    authoring.vex.visit();
                    authoring.vex.deleteVirtualEvent(event.name)
                    authoring.vex.addVirtualEvent(event)
                    authoring.vex.configureEvent(event)
                    publicSession.forEach((session)=>{
                        authoring.vex.addSession(session.name)
                        authoring.vex.configureSession(session)
                        authoring.vex.backToEvent(event.name)
                    })
                    authoring.vex.configureSessionTagging(singleSessionTagging)
                    authoring.vex.configureSessionTagging(multipleSessionTagging)
                    authoring.vex.addSearchAndFilterOptions(searchAndFilterOptions)
                    authoring.vex.saveSearchAndFiltersSettings();
                    authoring.vex.goToLandingPage() 
                    authoring.vex.deleteLandingPages(landingPage.name)
                    authoring.vex.addLandingPages(landingPage.name)
                    authoring.vex.editLandingPage(landingPage)
                    authoring.vex.setToHomePage(landingPage.name)
                    authoring.vex.goToPageEditor(landingPage.name)
                    authoring.vex.addAdvancedBlock(landingPage.blocks[0])
                    cy.contains('button', 'Save').click(); 
                }
            }) 
        }) 
        it("VEX Consumption:Pass Filters and Search values as a Query String parameter in VEX URL", ()=>{
            authoring.common.login()
           //Verify blocks when single filter values are given in a query string URL
            cy.visit(event.url + `?topic=${singleSessionTagging.topics}&language=${singleSessionTagging.language}&businessUnit=${singleSessionTagging.businessUnits}`)
            cy.get(consumption.vex.topicFilterLocator).should('have.contain', singleSessionTagging.topics)
            cy.get(consumption.vex.businessUnitFilterLocator).should('have.contain', singleSessionTagging.businessUnits)
            cy.get(consumption.vex.languageFilter).should('have.contain', singleSessionTagging.language)
            cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist") 
            cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("not.exist") 
            //Validate if all filters are filled with the multiple values from query strings and the sessions are filtered based on the filters.
            cy.visit(event.url + `?topic=${multipleSessionTagging.topics}&language=${singleSessionTagging.language}&persona=${multipleSessionTagging.personas}`)
            cy.get(consumption.vex.topicFilterLocator).should('have.contain', multipleSessionTagging.topics[0])
            cy.get(consumption.vex.topicFilterLocator).should('have.contain', multipleSessionTagging.topics[1])
            cy.get(consumption.vex.personaFilterLocator).should('have.contain', multipleSessionTagging.personas[0])
            cy.get(consumption.vex.personaFilterLocator).should('have.contain', multipleSessionTagging.personas[1])
            cy.get(consumption.vex.languageFilter).should('have.contain', singleSessionTagging.language)
            cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist") 
            cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist") 
            //Validate if the search is filled the value from query string search=value and the sessions are filtered based on the search.
            cy.visit(event.url + `?search=${publicSession[1].name}`)
            cy.get(consumption.vex.searchInputField).should('have.value',publicSession[1].name)
            cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist") 
            cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("not.exist")
            //When filter values doesn't matches with contents available 
            cy.visit(event.url + `?language="Hindi"`)
            cy.get(consumption.vex.languageFilter).should('have.contain', "Hindi")
            cy.contains('div', "No results match the search/filter criteria.").should("exist");
        })
    })