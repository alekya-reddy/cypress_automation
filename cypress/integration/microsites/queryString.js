import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';
const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})
const microsite = {
    name: "queryString.js",
    slug: "querystring-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },  
}
const target = {
    name: "Target 2 Shared Resource",
    slug: "target-2-shared-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-1 Shared Resource", "Wiki-2 Shared Resource", "Wiki-3 Shared Resource","Wiki-4 Shared Resource","Wiki-5 Shared Resource","Wiki-6 Shared Resource"]
}
const filterValues = {
    language: 'Arabic',
    topics: ['Canada','Custom Topic'],
    contentTypes: ['Article','Blog Post'],
    businessUnits: ['BUautomation'],
    personas: ['automation','automation2'],
    funnelStages: ['Top of Funnel'],
    industries: ['Automation Industry']
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
        {
            id: "Target Block Grid",
            type: "track",
            track: target.name,
            titleOverride: "Track Grid",
            layout: "Grid",
            expectContents: target.contents
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
            toggle: true
        }
    ]

describe("Microsites: Multiple Query strings support on filters for Microsite", () => {
    it("Set up Microsites if doesn't exist", ()=>{
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.microsites.removeMicrosite(microsite.name)
                authoring.microsites.addMicrosite(microsite)  
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({target: target.name})
                authoring.microsites.addSearchAndFilterOptions(searchAndFilterOptions);
                authoring.microsites.saveSearchAndFiltersSettings();
                authoring.microsites.tabToLandingPages()
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)  
            }
        }) 
    }) 
    // NOTE : The assets mentioned in target.contents block above are configured with the needed content tags(filterValues) manually. Need to make sure that this test data setup is correct,if test fails
    it("Verify Filters and Search values are populated in each filter and search field as per multiple query strings supplied in Microsite URL on consumption", ()=>{
        authoring.common.login() 
        //Verify blocks when single filter values are given in a query string URL
        cy.visit(landingPage.url + `?funnelStage=${filterValues.funnelStages}&businessUnit=${filterValues.businessUnits}&industry=${filterValues.industries}&language=${filterValues.language}`)
        cy.get(consumption.microsites.funnelStageFilter).should('have.contain', filterValues.funnelStages)
        cy.get(consumption.microsites.businessUnitFilter).should('have.contain', filterValues.businessUnits)
        cy.get(consumption.microsites.industryFilter).should('have.contain', filterValues.industries)
        cy.get(consumption.microsites.languageFilter).should('have.contain', filterValues.language)
        cy.contains(consumption.microsites.cardTitle, target.contents[5]).should("exist")  
        //Validate if all filters are filled with the multiple values from query strings and the contents are filtered based on the filters.
        cy.visit(landingPage.url + `?topic=${filterValues.topics}&contentType=${filterValues.contentTypes}`)
        cy.get(consumption.microsites.topicFilter).should('have.contain', filterValues.topics[0])
        cy.get(consumption.microsites.topicFilter).should('have.contain', filterValues.topics[1])
        cy.get(consumption.microsites.contentTypeFilter).should('have.contain', filterValues.contentTypes[0])
        cy.get(consumption.microsites.contentTypeFilter).should('have.contain', filterValues.contentTypes[1])
        cy.contains(consumption.microsites.cardTitle, target.contents[4]).should("exist") 
        cy.contains(consumption.microsites.cardTitle, target.contents[5]).should("exist") 
        //Validate if the search field is filled with the value from query string search=value and the contents are filtered based on the search
        cy.visit(landingPage.url + `?search=${target.contents[2]}`)
        cy.get(consumption.microsites.searchInput).should('have.value',target.contents[2])
        //When filter values doesn't matches with contents available 
        cy.visit(landingPage.url + `?language="Hindi"`)
        cy.get(consumption.microsites.languageFilter).should('have.contain', "Hindi")
        cy.contains('div', "No results match the search/filter criteria.").should("exist");
    })   
})

