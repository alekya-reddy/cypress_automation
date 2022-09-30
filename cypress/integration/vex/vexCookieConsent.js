import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' });
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' });

const pf_consentDecline = "0.1800.0.0"
const pf_consentAccept = "1.864000.1.1"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

const standardForm = {
    name: 'Standard Form Short',
    uniqueLocator: "#email",
    expect: () => {cy.get("#email", {timeout: 1000}).should("exist")},
    fill: () => {consumption.vex.fillStandardForm(visitor)},
}

const formwithoutcookiecheckbox = {
    name: 'eventRegistration.js',
    uniqueLocator: "#email",
    expect: () => {cy.get("#email", {timeout: 1000}).should("exist")},
    fill: () => {consumption.vex.fillStandardForm(visitor)},
}

const event = {
    name: 'vexCookieConsent.js',
    slug: 'vexcookieconsent-js',
    form: standardForm,
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const event2 = {
    name: 'vexCookieConsent2.js',
    slug: 'vexCookieConsent2-js',
    form:formwithoutcookiecheckbox,
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = [{
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
},
{
    name: "On-Demand",
    cloneName: "Clone of On-Demand",
    slug: "on-demand",
    get url() {
        return `${event.url}/${this.slug}`
    },
    description: "on demand description",
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents: [
        'Website - Used by Cypress automation for VEX testing'
    ]
}
]

const landingPage = {
    name: "Test Landing Page",
    slug: "test-landing-page",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions"
        },
    ]
}

const cookieConsentConfig1 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent not required"
}

const cookieConsentConfig2 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products"
}

const cookieConsentConfig3 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Do not collect data",
    consentDefault: "Enabled automatically for all products"
}

describe("VEX - Cookie Consent", () => {

    it("Set up event if not already done", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                sessions.forEach(session => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    cy.go('back')
                })
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })

        cy.request({ url: event2.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event2)
                authoring.vex.configureEvent(event2)
                sessions.forEach(session => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    cy.go('back')
                })
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })

    it("VEX cookie consent - Cookie consent Not required at org level and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        cy.get(authoring.vex.cookieConsentCheckbox,{timeout:20000}).should('not.have.attr','checked')
        cy.get(authoring.vex.cookieConsentCheckbox).should('have.attr','disabled')

        cy.visit(event.url)
        cy.contains("a", sessions[0].name).click()
        cy.get(consumption.vex.cookieConsent.messageBox).should('not.exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('not.exist')       
        
        cy.get(consumption.vex.standardForm.emailInput).clear().type(email)
        cy.contains("button", "Submit").click()

        cy.get(consumption.vex.cookieConsent.messageBox).should("not.exist")
        consumption.vex.checkPf_consentCookie(5000)
        consumption.vex.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)
    })

    it("VEX cookie consent - Cookie consent Not enabled at form level ,accept cookie on box and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)

        cy.get(authoring.vex.cookieConsentCheckbox,{timeout:20000}).should('have.attr','checked')
        cy.get(authoring.vex.cookieConsentCheckbox).should('have.attr','disabled')

        cy.window().then(win => win.location.href = event2.url);
        cy.contains("a", sessions[0].name).click()
        cy.get(consumption.vex.cookieConsent.messageBox).should('exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('not.exist')   
        cy.get(consumption.vex.cookieConsent.accept).should('exist').click()
        
        cy.get(consumption.vex.standardForm.emailInput).clear().type(email)
        cy.contains("button", "Submit").click()

        cy.get(consumption.vex.cookieConsent.messageBox).should("not.exist")
        consumption.vex.checkPf_consentCookie(5000,pf_consentAccept)
        consumption.vex.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)
        cy.get(consumption.vex.header.cookieSettings).should('exist')
    })

    it("VEX cookie consent - Cookie consent Not enabled at form level ,decline cookie on box and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)

        cy.get(authoring.vex.cookieConsentCheckbox,{timeout:20000}).should('have.attr','checked')
        cy.get(authoring.vex.cookieConsentCheckbox).should('have.attr','disabled')

        cy.window().then(win => win.location.href = event2.url);
        cy.contains("a", sessions[0].name).click()
        cy.get(consumption.vex.cookieConsent.messageBox).should('exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('not.exist')   
        cy.get(consumption.vex.cookieConsent.decline).should('exist').click()
        
        cy.get(consumption.vex.standardForm.emailInput).clear().type(email)
        cy.contains("button", "Submit").click()

        cy.get(consumption.vex.cookieConsent.messageBox).should("not.exist")
        consumption.vex.checkPf_consentCookie(5000,pf_consentDecline)
        consumption.vex.check30MinCookie(5000)
        cy.get(consumption.vex.header.cookieSettings).should('exist')
    })

    it.only("VEX cookie consent - Cookie consent Not enabled at form level ,accept cookie on box and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)

        cy.get(authoring.vex.cookieConsentCheckbox,{timeout:20000}).should('have.attr','checked')
        cy.get(authoring.vex.cookieConsentCheckbox).should('have.attr','disabled')

        cy.window().then(win => win.location.href = event2.url);
        cy.contains("a", sessions[0].name).click()
        cy.get(consumption.vex.cookieConsent.messageBox).should('exist')
        cy.get(consumption.vex.standardForm.cookieConsentCheckbox).should('not.exist')   
        cy.get(consumption.vex.cookieConsent.accept).should('exist').click()
        
        cy.get(consumption.vex.standardForm.emailInput).clear().type(email)
        cy.contains("button", "Submit").click()

        cy.get(consumption.vex.cookieConsent.messageBox).should("not.exist")
        consumption.vex.checkPf_consentCookie(5000,pf_consentAccept)
        consumption.vex.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)
        cy.get(consumption.vex.header.cookieSettings).should('exist')
    })

    it("Afterhook: In case cookie consent left disabled from last test scenario, turn it back on for the organization", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
    })
})