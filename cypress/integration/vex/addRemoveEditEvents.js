import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = {
    name: '1 addRemoveEditEvents.js',
    newName: 'newName addRemoveEditEvents.js',
    slug: 'test-1-1-slug',
    externalID: "someID"
}

const event2 = {
    name: "2 addRemoveEditEvents.js",
    slug: "cannot-change-me"
}

const folder = {
    name: "Folder2"
}

const rootFolder = {
    name: "Root"
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

    it('Confirm can add, remove and edit events', function() {
        // Set up
        authoring.common.login();
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event.name);
        authoring.vex.deleteVirtualEvent(event.newName);

        // Go to Vex
        authoring.vex.visit();
        cy.get(authoring.vex.addEventButton).should('exist');

        // Verify can add event
        authoring.vex.addVirtualEvent(event) // Function already contains assertion that event was successfully created 

        // Verify that you cannot add an event with same name as existing one 
        authoring.vex.addVirtualEvent(event,false)
        cy.contains(authoring.vex.antModal, "has already been taken").should('exist')
        cy.contains('button', 'Cancel').click()
        cy.get(authoring.vex.antModal).should('not.be.visible')
        cy.containsExact(authoring.vex.eventCardTitle, event.name).should('have.length', 1)

        // Verify can delete an event 
        authoring.vex.deleteVirtualEventWithTrashIcon(event.name)// Already contains assertion that event successfully deleted 

        // Verify can configure event 
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)
        cy.reload()
        cy.get(authoring.vex.eventNameInput).should('have.value', event.newName)
        cy.get(authoring.vex.eventSlugInput).should('have.value', event.slug)
        cy.get(authoring.vex.externalIDInput).should("have.value", event.externalID)

        // Verify can add sessions to event 
        sessions.forEach((session)=>{
            authoring.vex.addSession(session.name, session.type); // Already contains assertion that session successfully created
        }) 

        // Verify can remove session 
        authoring.vex.removeSession(sessions[2].name) // Already contains assertion that session successfully removed 

        // Add another event and check the validation for event slug 
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.addVirtualEvent(event2)
        authoring.vex.goToEventConfig(event2.name)
        cy.get(authoring.vex.eventSlugInput, {timeout: 10000}).clear().type(event.slug)
        cy.contains("button", "Save").click()
        cy.contains(authoring.vex.messages.saveFailed).should('exist')
        cy.contains(authoring.vex.messages.duplicateEntry).should('exist')

        // Not testing here, but when you enter blank event slug, it auto-generates a valid slug 
        // Not testing here, but any invalid event slug input that is not a duplicate, it would auto-generate a valid slug 
    })
       
       it('Confirm can drag and drop events to folder and root folder available as a option', function() {
        authoring.common.login();
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event)
        authoring.vex.editfolder(event.name)
        cy.contains("span","Save Folder").should("exist").click()

        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('1')
        })

        cy.contains('td', event.name).prev().click()
        cy.contains("a", event.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",folder.name,{timeout:10000}).trigger("drop").trigger("dragend")
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('2')
        }) 

        cy.contains("span", folder.name,{timeout:10000}).click()
        cy.contains("a", event.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",rootFolder.name,{timeout:10000}).trigger("drop").trigger("dragend") 
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('1')
        })

     })
})