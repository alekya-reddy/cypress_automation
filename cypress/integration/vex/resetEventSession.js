import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 

const originalEvent = {
    name: 'Reset test',
    slug: 'reset',
    description: 'Reset event',
    form: {
        name: 'resetEventSession.js',
        title: 'Form title',
        message: 'form message'
    }
}

const newEvent = {
    name: 'Reset test',
    newEventName: 'Different name',
    slug: 'differentslug',
    description: 'Different description',
    form: {
        name: authoring.vex.noRegistrationNeededOption,
        title: '',
        message: ''
    }
}

const originalSession = {
    name: "Reset session",
    slug: "resetsession",
    visibility: 'Public',
    description: 'Session description',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const newSession = {
    name: "Reset session",
    newName: "New Session Name",
    slug: "newsessionslug",
    visibility: 'Private',
    description: 'New description',
    type: 'Live',
    video: 'Vimeo - Used in Cypress automation for VEX testing'
}


describe('VEX - Virtual Event', function() {
    it('Test the reset button in the event and session configuration pages', function() {
        // Login, clean up 
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.deleteVirtualEvent(originalEvent.name)

        // Set up an event 
        authoring.vex.addVirtualEvent(originalEvent.name)
        authoring.vex.configureEvent(originalEvent)

        // Reset button should be disabled as there are no changes since last save 
        cy.get(authoring.vex.resetButton).should('be.disabled')

        // Now change all event details (name, slug, description, form details), do not save, and then reset 
        cy.get(authoring.vex.eventNameInput).clear().type(newEvent.newEventName)
        cy.get(authoring.vex.eventSlugInput).clear().type(newEvent.slug)
        cy.get(authoring.vex.eventDescription).clear().type(newEvent.description)

        cy.get(authoring.vex.eventFormPicker).parent().parent().click()
        cy.get(authoring.vex.antDropdownContainer).within(()=>{
            cy.get(authoring.vex.antDropdownOption(newEvent.form.name)).click()
        })
        cy.get(authoring.vex.eventFormTitle).clear()
        cy.get(authoring.vex.eventFormMessage).clear()

        cy.get(authoring.vex.resetButton).should('not.be.disabled').click() 

        // Now verify all details back to original 
        cy.get(authoring.vex.eventNameInput).should('have.value', originalEvent.name)
        cy.get(authoring.vex.eventSlugInput).should('have.value', originalEvent.slug)
        cy.get(authoring.vex.eventDescription).should('contain', originalEvent.description)
        cy.containsExact(authoring.vex.antSelectItem, originalEvent.form.name).should('exist')
        cy.get(authoring.vex.eventFormTitle).should('have.value', originalEvent.form.title)
        cy.get(authoring.vex.eventFormMessage).should('have.value', originalEvent.form.message)

        // Now add a session and set it up 
        authoring.vex.addSession(originalSession.name)
        authoring.vex.configureSession(originalSession)
        cy.get(authoring.vex.resetButton).should('be.disabled')

        // Change all session details but don't save, then reset 
        cy.get(authoring.vex.sessionNameInput).clear().type(newSession.newName)
        cy.get(authoring.vex.privateRadio).click()
        cy.get(authoring.vex.sessionSlugInput).clear().type(newSession.slug)
        cy.get(authoring.vex.sessionDescriptionInput).clear().type(newSession.description)
        cy.get(authoring.vex.liveRadio).click()
        authoring.vex.pickOnDemandVideo(newSession.video)
        cy.get(authoring.vex.resetButton).should('not.be.disabled').click()

        // Now verify all session details are back to the original values 
        cy.get(authoring.vex.sessionNameInput).should('have.value', originalSession.name)
        cy.get(authoring.vex.publicRadio).parent().should('have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.privateRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.sessionSlugInput).should('have.value', originalSession.slug)
        cy.get(authoring.vex.sessionDescriptionInput).should('contain', originalSession.description)
        cy.get(authoring.vex.onDemandRadio).parent().should('have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.liveRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.onDemandTitleLocator).should('contain', originalSession.video)
    })
})