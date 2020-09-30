import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'landingPage.js',
    slug: 'landingpage-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }    
}

const publicSession = {
    name: "public-session",
    slug: "public-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const privateSession = {
    name: "private-session",
    slug: "private-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Private',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const sessions = [publicSession, privateSession]

const sessionGroupA = {
    name: "Group A",
    sessions: [publicSession.name, privateSession.name]
}

const firstBlockText = "I should be first"

const testLandingPage = {
    name: "Test Landing Page",
    slug: "test-landing-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "HTML",
            content: `<h1>${firstBlockText}</h1>`,
            checkContent: {
                text: [firstBlockText],
                locators: ["h1"]
            },
            typography: {
                color: {r: "255", g: "255", b: "255"},
                textAlign: 'right'
            },
            className: "george",
            background: {
                color: {r: "0", g: "200", b: "200"},
                image: {
                    category: "Stock Images",
                    url: "https://img.cdn.lookbookhq.com/stock/sm/bench-forest-trees-path.jpg"
                },
                position: "top",
                size: "contain"
            },
            spacing: "6rem"
        },
        {
            type: "Session Group",
            sessionGroup: sessionGroupA.name,
            expectSessions: [publicSession.name],
            expectNoSessions: [privateSession.name],
            heading: {
                color: {r: "0", g: "255", b: "255"},
                textAlign: 'center'
            },
            background: {
                color: {r: "0", g: "200", b: "100"},
                image: {
                    category: "Stock Images",
                    url: "https://img.cdn.lookbookhq.com/stock/sm/bench-forest-trees-path.jpg"
                },
                position: "bottom",
                size: "cover"
            },
            spacing: "91px"
        },
        {
            type: "HTML",
            content: "<p>Delete me</p>"
        }
    ]
}

describe("VEX - Landing Page Editor", ()=>{
    it("Set up if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                sessions.forEach((session)=>{
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
                authoring.vex.addSessionGroup(sessionGroupA.name)
                authoring.vex.addToGroup(sessionGroupA)
            }
        })
    })

    it("Test landing page", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        // Clear out all landing pages 
        authoring.vex.clearLandingPages()

        // Add, edit landing pages 
        authoring.vex.addLandingPages([testLandingPage.name, "Edit me"])
        authoring.vex.editLandingPage(testLandingPage)
        authoring.vex.editLandingPage({name: "Edit me", newName: "Delete me"})

        // Input validation for adding name 
        authoring.vex.addLandingPages(testLandingPage.name, false)
        cy.contains(authoring.common.messages.duplicateEntry2).should('exist')
        cy.contains("button:visible", "Cancel").click()
        authoring.vex.addLandingPages(" ", false)
        cy.contains(authoring.common.messages.blankInput).should('exist')
        cy.contains("button:visible", "Cancel").click()

        // Input validation for editing name 
        authoring.vex.editLandingPage({name: "Delete me", newName: testLandingPage.name, verify: false})
        cy.contains(authoring.common.messages.duplicateEntry2).should('exist')
        cy.contains("button:visible", "Cancel").click()
        authoring.vex.editLandingPage({name: "Delete me", newName: " ", verify: false})
        cy.contains(authoring.common.messages.blankInput).should('exist')
        cy.contains("button:visible", "Cancel").click()

        // Input validation for slug 
        authoring.vex.editLandingPage({name: "Delete me", slug: testLandingPage.slug, verify: false})
        cy.contains(authoring.common.messages.duplicateEntry3).should('exist')
        cy.contains("button:visible", "Cancel").click()

        // Remove landing page
        authoring.vex.deleteLandingPages("Delete me")

        // Modify landing page (the editor) - Add various html and session blocks
        authoring.vex.goToPageEditor(testLandingPage.name)
        testLandingPage.blocks.forEach((block)=>{
            authoring.vex.addAdvancedBlock(block)
            cy.get(authoring.vex.pages.blockContainer).eq(0).click() // This makes the add block button reappear
        })

        // Remove one of the blocks 
        authoring.vex.removeBlock("p:contains('Delete me')") // method contains assertion

        // Reorder the blocks and verify 
        authoring.vex.moveBlock(`h1:contains('${firstBlockText}')`, "up")
        cy.get(authoring.vex.pages.blockContainer).eq(0).should('contain', firstBlockText)
        cy.get(authoring.vex.pages.blockContainer).eq(1).should('contain', sessionGroupA.name)
        cy.contains("button", "Save").click()

        // Visit it on consumption 
        cy.visit(testLandingPage.url)
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[0])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[1])
        cy.contains(consumption.vex.landingPage.block, "Delete me").should("not.exist")

        // Go back to authoring, set landing page as the home page  
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.setToHomePage(testLandingPage.name)
        cy.wait(1000)

        // Verify landing page is home page on consumption
        cy.visit(event.url)
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[0])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[1])

        // Unset the homepage and verify and consumption
        cy.go("back")
        authoring.vex.unsetHomePage(testLandingPage.name)
        cy.wait(1000)
        cy.visit(event.url)
        cy.get(consumption.vex.landingPage.block).should("not.exist")
    })
})