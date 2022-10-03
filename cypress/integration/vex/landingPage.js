import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' })
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' })

const event = {
    name: 'landingPage.js',
    slug: 'landingpage-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const event1 = {
    name: 'VEXhideSession.js',
    slug: 'VEXhideSession-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
// const session1 = {
//     slug: 'NewVirtualEvent1-js',
//     name: 'Demandsession1',
//     type: 'On Demand',
//     visibility: 'Public',
//     video: 'Youtube - Used in Cypress automation for VEX testing'
// }
// const session2 = {
//     slug: 'NewVirtualEvent2-js',
//     name: 'Demandsession2',
//     type: 'Live',
//     visibility: 'Public',
//     video: 'Youtube - Used in Cypress automation for VEX testing'
// }

const publicSession = {
    name: "public-session",
    slug: "public-session",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const privateSession = {
    name: "private-session",
    slug: "private-session",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Private',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const carouselSession1 = { ...publicSession, name: "cs1", slug: "cs1" }
const carouselSession2 = { ...publicSession, name: "cs2", slug: "cs2" }
const carouselSession3 = { ...publicSession, name: "cs3", slug: "cs3" }
const carouselSession4 = { ...publicSession, name: "cs4", slug: "cs4" }
const carouselSession5 = { ...publicSession, name: "cs5", slug: "cs5" }
const carouselSession6 = { ...publicSession, name: "cs6", slug: "cs6" }

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
    get url() {
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
                color: { r: "255", g: "255", b: "255" },
                textAlign: 'right',
                fontSize: "14px"
            },
            className: "george",
            background: {
                color: { r: "0", g: "200", b: "200" },
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
                color: { r: "0", g: "255", b: "255" },
                textAlign: 'center'
            },
            background: {
                color: { r: "0", g: "200", b: "100" },
                image: {
                    category: "Stock Images",
                    url: "/stock/sm/bench-forest-trees-path.jpg"
                },
                position: "bottom",
                size: "cover"
            },
            spacing: "91px",
            card: {
                color: { r: "43", g: "91", b: "200" },
                textAlign: "right",
                fontSize: "17px"
            }
        },
        {
            type: "HTML",
            content: "<p>Delete me</p>"
        },
        {
            type: "Session Group",
            sessionGroup: 'No Sessions',
            expectNoSessions: 'No Sessions'
        },
        {
            type: "Session Group",
            sessionGroup: 'Demand Sessions'
        },
        {
            type: "Session Group",
            sessionGroup: 'Live Sessions'
        },
    ]
}

describe("VEX - Landing Page Editor", () => {
    it("Set up if not already done", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                const sessions = [publicSession, privateSession, carouselSession1, carouselSession2, carouselSession3, carouselSession4, carouselSession5, carouselSession6]
                sessions.forEach((session) => {
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

    it("Test landing page", () => {
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
        //verify new column of page title, description and thumbnail has been added
        cy.contains("th", "Page Title").should('be.visible')
        cy.contains("th", "Thumbnail").should('be.visible')
        cy.contains("th", "Page Description").should('be.visible')

        authoring.vex.editLandingPage(testLandingPage)
        //verify that edited values visible on landing page
        cy.contains("div", testLandingPage.pageTitle).should("exist")
        cy.contains("div", testLandingPage.pageDescription).should("exist")
        cy.get('img[src="https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"]').should("exist")

        authoring.vex.editLandingPage({ name: "Edit me", newName: "Delete me" })
        //verify helper text
        cy.contains('td', testLandingPage.name).siblings("td").within(() => {
            cy.contains("a", "Edit").click({ force: true })
        })
        cy.contains("div", "Used for title tag, meta title and og title. Appears in search result when event link is shared on social media.").should("exist")
        cy.contains("div", "Used for og image and appears when event link is shared on social media.")
        cy.contains("div", "Used for og description and meta description. Appears in search result when event link is shared on social media.").should("exist")
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
        authoring.vex.editLandingPage({ name: "Delete me", newName: testLandingPage.name, verify: false })
        cy.contains(authoring.common.messages.duplicateEntry2).should('exist')
        cy.contains("button:visible", "Cancel").click()
        authoring.vex.editLandingPage({ name: "Delete me", newName: " ", verify: false })
        cy.contains(authoring.common.messages.blankInput).should('exist')
        cy.contains("button:visible", "Cancel").click()

        // Input validation for slug 
        authoring.vex.editLandingPage({ name: "Delete me", slug: testLandingPage.slug, verify: false })
        cy.contains(authoring.common.messages.duplicateEntry3).should('exist')
        cy.contains("button:visible", "Cancel").click()

        // Remove landing page
        authoring.vex.deleteLandingPages("Delete me")

        // Modify landing page (the editor) - Add various html and session blocks
        authoring.vex.goToPageEditor(testLandingPage.name)
        testLandingPage.blocks.forEach((block) => {
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
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession1.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession2.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession3.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession4.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession5.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, carouselSession6.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, privateSession.name).should('exist')
            cy.contains(authoring.vex.pages.sessionCardTitle, publicSession.name).should('exist')

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
            cy.contains(consumption.vex.sessionCardTitle, carouselSession1.name).should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession2.name).should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession3.name).should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession4.name).should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession5.name).should('exist')
            cy.contains(consumption.vex.sessionCardTitle, carouselSession6.name).should('exist')
            cy.contains(consumption.vex.sessionCardTitle, privateSession.name).should('not.exist')
            cy.contains(consumption.vex.sessionCardTitle, publicSession.name).should('exist')

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
            cy.get(consumption.vex.landingPage.arrowRight).click({ force: true })
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

    const demand_session = {
        name: "ondemand session",
        slug: "ondemandession",
        visibility: 'Public',
        description: 'Session description',
        type: 'On Demand',
        video: 'Brightcove - Used in Cypress automation to test VEX',
        captions: 'on',
        captionsLanguage: "English",
    }
    const sessionGroupA = {
        name: "Demand Sessions",
        sessions: ["ondemand session"]
    }

    const live_session = {
        name: 'live session',
        slug: 'livesession',
        get url() { return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Brightcove - Used in Cypress automation to test VEX',
            liveVideoCaptions: 'on',
            captionsLanguage: "English",
        },
        captionsLanguage: "English"
    }
    const sessionGroupB = {
        name: "Live Sessions",
        sessions: ["live session"]
    }

    it('User able to hide blocks that have no session under it when no filter has been applied', () => {

        authoring.common.login()
        //  cy.intercept("POST", `https://jukebox.${authoring.common.env.TEST_ENV}-pathfactory.com/api/public/v1/page_views/create_event`).as('create_event')
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event1.name)
        authoring.vex.addVirtualEvent(event1)
        authoring.vex.configureEvent(event1)
        //creating on demand session
        authoring.vex.addSession(demand_session.name, 'On Demand')
        authoring.vex.configureSession(demand_session)
        authoring.vex.backToEvent(event1.name)

        //creating on live session
        authoring.vex.addSession(live_session.name, 'On Demand')
        authoring.vex.configureSession(live_session)
        authoring.vex.backToEvent(event1.name)

        // Add, edit landing pages 
        authoring.vex.addLandingPages(testLandingPage.name)
        //authoring.vex.goToLandingPage()
        authoring.vex.setToHomePage(testLandingPage.name)

        //creating sessions groups
        authoring.vex.addSessionGroup('No Sessions')
        authoring.vex.addSessionGroup('Demand Sessions')
        authoring.vex.addToGroup(sessionGroupA)
        authoring.vex.addSessionGroup('Live Sessions')
        authoring.vex.addToGroup(sessionGroupB)

        //verify that go to landing page and modify the page
        authoring.vex.editLandingPage(testLandingPage)
        authoring.vex.setToHomePage(testLandingPage.name)
        authoring.vex.goToPageEditor(testLandingPage.name)
        cy.wait(4000)

        //sessionGroup --no sessions
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[8]) //Adding a new block(All Sessions)to verify the configurations
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        //cy.pause()
        cy.contains('button', 'Confirm').click();


        //*********************
        // Validate if all sessions from the events are shown in a block when the option is selected in the preview(Excluding Private session)
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[9])
        cy.contains(authoring.vex.eventSessions, testLandingPage.blocks[9].sessionGroup).within(() => {
            //cy.get(authoring.vex.sessionCardTitle).should("have.length", 1)
            //blockContainer
            cy.get(authoring.vex.blockContainer).eq(0).click()
            cy.contains(authoring.vex.sessionCardTitle, demand_session.name).should('exist')
            cy.get(authoring.vex.eventSessionsBlockName, 'Demand Sessions').click()
            cy.pause()
            // cy.get(consumption.vex.sessionCardTitle, demand_session.name).scrollIntoView()
            // cy.get(consumption.vex.sessionCardTitle, demand_session.name).trigger('mouseover').click({ force: true })
            cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
            cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
            cy.pause()
            cy.contains('button', 'Confirm').click();
            cy.log("demand session is added with toggle enabled")

        })
        // *********************

        //sessionGroup --demand sessions
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[9]) //Adding a new block(All Sessions)to verify the configurations
        cy.get(authoring.vex.eventSessions).should('contain', 'ondemand session').eq(1).click({ force: true })
        cy.pause()
        cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.pause()
        cy.contains('button', 'Confirm').click();


        //sessionGroup --live session
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[10]) //Adding a new block(All Sessions)to verify the configurations
        cy.get(authoring.vex.eventSessions).eq(2).click({ force: true })
        cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        cy.wait(3000)
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.contains('button', 'Confirm').click();

        cy.contains('button', 'Save').click();
        // Verify landing page is home page on consumption
        cy.window().then(win => win.location.href = event1.url);
        cy.reload()

        //This is pageTitle
        cy.title().should('eq', testLandingPage.pageTitle)

        cy.contains("[class*='pf-event-session-card-title']", 'No sessions').should('not.exist')
        //This is pageTitle
        cy.contains(consumption.vex.sesessionCardTitle, demand_session.name, { timeout: 25000 }).should('exist')
        cy.contains(consumption.vex.sesessionCardTitle, live_session.name).should('exist')

        authoring.vex.visit()
        authoring.vex.backToEvent(event1.name)
        authoring.vex.goToLandingPage(testLandingPage.name)
        authoring.vex.goToPageEditor(testLandingPage.name)
        cy.wait(10000)

        var sessions = ["live session", "ondemand session"]
        sessions.forEach(session => {
            cy.contains("div[class*='pf-event-session-card-title']", session, { timeout: 20000 }).click({ force: true })
            cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
            cy.get(authoring.vex.pages.hideSessionToggle).click()
            cy.pause()
            cy.contains('button', 'Confirm').click();
            cy.pause()
        })

        // cy.get(authoring.vex.eventSessionsBlockName).each(($session,$index)=>{
        // cy.pause()
        // $session.eq($index).click({ force: true })
        // cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        // cy.pause()
        // cy.get(authoring.vex.pages.hideSessionToggle).click()
        // cy.pause()

        // })


        cy.contains('button', 'Save').click();





        //sessionGroup --live sessions *********************
        // //cy.get(authoring.vex.eventSessions).eq(1).click({ force: true }),,{timeout: 30000}
        // cy.get(authoring.vex.eventSessionsBlockName).eq(0).should('contain','Live Sessions').click({ force: true })
        // cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        // cy.pause()
        // cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        // cy.pause()
        // cy.contains('button', 'Confirm').click();

        // //sessionGroup --demand sessions
        // //cy.get(authoring.vex.eventSessionsBlockName).eq(2).click({ force: true })

        // cy.get(authoring.vex.eventSessionsBlockName).eq(1).should('contain','Demand Sessions').click({ force: true })

        // //cy.pause()
        // //authoring.vex.addAdvancedBlock(testLandingPage.blocks[9]) 
        // //Adding a new block(All Sessions)to verify the configurations
        // //cy.get(authoring.vex.eventSessions).eq(1).click({ force: true })
        // cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        // //cy.pause()
        // cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        // //cy.pause()
        // cy.contains('button', 'Confirm').click();

        // //sessionGroup --live session
        // cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        // authoring.vex.addAdvancedBlock(testLandingPage.blocks[8]) //Adding a new block(All Sessions)to verify the configurations
        // cy.contains('button', 'Save').click();
        //******************************** */

        // Verify landing page is home page on consumption
        cy.window().then(win => win.location.href = event1.url);
        cy.reload()
        //This is pageTitle
        cy.title().should('eq', testLandingPage.pageTitle)
        cy.contains("[class*='pf-event-sessions']", 'No Sessions').should('exist')
        cy.contains(consumption.vex.sesessionCardTitle, demand_session.name, { timeout: 25000 }).should('exist')
        cy.contains(consumption.vex.sesessionCardTitle, live_session.name).should('exist')



    })
    it('visiting modal page', () => {
        cy.visit('https://automation-vex.qa-pathfactory.com/authoring/content-library/landing-pages/27796/vex')
        cy.get("#login-data").type("cy-admin")
        cy.get("#password").type("Cypress1234")
        cy.get("#input-button").click()
        cy.wait(20000)
        cy.reload()

        authoring.vex.addAdvancedBlock(testLandingPage.blocks[8]) //Adding a new block(All Sessions)to verify the configurations
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.pause()
        cy.contains('button', 'Confirm').click();


        authoring.vex.addAdvancedBlock(testLandingPage.blocks[9])
        cy.contains(consumption.vex.sessionGroup, testLandingPage.blocks[9].sessionGroup).within(() => {
            cy.get(consumption.vex.sessionCardTitle).should("have.length", 1)
            cy.contains(consumption.vex.sessionCardTitle, demand_session.name).should('exist')
            cy.pause()
            cy.get(consumption.vex.sessionCardTitle, demand_session.name).scrollIntoView()
            cy.get(consumption.vex.sessionCardTitle, demand_session.name).trigger('mouseover').click({ force: true })
            cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
            cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
            cy.pause()
            cy.contains('button', 'Confirm').click();
            cy.log("demand session is added with toggle enabled")

        })

    })


    it.only('User able to hide blocks that have no session under it when no filter has been applied1', () => {

        authoring.common.login()
        //  cy.intercept("POST", `https://jukebox.${authoring.common.env.TEST_ENV}-pathfactory.com/api/public/v1/page_views/create_event`).as('create_event')
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event1.name)
        authoring.vex.addVirtualEvent(event1)
        authoring.vex.configureEvent(event1)
        //creating on demand session
        authoring.vex.addSession(demand_session.name, 'On Demand')
        authoring.vex.configureSession(demand_session)
        authoring.vex.backToEvent(event1.name)

        //creating on live session
        authoring.vex.addSession(live_session.name, 'On Demand')
        authoring.vex.configureSession(live_session)
        authoring.vex.backToEvent(event1.name)

        // Add, edit landing pages 
        authoring.vex.addLandingPages(testLandingPage.name)
        //authoring.vex.goToLandingPage()
        authoring.vex.setToHomePage(testLandingPage.name)

        //creating sessions groups
        authoring.vex.addSessionGroup('No Sessions')
        authoring.vex.addSessionGroup('Demand Sessions')
        authoring.vex.addToGroup(sessionGroupA)
        authoring.vex.addSessionGroup('Live Sessions')
        authoring.vex.addToGroup(sessionGroupB)

        //verify that go to landing page and modify the page
        authoring.vex.editLandingPage(testLandingPage)
        authoring.vex.setToHomePage(testLandingPage.name)
        authoring.vex.goToPageEditor(testLandingPage.name)
        cy.wait(4000)

        //sessionGroup --no sessions
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[8]) //Adding a new block(All Sessions)to verify the configurations
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        cy.get(authoring.vex.pages.menuBlock).eq(3).click({ force: true })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.contains('button', 'Confirm').click();


        //*********************
        // Validate if all sessions from the events are shown in a block when the option is selected in the preview(Excluding Private session)
        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[9])
        cy.contains(authoring.vex.eventSessions, testLandingPage.blocks[9].sessionGroup).within(() => {
            cy.get("div[class*='pf-event-session-card']").eq(0).click({ force: true })
            cy.wait(1000)
        })
        cy.get(authoring.vex.pages.menuBlock, { timeout: 10000 }).eq(3).click({ force: true })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.contains('button', 'Confirm').click();
        cy.log("demand session is added with toggle enabled")

        cy.get(authoring.vex.eventSessions).eq(0).click({ force: true })
        authoring.vex.addAdvancedBlock(testLandingPage.blocks[10])
        cy.contains(authoring.vex.eventSessions, testLandingPage.blocks[10].sessionGroup).within(() => {
            cy.get("div[class*='pf-event-session-card']").eq(0).click({ force: true })
            cy.wait(1000)
        })
        cy.get(authoring.vex.pages.menuBlock, { timeout: 10000 }).eq(3).click({ force: true })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.contains('button', 'Confirm').click();
        cy.log("live session is added with toggle enabled")

        cy.contains("button", "Save").click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        cy.visit(event1.url)

        cy.go("back")
        cy.wait(4000)

        cy.contains("div[data-react-beautiful-dnd-draggable='0']", testLandingPage.blocks[10].sessionGroup,{timeout:20000}).within(() => {
            cy.get("div[class*='pf-event-session-card']").eq(0).click({ force: true })
            cy.get(authoring.vex.pages.menuBlock, { timeout: 10000 }).eq(3).click({ force: true })
            cy.wait(3000)
        })
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.wait(2000)
        cy.contains('button', 'Confirm').click();
        cy.log("live session is added with toggle disabled")

        cy.pause()
        cy.contains("div[data-react-beautiful-dnd-draggable='0']", testLandingPage.blocks[9].sessionGroup).within(() => {
            cy.get("div[class*='pf-event-session-card']").eq(0).click({ force: true })
            cy.get(authoring.vex.pages.menuBlock, { timeout: 10000 }).eq(3).click({ force: true })
        })
        cy.wait(2000)
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.wait(1000)
        cy.pause()
        cy.contains('button', 'Confirm').click();
        cy.log("demand session is added with toggle disabled")

        cy.contains("div[data-react-beautiful-dnd-draggable='0']", testLandingPage.blocks[8].sessionGroup).within(() => {
            cy.get(authoring.vex.pages.menuBlock, { timeout: 10000 }).eq(3).click({ force: true })
        })
        cy.wait(2000)
        cy.get(authoring.vex.pages.hideSessionToggle).dblclick()
        cy.wait(1000)
        cy.pause()
        cy.contains('button', 'Confirm').click();
        cy.log("No session is added with toggle disabled")
        cy.pause()
    })

})

// configureLandingPage(config) {
//     const name = config.name
//     const setHome = config.setHome
//     const unsetHome = config.unsetHome
//     const blocks = config.blocks

//     this.editLandingPage(config)

//     if (setHome) {
//         this.setToHomePage(name)
//     }

//     if (unsetHome) {
//         this.unsetHomePage(name)
//     }

//     if (blocks) {
//         this.goToPageEditor(name)
//         blocks.forEach((block) => {
//             this.addAdvancedBlock(block)
//             cy.get(this.pages.blockContainer).eq(0).click()
//              // This makes the add block button reappear
//         if(hidesession){
//             cy.get(this.pages.hideSessionToggle).dblclick()
//         }

//         })
//         cy.contains("button", "Save").click()
//         cy.go("back")
//     }
// }
