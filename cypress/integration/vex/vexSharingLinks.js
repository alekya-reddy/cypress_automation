import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'vexSharingLinks.js',
    slug: 'vexsharinglinks-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session1 = {
    name: "session1",
    slug: "session1",
    get url(){
        return `${event.url}/${this.slug}`
    }
}

const session2 = {
    name: "session2",
    slug: "session2",
    get url(){
        return `${event.url}/${this.slug}`
    }
}

const landingPageShare = {
    name: "landingPageShare",
    slug: "landingpageshare",
    get url(){
        return `${event.url}/${this.slug}`
    }
}

describe("VEX - Sharing links", ()=>{
    it("Set up event, sessions and landing page if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session1.name)
                authoring.vex.addSession(session2.name)
                authoring.vex.addLandingPages(landingPageShare.name)
            }
        })
    })

    it("There should be sharing links in the event cards, session cards,event configuration page and landing pages", ()=>{
        // Note: Not going into detail to ensure query string options are present, or that base domain changings according to sharing url 
        // These features are already tested in test files dedicated to testing sharing urls and query strings 
        authoring.common.login()
        authoring.vex.visit()

        // Check for sharing links on the event card 
        cy.containsExact(authoring.vex.eventCardTitle, event.name, {timeout: 20000}).parents(authoring.vex.eventCardLocator).within(()=>{
            cy.get(authoring.vex.shareIcon).should('exist').click()
        })
        cy.contains(authoring.vex.modal, "Share Link").within(()=>{
            cy.contains(event.url).should("exist")
        })
        cy.get(authoring.vex.closeModal).click()
        cy.contains(authoring.vex.modal).should("not.exist")

        // Check for sharing links on the event configuration page
        authoring.vex.goToEventConfig(event.name)
        cy.containsExact("span", event.url, {timeout: 20000}).parent().within(()=>{
            cy.get(authoring.vex.shareIcon).click()
        })
        cy.contains(authoring.vex.modal, "Share Link").within(()=>{
            cy.contains(event.url).should("exist")
        })
        cy.get(authoring.vex.closeModal).click()
        cy.contains(authoring.vex.modal).should("not.exist")

        // Check for sharing link on the first session card
        authoring.vex.goToSessionList()
        cy.get(authoring.vex.sessionName(session1.name)).siblings(authoring.vex.sessionShareCell).within(()=>{
            cy.get(authoring.vex.shareIcon).click()
        })
        cy.contains(authoring.vex.modal, "Share Link").within(()=>{
            cy.contains(session1.url).should("exist")
        })
        cy.get(authoring.vex.closeModal).click()
        cy.contains(authoring.vex.modal).should("not.exist")

        // Check for sharing link on the second session card
        cy.get(authoring.vex.sessionName(session2.name)).siblings(authoring.vex.sessionShareCell).within(()=>{
            cy.get(authoring.vex.shareIcon).click()
        })
        cy.contains(authoring.vex.modal, "Share Link").within(()=>{
            cy.contains(session2.url).should("exist")
        })
        cy.get(authoring.vex.closeModal).click()
        cy.contains(authoring.vex.modal).should("not.exist")

        // Check for sharing link on landing page
        authoring.vex.goToLandingPage()
        cy.containsExact(authoring.vex.antCell, landingPageShare.name, {timeout: 20000}).siblings(authoring.vex.landingPageShareCell).within(()=>{
            cy.get(authoring.vex.shareIcon).click()
        })
        cy.contains(authoring.vex.modal, "Share Link").within(()=>{
            cy.contains(landingPageShare.url).should("exist")
        })
        cy.get(authoring.vex.closeModal).click()
        cy.contains(authoring.vex.modal).should("not.exist")
    })
})