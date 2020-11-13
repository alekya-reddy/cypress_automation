import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'zoomAuthentication.js',
    slug: 'zoomauthentication-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: 'Zoom authentication',
    slug: 'zoomauthentication-js',
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
        zoomNum: '1234',
        zoomAuth: 'No Password'
    }
}

// For the next to 2 sessions, the set up is that session2 (a zoom session requiring password) is switched to a content library live session 
const session2 = {
    name: 'Zoom to CL',
    slug: 'zoomtocl-js',
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
        zoomNum: '1234',
        zoomAuth: "Require Password From Attendee",
        zoomPW: "12345"
    }
}

const session3 = {
    name: 'Zoom to CL',
    slug: 'zoomtocl-js',
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
    }
}

const email = `bobman${Math.random()}@gmail.com` // Need to generate new email each time because it will remember you from last time, and not ask for meeting PW again
const emailQueryString = email.replace("@", "%40") // @ won't work in a query string, so using %40 encoding

/* Expected behavior for zoom authentication 
    If 'no password' option is set, should be able to attend a zoom session.
    If 'apply password automatically' option is set, the end user would see no difference than if no password were set. 
    However, if the incorrect password is set on authoring side, attendees would not be able to attend. Cannot test this 
    scenario as this would require a live zoom meeting, and there's no way to set one up to be open indefinitely. 
    If 'require password' option is set, then attendees must enter the correct zoom password to be able to get into the zoom
    session. In the case that the wrong password is entered on authorin side, attendees would be able to get into the 
    session but the zoom meeeting itself would not connect. Again, can't test that zoom meeting actually connect. Can only
    test using a dummy zoom meeting number. 

    If form requires a zoom password, if you are visiting with same email that you used before (and entered the password), you won't be asked for it again
    if revisiting on a fresh incognito browser.
*/
describe('VEX - Virtual Event, zoom authentication', function() {

    const visitSessionConfig = () => {
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(session.name)
    }

    it('Zoom authentication set to no password needed', function() {
        visitSessionConfig()
        authoring.vex.configureLive({
            zoomAuth: "No Password"
        })
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.wait(2000)

        cy.visit(session.url)
        cy.get(consumption.vex.emailInput, {timeout: 10000}).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })

    it('Zoom authentication set to Apply Password Automatically For Attendee', function() {
        visitSessionConfig()
        authoring.vex.configureLive({
            zoomAuth: "Apply Password Automatically For Attendee",
            zoomPW: "12345"
        })
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.wait(2000)

        cy.visit(session.url)
        cy.get(consumption.vex.emailInput).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })

    it('Zoom authentication set to Require Password From Attendee', function() {
        visitSessionConfig()
        authoring.vex.configureLive({
            zoomAuth: "Require Password From Attendee",
            zoomPW: "12345"
        })
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 3000})
        cy.wait(2000)

        cy.visit(session.url)
        cy.get(consumption.vex.emailInput).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('exist')

        // If you provide the wrong password, this should prevent you from attending 
        cy.get(consumption.vex.emailInput).clear().type(email)
        cy.get(consumption.vex.meetingPWInput).clear().type("54321")
        cy.contains("button", "Submit").click()
        cy.contains('div', "Meeting password is invalid").should('exist')
        cy.get('iframe').should('not.exist')
        cy.get('form').should('exist')

        // If you provide the right password, you should be able to attend session 
        cy.get(consumption.vex.meetingPWInput).clear().type("12345")
        cy.contains("button", "Submit").click()
        consumption.vex.expectZoom()
        cy.get('form').should('not.exist')
        cy.contains('div', "Meeting password is invalid").should('not.exist')

        // Also check that zoom has link to open up in separate tab in case of connectivity issues
        cy.contains("a", "Click here to launch the meeting directly.").should('exist')
        cy.get(`a[href^='https://zoom.us/j/${session.live.zoomNum}']`).should('exist')
    })

    it("If you have previously registered and provided meeting PW, and then revisit with same email on fresh browser, no need to provide name or zoom pw again", ()=>{
        cy.visit(`${session.url}?lb_email=${emailQueryString}`) 
        cy.wait(1000)
        cy.get(consumption.vex.emailInput).should('not.exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })

    it("If require zoom password option is still active but live type has been switched to content library, you should not be asked for zoom password", ()=>{
        // There was a bug where if the 'require password' option is still active, it would still ask for zoom PW despite no longer being a zoom session 
        cy.visit(session3.url)
        cy.get(consumption.vex.emailInput, {timeout: 20000}).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })

})