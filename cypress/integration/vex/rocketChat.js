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
        rocketChat: {
            addNew: true,
            live: true,
            onDemand: true
        },
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
        rocketChat: {
            addNew: true,
            live: true,
            onDemand: true
        },
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
    }
]

const form = {name: "Standard Form Short"}
const noForm = { name: "None (Registration Not Required)" }
const visitor = {
    email: 'penguin@gmail.com',
    name: 'penguin'
}

describe("Vex - Rocket Chat Registration", ()=>{
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
                    authoring.vex.backToEvent(event.name)
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

        // Visit live session
        cy.visit(sessions[0].url)
        consumption.vex.expectRocketChat()
        consumption.vex.chat({message: "Hi", user: visitor.name})

        // Visit live session that has ended and is now showing on-demand
        cy.visit(sessions[1].url)
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")

        // Visit the on-demand session
        cy.visit(sessions[2].url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should('not.exist')
    })

    it("With form set, visit a session, fill form on session, which should add you to chat on all sessions with chat enabled", ()=>{
        cy.visit(sessions[0].url)
        cy.get(consumption.vex.emailInput).clear().type(visitor.email)
        cy.contains("button", "Submit").click()
        cy.get('form').should('not.exist')
        consumption.vex.expectRocketChat()
        consumption.vex.chat({message: "Hi", user: visitor.name})

        // Visit the live session that ended
        cy.visit(sessions[1].url)
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")
    })

    it("With form set, visit a session and register via lb_email query string, which should add you to chat", ()=>{
        cy.clearCookies()
        cy.visit(sessions[0].url + "/?lb_email=penguin%40gmail.com")
        consumption.vex.expectRocketChat()
        consumption.vex.chat({message: "Hi", user: visitor.name})
    })

    it("Turn off form, visit each session and provide email, which should add you to chat on all sessions with chat enabled", ()=>{
        // Add the form
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(noForm)
        cy.wait(1500) // allow DB time to update before visiting consumption 

        // A live session that has ended that has chat should ask for email
        cy.visit(sessions[1].url)
        consumption.vex.fillStandardForm({email: visitor.email})
        consumption.vex.expectYoutube()
        consumption.vex.expectRocketChat()

        // Now visit a live session, which should ask you to provide email even though form is disabled
        cy.clearCookies()
        cy.visit(sessions[0].url)
        consumption.vex.fillStandardForm({email: visitor.email})
        consumption.vex.expectWebex()
        consumption.vex.expectRocketChat()

        // Confirm that the on-demand session has no rocket chat 
        cy.visit(sessions[2].url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")
    })
})