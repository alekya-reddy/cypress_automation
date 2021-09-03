import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: "automation-microsites", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-microsites', tld: 'lookbookhq' })

const target = {
    name: "Target 2 Shared Resource",
    slug: "target-2-shared-resource",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Wiki-1 Shared Resource", "Wiki-2 Shared Resource", "Wiki-3 Shared Resource", "Wiki-4 Shared Resource", "Wiki-5 Shared Resource", "Wiki-6 Shared Resource"]
}

const filtersContent = {
    name: "Authoring SearchAndFilters",
    slug: "search-and-filters-authoring",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Pie"]
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const microsite = {
    name: "landingPageSetup.js",
    slug: "landingpagesetup-js",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Target Block Grid",
            type: "track",
            track: target.name,
            titleOverride: "Track Grid",
            layout: "Grid",
            expectContents: target.contents
        },
        {
            id: "Target Block Carousel",
            type: "track",
            track: target.name,
            titleOverride: "Track Carousel",
            layout: "Carousel",
            expectContents: target.contents
        },
        {
            id: "Filters Block",
            type: "track",
            track: filtersContent.name,
            expectContents: filtersContent.contents,
            searchConfiguration: {
                enableToggle: true,
                searchButtonTitle: "Test Search",
                buttonTextColor: { r: "225", g: "107", b: "140", position: 0 },
                inputTextColor: { r: "204", g: "162", b: "162", position: 1 },
                buttonBackgroundAndBorderColor: { r: "231", g: "185", b: "141", position: 2 }
            },
            topicFilter: {
                enableToggle: true,
                overrideLabel: 'Filter By Topics Here',
                textColor: { r: "43", g: "91", b: "200", position: 0 },
                backgroundColor: { r: "87", g: "255", b: "78", position: 1 }
            },
            contentTypeFilter: {
                enableToggle: true,
                overrideLabel: 'Filter By Content Type Here',
                backgroundColor: { r: "184", g: "106", b: "164", position: 1 }
            },
            funnelStageFilter: {
                enableToggle: true,
                overrideLabel: 'Filter By Funnel Stage Here'
            },
            industryFilter: {
                enableToggle: true,
                overrideLabel: 'Filter By Industry Here'
            },
            personaFilter: {
                enableToggle: true,
                overrideLabel: 'Filter By Persona Here'
            },
            businessUnitFilter: {
                enableToggle: true,
                overrideLabel: 'Filter By Business Unit Here'
            }
        },
        {
            id: "Recommend Block",
            type: "track",
            track: recommend.name,
            titleOverride: `Overrided title`,
            expectContents: recommend.contents,
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
            },
            searchConfiguration: {
                enableToggle: true,
                searchButtonTitle: 'Test Search2',
                buttonTextColor: { r: "215", g: "107", b: "140", position: 0 },
                inputTextColor: { r: "234", g: "162", b: "172", position: 1 },
                buttonBackgroundAndBorderColor: { r: "101", g: "15", b: "205", position: 2 }
            }
        },
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>Some text</h1>`,
            checkContent: {
                text: ["Some text"],
                locators: ["h1"]
            },
            typography: {
                color: { r: "255", g: "255", b: "255" },
                textAlign: 'right',
                fontSize: "12px"
            },
            className: "landingpageblock",
            background: {
                color: { r: "0", g: "200", b: "200" },
                image: {
                    category: "Stock Images",
                    url: "/stock/sm/bench-forest-trees-path.jpg"
                },
                position: "top",
                size: "contain"
            },
            spacing: "96px"
        }
    ]
}

const defaultLandingPage = {
    name: "Home Page",
    slug: "landing-page-home-pa",
    get url() {
        return `${microsite.url}/${this.slug}`
    }
}

describe("Microsites - Landing page setup", () => {
    it("Test landing page setup and landing page editor", () => {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)
        authoring.microsites.addTracks({ target: [target.name, filtersContent.name], recommend: recommend.name })

        // Every new microsite has a default landing page with these settings: 
        authoring.microsites.tabToLandingPages()
        cy.contains(authoring.microsites.antTable.cell, defaultLandingPage.name, { timeout: 10000 }).should("exist")
        cy.get(authoring.microsites.antTable.cell).eq(5).should("contain", "Home Page").should("not.contain", "Set as Home Page")
        cy.contains("button", "Remove").should("not.exist") // Any landing page that is set to home page cannot be removed 

        // Add a new landing page and fully configure it with landing page blocks. Set this page as home page.
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)

        // Verify that the default landing page is no longer home page 
        cy.contains(authoring.microsites.antTable.cell, defaultLandingPage.name, { timeout: 20000 }).should("exist")
             .parents(authoring.microsites.antTable.row).within(() => {
                cy.get(authoring.microsites.antTable.cell).eq(7).should("contain", "Set as Home Page")
                cy.contains("button", "Remove").should("exist")
             })

        // And verify that the new landing page is now the home page
        cy.contains(authoring.microsites.antTable.cell, landingPage.name, { timeout: 10000 }).should("exist")
            .parents(authoring.microsites.antTable.row).within(() => {
                cy.get(authoring.microsites.antTable.cell).eq(7).should("contain", "Home Page").should("not.contain", "Set as Home Page")
                cy.contains("button", "Remove").should("not.exist")
            })

        // Visit the home url (aka microsite url), and verify that this takes you to the home landing page 
        cy.visit(microsite.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })

        // Verify the carousel block
        cy.contains("h4", landingPage.blocks[1].titleOverride).parent().within(() => {
            cy.get(consumption.microsites.cardTitle).should("have.length", 6)
            cy.get(consumption.microsites.cardTitle).eq(0).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(1).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(2).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(3).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(4).should("not.be.visible")
            cy.get(consumption.microsites.cardTitle).eq(5).should("not.be.visible")
            cy.get(consumption.microsites.arrowRight).click({ force: true })
            cy.get(consumption.microsites.cardTitle).eq(0).should("not.be.visible")
            cy.get(consumption.microsites.cardTitle).eq(1).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(2).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(3).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(4).should("be.visible")
            cy.get(consumption.microsites.cardTitle).eq(5).should("not.be.visible")
        })

        // Verify the grid block
        cy.contains("h4", landingPage.blocks[0].titleOverride).parent().within(() => {
            cy.get(consumption.microsites.cardTitle).should("have.length", 6)
            cy.get(consumption.microsites.cardTitle).each(card => {
                cy.get(card).should("be.visible")
            })
        })

        // Visiting the home landing page url (which is microsite url + landing page slug) directly should take you to the same place 
        cy.visit(landingPage.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })

        // Back in authoring, you should not be able to set the home page to private
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.editLandingPage({
            name: landingPage.name,
            visibility: "private",
            verify: false
        })
        cy.contains("Home page visibility cannot be set to private").should("exist")
        cy.contains(authoring.microsites.antModal, "Edit Landing Page").within(() => {
            cy.contains("button", "Cancel").click()
        })
        authoring.common.waitForAntModal({ title: "Edit Landing Page" })

        // Set the main page to 'not-home-page' by setting default page to home page, and verify you can now set main page to private
        authoring.microsites.setToHomePage(defaultLandingPage.name)
        authoring.microsites.editLandingPage({
            name: landingPage.name,
            visibility: "private"
        })

        // A landing page that's set to private cannot be set as a home page and should be removable
        cy.contains(authoring.microsites.antTable.cell, landingPage.name, { timeout: 10000 }).should("exist")
            // .parents(authoring.microsites.antTable.row).within(() => {
                cy.get(authoring.microsites.antTable.cell).eq(5).should("not.contain", "Set as Home Page")
                cy.contains("button", "Remove").should("exist")
            // })

        // Verify that the private landing page is not accessible on consumption side
        cy.request({ url: landingPage.url, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(404)
        })

        // Test various input validations
        authoring.microsites.editLandingPage({ name: defaultLandingPage.name, slug: landingPage.slug, verify: false })
        cy.contains(authoring.microsites.messages.duplicateEntry3).should("exist")
        cy.contains(authoring.microsites.antModal + ":visible", "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })
        authoring.microsites.editLandingPage({ name: defaultLandingPage.name, slug: "haha&^%&^", verify: false })
        cy.contains("Only alphanumeric characters, hyphens and underscores are allowed").should("exist")
        cy.contains(authoring.microsites.antModal + ":visible", "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })
        authoring.microsites.editLandingPage({ name: defaultLandingPage.name, newName: landingPage.name, verify: false })
        cy.contains(authoring.microsites.messages.duplicateEntry2).should("exist")
        cy.contains(authoring.microsites.antModal + ":visible", "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })
        authoring.microsites.editLandingPage({ name: defaultLandingPage.name, newName: "%^&*(&^", verify: false })
        cy.contains("Name must contain letters or numbers").should("exist")
        cy.contains(authoring.microsites.antModal + ":visible", "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })

        // Verify that a landing page not set as home page can be removed 
        authoring.microsites.removeLandingPages(landingPage.name)
    })
})