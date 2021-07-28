import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'webex.js',
    slug: 'webex-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: "webex",
    slug: "webex",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: 'Jun 24, 2020 8:00pm',
        end: 'Jun 24, 2041 8:00pm',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Webex',
        webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
    },
    contents: [
        'PDF - Used by Cypress automation for VEX testing',
        'Website - Used by Cypress automation for VEX testing',
        'Image - Used by Cypress automation for VEX testing'
    ]
}

const contentSource = authoring.common.env.orgs['automation-vex'].resources

// Test that we can configure and visit a webex event 
describe('VEX - Webex', function() {
    it('Test webex set up on authoring side', function() {
        // Set up the webex session
        authoring.common.login()
        authoring.vex.visit() 
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)
        authoring.vex.addSession(session.name)
        authoring.vex.configureSession(session)

        // A UI check to make sure webex link input shows up only when webex option is selected
        cy.get(authoring.vex.liveTypePicker).click()
        cy.get(authoring.vex.antDropdownContainer).within(()=>{
            cy.get(authoring.vex.selectOption("Zoom")).click()
        })
        cy.get(authoring.vex.webexLinkInput).should("not.exist")
        cy.get(authoring.vex.liveTypePicker).click()
        cy.get(authoring.vex.antDropdownContainer).within(()=>{
            cy.get(authoring.vex.selectOption("Webex")).click()
        })
        cy.get(authoring.vex.webexLinkInput).should('exist')
    })

    it('Verify on consumption side that webex can be viewed', function(){
        cy.visit(session.url)

        // Fill out the registration form to get rid of it 
        cy.get(consumption.vex.emailInput).clear().type("bobman@gmail.com")
        cy.contains("button", "Submit").click()

        // Now check that the webex has loaded onto the dom and that correct meeting url is used 
        consumption.vex.expectWebex(session.live.webexLink)
        cy.contains("a", "Click here to launch the meeting directly.").should('exist').should("have.attr", "href", session.live.webexLink)

        // Cycle through the webex session's content to make sure they display and that webex iframe still exists
        session.contents.forEach((content)=>{
            cy.contains('a', content).should('exist').click()
            cy.get('iframe').should('have.length', 2)
            cy.get(`iframe[src="${contentSource[content][authoring.common.env.TEST_ENV]}"]`).should('exist')
        })

        // Close the supplemental content and verify that only the zoom webex is still open
        cy.get(consumption.vex.closeContentButton).click()
        cy.get('iframe').should('have.length', 1)
        cy.getIframeBody("iframe").within(()=>{
            cy.get(`h2:contains('${session.live.webexLink}')`).should('exist')
        })

    })
})