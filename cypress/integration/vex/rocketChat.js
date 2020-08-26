import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'rocketChat.js',
    slug: 'rocketchat-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = [
    {
        name: "Live current",
        slug: "current",
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
        widgets: "Rocket Chat"
    },
    {
        name: "Live ended with on-demand",
        slug: "ended-fallback",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        widgets: "Rocket Chat"
    },
    {
        name: "On-demand",
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        widgets: "Rocket Chat"
    },
    {
        name: "no-chat",
        slug: "no-chat",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
]

const form = {name: "rocketChat.js"}
const noForm = { name: "None (Registration Not Required)" }

const visitor = {
    email: 'penguin@gmail.com',
    name: 'penguin'
}

describe("Vex - Rocket Chat", ()=>{
    it("Set up rocket chat on authoring side if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                sessions.forEach((session)=>{
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    cy.containsExact("a", event.name).click()
                })
            }
        })
    })

    it("With form set, visit event, fill form on event, which should add you to chat on all sessions with chat enabled", ()=>{
        // Add the form
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(form)
        cy.wait(2000) // allow DB time to update before visiting consumption 

        // Go to consumption and register on the event page 
        cy.clearCookies()
        cy.visit(event.url)
        cy.get(consumption.vex.emailInput).clear().type(visitor.email)
        cy.contains("button", "Submit").click()
        cy.get('form').should('not.exist')

        // Go to each session, and rocket chat should load where it is enabled 
        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.widgets){
                cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
                cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
                    cy.get(consumption.vex.rocketChat.container).should('exist')
                    cy.contains(visitor.name).should("exist")
                })
            } else {
                cy.wait(3000) // Wait 3 seconds - if check immediately, it could immediately conclude that rocket chat doesn't exist when in fact it will load a few seconds later
                cy.get(consumption.vex.rocketChat.iframe).should('not.exist')
            }
        })
    })

    it("With form set, visit a session, fill form on session, which should add you to chat on all sessions with chat enabled", ()=>{
        cy.clearCookies()
        cy.visit(sessions[0].url)
        cy.get(consumption.vex.emailInput).clear().type(visitor.email)
        cy.contains("button", "Submit").click()
        cy.get('form').should('not.exist')

        // Go to each session, and rocket chat should load where it is enabled 
        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.widgets){
                cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
                cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
                    cy.get(consumption.vex.rocketChat.container).should('exist')
                    cy.contains(visitor.name).should("exist")
                })
            } else {
                cy.wait(3000) 
                cy.get(consumption.vex.rocketChat.iframe).should('not.exist')
            }
        })
    })

    it("With form set, visit a session and register via lb_email query string, which should add you to chat", ()=>{
        cy.clearCookies()
        cy.visit(sessions[0].url + "/?lb_email=penguin%40gmail.com")
        cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.get(consumption.vex.rocketChat.container).should('exist')
            cy.contains(visitor.name).should("exist")
        })
    })

    it("Turn off form, visit each session and provide email, which should add you to chat on all sessions with chat enabled", ()=>{
        // Add the form
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(noForm)
        cy.wait(2000) // allow DB time to update before visiting consumption 

        // Note: currenty, in scenario with no form, visiting on-demand session first will have no chat as user is unknown 
        // Can add this scenario to testing later once it is fixed 

        // Go to each session, and rocket chat should load where it is enabled 
        cy.clearCookies()
        sessions.forEach((session)=>{
            cy.visit(session.url)
            if(session.widgets){
                cy.ifElementExists(consumption.vex.emailInput, 2000, ()=>{
                    // Live sessions will still ask you to provide email
                    cy.get(consumption.vex.emailInput).clear().type(visitor.email)
                    cy.contains("button", "Submit").click()
                })
                cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
                cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
                    cy.get(consumption.vex.rocketChat.container).should('exist')
                    cy.contains(visitor.name).should("exist")
                })
            } else {
                cy.wait(3000) // Wait 3 seconds - if check immediately, it could immediately conclude that rocket chat doesn't exist when in fact it will load a few seconds later
                cy.get(consumption.vex.rocketChat.iframe).should('not.exist')
            }
        })
    })

    /*it("Add new session, visit event, register, visit 1 session, then visit the new session through the event page", ()=>{
        // This scenario currently can cause chat to not load without page refresh
        // Can add this scenario once it is fixed 
    })*/
})