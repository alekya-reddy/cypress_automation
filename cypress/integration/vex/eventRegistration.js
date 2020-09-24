import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'eventRegistration.js',
    slug: 'eventregistration-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = [
    {
        name: 'on demand',
        slug: '1',
        get url(){
            return `${event.url}/${this.slug}`
        }
    },
    {
        name: 'live upcoming',
        slug: '2',
        get url(){
            return `${event.url}/${this.slug}`
        }
    },
    {
        name: 'live current',
        slug: '3',
        get url(){
            return `${event.url}/${this.slug}`
        }
    },
    {
        name: 'live ended with on demand fallback',
        slug: '5',
        get url(){
            return `${event.url}/${this.slug}`
        }
    }
]

const noForm = { 
    name: "None (Registration Not Required)",
    expectedFormFieldLocators: [consumption.vex.emailInput]
}

const form1 = {
    name: 'eventRegistration.js',
    fields: ["Company"],
    expectedFormFieldLocators: [consumption.vex.emailInput, "#company"]
}

const form2 = {
    name: 'eventRegistration.js2',
    fields: ["First Name", "Last Name", "Email", "Phone"],
    expectedFormFieldLocators: [consumption.vex.firstNameInput, consumption.vex.lastNameInput, consumption.vex.emailInput, "#phone"]
}

/*
Expected behavior for registration:
ALL live sessions will require a form to be filled regardless of whether or not a form is configured.
The only required form field that will always be present is email. This field is required to be filled in - all others can be ignored. 
If a form is added that has this form missing, email field will be present on the consumption side.
If a form is added that has other fields, then these fields should be present on consumption side.

It is possible to automatically fill in the email field by visiting url with query string lb_email=liming%40gmail.com (%40 is encoding for @).
This will negate the need to fill out the form on event page.
If you visit the event/session again in a fresh browser using same email, you will be recognized from before and not be required to register again. 
*/

describe('VEX - Virtual Event Registration', function() {

    beforeEach(()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
    })

    it("Event with no form configured", ()=>{
        authoring.vex.configureForm(noForm)

        cy.visit(event.url)
        cy.get('form').should('not.exist')

        sessions.forEach((session)=>{
            cy.visit(session.url) 

            if(session.name == "live current"){
                // Any live session that has started and not yet ended would require registration regardless of whether or not a form is configured
                cy.get('form').should('exist')
                noForm.expectedFormFieldLocators.forEach((locator)=>{
                    cy.get(locator).should('exist')
                })
            } else {
                cy.wait(1000) // Require hard wait - if move too fast, form could exist but Cypress checks before form is loaded, leading to false pass 
                cy.get('form').should('not.exist')
            }
        })

    })

    it("Event with form - form lacks the required email field. The email field should still show up. Only the email field needs to be filled in", ()=>{
        authoring.vex.configureForm(form1)

        // The form should show up on event page 
        cy.visit(event.url)
        cy.get('form').should('exist')
        form1.expectedFormFieldLocators.forEach((locator)=>{
            cy.get(locator).should('exist')
        })

        // The same form should show up on session pages
        sessions.forEach((session)=>{
            cy.visit(session.url)
            cy.get('form').should('exist')
            form1.expectedFormFieldLocators.forEach((locator)=>{
                cy.get(locator).should('exist') 
            })
        })

        // Only the email field is required to be filled in (so not filling in company field)
        cy.visit(event.url)
        cy.get(consumption.vex.emailInput).clear().type("bobman@gmail.com")
        cy.contains("button", "Submit").click()
        cy.get('form').should('not.exist')

        // Once you fill out the form on event page, don't need to fill it out again for any of the sessions
        sessions.forEach((session)=>{
            cy.visit(session.url)
            cy.wait(1000)
            cy.get('form').should('not.exist')
        })

    })

    it("Event with form - form has the mandatory email field and more", ()=>{
        authoring.vex.configureForm(form2)

        // The form should show up on event page 
        cy.visit(event.url)
        cy.get('form').should('exist')
        form2.expectedFormFieldLocators.forEach((locator)=>{
            cy.get(locator).should('exist')
        })

        // The same form should show up on sessions page
        sessions.forEach((session)=>{
            cy.visit(session.url)
            cy.get('form').should('exist')
            form2.expectedFormFieldLocators.forEach((locator)=>{
                cy.get(locator).should('exist') 
            })
        })

        // If you fill out form on session page, don't need to fill it out again if visiting event page 
        cy.visit(sessions[2].url)
        cy.get(consumption.vex.firstNameInput).clear().type("Bob")
        cy.get(consumption.vex.lastNameInput).clear().type("Man")
        cy.get(consumption.vex.emailInput).clear().type("bobman@gmail.com")
        cy.contains("button", "Submit").click()
        cy.get('form').should('not.exist')

        cy.visit(event.url)
        cy.wait(1000)
        cy.get('form').should('not.exist')
    })

    it("Visiting with lb_email query string should make it unnecessary to fill out form", ()=>{
        cy.visit(event.url)
        cy.get('form').should('exist')

        cy.visit(event.url + `?lb_email=bobman${Math.random()}%40gmail.com`) // Must randomize or else will remember you from previous visit and not ask for name
        cy.wait(1000)     
        cy.get('form').should('not.exist')

        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.name == "live current") {
                cy.wait(1000)
                cy.get('form').should('not.exist')
            }
        })
    })

})