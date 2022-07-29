import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { Configurations } from '../../support/authoringClasses/Configurations.js'
const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' })
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' })
const event = {
    name: "queryString.js",
    slug: "querystring-js",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: 'Vex-QueryString'
}

const event2 = {
    name: "queryString2.js",
    slug: "querystring2-js",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const language = { name: "Vex-QueryString", code: "VQS" }
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
        name: 'Live content',
        slug: 'live-content',
        get url() { return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2021 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'live'
        },
    }
]
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
    topics: ['General Use', 'Aerospace'],
    businessUnits: ['General Use', 'Matrix'],
    personas: ['Automation Persona', 'Test Persona'],
    industry: ['Marketing', 'Test Industry'],
    funnelStages: ['Top of Funnel', 'Middle of Funnel', 'Bottom of Funnel']
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

const filterOptions2 = [
    {
        filtername: "topics",
        index: ["1"],
        exist: true
    }
]

const searchOptions =
{
    searchField: "public",
    exist: true
}

const queryString = "?y=qa";

describe("VEX- Multiple Query strings support on filters for VEX", () => {
    it("Set up Language and VEX if doesn't exist", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.configurations.visit.languages()
                cy.wait(3000) //Using this wait because language sidebar takes time to display all the configured languages 
                authoring.configurations.deleteLanguage(language.name)
                authoring.configurations.addNewLanguage(language)
                authoring.vex.visit();
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                publicSession.forEach((session) => {
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
    it("Verify Filters and Search values are populated in each filter and search field as per multiple query strings supplied in VEX URL on consumption", () => {
        authoring.common.login()
        //Verify blocks when single filter values are given in a query string URL
        cy.visit(event.url + `?topic=${singleSessionTagging.topics}&language=${singleSessionTagging.language}&businessUnit=${singleSessionTagging.businessUnits}`)
        cy.get(consumption.vex.cookieConsent.accept).click()
        cy.get(consumption.vex.topicFilter).should('have.contain', singleSessionTagging.topics)
        cy.get(consumption.vex.businessUnitFilter).should('have.contain', singleSessionTagging.businessUnits)
        cy.get(consumption.vex.languageFilter).should('have.contain', singleSessionTagging.language)
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("not.exist")
        cy.visit(event.url + `?persona=${singleSessionTagging.personas}&funnelStage=${singleSessionTagging.funnelStages}&availability="On Demand"`)
        cy.get(consumption.vex.personaFilter).should('have.contain', singleSessionTagging.personas)
        cy.get(consumption.vex.funnelStageFilter).should('have.contain', singleSessionTagging.funnelStages)
        cy.get(consumption.vex.availabilityFilter).should('have.contain', "On-Demand")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        //Validate if all filters are filled with the multiple values from query strings and the sessions are filtered based on the filters.
        cy.visit(event.url + `?topic=${multipleSessionTagging.topics}&language=${singleSessionTagging.language}&persona=${multipleSessionTagging.personas}`)
        cy.get(consumption.vex.topicFilter).should('have.contain', multipleSessionTagging.topics[0])
        cy.get(consumption.vex.topicFilter).should('have.contain', multipleSessionTagging.topics[1])
        cy.get(consumption.vex.personaFilter).should('have.contain', multipleSessionTagging.personas[0])
        cy.get(consumption.vex.personaFilter).should('have.contain', multipleSessionTagging.personas[1])
        cy.get(consumption.vex.languageFilter).should('have.contain', singleSessionTagging.language)
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        //Validate if the search field is filled with the value from query string search=value and the sessions are filtered based on the search.
        cy.visit(event.url + `?search=${publicSession[1].name}`)
        cy.get(consumption.vex.searchInputField).should('have.value', publicSession[1].name)
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("not.exist")
        //When filter values doesn't matches with contents available 
        cy.visit(event.url + `?language="Hindi"`)
        cy.get(consumption.vex.languageFilter).should('have.contain', "Hindi")
        cy.contains('div', "No results match the search/filter criteria.").should("exist");
    })

    it("Verify Allow for query strings to persist on VEX URL consumption", () => {
        authoring.common.login()

        //Adding Query string to the url and validate that should persist on consumption url
        cy.visit(event.url)
        cy.url().then(url => {
            cy.visit(url + queryString)
        })
        cy.get(consumption.vex.cookieConsent.accept).click()
        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")

        //Clicking on each session and validating added query string persist on URL
        publicSession.forEach(session => {
            cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist").click()
            cy.url().then(url => {
                expect(url).to.contain(queryString);
            })
            cy.go('back');
        })

        //Validate if filters and search query strings are not persisted to session page URLs.
        filterOptions2.forEach((filters) => {
            consumption.vex.SelectFiltersAndVerifyAsQueryStringInURL(filters);
        })
       
        consumption.vex.SearchTextAndVerifyAsQueryStringInURL(searchOptions);

        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist").click()

        cy.url().then(url => {
            expect(url).to.contain(queryString);
        })
       
        cy.url().should('not.include', `search=${searchOptions.searchField}`)
        cy.url().should('not.include', `topic=${filterOptions2[0].filtername}`)

        cy.go('back');
       
        //Applying Filters and verifying query string is persist and Filters functionality should not break
        //Select Filter options and verify applied filters showing as query strings in URL
        filterOptions.forEach((filters) => {
            consumption.vex.SelectFiltersAndVerifyAsQueryStringInURL(filters);
        })

        consumption.vex.SearchTextAndVerifyAsQueryStringInURL(searchOptions);

        cy.url().then(url => {
            expect(url).to.contain(queryString);
        })
        
        //Validation of allow query string to persist in VEX default landing page
        cy.request({ url: event2.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit();
                authoring.vex.addVirtualEvent(event2)
                authoring.vex.configureEvent(event2)
                publicSession.forEach((session) => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event2.name)
                })
            }
        })

        //Adding Query string to the url and validating in consumption page
        cy.visit(event2.url)
        cy.url().then(url => {
            cy.visit(url + queryString)
        })

        cy.contains(consumption.vex.sessionCardTitle, publicSession[1].name).should("exist")
        cy.contains(consumption.vex.sessionCardTitle, publicSession[0].name).should("exist")

        //Clicking on each session and validating added query string persist on URL
        publicSession.forEach(session => {
            cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist").click()
            cy.url().then(url => {
                expect(url).to.contain(queryString);
            })
            cy.go('back');
        })
    })
})