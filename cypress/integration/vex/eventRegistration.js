import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'eventRegistration.js',
    slug: 'eventregistration-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get registrationUrl(){
        return `${authoring.common.baseUrl}/${this.slug}/register`
    },
    form: { 
        name: 'eventRegistration.js',
        title: 'Event Registration',
        message: 'You must register before attending the session'
    },
    sessionName: 'Youtube',
    sessionSlug: 'youtube',
    get sessionUrl(){
        return `${this.url}/${this.sessionSlug}`
    }
}

describe('VEX - Virtual Event', function() {
    it('Test event registration setup on authoring side', function() {
        authoring.common.login()
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)

        // Select a form and enter it details, then refresh and verify details got saved 
        authoring.vex.configureForm(event.form)
        cy.reload()
        cy.containsExact(authoring.vex.antSelectItem, event.form.name).should('exist')
        cy.get(authoring.vex.eventFormTitle).should('have.value', event.form.title)
        cy.get(authoring.vex.eventFormMessage).should('have.value', event.form.message)

        // Go to the event page on consumption side and try to enter a session (should ask you to fill form). Form details should be correct. 
        cy.visit(event.url)
        cy.containsExact(consumption.vex.eventSessionTitle, event.sessionName).click() // You can get to session by clicking its card
        cy.url().should('eq', event.registrationUrl)
        cy.containsExact('a', event.name).click() // This link at the top should take you back to event page 
        cy.url().should('eq', event.url)
        cy.visit(event.sessionUrl) // You can also visit session by entering url directly 
        cy.url().should('eq', event.registrationUrl)
        cy.containsExact(consumption.vex.eventFormTitle, event.form.title).should('exist')
        cy.containsExact(consumption.vex.eventFormMessage, event.form.message).should('exist')

        // After filling out form, should be able to access session freely without having to refill form 
        cy.get('#firstName').clear().type('Joe')
        cy.contains('button', 'Submit').click()
        cy.url().should('eq', event.sessionUrl)
        cy.visit(event.url)
        cy.visit(event.sessionUrl) 
        cy.url().should('eq', event.sessionUrl)    
    })

    // Note: when executing the commands in another 'it' function, cookies etc are cleared so form fill in previous 'it' function won't carry over 
    it('Turn off registration and verify that form is not required on consumption side', function(){
        // Verify that form is still required when attempting to access session (as a new visitor, i.e. all cookies cleared)
        cy.visit(event.sessionUrl)
        cy.url().should('eq', event.registrationUrl)

        // Go back to authoring and turn off form 
        authoring.common.login() 
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm({name: authoring.vex.noRegistrationNeededOption, title: '', message: ''})

        // Go to consumption and verify no form needed 
        cy.visit(event.sessionUrl)
        cy.url().should('eq', event.sessionUrl)
    })
})