import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const microsite = {
    name: "micrositeCookieConsent.js",
    slug: "micrositecookieconsent-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const tracks = {
    targetConsentOn: {
        name: "micrositeCookieConsent.js T1",
        slug: "mcct-1",
        contents: [webContent.title],
        get url(){ return `${microsite.url}/${this.slug}` },
        get firstContentUrl(){ return `${this.url}/${webContent.slug}` },
        flow: "on",
        flowCTA: "Shared Resource Email Only",
        cookieConsent: "on"
    },
    targetConsentOff: {
        name: "micrositeCookieConsent.js T2",
        slug: "mcct-2",
        contents: [webContent.title],
        get url(){ return `${microsite.url}/${this.slug}` },
        get firstContentUrl(){ return `${this.url}/${webContent.slug}` },
        flow: "on",
        flowCTA: "Shared Resource Email Only",
        cookieConsent: "off"
    },
    recommendMessageOn: {
        name: "micrositeCookieConsent.js R1",
        slug: "mccr-1",
        contents: [webContent.title],
        get url(){ return `${microsite.url}/${this.slug}` },
        get firstContentUrl(){ return `${this.url}/${webContent.slug}` },
        sidebar: "on",
        sidebarOptions: { cta: "Shared Resource Email Only" },
        cookieMessage: "on"
    }
}

describe("Microsite - Cookie Consent", () => {
    it("Setup tracks and microsite if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()

                authoring.recommend.addTrack(tracks.recommendMessageOn)
                authoring.recommend.configure(tracks.recommendMessageOn)
                authoring.target.addTrack(tracks.targetConsentOff)
                authoring.target.configure(tracks.targetConsentOff)
                authoring.target.addTrack(tracks.targetConsentOn)
                authoring.target.configure(tracks.targetConsentOn)

                authoring.microsites.addMicrosite(microsite)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({
                    recommend: tracks.recommendMessageOn.name, 
                    target: [tracks.targetConsentOn.name, tracks.targetConsentOff.name]
                })
            }
        })
    })

    it("Microsite cookie consent on - all tracks should have cookie consent enabled regardless of track settings", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name,
            cookieConsent: true
        })

        // Visit landing page
        cy.visit(microsite.url)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit target track with cookie consent on 
        cy.visit(tracks.targetConsentOn.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit target track with cookie consent off 
        cy.visit(tracks.targetConsentOff.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist")

        // Visit recommend track with cookie message on 
        cy.visit(tracks.recommendMessageOn.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("exist") 
        cy.get(consumption.microsites.cookieConsent.ok).should("not.exist") // the cookie message "ok" button should be overriden 

        // Accept cookie consent on track - should be accepted on all other tracks, as well as microsite landing pages
        cy.get(consumption.microsites.cookieConsent.accept).click({force: true})
        consumption.microsites.checkPersistentCookie(5000)
       
        cy.visit(microsite.url)
        consumption.microsites.checkPersistentCookie(5000)
        
        cy.visit(tracks.targetConsentOff.firstContentUrl)
        consumption.microsites.checkPersistentCookie(5000)
       
        
        // Toggle cookie consent off on a track - should set cookie consent to false for all tracks/landing pages 
        consumption.microsites.toggleCookieConsent("off")
        consumption.microsites.check30MinCookie(5000)
       
        cy.visit(tracks.recommendMessageOn.firstContentUrl)
        consumption.microsites.check30MinCookie(5000)
        cy.visit(microsite.url)
        consumption.microsites.check30MinCookie(5000)
      
        // Accept cookie consent on microsite landing page - should be accepted on all tracks/landing pages 
        consumption.microsites.toggleCookieConsent("on")
        consumption.microsites.checkPersistentCookie(5000)
        cy.visit(tracks.targetConsentOn.firstContentUrl)
        consumption.microsites.checkPersistentCookie(5000)
        consumption.microsites.toggleCookieConsent("off")
        consumption.microsites.check30MinCookie(5000)

        // Accept cookie consent via a standard form (CTA) - should set consent to accepted on all tracks/landing pages 
        cy.get(consumption.target.flowHeader).within(() => {
            cy.get(consumption.target.ctaButton).click()
        })
        consumption.microsites.fillStandardForm({email: "salarian.scientist@gmail.com", cookieConsent: true})
        consumption.microsites.checkPersistentCookie(5000)
        cy.visit(microsite.url)
        consumption.microsites.checkPersistentCookie(5000)
    })

    it("Microsite cookie consent off - should turn off cookie consent for all tracks and landing pages", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.setup({
            name: microsite.name,
            cookieConsent: false
        })

        cy.visit(microsite.url)
        consumption.microsites.checkPersistentCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")

        cy.visit(tracks.targetConsentOn.firstContentUrl)
        consumption.microsites.checkPersistentCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")

        cy.visit(tracks.targetConsentOff.firstContentUrl)
        consumption.microsites.checkPersistentCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist")

        cy.visit(tracks.recommendMessageOn.firstContentUrl)
        consumption.microsites.checkPersistentCookie(5000)
        cy.get(consumption.microsites.cookieConsent.messageBox).should("not.exist") 
    })
})