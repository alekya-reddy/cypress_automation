import { createAuthoringInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'default', tld: "pathfactory", username: "liming", password: "Password123"});
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
        //cy.visit("https://automation-vex.staging2.lookbookhq.com/livesessionconfiguration-js") // works
        //cy.visit("https://automation-vex.pathfactory-staging.com/livesessionconfiguration-js") // doesn't work 
        //cy.visit("https://automation-vex.qa.lookbookhq.com/livesessionconfiguration-js") // works
        //cy.visit("https://automation-vex.pathfactory-qa.com/livesessionconfiguration-js") // doesn't work
        //cy.visit("https://automation-vex.pathfactory.com/livesessionconfiguration-js") // doesn't work
        //cy.visit("https://automation-vex.lookbookhq.com/livesessionconfiguration-js") // doesn't work - works now - just need https enabled
        //cy.visit("https://default.staging2.lookbookhq.com/l/limingexplore2") // works 
        //cy.visit("http://pathfactory-staging-wp.com/wordpress/staging-web-promoter-testing/") // doesn't work 
        //cy.visit("https://internal.lookbookhq.com/1/luciaaaa") // works 
        //cy.visit("https://internal.lookbookhq.com/l/limingexplore") // works 
        //cy.visit("https://internal.lookbookhq.com/c/abm-is-b2b-truth-5?x=lWMqTn")
        //cy.visit("https://automation-vex.lookbookhq.com/c/index-html?x=kpMsxq") // doesn't work - need to enable https? - yes, need https
        //cy.visit("https://automation-vex.lookbookhq.com/c/njgzzk8yvzgylw4oe4hl?x=nEdySZ") // doesn't work - need to enable https? - yes, need https
    })

})