import { createAuthoringInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'newqa', customBaseUrl: "https://newqa.pathfactory-qa.com/", username: "liming", password: "Password123"});
//const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}) 

describe("Testing lab - Use this spec file to test out new techniques, or to help troubleshoot... whatever you want", ()=>{
    /*it("Test scrolling within content library", ()=>{
        authoring.common.login()
        cy.scrollIntoViewWithin({
            scroller: 'div[class*="table-body-container"]',
            element: 'div[data-qa-hook="table-cell-internal-title"]',
            text: "Myrbetriq",
            increment: 2
        })
        cy.containsExact('div[data-qa-hook="table-cell-internal-title"]', "Myrbetriq").should('exist')
    })*/

    /*it("Test scrolling within timezone picker in VEX", ()=>{
        let timeZones = [
            '(GMT+13:00) Tokelau Is.',
            '(GMT-05:00) Eastern Time (US & Canada)'
        ]
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig("test lab")
        authoring.vex.goToSessionConfig("test time zone")
        authoring.vex.configureLive({timeZone: timeZones[1]})
    })*/

    /*it("Test xhr request reading", ()=>{
        cy.server()
        //cy.route('POST', 'https://spcollector.pathfactory-development.com/com.snowplowanalytics.snowplow/tp2').as('tp2')
        cy.route("GET", "https://content-upload-test2.glitch.me/dreams").as("dreams")
        cy.visit("https://content-upload-test2.glitch.me/")
        //cy.wait('@tp2')
        cy.wait("@dreams")
        cy.get('@tp2').then((xhr)=>{
            expect(xhr.status).to.eq(200)
            cy.log(xhr.requestBody)
        })
    })*/

    it("should always pass", ()=>{
        cy.visit("https://www.google.com")
    })

})