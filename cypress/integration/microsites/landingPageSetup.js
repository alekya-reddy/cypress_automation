import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

const microsite = {
    name: "landingPageSetup.js",
    slug: "landingpagesetup-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    setHome: true,
    blocks: [
        {
            id: "Target Block",
            type: "track",
            track: target.name,
            expectContents: target.contents,
        },
        {
            id: "Recommend Block",
            type: "track",
            track: recommend.name,
            titleOverride: `Overrided title`,
            expectContents: recommend.contents,
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
            id: "HTML block",
            type: "HTML",
            content: `<h1>Some text</h1>`,
            checkContent: {
                text: ["Some text"],
                locators: ["h1"]
            },
            typography: {
                color: {r: "255", g: "255", b: "255"},
                textAlign: 'right'
            },
            className: "landingpageblock",
            background: {
                color: {r: "0", g: "200", b: "200"},
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
    name: "landing Page Home Page",
    slug: "landing-page-home-pa",
    get url(){
        return `${microsite.url}/${this.slug}`
    }
}

describe("Microsites - Landing page setup", () => {
    it("Test landing page setup and landing page editor", () => {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.setup(microsite)
        authoring.microsites.addTracks({target: target.name, recommend: recommend.name})

        // Every new microsite has a default landing page with these settings: 
        authoring.microsites.tabToLandingPages()
        cy.containsExact(authoring.microsites.antTable.cell, defaultLandingPage.name, {timeout: 10000}).should("exist")
        .parents(authoring.microsites.antTable.row).within(() => {
            cy.get(authoring.microsites.antTable.cell).eq(4).should("contain", "Home Page").should("not.contain", "Set as Home Page")
            cy.contains("button", "Remove").should("not.exist") // Any landing page that is set to home page cannot be removed 
        })

        // Add a new landing page and fully configure it with landing page blocks. Set this page as home page.
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)

        // Verify that the default landing page is no longer home page 
        cy.containsExact(authoring.microsites.antTable.cell, defaultLandingPage.name, {timeout: 10000}).should("exist")
        .parents(authoring.microsites.antTable.row).within(() => {
            cy.get(authoring.microsites.antTable.cell).eq(4).should("contain", "Set as Home Page")
            cy.contains("button", "Remove").should("exist") 
        })

        // And verify that the new landing page is now the home page
        cy.containsExact(authoring.microsites.antTable.cell, landingPage.name, {timeout: 10000}).should("exist")
        .parents(authoring.microsites.antTable.row).within(() => {
            cy.get(authoring.microsites.antTable.cell).eq(4).should("contain", "Home Page").should("not.contain", "Set as Home Page")
            cy.contains("button", "Remove").should("not.exist")
        })

        // Visit the home url (aka microsite url), and verify that this takes you to the home landing page 
        cy.visit(microsite.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })

        // Visiting the home landing page url (which is microsite url + landing page slug) directly should take you to the same place 
        cy.visit(landingPage.url)
        landingPage.blocks.forEach((block) => {
            consumption.microsites.verifyLandingPageBlock(block)
        })

        // Return to authoring and test various input validations
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.editLandingPage({name: defaultLandingPage.name, slug: landingPage.slug, verify: false})
        cy.contains(authoring.microsites.messages.duplicateEntry3).should("exist")
        cy.contains(authoring.microsites.antModal, "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })
        authoring.microsites.editLandingPage({name: defaultLandingPage.name, slug: "haha&^%&^", verify: false})
        cy.contains("Only alphanumeric characters, hyphens and underscores are allowed").should("exist")
        cy.contains(authoring.microsites.antModal, "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })
        authoring.microsites.editLandingPage({name: defaultLandingPage.name, newName: landingPage.name, verify: false})
        cy.contains(authoring.microsites.messages.duplicateEntry2).should("exist")
        cy.contains(authoring.microsites.antModal, "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })
        authoring.microsites.editLandingPage({name: defaultLandingPage.name, newName: "%^&*(&^", verify: false})
        cy.contains("Name must contain letters or numbers").should("exist")
        cy.contains(authoring.microsites.antModal, "Edit Landing Page").within(() => { cy.contains("button", "Cancel").click() })

        // Verify that a landing page not set as home page can be removed 
        authoring.microsites.setToHomePage(defaultLandingPage.name)
        authoring.microsites.removeLandingPages(landingPage.name)
    })
})