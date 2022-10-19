import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-explore", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-explore', tld: 'lookbookhq' })

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const pf_consentAccept = "1.864000.1.1"
const pf_consentDecline_strictMode = "0.-86400.0.0"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

const recommend = {
    name: "recommend-cookie.js",
    slug: "recommend-cookie",
    contents: [webContent.title],
    header: "on"
}

const target = {
    name: "target-cookie.js",
    slug: "target-cookie",
    contents: [webContent.title],
    header: "on"
}

const targetwithform = {
    name: "target-cookieform.js",
    slug: "target-cookieform",
    contents: [webContent.title],
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

const exploreTarget = {
    name: 'TargetexploreCookie.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'exploretargetcookie',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const exploreTargetwithForm = {
    name: 'targetexpwithformcookie.js',
    experienceType: 'Target',
    trackName: targetwithform.name,
    slug: 'targetexpwithformcookie',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const exploreRecommend = {
    name: 'RecommendexploreCookie.js',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'explorerecommendcookie',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const exploreRecommendwithForm = {
    name: 'recommendexpwithformcookie.js',
    experienceType: 'Recommend',
    trackName: recommendwithform.name,
    slug: 'recommendexpwithformcookie',
    get url() {
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const cookieConsentConfig1 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Do not collect data",
    consentDefault: "Enabled automatically for all products"
}

const cookieConsentConfig = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent not required"
}

describe("Explore - Cookie consent Scenarios - Strict mode", () => {
    it("Target explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreTarget.name)

        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        authoring.explore.addExplore(exploreTarget)
        authoring.explore.configureExplore(exploreTarget)
        cy.visit(exploreTarget.url)

        cy.contains('div', target.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.explore.checkVidValueAndExpiry(5000)
        cy.get(consumption.explore.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        cy.reload()
        cy.wait(4000)
        consumption.explore.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.explore.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor)
        })
    })

    it("Target explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and Decline the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreTarget.name)

        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(target)

        authoring.explore.addExplore(exploreTarget)
        authoring.explore.configureExplore(exploreTarget)
        cy.visit(exploreTarget.url)

        cy.contains('div', target.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.explore.checkVidValueAndExpiry(5000)

        cy.get(consumption.explore.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        consumption.explore.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.explore.checkVidValueAndExpiry(5000);
    })

    it("Target explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and accept the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreTargetwithForm.name)

        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        authoring.explore.addExplore(exploreTargetwithForm)
        authoring.explore.configureExplore(exploreTargetwithForm)
        cy.visit(exploreTargetwithForm.url)

        cy.contains('div', targetwithform.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.wait(3000)
        cy.get(consumption.explore.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(3000)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.reload()
        cy.wait(4000)
        consumption.explore.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.explore.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.target.validateAnalyticsData(visitor,email)
        })
    })

    it("Target explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and decline the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreTargetwithForm.name)

        authoring.target.deleteTrack(targetwithform.name)
        authoring.target.addTrack(targetwithform)
        cy.get(authoring.target.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.target.configure(targetwithform)

        authoring.explore.addExplore(exploreTargetwithForm)
        authoring.explore.configureExplore(exploreTargetwithForm)
        cy.visit(exploreTargetwithForm.url)

        cy.contains('div', targetwithform.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.wait(3000)
        consumption.explore.checkVidValueAndExpiry(5000);
        cy.wait(3000)
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.explore.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.explore.checkVidValueAndExpiry(5000);
    })

    it("Recommend explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and accept the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommend.name)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        authoring.explore.addExplore(exploreRecommend)
        authoring.explore.configureExplore(exploreRecommend)
        cy.visit(exploreRecommend.url)

        cy.contains('div', recommend.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.explore.checkVidValueAndExpiry(5000)
        cy.get(consumption.explore.cookieConsent.accept, { timeout: 20000 }).should('exist').click()
        cy.reload()
        cy.wait(4000)
        consumption.explore.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.explore.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor)
        })
    })

    it("Recommend explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and Decline the cookie, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommend.name)

        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommend)

        authoring.explore.addExplore(exploreRecommend)
        authoring.explore.configureExplore(exploreRecommend)
        cy.visit(exploreRecommend.url)

        cy.contains('div', recommend.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        consumption.explore.checkVidValueAndExpiry(5000)

        cy.get(consumption.explore.cookieConsent.decline, { timeout: 20000 }).should('exist').click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.explore.checkVidValueAndExpiry(5000)

        consumption.explore.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.explore.checkVidValueAndExpiry(5000);
    })

    it("Recommend explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and accept the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommendwithForm.name)

        authoring.recommend.deleteTrack(recommendwithform.name)
        authoring.recommend.addTrack(recommendwithform)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommendwithform)

        authoring.explore.addExplore(exploreRecommendwithForm)
        authoring.explore.configureExplore(exploreRecommendwithForm)
        cy.visit(exploreRecommendwithForm.url)

        cy.contains('div', recommendwithform.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.wait(3000)
        consumption.explore.checkVidValueAndExpiry(5000)
        cy.get(consumption.explore.cookieConsent.accept, { timeout: 20000 }).should('exist')
        cy.wait(3000)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email + "\n")
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        cy.reload()
        cy.wait(4000)
        consumption.explore.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.explore.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime).then(visitor => {
            cy.wait(3000)
            authoring.common.login()
            cy.closeSession()
            authoring.recommend.validateAnalyticsData(visitor, email)
        })
    })

    it("Recommend explore - Configure Cookie consent settings using cookieConsentConfig1 object defined above and decline the cookie on form, Validate the VID , pf_consent and Analytics values", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommendwithForm.name)

        authoring.recommend.deleteTrack(recommendwithform.name)
        authoring.recommend.addTrack(recommendwithform)
        cy.get(authoring.recommend.cookieConsentToggle).should('exist')
        authoring.common.checkCookieConsentToggle("ON")
        authoring.recommend.configure(recommendwithform)

        authoring.explore.addExplore(exploreRecommendwithForm)
        authoring.explore.configureExplore(exploreRecommendwithForm)
        cy.visit(exploreRecommendwithForm.url)

        cy.contains('div', recommendwithform.contents[0]).click()
        cy.get(consumption.explore.cookieConsent.messageBox, { timeout: 20000 }).should('exist')
        cy.wait(3000)
        consumption.explore.checkVidValueAndExpiry(5000)
        cy.wait(3000)
        cy.get('#emailInput').type(email + "\n")
        consumption.explore.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.explore.checkVidValueAndExpiry(5000);
    })

    it("Afterhook: In case cookie consent left Enabled from last test scenario, turn it back off(Disabled) for the organization", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig)
    })
})