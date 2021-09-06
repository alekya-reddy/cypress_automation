import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const visitor = {email: "new.visitor" + Math.random() + "@gmail.com"}

const noForm = { 
    name: "None (Registration Not Required)",
    uniqueLocator: "#email"
}

const deleteForm = {
    name: "formRegistration.js"
}

const standardForm = {
    name: 'Standard Form Short',
    uniqueLocator: "#email",
    expect: () => {cy.get("#email", {timeout: 1000}).should("exist")},
    fill: () => {consumption.vex.fillStandardForm(visitor)}
}

const standardFormLong = {
    name: "Standard Form Long Shared Resource",
    uniqueLocator: "#employeeCount",
    expect: () => {cy.get("#employeeCount", {timeout: 1000}).should("exist")},
    fill: () => {consumption.vex.fillStandardForm({...visitor, first_name: "jo", last_name: "schmo"})}
}

const customForm = {
    name: 'Custom Form Shared Resource',
    uniqueLocator: "input[name='emailAddress']",
    expect: () => {
        cy.waitForIframeToLoad(consumption.vex.customFormIframe, "input[name='emailAddress']", 20000)
        cy.getIframeBody(consumption.vex.customFormIframe).within(()=>{
            cy.get("input[name='emailAddress']").should("exist")
        })
    },
    fill: () => {
        const email = visitor.email
        cy.waitForIframeToLoad(consumption.vex.customFormIframe, "input[name='emailAddress']", 20000)
        cy.getIframeBody(consumption.vex.customFormIframe).within(()=>{
            cy.get("input[name='emailAddress']").type(email)
            cy.get(".submit-button").click()
        })
        cy.waitFor({element: consumption.vex.customFormIframe, to: "not.exist"})
        cy.get(consumption.vex.customFormIframe).should("not.exist")
    }
}

// We do not have access to external forms that do not require http protocol. While this can be worked around, it is very annoying.
// Custom + external forms go down the exact same code path on jukebox, so it's redundant to test both
// For these reasons, will omit external forms for this test on consumption side. Only verify that it is listed in form options.
const externalForm = {
    name: 'External formRegistration.js',
    type: "External URL",
    url: "https://en.wikipedia.org/wiki/1"
}

const expectNoChat = () => {
    cy.get(consumption.vex.rocketChat.iframe).should("not.exist")
}

const event = {
    name: 'formRegistration.js',
    slug: 'formregistration-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    form: standardFormLong
}

const sessions = {
    // Session naming nomenclature to help you, the human, quickly identify session characteristics:
    // live or on-demand; before, during, or after session; form type; form visibility; chat or no chat; on-demand-fallback (no fall back if omitted)
    liveCurrentCustomAlwaysNoChat: {
        name: 'Live; Current; Custom; Always; No-chat',
        slug: '1',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        form: customForm.name,
        formVisibility: "Always",
        scenarios: {
            1: {
                form: customForm.expect
            },
            2: {
                form: customForm.fill,
                video: () => {consumption.vex.expectZoom()},
                chat: expectNoChat
            },
        }
    },
    liveEndedStandardBeforeDuringNoChat: {
        name: 'Live; Ended; Standard; Before-during; No-chat',
        slug: '2',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Youtube - Used in Cypress automation for VEX testing'
        },
        form: standardForm.name,
        formVisibility: "Before and During Live Session",
        scenarios: {
            1: {
                form: null,
                video: () => {consumption.vex.expectYoutube()}, // If this were zoom, zoom would not load as it requires email
                chat: expectNoChat
            },
            2: {
                form: null,
                video: () => {consumption.vex.expectYoutube()},
                chat: expectNoChat
            },
        }
    },
    liveEndedStandardBeforeDuringNoChatFallback: {
        name: 'Live; Ended; Standard; Before-during; No-chat; fallback',
        slug: '3',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        form: standardForm.name,
        formVisibility: "Before and During Live Session",
        video: 'Youtube - Used in Cypress automation for VEX testing',
        scenarios: {
            1: {
                form: null,
                video: () => {consumption.vex.expectYoutube()},
                chat: expectNoChat
            },
            2: {
                form: null,
                video: () => {consumption.vex.expectYoutube()},
                chat: expectNoChat
            },
        }
    },
    liveEndedStandardAlwaysNoChatFallback: {
        name: 'Live; Ended; Standard; Always; No-chat; fallback',
        slug: '4',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        form: standardForm.name,
        formVisibility: "Always",
        video: 'Youtube - Used in Cypress automation for VEX testing',
        scenarios: {
            1: {
                form: standardForm.expect,
            },
            2: {
                form: standardForm.fill,
                video: () => {consumption.vex.expectYoutube()},
                chat: expectNoChat
            },
        }
    },
    liveEndedStandardBeforeDuringChat: {
        name: 'Live; Ended; Standard; Before-during; Chat',
        slug: '6',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        form: standardForm.name,
        formVisibility: "Before and During Live Session",
        rocketChat: {
            addNew: true,
            live: true,
            onDemand: true
        },
        scenarios: {
            1: {
                form: standardForm.expect
            },
            2: {
                form: standardForm.fill,
                video: () => {consumption.vex.expectZoom()},
                chat: () => {consumption.vex.expectRocketChat()}
            },
        }
    },
    liveBeforeStandardBeforeDuringNoChat: {
        name: 'Live; Before; Standard; Before-during; No-chat',
        slug: '7',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        form: standardForm.name,
        formVisibility: "Before and During Live Session",
        scenarios: {
            1: {
                form: standardForm.expect
            },
            2: {
                form: standardForm.fill,
                video: () => { cy.get(consumption.vex.zoom.iframe).should("not.exist") },
                chat: expectNoChat
            },
        }
    },
    liveCurrentStandardAlwaysNoChat: {
        name: 'Live; Current; Standard; Always; No-chat',
        slug: '8',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        form: standardForm.name,
        formVisibility: "Always",
        scenarios: {
            1: {
                form: standardForm.expect
            },
            2: {
                form: standardForm.fill,
                video: () => {consumption.vex.expectZoom()},
                chat: expectNoChat
            },
        }
    },
    liveCurrentNoneNoChat: {
        name: 'Live; Current; None; N/A; No-chat',
        slug: '9',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        scenarios: {
            1: {
                form: standardFormLong.expect
            },
            2: {
                form: null,
                video: () => {consumption.vex.expectZoom()},
                chat: expectNoChat
            },
        }
    },
    liveCurrentNoneChat: {
        name: 'Live; Current; None; N/A; Chat',
        slug: '10',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111',
            zoomAuth: 'No Password',
        },
        rocketChat: {
            addNew: true,
            live: true,
            onDemand: true
        },
        scenarios: {
            1: {
                form: standardFormLong.expect
            },
            2: {
                form: null,
                video: () => {consumption.vex.expectZoom()},
                chat: () => {consumption.vex.expectRocketChat()}
            },
        }
    },
    ondemandNoneNoChat: {
        name: "On-demand; N/A; None; N/A; No-chat",
        slug: '11',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        scenarios: {
            1: {
                form: standardFormLong.expect
            },
            2: {
                form: null,
                video: () => {consumption.vex.expectYoutube()},
                chat: expectNoChat
            },
        }
    },
    ondemandStandardNoChat: {
        name: "On-demand; N/A; Standard; N/A; No-chat",
        slug: '12',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        form: standardForm.name,
        video: 'Youtube - Used in Cypress automation for VEX testing',
        scenarios: {
            1: {
                form: standardForm.expect
            },
            2: {
                form: standardForm.fill,
                video: () => {consumption.vex.expectYoutube()},
                chat: expectNoChat
            },
        }
    }
}

const event2 = {
    name: 'formRegistration2.js',
    slug: 'formregistration2-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const deleteFormSession = {
    name: "On-demand",
    slug: 'on-demand',
    get url(){
        return `${event2.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    form: deleteForm.name,
    video: 'Youtube - Used in Cypress automation for VEX testing',
}

/*
I describe the rules governing form behavior in VEX in the ticket https://lookbookhq.atlassian.net/browse/DEV-12319.
See the comment section. Here is the summary: 
1. If both session form and event form enabled, session form overrides the event form.
2. Session forms must be filled regardless of what other forms were filled except points 3, 4 and 5.
3. You do not need to fill a session form again if you have registered previously and register again in a different session using same email
4. You do not need to fill session form again if you already registered for that session.
5. If a session has chat, it requires the visitor’s email. Show session form, if not available show event form, if not available ask for email
6. Forms set to show before or during a session only will not show once session ends, unless required to by chat
*/

describe('VEX - Session Form Registration', function() {
    it("Set up if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                Object.values(sessions).forEach(session => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
            }
        })
    })

    it("Event has form. Cycle through each session and verify you see the expected form", () => {
        const scenarioIndex = 1
        Object.values(sessions).forEach(session => {
            cy.visit(session.url)
            cy.wait(2000)
            const scenarioExpectations = session.scenarios[scenarioIndex]
            if(scenarioExpectations.form){
                scenarioExpectations.form()
            } else {
                scenarioExpectations.video()
                scenarioExpectations.chat()
            }
        })
    })

    it("Event has form. Fill the session forms", () => {
        // Verify that you have to fill the session forms independently, as in filling 1 doesn't grant you access to all sessions gated by a session form
        // Filling a session form automatically registers you for the event (which is different from registering for a session)
        // This means that sessions with no forms that would have been gated by an event form would no longer require you to fill the event form
        const scenarioIndex = 2
        Object.values(sessions).forEach(session => {
            cy.visit(session.url)
            const scenarioExpectations = session.scenarios[scenarioIndex]
            if(scenarioExpectations.form){
                scenarioExpectations.form()
            }
            scenarioExpectations.video()
            scenarioExpectations.chat()
        })
    })

    it("Filling event form should not register you for a session that is gated by session form", () => {
        cy.visit(event.url)
        standardFormLong.fill()
        cy.visit(sessions.liveCurrentCustomAlwaysNoChat.url)
        customForm.fill()
    })

    it("Event has form. Lb-email query string should only register for event, not sessions.", () => {
        cy.visit(event.url)
        cy.get(consumption.vex.standardForm.emailInput).should("exist")
        cy.visit(event.url + "?lb_email=test@gmail.com")
        cy.get(consumption.vex.standardForm.emailInput).should("not.exist")
        cy.visit(sessions.liveCurrentCustomAlwaysNoChat.url)
        customForm.expect()
        cy.visit(sessions.ondemandNoneNoChat.url)
        consumption.vex.expectYoutube()
    })

    it("Authoring side tests: Verify can add custom + external forms to sessions, verify can delete form without breaking session that uses it", () => {
        // Set up
        authoring.common.login()
        authoring.configurations.deleteForm(deleteForm.name)
        authoring.configurations.addForm(deleteForm.name)
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.addVirtualEvent(event2)
        authoring.vex.configureEvent(event2)

        // Verify can add custom and external forms to event
        authoring.vex.configureForm(externalForm)
        authoring.vex.configureForm(customForm)
        cy.contains("button", "Save").click()
        cy.contains(authoring.common.messages.recordSaved).should("exist")

        // Add session with form to be deleted
        authoring.vex.addSession(deleteFormSession.name)
        authoring.vex.configureSession(deleteFormSession)

        // Verify can add custom and external forms, and option for no forms
        authoring.vex.setForm(customForm.name)
        authoring.vex.setForm(externalForm.name)
        authoring.vex.setForm(noForm.name)
        authoring.vex.setForm(deleteForm.name)

        // Delete the form saved in the session
        authoring.configurations.deleteForm(deleteForm.name)
        cy.wait(1000)

        // Verify custom external form on event
        cy.visit(event2.url)
        customForm.expect()
        customForm.fill()
        cy.contains("You have successfully registered for this event").should("be.visible")

        // Verify the session has no form
        cy.visit(deleteFormSession.url)
        consumption.vex.expectYoutube()
    })
})