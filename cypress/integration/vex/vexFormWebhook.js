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

const formWebhook = {
    first_name: "Penguin",
    last_name: "Superbird",
    email: "penguin.superbird@gmail.com",
    company: "The Flightless Birds",
    job_title: "Emperor",
    phone: "1234",
    opt_in: 'true',
    visitor_name: "Penguin Superbird",
    experience_external_id: "",
    experience_name: "vexFormWebhook.js",
    form_name: "vexFormWebhook.js",
    webhook_name: "vexFormWebhook.js",
    event_type: "Form Capture",
    content_source_url: "",
    content_title: "",
    query_string: "",
    utm_source: ""
}

describe("VEX - Form Webhook", ()=>{
    it("Set up the event if not already done, and clear all webhooks from pipedream database", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.visit() 
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
            }
        })
        cy.clearWebhooks()
    })

    it("Go to consumption and trigger all the webhooks - form, session, visitor activity (specific content, score, multiple asset)", ()=>{
        // Fill out the form 
        cy.visit(event.url)
        consumption.vex.fillStandardForm(formWebhook)

        // Visit session and interact with content for the configured amount of time to trigger the various hooks 

        // Close sessions to force webhooks to fire
        //cy.closeSession()

        // Now check for all the webhooks 
        cy.assertWebhook(formWebhook)
    })

})