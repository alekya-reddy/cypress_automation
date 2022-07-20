import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = {
    name: '3 addRemoveEditEvents.js',
    newName: 'newName addRemoveEditEvents.js',
    editedName: 'edited addRemoveEditEvents.js',
    slug: 'test-1-1-slug',
    externalID: "someID"
}

const event2 = {
    name: "4 addRemoveEditEvents.js",
    slug: "cannot-change-me"
}

const event0 = {
    name: "5 addRemoveEditEvents.js",
    parentFolder: "folder2"
}

const event3 = {
    name: "deleteEvent1.js"
}

const event4 = {
    name: "deleteEvent2.js"
}

const event5 = {
    name: "deleteEvent3.js"
}

const folder = {
    name: "Folder2"
}

const rootFolder = {
    name: "Root"
}

const folder2 = {
    name: "drag&drop"
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
        cy.get(authoring.vex.eventNameInput,{timeout:15000}).should('have.value', event.newName)
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
        cy.contains("span", folder.name,{timeout:10000}).click()
        authoring.vex.deleteVirtualEvent(event0.name)
        authoring.vex.addVirtualEvent(event0)
        cy.go("back")
         
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('2')
        })

        cy.contains('td', event0.name).prev().click()
        cy.contains("a", event0.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",folder2.name,{timeout:10000}).trigger("drop").trigger("dragend")
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('1')
        }) 

        cy.contains("span", folder2.name,{timeout:10000}).click()
        cy.contains('td', event0.name).prev().click()
        cy.contains("a", event0.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",folder.name,{timeout:10000}).trigger("drop").trigger("dragend") 
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('2')
        })

     })
     it('Verify Delete Option For Multi-Select', function() {
        authoring.common.login();
        authoring.vex.visit();
        authoring.vex.addVirtualEvent(event3)
        authoring.vex.addVirtualEvent(event4)
        authoring.vex.addVirtualEvent(event5)
        cy.go("back")
        cy.contains('td', event3.name).prev().click()
        cy.contains('td', event4.name).prev().click()
        cy.contains('td', event5.name).prev().click()
        cy.contains('h5', " Select: ").should("exist")
        cy.contains('h5', "3").should("exist")
        cy.contains('button', " Delete").should("exist").click()
        cy.get(authoring.common.modalBody).within(()=>{
            cy.contains('span', "Yes").should("exist").click()
        })
        cy.contains('td', event3.name).should("not.exist")
        cy.contains('td', event4.name).should("not.exist")
        cy.contains('td', event5.name).should("not.exist")

     })
          
})