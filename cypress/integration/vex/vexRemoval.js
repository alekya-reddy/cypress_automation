import { createAuthoringInstance } from '../../support/pageObject.js';
import { createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption  = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = {
    name: 'vexRemoval.js',
    slug: 'vexremoval-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; }
}

const sessions = [
    {
        name: 'Youtube',
        visibility: 'Public',
        slug: 'youtube',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Youtube description',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    {
        name: 'Vimeo',
        visibility: 'Public',
        slug: 'vimeo',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Vimeo description',
        type: 'On Demand',
        video: 'Vimeo - Used in Cypress automation for VEX testing'
    }
]

// This test file will verify that removing sessions and events from VEX will also remove from consumption side 
describe('VEX - Virtual Event', function() {
    it('Set up an event and then verify it can be seen on consumption side', function() {
        authoring.common.login();

        // Add event (and delete it if previously added already)
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)

        // Add session and configure sessions
        sessions.forEach((session)=>{
            authoring.vex.visit()
            authoring.vex.goToEventConfig(event.name)
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
        })

        // Now remove one of the sessions
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.removeSession(sessions[1].name)

        // Visit the consumption page and verify that the removed session isn't accessible 
        cy.visit(event.url)
        cy.containsExact(consumption.vex.sessionCardTitle, sessions[0].name).should('exist')
        cy.containsExact(consumption.vex.sessionCardTitle, sessions[1].name).should('not.exist')

        cy.request({url: sessions[1].url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })

    })

    it('Delete the event and verify event page is not available', function(){
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        cy.wait(2000)
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })
    })
})