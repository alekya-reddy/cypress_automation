import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' });
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' });

const event = {
    name: 'vexCookieConsent.js',
    slug: 'vexcookieconsent-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: "live content current",
    slug: "live-content-current",
    get url() {
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

const formWithCookieConsent = { name: 'vexCookieConsent.js1' }
const formWithoutCookieConsent = { name: 'vexCookieConsent.js2' }

const user = { email: "jo@gmail.com" }

describe("VEX - Cookie Consent", () => {
    it("Set up event if not already done", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
            }
        })
    })

    it("No cookie consent enabled, but it is enabled on the form", () => {
        // Set the form and disable cookie consent 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(formWithCookieConsent)
        authoring.vex.setCookieConsent(false)
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.wait(2000)

        // Visit consumption page and verify that vid cookie is persistentt cookie, and the cookie consent message box doesn't appear
        cy.clearCookies()
        cy.visit(event.url)
        cy.get(consumption.vex.cookieConsent.messageBox).should('not.exist')
        consumption.vex.checkPersistentCookie(5000)

        // Verify the form doesn't have the cookie consent checkbox (even though it is enabled on the form)
        cy.get(consumption.vex.standardForm.emailInput).should('exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('not.exist')
    })

    it("Cookie consent enabled but form doesn't have it", () => {

        // Set the form and enable cookie consent 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(formWithoutCookieConsent)
        authoring.vex.setCookieConsent(true)
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.wait(2000)

        // Visit consumption page and verify that vid cookie is a session cookie to start with 
        cy.clearCookies()
        cy.visit(event.url)
        consumption.vex.check30MinCookie(5000)

        // Verify cookie consent message box exists
        cy.get(consumption.vex.cookieConsent.messageBox).should('exist')

        // Go to session page and verify same thing 
        cy.contains("a", session.name)
        cy.get(consumption.vex.cookieConsent.messageBox).should('exist')

        // Decline cookie consent and verify vid is still session cookie
        cy.get(consumption.vex.cookieConsent.decline).click()
        consumption.vex.check30MinCookie(5000)
        cy.get(consumption.vex.header.cookieSettings).should('exist')
    })

    it("Cookie consent enabled and form has it enabled as well", () => {
        // Set the form and enable cookie consent 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(formWithCookieConsent)
        authoring.vex.setCookieConsent(true)
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.wait(2000)

        // Visit consumption page and verify that vid cookie is a session cookie to start with 
        cy.clearCookies()
        cy.visit(event.url)
        consumption.vex.check30MinCookie(5000)

        // Verify that the cookie consent message box is present, and clicking accept will change vid cookie to persistent 
        cy.get(consumption.vex.cookieConsent.messageBox).should('exist')
        cy.get(consumption.vex.cookieConsent.accept).click()
        cy.get(consumption.vex.cookieConsent.messageBox).should('not.exist')
        consumption.vex.checkPersistentCookie(5000)

        // Verify that the cookie settings gear is present in the header, and from here can toggle consent to true or false, which should change vid cookie accordingly 
        consumption.vex.toggleCookieConsent("off")
        consumption.vex.check30MinCookie(5000)
        consumption.vex.toggleCookieConsent("on")
        consumption.vex.checkPersistentCookie(5000)
        consumption.vex.toggleCookieConsent("off")
        consumption.vex.check30MinCookie(5000)

        // Verify that the form has the cookie consent checkbox and that it correctly sets the vid cookie 
        cy.get(consumption.vex.standardForm.emailInput).clear().type(user.email)
        cy.contains("button", "Submit").click()
        cy.get(consumption.vex.standardForm.emailInput).should('exist') // Need to agree to cookie consent before you can continue 
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('exist').click()
        cy.contains("button", "Submit").click()
        cy.get(consumption.vex.standardForm.emailInput).should('not.exist')
        consumption.vex.checkPersistentCookie(5000)

        // Go to session page and verify vid cookie still persistent and the cookie settings is still accessible from here 
        cy.visit(session.url)
        consumption.vex.checkPersistentCookie(5000)
        cy.get(consumption.vex.header.settingButton).should('exist')
        consumption.vex.toggleCookieConsent("off")
        consumption.vex.check30MinCookie(5000)
    })

    it("Cookie consent disabled on org settings", () => {
        // Turn off cookie consent for the entire org, and verify this no longer exists on VEX on authoring side
        authoring.common.login()
        authoring.settings.configureCookieConsent({ option: authoring.settings.cookieConsent.options.disable })
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        cy.get(authoring.vex.cookieConsentCheckbox).should("not.exist")

        // Confirm cookie consent no longer exists on VEX on consumption side
        cy.visit(event.url)
        cy.get(consumption.vex.header.cookieSettings).should('not.exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('not.exist')
        consumption.vex.checkPersistentCookie(5000)

        // Turn cookie consent on for the entire org, and verify this exists on VEX on authoring side
        authoring.settings.visitCookieConsent()
        authoring.settings.configureCookieConsent({ option: authoring.settings.cookieConsent.options.enableForAll })
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        cy.wait(5000)
        cy.get(authoring.vex.cookieConsentCheckbox).should("exist")

        // Confirm cookie consent exists on VEX on consumption side 
        cy.visit(event.url)
        cy.wait(5000)
        cy.get(consumption.vex.cookieConsent.decline).click()
        cy.get(consumption.vex.cookieConsent.messageBox).should('not.exist')
        cy.get(consumption.vex.header.cookieSettings, { timeout: 10000 }).should('exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('exist')
        consumption.vex.check30MinCookie(5000)
    })

    it("Afterhook: In case cookie consent left disabled from last test scenario, turn it back on for the organization", () => {
        cy.visit(event.url)
        let cookieConsentOn = false
        cy.ifElementExists(consumption.vex.cookieConsent.messageBox, 5000, () => {
            cookieConsentOn = true
        })
        cy.get("body").then(() => {
            if (cookieConsentOn == false) {
                authoring.common.login()
                authoring.settings.configureCookieConsent({ option: authoring.settings.cookieConsent.options.enableForAll })
            }
        })
    })
})