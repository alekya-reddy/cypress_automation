import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Youtube Shared Resource", "Bay cat Wikipedia", "Website Common Resource",]
const pf_consentDecline = "0.1800.0.0"
const pf_consentAccept = "1.864000.1.1"
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

const customFunctionAccept = `<script>
pfOnJukeboxLoad.then(function () {

console.log('partial consent obtained')
          window.pf("setConsentSettings", { accepted: true, trackKnownVisitor: true });
});
</script>`

const customFunctionDecline = `<script>
pfOnJukeboxLoad.then(function () {

console.log('partial consent obtained')
          window.pf("setConsentSettings", { accepted: false, trackKnownVisitor: false });
});
</script>`

const promotersTarget = [{
    name: "target-cookie.js",
    slug: "target-cookie",
    contents: webContent,
    flow: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
},
{
    name: "target-cookie.js",
    slug: "target-cookie",
    contents: webContent,
    signposts: "on",
    header: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
},
{
    name: "target-cookie.js",
    slug: "target-cookie",
    contents: webContent,
    bottombar: "on",
    header: "on",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}]

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

const cookieConsentConfig2 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products"
}

const cookieConsentConfig3 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for visitors with an originating IP from selected countries",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products",
    countries: ["United States of America", "Canada", "India"]
}

const cookieConsentConfig4 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for visitors with an originating IP from selected countries",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products",
    countries: ["Afghanistan"]
}

const cookieConsentConfig5 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled for newly created items"
}

const cookieConsentConfig6 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Not enabled for newly created items"
}

const cookieConsentConfig7 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by external cookie consent manager",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products",
    customScript: customFunctionAccept
}

const cookieConsentConfig8 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by external cookie consent manager",
    noConsentOrDecline: "Collect data anonymously with 30-minute cookie",
    consentDefault: "Enabled automatically for all products",
    customScript: customFunctionDecline
}

describe("Target - Cookie consent Scenarios - Non Strict mode", () => {

    it("Configure Cookie consent settings using cookieConsentConfig2,decline the cookie and visit another org, Validate the VID , pf_consent and Analytics values", () => {
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
        cy.get(consumption.target.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })

        cy.visit(`https://automation-microsites.${authoring.common.env.TEST_ENV}-pathfactory.com/c/watch-3?x=T9RdMJ`)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
    })

    it("Configure Cookie consent settings using cookieConsentConfig2,accept the cookie and visit another experience, Validate the VID , pf_consent and Analytics values", () => {
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
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })

        cy.visit(`https://automation-target.${authoring.common.env.TEST_ENV}-pathfactory.com/c/index-html?x=L3FgPy`)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2,decline the cookie and visit another experience, Validate the VID , pf_consent and Analytics values", () => {
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
        cy.get(consumption.target.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })

        cy.visit(`https://automation-target.${authoring.common.env.TEST_ENV}-pathfactory.com/c/index-html?x=L3FgPy`)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig2,validate cookie consent and optin showing for all promoters", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)
        promotersTarget.forEach(targettrack => {
            cy.clearCookies()
            authoring.common.login()
            authoring.target.deleteTrack(targettrack.name)
            authoring.target.addTrack(targettrack)
            cy.get(authoring.target.cookieConsentToggle).should('exist')
            authoring.common.checkCookieConsentToggle("ON")
            authoring.target.configure(targettrack)

            cy.wait(4000)
            cy.visit(targettrack.url)
            cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
            cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
            cy.get(consumption.common.header.cookieSettings, { timeout: 20000 }).should('exist')
            authoring.common.login()
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig3,provide lb_email,accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig3)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.wait(3000)
        cy.visit(target.url + `?lb_email=${email}`)
        cy.url().should("include", "_pfses=")
        cy.wait(3000)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.get(consumption.target.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig3.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor, email)
        })
    })

    xit("Configure Cookie consent settings using cookieConsentConfig4,provide lb_email, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig4)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.wait(3000)
        cy.visit(target.url + `?lb_email=${email}`)
        cy.wait(2000)
        cy.url().should("include", "_pfses=")
        cy.wait(3000)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig4.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor, email)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig5,validate cookie consent toggle in authoring side", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig5)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
    })

    it("Configure Cookie consent settings using cookieConsentConfig6,validate cookie consent toggle in authoring side", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig6)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("off")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
    })

    it("Configure Cookie consent settings using cookieConsentConfig7,accept the cookie in external cookie function, Validate the VID ,pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig7)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        cy.reload()
        cy.wait(2000)
        consumption.target.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.target.checkVidValueAndExpiry(5000, cookieConsentConfig7.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })
    })

    it("Configure Cookie consent settings using cookieConsentConfig8,decline the cookie in external cookie function, Validate the VID ,pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig8)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        cy.visit(target.url)
        cy.get(consumption.target.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.target.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.target.check30MinCookie(5000).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            validateAnalyticsData(visitor)
        })
    })

})