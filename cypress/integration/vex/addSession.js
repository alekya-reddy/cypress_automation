import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const event = "addSession.js"
const liveSession = "liveSession"
const start = 'Jun 24, 2000 8:00pm'
const end = 'Jun 24, 2010 8:00pm'
const onDemandSession = "onDemandSession"

describe('VEX - Virtual Event', function() {
    it("Add live session, then add on-demand session", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event) // Clean up from previous runs 
        authoring.vex.addVirtualEvent(event)
        authoring.vex.goToEventConfig(event)

        // Add live session using the modal 
        authoring.vex.goToSessionList()
        cy.get(authoring.vex.addSessionButton).click()
        cy.contains(authoring.vex.antModal, "Add Session").within(()=>{
            cy.get(authoring.vex.sessionNameInput).clear().type(liveSession)
            cy.get(authoring.vex.liveRadio).click()

            //While we're here, check to make sure can't input end date that is before start date
            cy.get(authoring.vex.startTimeInput).click().clear().type(end + "\n")
            cy.get(authoring.vex.endTimeInput).click().clear().type(start + "\n")
            cy.get(authoring.vex.addSessionButton).click()
            cy.contains("must be later than start time").should('exist')

            // Now enter proper start and end dates and proceed with test
            cy.get(authoring.vex.startTimeInput).click().clear().type(start + "\n")
            cy.get(authoring.vex.endTimeInput).click().clear().type(end + "\n")
            cy.get(authoring.vex.addSessionButton).click()
        })
        cy.get(authoring.vex.antModal).should('not.be.visible')
        cy.get(authoring.vex.sessionName(liveSession), {timeout: 10000}).should('exist')

        // Go to live session config to verify it has the correct session type and selected times 
        authoring.vex.goToSessionConfig(liveSession)
        cy.get(authoring.vex.liveRadio).should("have.attr", "checked")
        cy.get(authoring.vex.onDemandRadio).should("not.have.attr", "checked")
        cy.get(authoring.vex.startTimeEditInput(0)).should("have.attr", "title", start)
        cy.get(authoring.vex.endTimeEditInput(0)).should("have.attr", "title", end)

        // Go back and add on-demand session using the modal (on-demand session is the default value selected)
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event)
        authoring.vex.goToSessionList()
        cy.get(authoring.vex.addSessionButton).click()
        cy.contains(authoring.vex.antModal, "Add Session").within(()=>{
            cy.get(authoring.vex.sessionNameInput).clear().type(onDemandSession)
            cy.get(authoring.vex.addSessionButton).click()
        })
        cy.get(authoring.vex.antModal).should('not.be.visible')
        cy.get(authoring.vex.sessionName(onDemandSession), {timeout: 10000}).should('exist')

        // Go to on demand session config to verify it has the correct session type 
        authoring.vex.goToSessionConfig(onDemandSession)
        cy.get(authoring.vex.liveRadio).should("not.have.attr", "checked")
        cy.get(authoring.vex.onDemandRadio).should("have.attr", "checked")
        cy.get(authoring.vex.startTimeEditInput(0)).should('not.exist')
    })
})