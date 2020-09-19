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
        rocketChat: "Rocket Chat"
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
        rocketChat: "Rocket Chat"
    },
    /*{
        // On demand sessions can no longer have rocket chat 
        name: "On-demand",
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
    },*/
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

const rocketChatSession = {
    name: `Rocket-Chat: Configurations, long (name) with. special! character$ as_"this" caused bug & stuff / yeah? 1234 #iamtheone++==*@`, // Unfortunately, can't test single quoation due to cypress bug 
    slug: "rocket-chat-config",
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
        zoomNum: '111 111 111',
        zoomAuth: 'No Password',
    },
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const form = {name: "Standard Form Short"}
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
            if(session.rocketChat){
                cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
                cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
                    cy.get(consumption.vex.rocketChat.container).should('exist')
                    cy.get(consumption.vex.rocketChat.messageInput).type("Hi\n")
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
            if(session.rocketChat){
                cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
                cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
                    cy.get(consumption.vex.rocketChat.container).should('exist')
                    cy.get(consumption.vex.rocketChat.messageInput).type("Hi\n")
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
            cy.get(consumption.vex.rocketChat.messageInput).type("Hi\n")
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
            if(session.rocketChat){
                cy.ifElementExists(consumption.vex.emailInput, 2000, ()=>{
                    // Live sessions will still ask you to provide email
                    cy.get(consumption.vex.emailInput).clear().type(visitor.email)
                    cy.contains("button", "Submit").click()
                })
                cy.waitForIframeToLoad(consumption.vex.rocketChat.iframe, consumption.vex.rocketChat.container, 10000)
                cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
                    cy.get(consumption.vex.rocketChat.container).should('exist')
                    cy.get(consumption.vex.rocketChat.messageInput).type("Hi\n")
                    cy.contains(visitor.name).should("exist")
                })
            } else {
                cy.wait(3000) // Wait 3 seconds - if check immediately, it could immediately conclude that rocket chat doesn't exist when in fact it will load a few seconds later
                cy.get(consumption.vex.rocketChat.iframe).should('not.exist')
            }
        })
    })

    it("Rocket chat configurations - turn on/off, moderators", ()=>{
        // Add a new session for this scenario
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name) 
        authoring.vex.removeSession(rocketChatSession.name)
        authoring.vex.addSession(rocketChatSession.name)
        authoring.vex.configureSession(rocketChatSession)

        // Live session should have option to turn on chat 
        authoring.vex.goToChat()
        cy.get(authoring.vex.chat.toggle).should('exist')
        cy.contains(authoring.vex.chat.notAvailableText).should('not.exist')
        authoring.vex.backToSession()
        
        // On demand session should not have option to turn on chat 
        authoring.vex.configureSession({type: "On Demand", stayOnPage: true})
        authoring.vex.goToChat()
        cy.get(authoring.vex.chat.toggle).should('not.exist')
        cy.contains(authoring.vex.chat.notAvailableText).should('exist')
        authoring.vex.backToSession()

        // Verify that turning on chat will enable chat on consumption side 
        authoring.vex.configureSession({type: "Live", stayOnPage: true})
        authoring.vex.goToChat()
        authoring.vex.toggle(authoring.vex.chat.toggle, "on")
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.fillStandardForm({email: "random@gmail.com"})
        consumption.vex.expectRocketChat() 
        cy.go("back")

        // Verify that turning off rocket chat will turn it off on consumption side 
        
    })
})