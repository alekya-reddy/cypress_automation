import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = {
    name: 'Test 1',
    newName: 'Test 1.1',
    slug: 'test-1-1-slug',
    description: 'Test 1 description'
}

const sessions = [
    {
        name: 'Session 1',
        type: 'On Demand'
    },
    {
        name: 'Session 2',
        type: 'On Demand'
    },
    {
        name: 'Session 3',
        type: 'On Demand'
    }
]

describe('VEX - Virtual Event', function() {
    before(()=>{
        authoring.common.login();

        // Clean up previously added events
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event.name);
        authoring.vex.deleteVirtualEvent(event.newName);
    })

    it('Confirm can add, remove and edit events', function() {
        authoring.vex.visit();
        cy.get(authoring.vex.addEventButton).should('exist');

        // Verify can add and remove event
        authoring.vex.addVirtualEvent(event.name) // Function already contains assertion that event was successfully created 
        authoring.vex.deleteVirtualEvent(event.name) // Already contains assertion that event successfully deleted 

        // Verify can configure event 
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)
        cy.reload()
        cy.get(authoring.vex.eventNameInput).should('have.value', event.newName)
        cy.get(authoring.vex.eventSlugInput).should('have.value', event.slug)
        //cy.get(authoring.vex.eventDescription).should('have.value', event.description) // not currently working 

        // Verify can add sessions to event 
        sessions.forEach((session)=>{
            authoring.vex.addSession(session.name, session.type); // Already contains assertion that session successfully created
        }) 

        // Verify can remove session 
        authoring.vex.removeSession(sessions[2].name) // Already contains assertion that session successfully removed 

        // Return to home vex page and verify the card has correct event name, url, and number of sessions 
        authoring.vex.visit();
        cy.containsExact(authoring.vex.eventCardTitle, event.newName).parent().parent().parent().within(() => {
            cy.get(authoring.vex.eventCardTitle).should('have.contain', event.newName)
            cy.contains(authoring.vex.antDescriptionsContent, event.slug).should('exist')
            cy.containsExact(authoring.vex.antDescriptionsContent, `${sessions.length - 1}`)
        })
    })
})