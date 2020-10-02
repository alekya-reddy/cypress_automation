import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const videoContent = {
    url: "https://www.youtube.com/watch?v=Tk338VXcb24",
    publicTitle: "vexWebhooks video content",
    internalTitle: "vexWebhooks video content",
    slug: "vex-video-webhook",
    contentType: "Video",
    topics: "General Use",
    funnelStages: "Middle of Funnel",
    businessUnits: "General Use",
    externalID: "contentid",
    engagementTime: "1",
    engagementScore: "3",
    mediaType: "video"
}

const supplementalContent = {
    url: "https://en.wikipedia.org/wiki/SpaceX_Starship",
    publicTitle: "vexWebhooks supplemental content",
    internalTitle: "vexWebhooks supplemental content",
    slug: "vex-supplemental-webhook",
    contentType: "Article",
    topics: "SpaceX Starship",
    funnelStages: "Top of Funnel",
    businessUnits: "",
    externalID: "contentid2",
    engagementTime: "1",
    engagementScore: "1",
    mediaType: "webpage"
}

const event = {
    name: 'vexWebhooks.js',
    slug: 'vexwebhooks-js',
    form: {name: 'vexFormWebhook.js'},
    externalID: "vexwebhookid",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const videoSession = {
    name: "on demand",
    slug: "on-demand",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: videoContent.internalTitle,
    contents: [supplementalContent.internalTitle],
    engagementThreshold: "1",
    engagementScore: "2"
}

const webexSession = {
    name: "live webex",
    slug: "live-webex",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: 'Jun 24, 2020 8:00pm',
        end: 'Jun 24, 2041 8:00pm',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Webex',
        webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
    },
    engagementThreshold: "1",
    engagementScore: "5"
}

const formWebhook = {
    name: "Form Webhook",
    url: "https://c9f9d0f5f577df2c701fe6f44642eb9f.m.pipedream.net",
    type: "Form Capture",
    on_off: 'on',
    eventFields: {
        "Event Type": "event_type",
        "Event Time": "event_time",
        "Event Date": "event_date",
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
        "UTM Source": "utm_source",
        "Content URL": "content_url"
    }
}

const sessionWebhook = {
    // This has all fields added. Only a sample of these are checked for correct values
    name: "Session Webhook",
    url: "https://c9f9d0f5f577df2c701fe6f44642eb9f.m.pipedream.net",
    type: "Visitor Session",
    on_off: 'on',
    eventFields: {
        "Event Time": "event_time",
        "Event Date": "event_date",
        "Known Visitor Email": "email",
        "Experience Name": "experience_name",
        "Experience External ID": "experience_external_id",
        "Assets Viewed": "assets_viewed",
        "Content Journey": "content_journey",
        "Content Count - Time Thresholds Met": "content_count_time_thresholds_met",
        "Content List - Time Thresholds Met": "content_list_time_thresholds_met",
        "Business Units List - Time Thresholds Met": "business_units_list_time_thresholds_met",
        "Content Types List - Time Thresholds Met": "content_types_list_time_thresholds_met",
        "Engagement Score": "engagement_score",
        "Webhook Name": "webhook_name",
        "Engagement Time": "engagement_time",
        "Total Views": "total_views",
        "Business Units List - Time Thresholds Met": "business_units_list_time_thresholds_met",
        "Funnel Stages List - Time Thresholds Met": "funnel_stages_list_time_thresholds_met",
        "Content External ID List - Time Thresholds Met": "content_external_id_list_time_thresholds_met",
        "Event Type": "event_type",
        "Topics List - Time Thresholds Met": "topics_list_time_thresholds_met",
        "Session Start Time (UTC)": "session_start_time_utc",
        "Session End Time (UTC)": "session_end_time_utc",
        "Last Viewed Content Title": "last_viewed_content_title",
        "Is Known Visitor": "is_known_visitor",
        "Browser": "browser",
        "Captures": "captures",
        "City": "city",
        "Country": "country",
        "Device Type": "device_type",
        "Experience LookBook ID": "experience_lookbook_id",
        "ISP Domain": "isp_domain",
        "Known Visitor Email Domain": "known_visitor_email_domain",
        "Last Viewed Content Source URL": "last_viewed_content_source_url",
        "Likes": "likes",
        "Operating System": "operating_system",
        "Query String": "query_string",
        "Referrer Medium": "referrer_medium",
        "Referrer Source": "referrer_source",
        "Referrer URL": "referrer_url",
        "Region": "region",
        "Session End Time": "session_end_time",
        "Session ID": "session_id",
        "Session Start Time": "session_start_time",
        "Shares": "shares",
        "UTM Campaign": "utm_campaign",
        "UTM Content": "utm_content",
        "UTM Medium": "utm_medium",
        "UTM Source": "utm_source",
        "UTM Term": "utm_term"
    }
}

const activityWebhook = {
    name: "Activity Webhook",
    url: "https://c9f9d0f5f577df2c701fe6f44642eb9f.m.pipedream.net",
    type: "Visitor Activity",
    on_off: 'on',
    eventFields: {
        "Event Time": "event_time",
        "Event Date": "event_date",
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
    content_url: event.url
    //query_string: "foo=bar&utm_source=source",  // After deploy of release 92, this always comes up blank with automation. Manually, these fields still show up
    //utm_source: "source" // This value comes from the utm_source=source query string // After deploy of release 92, this always comes up blank with automation. Manually, these fields still show up
}

const sessionWebhookEvent = {
    "email": "penguin.superbird@gmail.com",
    "experience_name": event.name,
    "experience_external_id": event.externalID,
    "assets_viewed": '3', // The video, the wikipage, and the webex
    "content_journey": `[${videoSession.slug}][${supplementalContent.slug}][${videoSession.slug}][${webexSession.slug}]`, 
    "content_count_time_thresholds_met": "3", // This includes the webex
    "content_list_time_thresholds_met": `[${videoSession.slug}][${supplementalContent.slug}][${webexSession.slug}]`, 
    "business_units_list_time_thresholds_met": `[${videoContent.businessUnits}]`,
    "content_types_list_time_thresholds_met": `[${videoContent.contentType}][${supplementalContent.contentType}]`,
    "engagement_score": "10", // video = 2, supplemental = 1, video = 2, webex = 5 
    "webhook_name": sessionWebhook.name,
    "total_views": "4", // If you cycle back to previously viewed content, that counts as another view
    "business_units_list_time_thresholds_met": `[${videoContent.businessUnits}]`,
    "funnel_stages_list_time_thresholds_met": `[${videoContent.funnelStages}][${supplementalContent.funnelStages}]`,
    "content_external_id_list_time_thresholds_met": `[${videoContent.externalID}][${supplementalContent.externalID}]`,
    "event_type": "Closed Session",
    "topics_list_time_thresholds_met": `[${videoContent.topics}][${supplementalContent.topics}]`,
    "last_viewed_content_title": webexSession.name,
    "is_known_visitor": "true"
}

const engagementScoreWebhookEvent = {
    "content_external_id": "",
    "content_media_type": "",
    "content_source_url": "",
    "content_title": "",
    "content_type": "",
    "content_url": "",
    "email": "penguin.superbird@gmail.com",
    "event_type": "Visitor Activity",
    "experience_external_id": event.externalID,
    "experience_name": event.name,
    "is_known_visitor": "true",
    "known_visitor_email_domain": "gmail.com",
    "session_assets_viewed": "3",
    "session_business_units_list_time_thresholds_met": `[${videoContent.businessUnits}]`,
    "session_content_count_time_thresholds_met": "3",
    "session_content_external_id_list_time_thresholds_met": `[${videoContent.externalID}][${supplementalContent.externalID}]`,
    "session_content_journey": `[${videoSession.slug}][${supplementalContent.slug}][${videoSession.slug}][${webexSession.slug}]`,
    "session_content_list_time_thresholds_met": `[${videoSession.slug}][${supplementalContent.slug}][${webexSession.slug}]`,
    "session_content_types_list_time_thresholds_met": `[${videoContent.contentType}][${supplementalContent.contentType}]`,
    "session_engagement_score": "10",
    "session_funnel_stages_list_time_threshols_met": `[${videoContent.funnelStages}][${supplementalContent.funnelStages}]`,
    "session_last_viewed_content_source_url": webexSession.live.webexLink,
    "session_last_viewed_content_title": webexSession.name,
    "session_topics_list_time_thresholds_met": `[${videoContent.topics}][${supplementalContent.topics}]`,
    "session_total_views": "4",
    "visitor_activity_name": "Engagement Score",
    "visitor_activity_type": "Engagement Score",
    "webhook_name": activityWebhook.name
}

const supplementalSpecificContentWebhookEvent = {
    "content_external_id": supplementalContent.externalID,
    "content_media_type": supplementalContent.mediaType,
    "content_source_url": supplementalContent.url,
    "content_title": supplementalContent.publicTitle,
    "content_type": supplementalContent.contentType,
    "email": "penguin.superbird@gmail.com",
    "event_type": "Visitor Activity",
    "experience_external_id": event.externalID,
    "experience_name": event.name,
    "is_known_visitor": "true",
    "known_visitor_email_domain": "gmail.com",
    "session_assets_viewed": "3",
    "session_business_units_list_time_thresholds_met": `[${videoContent.businessUnits}]`,
    "session_content_count_time_thresholds_met": "3",
    "session_content_external_id_list_time_thresholds_met": `[${videoContent.externalID}][${supplementalContent.externalID}]`,
    "session_content_journey": `[${videoSession.slug}][${supplementalContent.slug}][${videoSession.slug}][${webexSession.slug}]`,
    "session_content_list_time_thresholds_met": `[${videoSession.slug}][${supplementalContent.slug}][${webexSession.slug}]`,
    "session_content_types_list_time_thresholds_met": `[${videoContent.contentType}][${supplementalContent.contentType}]`,
    "session_engagement_score": "10",
    "session_funnel_stages_list_time_threshols_met": `[${videoContent.funnelStages}][${supplementalContent.funnelStages}]`,
    "session_last_viewed_content_source_url": webexSession.live.webexLink,
    "session_last_viewed_content_title": webexSession.name,
    "session_topics_list_time_thresholds_met": `[${videoContent.topics}][${supplementalContent.topics}]`,
    "session_total_views": "4",
    "visitor_activity_name": "Specific Content Supplemental",
    "visitor_activity_type": "Specific Content Engagement",
    "webhook_name": activityWebhook.name
}

describe("VEX - Form Webhook", ()=>{
    it("Set up the event if not already done, and clear all webhooks from pipedream database", ()=>{
        if(Cypress.env('TEST_ENV') !== "prod"){
            cy.closeSession({failOnStatusCode: false, retryOnNetworkFailure: true}) // Closing sessions while all webhooks toggled off will purge all pent-up webhooks waiting to fire
            cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
                if(response.status == 404){
                    authoring.common.login()
                    authoring.vex.addVirtualEvent(event.name)
                    authoring.vex.configureEvent(event)
                    authoring.vex.addSession(videoSession.name)
                    authoring.vex.addSession(webexSession.name)
                    authoring.vex.configureSession(videoSession)
                    authoring.vex.backToEvent(event.name)
                    authoring.vex.configureSession(webexSession)
                    authoring.webhooks.addWebhook(formWebhook)
                    authoring.webhooks.configureWebhook(formWebhook)
                    authoring.webhooks.addWebhook(sessionWebhook)
                    authoring.webhooks.configureWebhook(sessionWebhook)
                    authoring.webhooks.addWebhook(activityWebhook)
                    authoring.webhooks.configureWebhook(activityWebhook)
                } else {
                    // Need to turn on before each test
                    authoring.common.login()
                    authoring.webhooks.configureWebhook({name: formWebhook.name, on_off: "on"})
                    authoring.webhooks.configureWebhook({name: sessionWebhook.name, on_off: "on"})
                    authoring.webhooks.configureWebhook({name: activityWebhook.name, on_off: "on"})
                }
            })
            cy.clearWebhooks()
        }
    })

    it("Go to consumption and trigger all the webhooks - form, session, visitor activity (specific content, score, multiple asset)", ()=>{
        if(Cypress.env('TEST_ENV') !== "prod"){
            // Fill out the form 
            cy.visit(event.url + `/?${formWebhookEvent.query_string}`)
            consumption.vex.fillStandardForm(formWebhookEvent)

            // Visit session and interact with content for the configured amount of time to trigger the various hooks 
            cy.visit(videoSession.url)
            cy.wait(5000)
            cy.containsExact("a", supplementalContent.publicTitle).click() // View supplemental
            cy.wait(5000)
            cy.get(`a[href="/${event.slug}/${videoSession.slug}"]`).click() // Close supplemental 
            cy.wait(5000)
            cy.containsExact("a", event.name).click() // Back to event page 
            cy.get(`a[href="/${event.slug}/${webexSession.slug}"]`).click() // Visit the webex session
            cy.waitForIframeToLoad("iframe", "div[class='meeting-controls']", 20000)
            cy.getIframeBody("iframe").within(()=>{
                cy.get(`h2:contains('${webexSession.live.webexLink}')`, {timeout: 20000}).should('exist')
                cy.get("div[class='meeting-controls']").should('exist')
            })
            cy.wait(5000)
        }
    })

    it("Close sessions and check all the webhooks", ()=>{
        if(Cypress.env('TEST_ENV') !== "prod"){
            // Closing sessions in separate it block so can go to different url and clear all cookeis 
            // If you close sessions while browser still open on the experience, it immediately starts a new session that will appear in webhooks if close session again
            authoring.common.login()
            cy.closeSession()

            // Now check for all the webhooks 
            // Note: not all fields will be verified. If field changes between runs, it is omitted from check.
            // For example, time fields, city, country, device etc
            cy.assertWebhook({find: formWebhookEvent, retries: 300})
            cy.assertWebhook({find: engagementScoreWebhookEvent, retries: 300})
            cy.assertWebhook({find: supplementalSpecificContentWebhookEvent, retries: 300})
            cy.assertWebhook({find: sessionWebhookEvent, retries: 300})
            // Multiple asset engagement webhook not firing
            // Specific content webhook for video not firing
        } 
    })

    it("Turn off webhook after each test to prevent other sessions from firing, which would clog up pipeline and cause test to fail from timing out", ()=>{
        if(Cypress.env('TEST_ENV') !== "prod"){
            authoring.common.login()
            authoring.webhooks.configureWebhook({name: formWebhook.name, on_off: "off"})
            authoring.webhooks.configureWebhook({name: sessionWebhook.name, on_off: "off"})
            authoring.webhooks.configureWebhook({name: activityWebhook.name, on_off: "off"})
        }
    })

})