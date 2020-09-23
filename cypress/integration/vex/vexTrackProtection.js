import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexTrackProtection.js',
    slug: 'vextrackprotection-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const tp1 = {group: "vexTrackProtection1", allowedEmail: "random@pathfactory.com"}
const tp2 = {group: "vexTrackProtection2", allowedEmail: "jimjam@haha.com"}

describe("VEX - Track Protection", ()=>{
    it("Add, remove groups for track protection", ()=>{
        // Set up
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)

        // Test adding and removing track protection
        authoring.vex.addTrackProtection([tp1.group, tp2.group, "Default"])
        authoring.vex.removeTrackProtection("Default")
        cy.contains("button", "Save").click()
        cy.contains("The record was saved successfully.").should('exist')
        cy.wait(2)
    })

    it("Visit event page on consumption side and verify that it asks for email", ()=>{
        cy.visit(event.url)
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        cy.contains("Email confirmation is required").should("exist")
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("not_allowed@gmail.com\n")
        cy.contains("Email is not authorized, please try again.").should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type(tp1.allowedEmail + "\n")
        cy.contains("Success! An email has been sent").should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type(tp2.allowedEmail + "\n")
        cy.contains("Success! An email has been sent").should('exist')

        // Not going into actual email to check - this is too much of a pain, especially with gmail 
        // Mailinator is more doable, but the wait time for the email to arrive in inbox makes the test very flaky 
        // This aspect of testing should be done manually 
        // If a form is configured for the session, clicking the emailed link should register you for the session with your email 
    })
})