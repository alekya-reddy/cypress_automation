import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-recommend", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-recommend', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const pf_consentAccept = "1.864000.1.1"
const pf_consentDecline_strictMode = "0.-86400.0.0"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

const recommend = {
    name: "recommend-cookie.js",
    slug: "recommend-cookie",
    contents: [webContent.title],
    header: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}

const recommendwithform = {
    name: "recommend-cookieform.js",
    slug: "recommend-cookieform",
    contents: [webContent.title],
    sidebar: "on",
    formsStrategy: "on",
    formsStrategyOptions: {
        trackRule: {
            form: "Standard Form Email with cookie",
            timeOnTrack: '0',
            showToUnknown: "on",
            showToKnown: "on",
            dismissable: "on"
        }
    },
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}


const cookieConsentConfig1 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Do not collect data",
    consentDefault: "Enabled automatically for all products"
}

describe("Recommend - Cookie consent Scenarios - Strict mode", () => {
    it("Configure Cookie consent settings using cookieConsentConfig1 object defined above and accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.recommend.checkVidValueAndExpiry(5000)
        cy.get(consumption.recommend.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        cy.reload()
        cy.wait(3000)
        consumption.recommend.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.recommend.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig1 object defined above and Decline the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.recommend.checkVidValueAndExpiry(5000)
        cy.get(consumption.recommend.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.recommend.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.recommend.checkVidValueAndExpiry(5000);
    })

    it("Configure Cookie consent settings using cookieConsentConfig1 object defined above and accept the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.recommend.deleteTrack(recommendwithform.name)
        authoring.recommend.addTrack(recommendwithform)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommendwithform)

        cy.visit(recommendwithform.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.recommend.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        cy.reload()
        cy.wait(3000)
        consumption.recommend.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.recommend.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor, email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig1 object defined above and decline the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.recommend.deleteTrack(recommendwithform.name)
        authoring.recommend.addTrack(recommendwithform)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommendwithform)

        cy.visit(recommendwithform.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.recommend.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.recommend.checkVidValueAndExpiry(5000);
    })
})