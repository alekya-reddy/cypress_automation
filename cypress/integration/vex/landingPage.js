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

const carouselSession1 = {...publicSession, name: "cs1", slug: "cs1"}
const carouselSession2 = {...publicSession, name: "cs2", slug: "cs2"}
const carouselSession3 = {...publicSession, name: "cs3", slug: "cs3"}
const carouselSession4 = {...publicSession, name: "cs4", slug: "cs4"}
const carouselSession5 = {...publicSession, name: "cs5", slug: "cs5"}
const carouselSession6 = {...publicSession, name: "cs6", slug: "cs6"}

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

const carouselSessionGroup = {
    name: "Carousel Session Group",
    sessions: [carouselSession1, carouselSession2, carouselSession3, carouselSession4, carouselSession5, carouselSession6]
}

const gridSessionGroup = {
    name: "Grid Session Group",
    sessions: [carouselSession1, carouselSession2, carouselSession3, carouselSession4, carouselSession5, carouselSession6]
}

const firstBlockText = "I should be first"

const testLandingPage = {
    name: "Test Landing Page",
    slug: "test-landing-page",
    pageTitle: "This is pageTitle",
    pageDescription: "This is pageDescription",
    get url(){
        return `${event.url}/${this.slug}`
    },
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg"
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions",
        },
        {
            type: "Session Group",
            sessionGroup: deleteSessionGroup.name,
        },
        {
            type: "Session Group",
            layout: "Carousel",
            sessionGroup: carouselSessionGroup.name
        },
        {
            type: "Session Group",
            layout: "Grid",
            sessionGroup: gridSessionGroup.name
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
                textAlign: 'right',
                fontSize: "14px"
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
            spacing: "91px",
            card: {
                color: {r: "43", g: "91", b: "200"},
                textAlign: "right",
                fontSize: "17px"
            }
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
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                const sessions = [publicSession, privateSession, carouselSession1, carouselSession2, carouselSession3, carouselSession4, carouselSession5, carouselSession6]
                sessions.forEach((session)=>{
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
                const sessionGroups = [sessionGroupA, privateSessionGroup, carouselSessionGroup, gridSessionGroup]
                sessionGroups.forEach(group => {
                    authoring.vex.addSessionGroup(group.name)
                    authoring.vex.addToGroup(group)
                })
            }
        })
    })

    it("Test landing page", ()=>{
        cy.viewport(1500, 1000)
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
        //verify helper text
        cy.contains("button", "Edit").eq(0).click()
        cy.contains("div", "This title will be shown in the title tag, meta title and og title").should("exist")
        cy.contains("div", "This image will show in the og image")
        cy.contains("div", "This description will show in the meta description, and og description").should("exist")
        cy.contains("button", "Submit").click()
        cy.contains('.ant-modal-content', "Edit Landing Page").should('not.be.visible').should("exist")

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

        //Validate if all sessions from the events are shown in a block when the option is selected in the landing page builder.(Including Private Event)
        cy.contains(authoring.vex.pages.sessionGroupRow, testLandingPage.blocks[0].sessionGroup).within(() => {
            cy.get(authoring.vex.pages.sessionCardTitleName).should("have.length", 8)
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession1.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession2.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession3.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession4.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession5.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession6.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, privateSession.name). should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, publicSession.name). should('exist')
           
        })   

        // Visit it on consumption 
        //check that description,thumbnail and page Title you have set on landing pages will show up in the <title> and <description> attribute
        cy.visit(testLandingPage.url)
        cy.wait(2000)
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", testLandingPage.pageTitle);
        cy.get('meta[name="description"]').should("have.attr", "content", testLandingPage.pageDescription);
        cy.get('meta[property="og:title"]').should("have.attr", "content", testLandingPage.pageTitle); 
        cy.get('meta[property="og:description"]').should("have.attr", "content", testLandingPage.pageDescription);
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg");
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg");

        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[0])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[2])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[3])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[4])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[5])
        cy.contains(consumption.vex.landingPage.block, "Delete me").should("not.exist")
        cy.contains(consumption.vex.landingPage.block, deleteSessionGroup.name).should("not.exist")
        cy.contains("Please select a session group").should("not.exist") // empty session block should not exist 
        cy.get(consumption.vex.sessionGroup).should("have.length", 5) // This checks that there are only 4 session group blocks (blocks 1, 2, 4 and 5)

        // Validate if all sessions from the events are shown in a block when the option is selected in the preview(Excluding Private session)
        cy.contains(consumption.vex.sessionGroup, testLandingPage.blocks[0].sessionGroup).within(() => {
            cy.get(consumption.vex.sessionCardTitle).should("have.length", 7)
            cy.contains(consumption.vex.sessionCardTitle, carouselSession1.name). should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession2.name). should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession3.name). should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession4.name). should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession5.name). should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession6.name). should('exist')
            cy.contains(consumption.vex.sessionCardTitle, privateSession.name). should('not.exist')
            cy.contains(consumption.vex.sessionCardTitle, publicSession.name). should('exist')
           
        })   

        // Verify carousel session block
        cy.contains(consumption.vex.sessionGroup, testLandingPage.blocks[2].sessionGroup).within(() => {
            cy.get(consumption.vex.sessionCardTitle).should("have.length", 6)
            cy.get(consumption.vex.sessionCardTitle).eq(0).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(1).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(2).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(3).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(4).should("not.be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(5).should("not.be.visible")
            cy.get(consumption.vex.landingPage.arrowRight).click({force: true})
            cy.get(consumption.vex.sessionCardTitle).eq(0).should("not.be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(1).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(2).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(3).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(4).should("be.visible")
            cy.get(consumption.vex.sessionCardTitle).eq(5).should("not.be.visible")
        })

        // Verify grid session block
        cy.contains(consumption.vex.sessionGroup, testLandingPage.blocks[3].sessionGroup).within(() => {
            cy.get(consumption.vex.sessionCardTitle).should("have.length", 6)
            cy.get(consumption.vex.sessionCardTitle).each(sessionCard => {
                cy.get(sessionCard).should("be.visible")
            })
        })

        // Go back to authoring, set landing page as the home page  
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.setToHomePage(testLandingPage.name)
        cy.wait(1000)

        // Verify landing page is home page on consumption
        cy.visit(event.url)
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[0])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[2])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[3])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[4])
        consumption.vex.verifyLandingPageBlock(testLandingPage.blocks[5])

        // Unset the homepage and verify and consumption
        cy.go("back")
        authoring.vex.unsetHomePage(testLandingPage.name)
        cy.wait(1000)
        cy.visit(event.url)
        cy.get(consumption.vex.landingPage.block).should("not.exist")
    })
})