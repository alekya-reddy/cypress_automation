import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'});
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'maxSessionAttendees.js',
    slug: 'maxsessionattendees-js',
    form: {name: 'Standard Form Short'},
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; }
}

const sessions = {
    zoom: {
        name: "zoom",
        newName: "zoom",
        slug: "zoom",
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
        maxAttendees: "1",
        stayOnPage: true
    },
    webex: {
        name: "webex",
        newName: "zoom",
        slug: "webex",
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
        stayOnPage: true
    },
    liveContentLibrary: {
        name: "live-video",
        newName: "zoom",
        slug: "live-video",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Youtube - Used in Cypress automation for VEX testing'
        },
        stayOnPage: true
    },
    onDemand: {
        name: "on-demand",
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
}

const visitor = {email: "Jim.Raynor@gmail.com"}
const visitor2 = {email: "Sara.Kerrigan@gmail.com", checkSuccess: false}
const visitor3 = {email: "Preator.Fenix@gmail.com", checkSuccess: false}
const visitor4 = {email: "Arcturus.Mengsk@gmail.com", checkSuccess: false}
const visitor5 = {email: "Tassadar@gmail.com", checkSuccess: false}
const moderator = {email: "moderator@gmail.com"}

const maxAttendeesMinumumMessage = ["Currently, 4 attendees in the session", "The maximum cannot be less than that"] // Stupid text broken up by weird spaces

describe("VEX - maximum session attendees configuration", ()=>{

    it("Verify max attendees functionality - max set to 1 - First and second visitors", ()=>{
        authoring.common.login()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)
        authoring.vex.addSession(sessions.onDemand.name)

        // Max attendees should be configurable only on live sessions - not on on-demand sessions
        authoring.vex.configureSession(sessions.onDemand)
        cy.get(authoring.vex.maxAttendeesInput).should("have.attr", "disabled")
        authoring.vex.configureSession(sessions.webex)
        cy.get(authoring.vex.maxAttendeesInput).should("not.have.attr", "disabled")
        authoring.vex.configureSession(sessions.liveContentLibrary)
        cy.get(authoring.vex.maxAttendeesInput).should("not.have.attr", "disabled")
        authoring.vex.configureSession(sessions.zoom) // This will set max attendees to 1
        authoring.vex.goToWidget()
        authoring.vex.addWidget('Chat')
        authoring.vex.goToChat()
        authoring.vex.addModerators(moderator.email)

        // Visit the session and register - should allow the first visitor to attend 
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor)
        cy.reload() // There is edge case bug where you will see max attendees reached message erroneously - refreshing allows you to attend. Happens when only 1 slot left open 
        consumption.vex.expectZoom()

        // The second visitor should be blocked from attending as max of 1 has been reached 
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor2)
        cy.get("body").should("contain", consumption.vex.messages.maxAttendeesReached)
        cy.reload()
        cy.get(consumption.vex.zoom.iframe).should("not.exist")

        // A moderator should still be able to attend even though max reached (moderator still counts towards the # of attendees)
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(moderator)
        cy.get("body").should("not.contain", consumption.vex.messages.maxAttendeesReached)
        consumption.vex.expectZoom()
    })

    it("Increase max sessions to 2, and now second person should be able to attend ", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureSession({name: sessions.zoom.name, maxAttendees: "3"})

        // Revisit as the second visitor and attend the session 
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor2)
        cy.reload()
        cy.wait(2000)
        cy.reload() // Bug: if only 1 slot left, last person to register directly to session will erroneously see max attendees reached message, refreshing allows you to attend
        consumption.vex.expectZoom()

        // Try to attend as a 3rd visitor - should be blocked 
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor3)
        cy.get("body").should("contain", consumption.vex.messages.maxAttendeesReached)
        cy.reload()
        cy.get(consumption.vex.zoom.iframe).should("not.exist")
    })

    it("Set max to blank to disable limit - 3rd person should be able to attend", ()=>{
        // Set max attendees to blank - this should remove any caps on attendees 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureSession({name: sessions.zoom.name, maxAttendees: "{enter}"})

        // Revisit as the third visitor and attend the session 
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor3)
        consumption.vex.expectZoom()
    })

    it("Attempt to set max to number less than currently registered attendees - this should not be allowed", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureSession({name: sessions.zoom.name, type: sessions.zoom.type})
        cy.get(authoring.vex.maxAttendeesInput).clear().type("2")
        cy.get(authoring.vex.saveButton).click()
        cy.contains(maxAttendeesMinumumMessage[0]).should('exist')
        cy.contains(maxAttendeesMinumumMessage[1]).should('exist')

        // Saving the current number of attendees as max attendees is allowed
        cy.get(authoring.vex.maxAttendeesInput).clear().type("4")
        cy.get(authoring.vex.saveButton).click()
        cy.get("body").should("contain", authoring.vex.messages.recordSaved)

        //Set the session to end so the session falls back to the on-demand video. I should be able to attend as 4th visitor even though max has been exceeded
        authoring.vex.configureSession({live: {end: 'Jun 25, 2020 8:00pm'}, stayOnPage: true})
        cy.get(authoring.vex.maxAttendeesInput).should("not.have.attr", "disabled")
        cy.get(authoring.vex.maxAttendeesInput).should("have.attr", "value", "4")
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor4)
        consumption.vex.expectYoutube()
    })

    it("Toggle the live session, which has registered attendees, to an on-demand session. Max attendees should be disabled.", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(sessions.zoom.name)

        // Set session to an on-demand session - should disable max attendees (value remains)
        authoring.vex.configureSession({type: "On Demand", stayOnPage: true})
        cy.get(authoring.vex.maxAttendeesInput).should("have.attr", "disabled")
        cy.get(authoring.vex.maxAttendeesInput).should("have.attr", "value", "4")

        // Visit session to confirm that the limit no longer applies 
        cy.clearCookies()
        cy.visit(sessions.zoom.url)
        consumption.vex.fillStandardForm(visitor5)
        consumption.vex.expectYoutube()
    })

})