import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = {
    name: 'Test 1',
    newName: 'Test 1.1',
    slug: 'test-1-1-slug',
    description: 'Test 1 description',
    externalID: "someID"
}

const event2 = {
    name: "Test 2",
    slug: "cannot-change-me"
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

        // Verify can add event
        authoring.vex.addVirtualEvent(event.name) // Function already contains assertion that event was successfully created 

        // Verify that you cannot add an event with same name as existing one 
        authoring.vex.addVirtualEvent(event.name, ()=>{
            // If event has duplicate name, then this callback will be invoked 
            cy.contains(authoring.vex.antModalBody, "has already been taken").should('exist')
            cy.contains('button', 'Cancel').click()
            cy.get(authoring.vex.antModalBody).should('not.be.visible')
            cy.containsExact(authoring.vex.eventCardTitle, event.name).should('have.length', 1)
        })

        // Verify can delete an event 
        authoring.vex.deleteVirtualEvent(event.name) // Already contains assertion that event successfully deleted 

        // Verify can configure event 
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)
        cy.reload()
        cy.get(authoring.vex.eventNameInput).should('have.value', event.newName)
        cy.get(authoring.vex.eventSlugInput).should('have.value', event.slug)
        cy.get(authoring.vex.eventDescription).should('have.value', event.description) 
        cy.get(authoring.vex.externalIDInput).should("have.value", event.externalID)

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

        // Add another event and check the validation for event slug 
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.addVirtualEvent(event2.name)
        authoring.vex.goToEventConfig(event2.name)
        cy.get(authoring.vex.eventSlugInput).clear().type(event.slug)
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.saveFailed).should('exist')
        cy.contains(authoring.vex.messages.duplicateEntry).should('exist')

        // Not testing here, but when you enter blank event slug, it auto-generates a valid slug 
        // Not testing here, but any invalid event slug input that is not a duplicate, it would auto-generate a valid slug 
    })
})