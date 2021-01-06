import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'rocketChatConfiguration.js',
    slug: 'rocketchatconfig-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    form: {name: "Standard Form Short"}
}

const sessions = {
    liveCurrent: {
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
        }
    },
    liveEnded: {
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
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    onDemand: {
        name: `Rocket-Chat: Configurations, long (name) with. special! character$ as_"this" caused bug & stuff / yeah? 1234 #iamtheone++==*@`,
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    liveZoom: {
        name: `Live Zoom`,
        slug: "live-zoom",
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
        rocketChat: {addNew: true}
    }
}

const visitor = {
    email: 'bearbear@gmail.com',
    name: 'bear'
}

describe("Vex - Rocket Chat Configuration", ()=>{
    it("Set up rocket chat on authoring side if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                Object.values(sessions).forEach((session)=>{
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.addWidget("Chat")
                    authoring.vex.backToEvent(event.name)
                })
            }
        })
    })

    it("Test turning chat on/off for live and on demand sessions, moderators, and read only toggles, and verify each on consumption", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        cy.log("Set rocket chat to show up only for live sessions on a live session, then verify rocket chat exists on consumption")
        authoring.vex.goToSessionConfig(sessions.liveCurrent.name)
        authoring.vex.configureRocketChat({live: true, onDemand: false})
        cy.visit(sessions.liveCurrent.url)
        consumption.vex.fillStandardForm({email: visitor.email})
        consumption.vex.expectRocketChat()

        cy.log("Set rocket chat to show up only for on demand sessions on a live session, then verify rocket chat doesn't exist on consumption") 
        cy.go("back")
        authoring.vex.configureRocketChat({live: false, onDemand: true})
        cy.visit(sessions.liveCurrent.url)
        consumption.vex.expectWebex() // This'll force the page to load first before checking that rocktechat doesn't exist
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")

        cy.log("Set rocket chat to show up only for live sessions on an on-demand session, then verify rocket chat doesn't exist on consumption")
        cy.go("back")
        authoring.vex.backToEvent(event.name)
        authoring.vex.goToSessionConfig(sessions.onDemand.name)
        authoring.vex.configureRocketChat({live: true, onDemand: false})
        cy.visit(sessions.onDemand.url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")

        cy.log("Set rocket chat to show up only for on demand sessions on an on-demand session, then verify rocket chat exists on consumption")
        cy.go("back")
        authoring.vex.configureRocketChat({live: false, onDemand: true})
        cy.visit(sessions.onDemand.url)
        consumption.vex.expectRocketChat()

        cy.log("Set rocket chat to show up only for live sessions on a live session that has fallen back to on-demand, and verify rocket chat doesn't exist on consumption")
        cy.go("back")
        authoring.vex.backToEvent(event.name)
        authoring.vex.goToSessionConfig(sessions.liveEnded.name)
        authoring.vex.configureRocketChat({live: true, onDemand: false})
        cy.visit(sessions.liveEnded.url)
        consumption.vex.expectYoutube()
        cy.get(consumption.vex.rocketChat.iframe).should("not.exist")

        cy.log("Set rocket chat to show up only for on-demand sessions on a live session that has fallen back to on-demand, and verify rocket chat exists on consumption")
        cy.go("back")
        authoring.vex.configureRocketChat({live: false, onDemand: true})
        cy.visit(sessions.liveEnded.url)
        consumption.vex.expectRocketChat()

        cy.log("Input validation check for adding moderator (note: current sessions is live session that has ended, rocket chat is on)")
        cy.go("back")
        authoring.vex.backToEvent(event.name)
        authoring.vex.removeSession(sessions.liveZoom.name)
        authoring.vex.addSession(sessions.liveZoom.name)
        authoring.vex.configureSession(sessions.liveZoom)
        authoring.vex.configureRocketChat({moderators: visitor.email})
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

        cy.log("Input validation check for editing moderator") 
        authoring.vex.configureRocketChat({moderators: "test@gmail.com"})
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

        cy.log("Verify on consumption side that the moderator was added") 
        cy.visit(sessions.liveZoom.url)
        consumption.vex.expectRocketChat()
        cy.get(consumption.vex.rocketChat.moderatorViewButton).should('exist') // Unfortunately, clicking this will open a new tab to separate domain, which is not allowed within Cypress
        cy.go("back")

        cy.log("Edit moderator and verify on consumption side")
        authoring.vex.goToChat()
        authoring.vex.editModerator({moderator: visitor.email, newEmail: "random@gmail.com"})
        cy.wait(1000)
        cy.visit(sessions.liveZoom.url)
        consumption.vex.expectRocketChat()
        cy.get(consumption.vex.rocketChat.moderatorViewButton).should('not.exist')
        cy.go("back")

        cy.log("Delete moderator")
        authoring.vex.goToChat()
        authoring.vex.deleteModerators("random@gmail.com")

        cy.log("Make chat read only - and verify on consumption as non-moderator")
        authoring.vex.configureRocketChat({readOnly: "on"})
        cy.wait(1000)
        cy.visit(sessions.liveZoom.url)
        consumption.vex.expectRocketChat()
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.contains("This room is read only").should("exist")
        })
        cy.go("back")

        cy.log("Turn off read only mode and verify on consumption") 
        authoring.vex.configureRocketChat({readOnly: "off"})
        cy.wait(1000)
        cy.visit(sessions.liveZoom.url)
        consumption.vex.expectRocketChat()
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.ifNoElementWithExactTextExists("span", "This room is read only", 20000, ()=>{}, "div") // Smart wait for that text to stop existing
            cy.contains("This room is read only").should("not.exist")
        })
        cy.go("back")

        cy.log("Make the visitor a moderator then turn chat to read only mode - moderator should not be affected by read-only mode")
        authoring.vex.configureRocketChat({
            readOnly: "on",
            moderators: visitor.email.toUpperCase() // If adding uppercase, should save as lower case (method checks for that)
        })
        cy.wait(1000)
        cy.visit(sessions.liveZoom.url)
        consumption.vex.expectRocketChat()
        cy.get(consumption.vex.rocketChat.moderatorViewButton).should('exist')
        cy.getIframeBody(consumption.vex.rocketChat.iframe).within(()=>{
            cy.ifNoElementWithExactTextExists("span", "This room is read only", 20000, ()=>{}, "div") // Smart wait for that text to stop exisiting
            cy.contains("This room is read only").should("not.exist")
        })

        // Not going to test moderator functions of deleting/kicking out users as all of this occurs within the rocket chat browser - this is 3rd party software
    })
})