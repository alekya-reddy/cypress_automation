import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Youtube Shared Resource", "Bay cat Wikipedia", "Website Common Resource",]
const pf_consentDecline = "0.1800.0.0"
const pf_consentAccept = "1.864000.1.1"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`
const email2 = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

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
    flowCTA: {
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

describe("Target - Cookie consent Scenarios - Non Strict mode", () => {
    it("Apply Cookie consent not required , Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        //When Cookie consent not required ,cookie consent toggle is not available on the authoring side
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('not.exist')
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(2000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and Decline the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and Do not touch the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.contains(webContent[2], { timeout: 20000 }).click({ force: true })
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.checkPf_consentCookie(5000)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and Decline cookie from Opt-in popup, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.common.cookieConsentToggle("off")
        cy.reload()
        cy.wait(3000)
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        cy.wait(3000)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            cy.log(visitor)
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and Accept cookie from Opt-in popup, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        //Navigate to Consumption and accept cookie and validate the details
        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.common.cookieConsentToggle("on")
        cy.reload()
        cy.wait(5000)
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and accept the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        cy.visit(targetwithform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor, email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and decline the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        cy.visit(targetwithform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.wait(100)
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and accept the cookie on cta form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(targetwithctaform.name)
        authoring.target.addTrack(targetwithctaform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithctaform)

        cy.wait(3000)
        cy.visit(targetwithctaform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.ctaButton, { timeout: 20000 }).eq(0).click({ force: true })
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateCtaAnalyticsData(targetwithctaform.name, visitor, email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and decline the cookie on cta form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(targetwithctaform.name)
        authoring.target.addTrack(targetwithctaform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithctaform)

        cy.wait(3000)
        cy.visit(targetwithctaform.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.ctaButton, { timeout: 20000 }).eq(0).click({ force: true })
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateCtaAnalyticsData(targetwithctaform.name, visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and provide lb_email,accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url + `?lb_email=${email}`)
        cy.url().should("include", "_pfses=")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor, email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and provide lb_email,accept the cookie on form with different email, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        cy.wait(3000)
        cy.visit(targetwithform.url + `?lb_email=${email}`)
        cy.url().should("include", "_pfses=")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email2 + "\n")
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor, email2)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and accept the cookie and visit another org, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.target.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })

        cy.visit(`https://automation-microsites.${authoring.common.env.TEST_ENV}-pathfactory.com/c/watch-3?x=T9RdMJ`)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
    })

})