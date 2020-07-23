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
    /*{
        name: 'live ended',
        slug: '4',
        get url(){
            return `${event.url}/${this.slug}`
        }
    },*/
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
    expectedFormFieldLocators: [consumption.vex.firstNameInput, consumption.vex.lastNameInput, consumption.vex.emailInput]
}

const form1 = {
    name: 'eventRegistration.js',
    fields: ["Company"],
    expectedFormFieldLocators: [consumption.vex.firstNameInput, consumption.vex.lastNameInput, consumption.vex.emailInput, /*"#company"*/]
}

const form2 = {
    name: 'eventRegistration.js2',
    fields: ["First Name", "Last Name", "Email", "Phone"],
    expectedFormFieldLocators: [consumption.vex.firstNameInput, consumption.vex.lastNameInput, consumption.vex.emailInput, /*"#phone"*/]
}

/*
Expected behavior for registration:
ALL live sessions will require a form to be filled regardless of whether or not a form is configured.
ALL on-demand sessions will NOT require a form to be filled regardless of whether or not a form is configured.
The 3 required form fields that will always be present are first name, last name and email. Only these 3 fields are required to be filled in - all others can be ignored. 
If a form is added that has any of those 3 fields missing, those fields will be present on the consumption side.
If a form is added that has fields other than those 3 standard fields, then these fields should be present on consumption side.

It is possible to automatically fill in the email field by visiting url with query string lb_email=liming%40gmail.com (%40 is encoding for @).
This will negate the need to fill out the form on event page. You will still have to fill out form on session page, but email field will be omitted. 
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
                // Any live session would require registration regardless of whether or not a form is configured
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

    it("Event with form - form lacks the 3 mandatory fields. The 3 fields should still show up. Only the 3 required fields need to be filled in", ()=>{
        authoring.vex.configureForm(form1)

        // The form should show up on event page 
        cy.visit(event.url)
        cy.get('form').should('exist')
        form1.expectedFormFieldLocators.forEach((locator)=>{
            cy.get(locator).should('exist')
        })

        // The same form should show up on LIVE sessions page - on demand never require forms 
        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.name == "live current") {
                cy.get('form').should('exist')
                form1.expectedFormFieldLocators.forEach((locator)=>{
                    cy.get(locator).should('exist') // Currently there's a bug where only the 3 mandatory fields will show up 
                })
            } else {
                cy.wait(1000)
                cy.get('form').should('not.exist')
            }
        })

        // Only the 3 mandatory fields are required to be filled in (so not filling in company field)
        cy.visit(event.url)
        cy.get(consumption.vex.firstNameInput).clear().type("Bob")
        cy.get(consumption.vex.lastNameInput).clear().type("Man")
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

    it("Event with form - form has the 3 mandatory fields and more", ()=>{
        authoring.vex.configureForm(form2)

        // The form should show up on event page 
        cy.visit(event.url)
        cy.get('form').should('exist')
        form2.expectedFormFieldLocators.forEach((locator)=>{
            cy.get(locator).should('exist')
        })

        // The same form should show up on LIVE sessions page - on demand never require forms 
        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.name == "live current") {
                cy.get('form').should('exist')
                form1.expectedFormFieldLocators.forEach((locator)=>{
                    cy.get(locator).should('exist') // Currently there's a bug where only the 3 mandatory fields will show up 
                })
            } else {
                cy.wait(1000)
                cy.get('form').should('not.exist')
            }
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

    it("Visiting with lb_email query string should make it unnecessary to fill out form on event page. On session page, email field does not need to be filled.", ()=>{
        cy.visit(event.url)
        cy.get('form').should('exist')

        cy.visit(event.url + "?lb_email=bobman2%40gmail.com")   
        cy.wait(1000)     
        cy.get('form').should('not.exist')

        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.name == "live current") {
                form2.expectedFormFieldLocators.forEach((locator)=>{
                    if(locator !== consumption.vex.emailInput){
                        cy.get(locator).should('exist') 
                    } else {
                        cy.get(locator).should('not.exist')
                    }
                })
            } else {
                cy.wait(1000)
                cy.get('form').should('not.exist')
            }
        })
    })

})