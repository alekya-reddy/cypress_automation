import { createAuthoringInstance } from '../../support/pageObject.js';
import { createConsumptionInstance } from '../../support/pageObject.js';

//const authoring = createAuthoringInstance(); 
const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
//const consumption = createConsumptionInstance();
const consumption  = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = {
    event: 'vexRemoval.js',
    slug: 'vexremoval-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; }
}

const contents = [
    'Image - Used by Cypress automation for VEX testing',
    'PDF - Used by Cypress automation for VEX testing',
    'Website - Used by Cypress automation for VEX testing'
]

const sessions = [
    {
        name: 'Youtube',
        supplementalContent: contents,
        visibility: 'Public',
        slug: 'youtube',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Youtube description',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    {
        name: 'Vimeo',
        supplementalContent: contents,
        visibility: 'Public',
        slug: 'vimeo',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Vimeo description',
        type: 'On Demand',
        video: 'Vimeo - Used in Cypress automation for VEX testing'
    }
]

// This test file will verify that removing sessions and events from VEX will also remove from consumption side 
// As of June 5, 2020, this test will fail due to bug where removing session does not remove it from consumption side
describe('VEX - Virtual Event', function() {
    it('Set up an event and then verify it can be seen on consumption side', function() {
        // Toggle on VEX
        authoring.common.login();
        //authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'on');
        //authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');

        // Add event (and delete it if previously added already)
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event.event)
        authoring.vex.addVirtualEvent(event.event)
        authoring.vex.configureEvent(event)

        // Add session and configure sessions
        sessions.forEach((session)=>{
            authoring.vex.visit()
            authoring.vex.goToEventConfig(event.event)
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            //authoring.vex.addSupplementalContent(session.supplementalContent)
        })

        // Now remove one of the sessions
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.event)
        authoring.vex.removeSession(sessions[1].name)

        // Use cy.request to get the body contents - can't visit due to Cypess bug where page is blank on pathfactory domain.
        // Even visiting pathfactory domain in separate it function, then visiting lookbook domain on consumption side would cause consumption to be blank.
        // Can get around this by doing everything on lookbookhq domain, but this requires you to toggle on lookbookhq domain permanently.
        // THis will cause some of our capybara tests to fail. So, gotta toggle it on as needed. However, you cannot toggle on lookbook in the same test file.
        // This is because that requires you to login via pathfactory to switch to lookbook, which means any lookbook consumption you visit subsequently will be blank. 
        // So you have to put the domain switching into a separate file, which will work.... as long as you do that first, then the test, then a file to switch back.
        // EXCEPT that <<<!!!!!CYPRESS!!!!!>>> doesn't support the ability to run tests in a specific order. In fact, many people have complained about this, and 
        // Cypress's response is "that's an anti-pattern, your tests should be self-contained... blah-blah-blah"
        // listen here Cypress, the only reason we gotta separate out this test into separate files is <<<!!!!BECAUSE!!!!!>>>>> of your STUPID software
        // that is FULL of bugs and annoying limitations. Holy crap. No hovering. Can't handle iframes. Blank pages. After hooks don't work. Can't run tests in specific order...
        // So long story short, if your test requires you to visit both authoring and consumption, use cy.request so that you don't have to actually visit the page.
        // Look in the body of the request for whatever you're looking for. This requires you to know what the body is going to look like, so good luck with that. 
        cy.request(event.url).then((response)=>{
            expect(response.body).to.include(`${event.slug}/${sessions[0].slug}`)
            expect(response.body).to.not.include(`${event.slug}/${sessions[1].slug}`)
        })

        cy.request({url: sessions[1].url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })

    })

    it('Delete the event and verify event page is not available', function(){
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.event)
        cy.wait(2000)
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })
    })

    /*it('Afterhook - reset to pathfactory domain and toggle off VEX', ()=>{
        authoring.common.login();
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'off');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off');
    })*/
})