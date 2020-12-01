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

const privateSessionGroup = {
    name: "Private Group",
    sessions: [privateSession.name]
}

const deleteSessionGroup = {
    name: "Delete Session Group",
    sessions: [publicSession.name]
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
            type: "Session Group",
            sessionGroup: deleteSessionGroup.name,
        },
        {
            type: "Session Group",
            sessionGroup: privateSessionGroup.name,
            expectNoSessions: [privateSession.name]
        },
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
                    url: "/stock/sm/bench-forest-trees-path.jpg"
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
                    url: "/stock/sm/bench-forest-trees-path.jpg"
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

const emptySessionBlockLocator = "h4:contains('Please select a session group')"

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
                authoring.vex.addSessionGroup(privateSessionGroup.name)
                authoring.vex.addToGroup(privateSessionGroup)
            }
        })
    })

    it("Test landing page", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        // Add a session group (which would be deleted later)
        authoring.vex.deleteSessionGroup(deleteSessionGroup.name)
        authoring.vex.addSessionGroup(deleteSessionGroup.name)
        authoring.vex.addToGroup(deleteSessionGroup)

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

        // Delete one of the session groups used in a block
        cy.go("back")
        authoring.vex.deleteSessionGroup(deleteSessionGroup.name)

        // Verify deleted in the editor 
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(testLandingPage.name)
        cy.contains(authoring.vex.pages.sessionGroupRow, deleteSessionGroup.name).should("not.exist")

        // Visit it on consumption 
        cy.visit(testLandingPage.url)
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[1])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[2])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[3])
        cy.contains(consumption.vex.landingPage.block, "Delete me").should("not.exist")
        cy.contains(consumption.vex.landingPage.block, deleteSessionGroup.name).should("not.exist")
        cy.contains("Please select a session group").should("not.exist") // empty session block should not exist 
        cy.get(consumption.vex.sessionGroup).should("have.length", 2) // This checks that there are only 2 session group blocks (blocks 2 and 4)

        // Go back to authoring, set landing page as the home page  
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.setToHomePage(testLandingPage.name)
        cy.wait(1000)

        // Verify landing page is home page on consumption
        cy.visit(event.url)
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[1])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[2])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[3])

        // Unset the homepage and verify and consumption
        cy.go("back")
        authoring.vex.unsetHomePage(testLandingPage.name)
        cy.wait(1000)
        cy.visit(event.url)
        cy.get(consumption.vex.landingPage.block).should("not.exist")
    })
})