import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexFormWebhook.js',
    slug: 'vexformwebhook-js',
    form: {name: 'vexFormWebhook.js'},
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const visitor = {
    name: "Penguin",
    lastName: "Superbird",
    email: "penguin.superbird@gmail.com"
}

const webhook = "vexFormWebhook.js"

describe("VEX - Form Webhook", ()=>{
    it("Set up the event if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.visit() 
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
            }
        })
    })

    it("Visit the event, fill the form", ()=>{
        cy.visit(event.url)
        cy.get(consumption.vex.firstNameInput).clear().type(visitor.name)
        cy.get(consumption.vex.lastNameInput).clear().type(visitor.lastName)
        cy.get(consumption.vex.emailInput).clear().type(visitor.email) 
        cy.get("input[name='optIn']").should("exist") // Might as well check that the opt-in appears here on form
        cy.contains("button", "Submit").click() 
        cy.get("form").should("not.exist")
        cy.wait(2000) // Wait a while to ensure that webhook has had time to fire
    })

    it("Go to authoring and check the log to verify that the webhook fired", ()=>{
        authoring.common.login()
        cy.visit(`${authoring.common.baseUrl}/authoring/content-library/config/webhooks`)
        cy.contains(authoring.common.table.cellName, webhook).click() // opens right hand preview bar
        cy.containsExact("div", "View Logs").click() 
        cy.contains(authoring.common.modal, visitor.email).should("exist")
    })
})