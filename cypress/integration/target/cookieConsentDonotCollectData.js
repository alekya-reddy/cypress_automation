import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Youtube Shared Resource", "Bay cat Wikipedia", "Website Common Resource",]
const pf_consentAccept = "1.864000.1.1"
const pf_consentDecline_strictMode="0.-86400.0.0"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

const target = {
    name: "target-cookie.js",
    slug: "target-cookie",
    contents: webContent,
    header: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const targetwithform = {
    name: "target-cookieform.js",
    slug: "target-cookieform",
    contents: webContent,
    header: "on",
    flow: "on",
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
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const targetwithctaform = {
    name: "target-cookiectaform.js",
    slug: "target-cookiectaform",
    contents: webContent,
    header: "on",
    formsStrategy: "on",
    flow: "on",
    flowCTA:  {
        ctaNumber: "CTA 1",
        flowCTA: "emailonly",
        location: "Before assets",
        buttonColor: "#04977d",
        fontColor: "#483d1e",
        addcta: true
    },
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

function validateAnalyticsData(visitor, email) {
    cy.wait(5000)
    authoring.target.visit()
    cy.get(authoring.target.targetAnalytics).should("exist").click()
    cy.contains('div', "Last 30 Days").should("exist")
    cy.contains('[role="menuitem"] div.ant-menu-submenu-title', "Visitors").should("exist").click()
    cy.contains('a', 'Visitor Journeys per Session').click()
    if (!email)
        cy.contains('[data-qa-hook="table-cell-identity"]', visitor).should('exist')
    else {
        cy.contains('[data-qa-hook="table-cell-identity"]', visitor).should('not.exist')
        cy.contains('[data-qa-hook="table-cell-identity"]', email).should('exist')
    }
}

function validateCtaAnalyticsDataForStrictMode(name,visitor, email) {
    cy.wait(5000)
    authoring.target.visit()
    authoring.target.goToTrack(name)

    cy.wait(3000)
    cy.get("a[href*='analytics-overview']",{timeout:10000}).should("exist").click()
    cy.contains('[role="menuitem"] div.ant-menu-submenu-title', "Events",{timeout:10000}).should("exist").click()
    cy.contains('a', 'Form Captures').click()
    if (!email)
        cy.contains('[data-qa-hook="table-cell-email"]', visitor).should('exist')
    else {
        cy.contains('[data-qa-hook="table-cell-email"]', visitor).should('not.exist')
        cy.contains('[data-qa-hook="table-cell-email"]', email).should('exist')
    }
}

const cookieConsentConfig1 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Do not collect data",
    consentDefault: "Enabled automatically for all products"
}

describe("Target - Cookie consent Scenarios - Strict mode", () => {

    it("Configure Cookie consent settings using cookieConsentConfig1,accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig1,Decline the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.target.checkVidValueAndExpiry(5000);
    })

    it("Configure Cookie consent settings using cookieConsentConfig1,Do not touch the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.contains(webContent[2], { timeout: 20000 }).click({ force: true })
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.checkPf_consentCookie(5000)
        consumption.target.checkVidValueAndExpiry(5000);
    })

    it("Configure Cookie consent settings using cookieConsentConfig1,accept the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        //Navigate to Consumption and accept cookie and validate the details
        cy.visit(targetwithform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor,email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig1,decline the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        //Navigate to Consumption and accept cookie and validate the details
        cy.visit(targetwithform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.target.checkVidValueAndExpiry(5000);
    })

    it("Configure Cookie consent settings using cookieConsentConfig1,accept the cookie on cta form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(targetwithctaform.name)
        authoring.target.addTrack(targetwithctaform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithctaform)

        cy.wait(3000)
        //Navigate to Consumption and accept cookie and validate the details
        cy.visit(targetwithctaform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.ctaButton,{timeout:20000}).eq(0).click({force:true})
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateCtaAnalyticsDataForStrictMode(targetwithctaform.name,visitor,email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig1,decline the cookie on cta form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
        authoring.target.deleteTrack(targetwithctaform.name)
        authoring.target.addTrack(targetwithctaform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithctaform)

        cy.wait(3000)
        //Navigate to Consumption and accept cookie and validate the details
        cy.visit(targetwithctaform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.ctaButton,{timeout:20000}).eq(0).click({force:true})
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.target.checkVidValueAndExpiry(5000);
    })

    xit("Navigate to custom domain experienece and accept the cookie", () => {
        cy.clearCookies()
        cy.visit(`http://custom.pathfactory-${authoring.common.env.TEST_ENV}-test.com/gdpr_custom_domain/fs-cio`,{timeout:120000})
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)
    })

})