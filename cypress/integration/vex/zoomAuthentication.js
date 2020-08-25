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
    }
}

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
    beforeEach(()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(session.name)
    })

    it('Zoom authentication set to no password needed', function() {
        authoring.vex.configureLive({
            zoomAuth: "No Password"
        })
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 20000})

        cy.visit(session.url)
        cy.get(consumption.vex.emailInput, {timeout: 10000}).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })

    it('Zoom authentication set to Apply Password Automatically For Attendee', function() {
        authoring.vex.configureLive({
            zoomAuth: "Apply Password Automatically For Attendee",
            zoomPW: "12345"
        })
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 20000})

        cy.visit(session.url)
        cy.get(consumption.vex.emailInput).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })

    it('Zoom authentication set to Require Password From Attendee', function() {
        authoring.vex.configureLive({
            zoomAuth: "Require Password From Attendee",
            zoomPW: "12345"
        })
        cy.contains("button", "Save").click()
        cy.get("body").should("contain", "The record was saved successfully.", {timeout: 20000})

        cy.visit(session.url)
        cy.get(consumption.vex.emailInput).should('exist')
        cy.get(consumption.vex.meetingPWInput).should('exist')

        // If you provide the wrong password, this should prevent you from attending 
        cy.get(consumption.vex.emailInput).clear().type("bobman@gmail.com")
        cy.get(consumption.vex.meetingPWInput).clear().type("54321")
        cy.contains("button", "Submit").click()
        cy.contains('div', "Meeting password is invalid").should('exist')
        cy.get('iframe').should('not.exist')
        cy.get('form').should('exist')

        // If you provide the right password, you should be able to attend session 
        cy.get(consumption.vex.meetingPWInput).clear().type("12345")
        cy.contains("button", "Submit").click()
        cy.waitForIframeToLoad('iframe', consumption.vex.zoomRootDiv, 10000)
        cy.getIframeBody('iframe').within(()=>{
            cy.get(consumption.vex.zoomRootDiv).should('exist')
        })
        cy.get('form').should('not.exist')
        cy.contains('div', "Meeting password is invalid").should('not.exist')
    })

    it("If you have previously registered and provided meeting PW, and then revisit with same email on fresh browser, no need to provide name or zoom pw again", ()=>{
        cy.visit(`${session.url}?lb_email=bobman%40gmail.com`)
        cy.wait(1000)
        cy.get(consumption.vex.emailInput).should('not.exist')
        cy.get(consumption.vex.meetingPWInput).should('not.exist')
    })
})