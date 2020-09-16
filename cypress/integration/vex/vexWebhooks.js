import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexWebhooks.js',
    slug: 'vexwebhooks-js',
    form: {name: 'vexFormWebhook.js'},
    externalID: "vexwebhookid",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const formWebhook = {
    name: "Form Webhook",
    url: "https://c9f9d0f5f577df2c701fe6f44642eb9f.m.pipedream.net",
    type: "Form Capture",
    on_off: 'on',
    eventFields: {
        "Event Type": "event_type",
        "Event Time": "event_time",
        "Form Name": "form_name",
        "Visitor Email": "email",
        "First Name": "first_name",
        "Last Name": "last_name",
        "Job Title": "job_title",
        "Phone Number": "phone",
        "Company": "company",
        "Content Title": "content_title",
        "Content Source URL": "content_source_url",
        "Experience Name": "experience_name",
        "Experience External ID": "experience_external_id",
        "Webhook Name": "webhook_name",
        "Event Type": "event_type",
        "Visitor Name": "visitor_name",
        "Opt In": "opt_in",
        "Query String": "query_string",
        "UTM Source": "utm_source"
    }
}

const formWebhookEvent = {
    first_name: "Penguin",
    last_name: "Superbird",
    email: "penguin.superbird@gmail.com",
    company: "The Flightless Birds",
    job_title: "Emperor",
    phone: "1234",
    opt_in: 'true',
    visitor_name: "Penguin Superbird",
    experience_external_id: event.externalID,
    experience_name: event.name,
    form_name: event.form.name,
    webhook_name: formWebhook.name,
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
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.webhooks.addWebhook(formWebhook)
                authoring.webhooks.configureWebhook(formWebhook)
            }
        })
        cy.clearWebhooks()
    })

    it("Go to consumption and trigger all the webhooks - form, session, visitor activity (specific content, score, multiple asset)", ()=>{
        // Fill out the form 
        cy.visit(event.url)
        consumption.vex.fillStandardForm(formWebhookEvent)

        // Visit session and interact with content for the configured amount of time to trigger the various hooks 

        // Close sessions to force webhooks to fire
        //cy.closeSession()

        // Now check for all the webhooks 
        cy.assertWebhook(formWebhookEvent)
    })

})