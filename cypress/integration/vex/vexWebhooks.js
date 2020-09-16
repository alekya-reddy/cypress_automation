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

const sessionWebhook = {
    name: "Session Webhook",
    url: "https://c9f9d0f5f577df2c701fe6f44642eb9f.m.pipedream.net",
    type: "Visitor Session",
    on_off: 'on',
    eventFields: {
        "Event Time": "event_time",
        "Known Visitor Email": "email",
        "Experience Name": "experience_name",
        "Experience External ID": "experience_external_id",
        "Assets Viewed": "assets_viewed",
        "Content Journey": "content_journey",
        "Content Count - Time Thresholds Met": "content_count_time_thresholds_met",
        "Content List - Time Thresholds Met": "content_list_time_thresholds_met",
        "Engagement Score": "engagement_score",
        "Business Units List - Time Thresholds Met": "business_units_list_time_thresholds_met",
        "Content Types List - Time Thresholds Met": "content_types_list_time_thresholds_met",
        "Engagement Score": "engagement_score",
        "Webhook Name": "webhook_name",
        "Engagement Time": "engagement_time",
        "Total Views": "total_views",
        "Business Units List - Time Thresholds Met": "business_units_list_time_thresholds_met",
        "Content Types List - Time Thresholds Met": "content_types_list_time_thresholds_met",
        "Funnel Stages List - Time Thresholds Met": "funnel_stages_list_time_thresholds_met",
        "Content External ID List - Time Thresholds Met": "content_external_id_list_time_thresholds_met",
        "Event Type": "event_type",
        "Topics List - Time Thresholds Met": "topics_list_time_thresholds_met",
        "Session Start Time (UTC)": "session_start_time_utc",
        "Session End Time (UTC)": "session_end_time_utc",
        "Last Viewed Content Title": "last_viewed_content_title",
        "Is Known Visitor": "is_known_visitor"
    }
}

const activityWebhook = {
    name: "Activity Webhook",
    url: "https://c9f9d0f5f577df2c701fe6f44642eb9f.m.pipedream.net",
    type: "Visitor Activity",
    on_off: 'on',
    eventFields: {
        "Event Time": "event_time",
        "Known Visitor Email": "email",
        "Visitor Activity Name": "visitor_activity_name",
        "Experience Name": "experience_name",
        "Experience External ID": "experience_external_id",
        "Content External ID (Specific Content Engagement Only)": "content_external_id",
        "Content Media Type (Specific Content Engagement Only)": "content_media_type",
        "Content Source URL (Specific Content Engagement Only)": "content_source_url",
        "Content Title (Specific Content Engagement Only)": "content_title",
        "Content Type (Specific Content Engagement Only)": "content_type",
        "Content URL (Specific Content Engagement Only)": "content_url",
        "Event Type": "event_type",
        "Is Known Visitor": "is_known_visitor",
        "Known Visitor Email Domain": "known_visitor_email_domain",
        "Session Assets Viewed": "session_assets_viewed",
        "Session Business Units List - Time Thresholds Met": "session_business_units_list_time_thresholds_met",
        "Session Content Count - Time Thresholds Met": "session_content_count_time_thresholds_met",
        "Session Content External ID List - Time Thresholds Met": "session_content_external_id_list_time_thresholds_met",
        "Session Content Journey": "session_content_journey",
        "Session Content List - Time Thresholds Met": "session_content_list_time_thresholds_met",
        "Session Content Types List - Time Thresholds Met": "session_content_types_list_time_thresholds_met",
        "Session Start Time (UTC)": "session_start_time_utc",
        "Session End Time (UTC)": "session_end_time_utc",
        "Session Engagement Score": "session_engagement_score",
        "Session Engagement Time": "session_engagement_time",
        "Session Funnel Stages List - Time Thresholds Met": "session_funnel_stages_list_time_threshols_met",
        "Session Topics List - Time Thresholds Met": "session_topics_list_time_thresholds_met",
        "Visitor Activity Type": "visitor_activity_type",
        "Webhook Name": "webhook_name",
        "Session Total Views": "session_total_views",
        "Session Last Viewed Content Source URL": "session_last_viewed_content_source_url",
        "Session Last Viewed Content Title": "session_last_viewed_content_title"
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
    content_source_url: "", // content values will not show up for vex forms as there is no content visible when filling out either on event or session page
    content_title: "",
    query_string: "foo=bar&utm_source=source",
    utm_source: "source" // This value comes from the utm_source=source query string 
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
                authoring.webhooks.addWebhook(sessionWebhook)
                authoring.webhooks.configureWebhook(sessionWebhook)
                authoring.webhooks.addWebhook(activityWebhook)
                authoring.webhooks.configureWebhook(activityWebhook)
            }
        })
        cy.clearWebhooks()
    })

    it("Go to consumption and trigger all the webhooks - form, session, visitor activity (specific content, score, multiple asset)", ()=>{
        // Fill out the form 
        cy.visit(event.url + `/?${formWebhookEvent.query_string}`)
        consumption.vex.fillStandardForm(formWebhookEvent)

        // Visit session and interact with content for the configured amount of time to trigger the various hooks 

        // Close sessions to force webhooks to fire
        //cy.closeSession()

        // Now check for all the webhooks 
        cy.assertWebhook(formWebhookEvent)
    })

})