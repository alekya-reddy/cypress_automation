import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'sharedTarget',
    contents: [webContent.title, youtubeContent.title]
};

const targetExplore = {
    name: 'searchandfilter.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'searchandfilter-js',
    filters: "on",
    selectFilters: { 
        topic: true,
        contentType: true, 
        businessUnit: true,
        funnelStage: true,
        persona: true,
        industry: true,
        language:true
    },   
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const filterOptions = [
    {
        filtername: "topic",
        index: ["1"],
        exist: true
    },
    {
        filtername: "content-type",
        index: ["1"],
        exist: true
    },
    {
        filtername: "funnel-stage",
        index: ["1"],
        exist: true
    },
    {
        filtername: "industry",
        index: ["1"],
        exist: true
    },
    {
        filtername: "persona",
        index: ["1"],
        exist: true
    },
    {
        filtername: "business-unit",
        index: ["1"],
        exist: true
    },
    {
        filtername: "language",
        index: ["1"],
        exist: true
    }
]

const htmlEncodeValue="cloud%26computing"

describe("Search and Filters validation - explore page", () => {

    it("Verify applied filters showing as query strings in URL", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(targetExplore.name)
        authoring.explore.addExplore(targetExplore)
        authoring.explore.configureExplore(targetExplore)

        // Verify in consumption
        cy.visit(targetExplore.url)

        filterOptions.forEach((filters) => {
            consumption.explore.SelectFiltersAndVerifyAsQueryStringInURL(filters);
        })

         //Validate HTML Encode
         cy.visit(targetExplore.url +`?topic=${htmlEncodeValue}`)
         cy.url().should('include', `topic=cloud%26computing`)
         cy.contains('span',"Filter By Topic: cloud&computing").should('exist')
    })

})