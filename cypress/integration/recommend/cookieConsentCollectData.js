import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-recommend", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-recommend', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const pf_consentDecline = "0.1800.0.0"
const pf_consentAccept = "1.864000.1.1"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

const customFunctionAccept = `<script>
pfOnJukeboxLoad.then(function () {

console.log('Cookie consent accepted through external function')
          window.pf("setConsentSettings", { accepted: true, trackKnownVisitor: true });
});
</script>`

const customFunctionDecline = `<script>
pfOnJukeboxLoad.then(function () {

console.log('Cookie consent declined through external function')
          window.pf("setConsentSettings", { accepted: false, trackKnownVisitor: false });
});
</script>`

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

const recommendwithPromoters = [{
    name: "recommend-cookieform.js",
    slug: "recommend-cookieform",
    contents: [webContent.title],
    sidebar: "on",
    header: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
},
{
    name: "recommend-cookieform.js",
    slug: "recommend-cookieform",
    contents: [webContent.title],
    topicSidebar: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}
]

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
    consentConfiguration: "Cookie Consent managed by external cookie consent manager",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products",
    customScript: customFunctionAccept
}

const cookieConsentConfig4 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by external cookie consent manager",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products",
    customScript: customFunctionDecline
}

describe("Recommend - Cookie consent Scenarios - Non Strict mode", () => {
    it("Apply Cookie consent not required , Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        //When Consent Configuration value is 'Cookie Consent not required' ,cookie consent toggle is not available on the authoring side
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('not.exist')
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.recommend.checkPf_consentCookie(5000)
        consumption.recommend.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(2000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.recommend.check30MinCookie(5000)
        cy.get(consumption.recommend.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.recommend.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.recommend.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and Decline the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.recommend.check30MinCookie(5000)
        cy.get(consumption.recommend.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.recommend.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.recommend.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and accept the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.recommend.deleteTrack(recommendwithform.name)
        authoring.recommend.addTrack(recommendwithform)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommendwithform)

        cy.visit(recommendwithform.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.recommend.check30MinCookie(5000)
        cy.get(consumption.recommend.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(100)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.recommend.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.recommend.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor, email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and decline the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.recommend.deleteTrack(recommendwithform.name)
        authoring.recommend.addTrack(recommendwithform)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommendwithform)

        cy.visit(recommendwithform.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.recommend.check30MinCookie(5000)
        cy.wait(100)
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.recommend.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.recommend.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2 object defined above and validate cookie consent and optin showing for all promoters", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        recommendwithPromoters.forEach(recommendtrack => {
            cy.clearCookies()
            authoring.common.login()
            authoring.recommend.deleteTrack(recommendtrack.name)
            authoring.recommend.addTrack(recommendtrack)
            cy.get(authoring.recommend.cookieConsentToggle).should('exist')
            authoring.common.checkCookieConsentToggle("ON")
            authoring.recommend.configure(recommendtrack)

            cy.wait(4000)
            cy.visit(recommendtrack.url)
            cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
            cy.get(consumption.recommend.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
            cy.get(consumption.common.header.cookieSettings, { timeout: 20000 }).should('exist')
            authoring.common.login()
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig3 object defined above and accept the cookie in external cookie function, Validate the VID ,pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig3)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        cy.reload()
        cy.wait(2000)
        consumption.recommend.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.recommend.checkVidValueAndExpiry(5000, cookieConsentConfig3.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig4 object defined above and decline the cookie in external cookie function, Validate the VID ,pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig4)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        cy.visit(recommend.url)
        cy.get(consumption.recommend.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.recommend.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.recommend.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

})