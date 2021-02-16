import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'blackList.js',
    slug: 'blacklist-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: "on demand",
    slug: "on-demand",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: 'Jun 24, 2020 8:00pm',
        end: 'Jun 24, 2041 8:00pm',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Content Library',
        video: 'Youtube - Used in Cypress automation for VEX testing',
    },
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const form = {name: "Standard Form Short"}
const noForm = { name: "None (Registration Not Required)" }

const visitor = {
    email: "Bearington.Bear.123@gmail.com",
    newEmail: "Paddington.Bear@gmail.com",
    lb_email_query_string: "/?lb_email=bearington.bear.123%40gmail.com",
    checkSuccess: false // this is for the fillStandard form method 
}

const visitor2 = {
    email: "Test@gmail.com"
}

describe("VEX - Blacklist", ()=>{
    it("Set up if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
            }
        })
    })

    it("Add emails to blacklist and test on consumption", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        // Clean up any existing emails 
        authoring.vex.clearBlacklist()

        // Add and edit emails 
        authoring.vex.addToBlacklist([visitor.email, visitor2.email], true) // Note: verifies that it saves in lowercase 
        authoring.vex.editBlacklistEmail({email: visitor.email, newEmail: visitor.newEmail, verify: true})
        authoring.vex.editBlacklistEmail({email: visitor.newEmail, newEmail: visitor.email})

        // Test edit email input validation 
        authoring.vex.editBlacklistEmail({email: visitor2.email, newEmail: " ", verify: false})
        cy.contains(authoring.common.messages.blankInput).should("exist")
        cy.contains("button:visible", "Cancel").click()
        authoring.vex.editBlacklistEmail({email: visitor2.email, newEmail: visitor.email, verify: false})
        cy.contains(authoring.common.messages.duplicateEntry2).should("exist")
        cy.contains("button:visible", "Cancel").click()
        authoring.vex.editBlacklistEmail({email: visitor2.email, newEmail: "safaffasl", verify: false})
        cy.contains(authoring.common.messages.invalidEmail2).should("exist")
        cy.contains("button:visible", "Cancel").click()

        // Test add email input validation 
        authoring.vex.addToBlacklist(visitor.email, false)
        cy.contains(authoring.common.messages.duplicateEntry2).should("exist")
        cy.contains("button", "Cancel").click()
        authoring.vex.addToBlacklist(" ", false)
        cy.contains(authoring.common.messages.blankInput).should("exist")
        cy.contains("button", "Cancel").click()
        authoring.vex.addToBlacklist("fafafsdf", false)
        cy.contains(authoring.common.messages.invalidEmail2).should("exist")
        cy.contains("button", "Cancel").click()

        // Verify can remove from blacklist
        authoring.vex.removeFromBlacklist(visitor2.email)

        // Add Form to event   
        authoring.vex.goToEventSetup()
        authoring.vex.configureForm(form)
        cy.wait(1000)

        // Verify on consumption - register on event page and check that blacklisted email can't attend
        cy.visit(event.url)
        consumption.vex.fillStandardForm(visitor)
        cy.contains(consumption.vex.messages.blacklisted, {timeout: 10000}).should('exist')
        cy.visit(session.url)
        consumption.vex.fillStandardForm({email: visitor.email.toUpperCase(), checkSuccess: false}) // Should be able to detect regardless of case
        cy.contains(consumption.vex.messages.blacklisted, {timeout: 10000}).should('exist')

        // Register on session page and verify that blacklisted can't attend
        cy.clearCookies()
        cy.visit(session.url)
        consumption.vex.fillStandardForm(visitor)
        cy.contains(consumption.vex.messages.blacklisted, {timeout: 10000}).should('exist')

        // Verify that can't visit by entering url with query string directly 
        cy.clearCookies()
        cy.visit(session.url + visitor.lb_email_query_string)
        cy.contains(consumption.vex.messages.blacklisted, {timeout: 10000}).should('exist')
        cy.get(consumption.vex.jukeBoxApp).should('not.exist')

        // Clear cookies and verify that a non-black-listed user can still attend 
        cy.clearCookies()
        cy.visit(event.url)
        consumption.vex.fillStandardForm(visitor2)
        cy.visit(session.url)
        consumption.vex.expectYoutube()     
    })

    it("Switch to no form and verify that when register to a live session, it'll detect blacklisted email", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureForm(noForm)
        cy.wait(1000)

        // Visit session and register - should not be able to attend 
        cy.visit(session.url)
        consumption.vex.fillStandardForm(visitor)
        cy.contains(consumption.vex.messages.blacklisted, {timeout: 10000}).should('exist')
    })
})