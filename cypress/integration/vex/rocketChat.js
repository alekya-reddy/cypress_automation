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
        rocketChat: {on_off: "ON"}
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
        rocketChat: {on_off: "ON"}
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

        // A live session that has ended and is now showing on-demand should not have chat if there is no registration even if rocket chat enabled 
        cy.visit(sessions[1].url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")

        // Now visit a live session, which should ask you to provide email even though form is disabled
        cy.visit(sessions[0].url)
        cy.get(consumption.vex.emailInput).clear().type(visitor.email)
        cy.contains("button", "Submit").click()
        consumption.vex.expectWebex()
        consumption.vex.expectRocketChat()

        // Visiting the live session that has ended (and has on-demand fallback) should still not show the rocket chat 
        cy.visit(sessions[1].url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist") // consumption.vex.expectRocketChat()

        // Confirm that the on-demand session has no rocket chat 
        cy.visit(sessions[2].url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")
    })

    it("Rocket chat configurations - turn on/off, moderators", ()=>{
        const enableChatToggle = "button[data-qa-hook^='chat-widget-']" // Use this for the chat toggle before it has been toggled on, it later switches data-qa-hook to chat-widget-neable, this will be fixed by devs later
        // Add a new session for this scenario
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name) 
        authoring.vex.removeSession(rocketChatSession.name)
        authoring.vex.addSession(rocketChatSession.name)
        authoring.vex.configureSession(rocketChatSession)

        // Live session should have option to turn on chat 
        authoring.vex.goToChat()
        cy.get(enableChatToggle).should('exist') //cy.get(authoring.vex.chat.toggle).should('exist')
        cy.contains(authoring.vex.chat.notAvailableText).should('not.exist')
        authoring.vex.backToSession()
        
        // On demand session should not have option to turn on chat 
        authoring.vex.configureSession({type: "On Demand", stayOnPage: true})
        authoring.vex.goToChat()
        cy.get(enableChatToggle).should('not.exist') //cy.get(authoring.vex.chat.toggle).should('not.exist')
        cy.contains(authoring.vex.chat.notAvailableText).should('exist')
        authoring.vex.backToSession()

        // Verify that turning on chat will enable chat on consumption side 
        authoring.vex.configureSession({type: "Live", stayOnPage: true})
        authoring.vex.goToChat()
        authoring.vex.toggle(enableChatToggle, "on") //authoring.vex.toggle(authoring.vex.chat.toggle, "on")
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.fillStandardForm({email: visitor.email})
        consumption.vex.expectRocketChat() 
        cy.go("back")

        // Verify that turning off rocket chat will turn it off on consumption side 
        authoring.vex.toggle(authoring.vex.chat.toggle, "off")
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.expectZoom() // This'll force most the page to load first, otherwise will immediately see that rocket chat doesn't exist and move on without waiting for page to load 
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")
        cy.go("back")

        // Input validation check for adding moderator, and cancel button check 
        authoring.vex.toggle(authoring.vex.chat.toggle, "on")
        authoring.vex.addModerators(visitor.email)
        cy.get(authoring.vex.chat.addModeratorButton).click() 
        cy.contains(authoring.vex.antModal, "Add Moderator").should("exist").within(()=>{
            cy.get(authoring.vex.chat.emailInput).clear()
            cy.contains('button', "Submit").click()
            cy.contains(authoring.vex.messages.blankInput, {timeout: 20000}).should('exist')
            cy.get(authoring.vex.chat.emailInput).clear().type(visitor.email)
            cy.contains('button', "Submit").click()
            cy.contains(authoring.vex.messages.duplicateEntry2, {timeout: 20000}).should('exist')
            cy.get(authoring.vex.chat.emailInput).clear().type("invalid    email")
            cy.contains('button', "Submit").click()
            cy.contains(authoring.vex.messages.invalidEmail, {timeout: 20000}).should('exist')
            cy.contains("button", "Cancel").click()
        })
        cy.contains(authoring.vex.antModal, "Add Moderator", {timeout: 20000}).should("not.be.visible")

        // Input validation check for editing moderator, and cancel button check 
        authoring.vex.addModerators("test@gmail.com")
        cy.containsExact("span", "test@gmail.com", {timeout: 20000}).parents(authoring.vex.chat.emailRow).within(()=>{
            cy.contains("button", "Edit").click()
        })
        cy.contains(authoring.vex.antModal, "Edit Moderator").should("exist").within(()=>{
            cy.get(authoring.vex.chat.emailInput).clear()
            cy.contains('button', "Submit").click()
            cy.contains(authoring.vex.messages.blankInput).should('exist')
            cy.get(authoring.vex.chat.emailInput).clear().type(visitor.email)
            cy.contains('button', "Submit").click()
            cy.contains(authoring.vex.messages.duplicateEntry2).should('exist')
            cy.get(authoring.vex.chat.emailInput).clear().type("invalid    email")
            cy.contains('button', "Submit").click()
            cy.contains(authoring.vex.messages.invalidEmail).should('exist')
            cy.contains("button", "Cancel").click()
        })
        cy.contains(authoring.vex.antModal, "Edit Moderator").should("not.be.visible")

        // Verify on consumption side that the moderator was added  
        cy.visit(rocketChatSession.url)
        consumption.vex.expectRocketChat()
        cy.get(consumption.vex.rocketChat.moderatorViewButton).should('exist') // Unfortunately, clicking this will open a new tab to separate domain, which is not allowed within Cypress
        cy.go("back")

        // Edit moderator and verify on consumption side 
        authoring.vex.editModerator({moderator: visitor.email, newEmail: "random@gmail.com"})
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.expectRocketChat()
        cy.get(consumption.vex.rocketChat.moderatorViewButton).should('not.exist')
        cy.go("back")

        // Delete moderator 
        authoring.vex.deleteModerators("random@gmail.com")

        // Make chat read only - and verify on consumption as non-moderator 
        authoring.vex.toggle(authoring.vex.chat.readOnly, "on")
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.expectRocketChat()
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.contains("This room is read only").should("exist")
        })
        cy.go("back")

        // Turn off read only mode 
        authoring.vex.toggle(authoring.vex.chat.readOnly, "off")
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.expectRocketChat()
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.ifNoElementWithExactTextExists("span", "This room is read only", 20000, ()=>{}, "div") // Smart wait for that text to stop exisiting
            cy.contains("This room is read only").should("not.exist")
        })
        cy.go("back")

        // Make the visitor a moderator then turn chat to read only mode - moderator should not be affected by read-only mode 
        authoring.vex.toggle(authoring.vex.chat.readOnly, "on")
        authoring.vex.addModerators(visitor.email.toUpperCase()) // If adding uppercase, should save as lower case (method checks for that already)
        cy.wait(1500)
        cy.visit(rocketChatSession.url)
        consumption.vex.expectRocketChat()
        cy.get(consumption.vex.rocketChat.moderatorViewButton).should('exist')
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.ifNoElementWithExactTextExists("span", "This room is read only", 20000, ()=>{}, "div") // Smart wait for that text to stop exisiting
            cy.contains("This room is read only").should("not.exist")
        })

        // Not going to test moderator functions of deleting/kicking out users as all of this occurs within the rocket chat browser - this is 3rd party software
    })
})