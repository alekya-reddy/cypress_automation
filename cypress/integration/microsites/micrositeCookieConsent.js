import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]
const pf_consentDecline = "0.1800.0.0"
const pf_consentAccept = "1.864000.1.1"
const pf_consentDecline_strictMode = "0.-86400.0.0"
const email = `test${Math.floor((Math.random() * 1000000000) + 1)}@pf.com`

const microsite = {
    name: "micrositeCookieConsent.js",
    slug: "micrositecookieconsent-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const tracks = {
    target: {
        name: "micrositeCookieConsent.js T1",
        slug: "mcct-1",
        contents: [webContent.title],
        get url(){ return `${microsite.url}/${this.slug}` },
        get firstContentUrl(){ return `${this.url}/${webContent.slug}` },
        flow: "on",
        flowCTA: "Shared Resource Email Only",
        cookieConsent: "on"
    },
    recommend: {
        name: "micrositeCookieConsent.js R1",
        slug: "mccr-1",
        contents: [webContent.title],
        get url(){ return `${microsite.url}/${this.slug}` },
        get firstContentUrl(){ return `${this.url}/${webContent.slug}` },
        sidebar: "on",
        sidebarOptions: { cta: "Shared Resource Email Only" },
        cookieMessage: "on"
    },
    targetwithform: {
        name: "micrositetargetform.js",
        slug: "micrositetargetform-js",
        contents: [webContent.title],
        get url(){ return `${microsite.url}/${this.slug}` },
        get firstContentUrl(){ return `${this.url}/${webContent.slug}` },
        flow: "on",
        formsStrategy: "on",
        formsStrategyOptions: {
            trackRule: {
                form: "Shared Resource Email Only",
                timeOnTrack: '0',
                showToUnknown: "on",
                showToKnown: "off",
                dismissable: "on"
            }
        }
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

const cookieConsentConfig3 = {
    visitorCookieLifeTime: 10,
    consentConfiguration: "Cookie Consent managed by PathFactory for all visitors",
    noConsentOrDecline: "Do not collect data",
    consentDefault: "Enabled automatically for all products"
}

describe("Microsite - Cookie Consent", () => {
    it("Setup tracks and microsite if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()

                authoring.recommend.addTrack(tracks.recommend)
                authoring.recommend.configure(tracks.recommend)
                authoring.target.addTrack(tracks.target)
                authoring.target.configure(tracks.target)
                authoring.target.addTrack(tracks.targetwithform)
                authoring.target.configure(tracks.targetwithform)
            
                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({
                    recommend: tracks.recommend.name, 
                    target: [tracks.target.name, tracks.targetwithform.name]
                })
            }
        })
    })

    it("Microsite cookie consent - Cookie consent Not required at org level and validate pf_consent and VID cookies", () => {       
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('not.have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')
       
         // Visit landing page
         cy.visit(microsite.url)
         cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
         consumption.microsites.checkPf_consentCookie(5000)
         consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)
       
        cy.visit(tracks.recommend.firstContentUrl)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)

        cy.visit(tracks.target.firstContentUrl)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig1.visitorCookieLifeTime)
    })

    it("Microsite cookie consent- Collect Data - Accept consent on cookie consent dialog and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')
        
        // Visit landing page
        cy.visit(microsite.url)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit target track with cookie consent on 
        cy.visit(tracks.target.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.messageBox).should("exist")

        // Visit recommend track with cookie message on 
        cy.visit(tracks.recommend.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox, { timeout: 20000 }).should("exist") 

        // Accept cookie consent on track - should be accepted on all other tracks, as well as microsite landing pages
        cy.get(consumption.microsites.cookieConsent.accept).click({force: true})
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)

        cy.visit(microsite.url)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)
        
        cy.visit(tracks.target.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)

        cy.visit(tracks.recommend.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)
    })

    it("Microsite cookie consent- Collect Data - Decline consent on cookie consent dialog and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')

        //Decline cookie consent - should be declined on all other tracks, as well as microsite landing pages
        cy.visit(microsite.url)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")
        cy.get(consumption.microsites.cookieConsent.decline).click({force: true})
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)

        cy.visit(tracks.target.firstContentUrl)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)

        cy.visit(tracks.recommend.firstContentUrl)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)
    })

    it("Microsite cookie consent- Do not Collect Data - Accept consent on cookie consent dialog and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig3)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')
        
        // Visit landing page
        cy.visit(microsite.url)
        consumption.microsites.checkVidValueAndExpiry(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit target track with cookie consent on 
        cy.visit(tracks.target.firstContentUrl)
        consumption.microsites.checkVidValueAndExpiry(5000)
        consumption.microsites.checkPf_consentCookie(5000)
        cy.get(consumption.target.cookieConsent.messageBox).should("exist")

        // Visit recommend track with cookie message on 
        cy.visit(tracks.recommend.firstContentUrl)
        consumption.microsites.checkVidValueAndExpiry(5000)
        consumption.microsites.checkPf_consentCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox, { timeout: 20000 }).should("exist") 

        // Accept cookie consent on track - should be accepted on all other tracks, as well as microsite landing pages
        cy.get(consumption.microsites.cookieConsent.accept).click({force: true})
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig3.visitorCookieLifeTime)

        cy.visit(microsite.url)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig3.visitorCookieLifeTime)
        
        cy.visit(tracks.target.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig3.visitorCookieLifeTime)

        cy.visit(tracks.recommend.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig3.visitorCookieLifeTime)
    })

    it("Microsite cookie consent- Do not Collect Data - Decline consent on cookie consent dialog and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig3)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')

        //Decline cookie consent - should be declined on all other tracks, as well as microsite landing pages
        cy.visit(microsite.url)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")
        consumption.microsites.checkVidValueAndExpiry(5000)
        cy.get(consumption.microsites.cookieConsent.decline).click({force: true})
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.microsites.checkVidValueAndExpiry(5000)

        cy.visit(tracks.target.firstContentUrl)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.microsites.checkVidValueAndExpiry(5000)

        cy.visit(tracks.recommend.firstContentUrl)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline_strictMode)
        consumption.microsites.checkVidValueAndExpiry(5000)
    })

    it("Microsite cookie consent- Collect Data - Accept cookie on form and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')
        
        // Visit landing page
        cy.visit(microsite.url)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit target track with cookie consent on 
        cy.visit(tracks.targetwithform.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.messageBox).should("exist")

        // Accept cookie consent on form - should be accepted on all other tracks, as well as microsite landing pages
        cy.wait(3000)
        cy.get(consumption.common.standardForm.cookieConsentCheckbox).click()
        cy.get('#emailInput').type(email +"\n")
        
        cy.get(consumption.microsites.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)

        cy.visit(microsite.url)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)
        
        cy.visit(tracks.target.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)

        cy.visit(tracks.recommend.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentAccept)
        consumption.microsites.checkVidValueAndExpiry(5000, cookieConsentConfig2.visitorCookieLifeTime)
    })

    it("Microsite cookie consent- Collect Data - Decline cookie on form and validate pf_consent and VID cookies", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig2)

        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name
        })

        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','checked')
        cy.get(authoring.microsites.setupPage.cookieConsentCheckbox).should('have.attr','disabled')
        
        // Visit landing page
        cy.visit(microsite.url)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit target track with cookie consent on 
        cy.visit(tracks.targetwithform.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.target.cookieConsent.messageBox).should("exist")

        // Decline cookie consent on form - should be declined on all other tracks, as well as microsite landing pages
        cy.wait(3000)
        cy.get('#emailInput').type(email +"\n")
        
        cy.get(consumption.microsites.cookieConsent.messageBox, { timeout: 20000 }).should('not.exist')
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)

        cy.visit(microsite.url)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)
        
        cy.visit(tracks.target.firstContentUrl)
        consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)

        cy.visit(tracks.recommend.firstContentUrl)
       consumption.microsites.checkPf_consentCookie(5000, pf_consentDecline)
        consumption.microsites.check30MinCookie(5000)
    })

    it("Afterhook: In case cookie consent left Enabled from last test scenario, turn it back off(Disabled) for the organization", () => {
        authoring.common.login()
        authoring.settings.navigateToCookieConsentSettings()
        authoring.settings.cookieConsentOrganizationSettings(cookieConsentConfig1)
    })
})