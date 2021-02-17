import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: "navigationSetup.js",
    slug: "navigationsetup-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"],
    firtContentSlug: "openai"
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"],
    firtContentSlug: "openai"
}

const landingPage1 = {
    name: "Main Page",
    slug: "main-page",
    visibility: 'Public',
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    blocks: [
        {
            id: "Target Block",
            type: "track",
            track: target.name,
            expectContents: target.contents,
        }
    ]
}

const landingPage2 = {
    name: "Other Page",
    slug: "other-page",
    visibility: 'Public',
    get url(){
        return `${microsite.url}/${this.slug}`
    }
}

const link1 = target.url

const link2 = recommend.url 

const navigation = {
    target: {
        label: "Target",
        type: "Track",
        source: target.name,
        reference: target
    },
    recommend: {
        label: "Recommend",
        type: "Track",
        source: recommend.name,
        reference: recommend
    },
    link1: {
        label: "Link1",
        type: "Link",
        source: link1,
        newTab: true,
    },
    landingPage1: {
        label: "Home Landing Page",
        type: "Landing Page",
        source: landingPage1.name,
        reference: landingPage1
    },
    link2: {
        label: "Link2",
        type: "Link",
        source: link2,
        newTab: false
    },
    landingPage2: {
        label: "Other Landing Page",
        type: "Landing Page",
        source: landingPage2.name,
        reference: landingPage2
    },
    deleteLink: {
        label: "Delete",
        type: "Link",
        source: "https://delete.me"
    }
}

describe("Microsites - Navigation setup", () => {
    it("Build a navigation header for microsites", () => {
        authoring.common.login()

        // Setup
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite.name)
        authoring.microsites.setup(microsite)
        authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
        authoring.microsites.addLandingPages(landingPage1.name)
        authoring.microsites.configureLandingPage(landingPage1)
        authoring.microsites.addLandingPages(landingPage2.name)
        authoring.microsites.editLandingPage(landingPage2)

        // Add navigation items of all types (Track, Landing Page, Link)
        Object.values(navigation).forEach((navItem) => {
            authoring.microsites.addNavItem(navItem)
        })

        // Rearrange the links, creating sublinks 
        authoring.microsites.attachSubNav({subject: navigation.link1.label, target: navigation.landingPage1.label})
        authoring.microsites.attachSubNav({subject: navigation.link2.label, target: navigation.landingPage2.label})

        // Attempt to remove one of the tracks and verify that cannot do this while it's used in navigation 
        authoring.microsites.removeTracks(recommend.name, false)
        cy.contains("Before deleting a track(s) from microsite, delete it from landing page/Navigation config").should("exist")
        cy.contains(authoring.microsites.antModal, "Are you sure?").within(() => { cy.contains("button", "Cancel").click() }) 

        // Delete one of the landing pages and verify its link and attached sublink are gone 
        authoring.microsites.removeLandingPages(landingPage2.name)
        authoring.microsites.tabToLandingPages()
        cy.containsExact(authoring.microsites.navigation.navTitle, landingPage2.name).should('not.exist') 
        cy.containsExact(authoring.microsites.navigation.navTitle, link2).should('not.exist')

        // Verify can delete nav items 
        authoring.microsites.removeNavItems(navigation.deleteLink.label)
    })

    it("Go to consumption and verify that the navigation header is correct", () => {
        cy.visit(microsite.url)
        cy.wait(2000) // Wait for DOM to settle to reduce likelihood of failure at step trigger("mouseover")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", `${microsite.url}/${navigation.target.reference.slug}/${navigation.target.reference.firtContentSlug}`)
        })
        cy.contains(consumption.microsites.navigation.menuItem, navigation.recommend.label).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", `${microsite.url}/${navigation.recommend.reference.slug}/${navigation.recommend.reference.firtContentSlug}`)
        })
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.landingPage1.label).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", `${microsite.url}/${navigation.landingPage1.reference.slug}`)
        })
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link1.label).should("not.exist")
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.landingPage1.label).should("be.visible").trigger("mouseover")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link1.label).should("be.visible").within(() => {
            cy.get("a").should("have.attr", "href", navigation.link1.source)
        })
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.landingPage2.label).should("not.exist")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link2.label).should("not.exist")

        // Click the target link and verify that it goes to correct link and that navigation header is still visible
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label).click()
        cy.url().should("eq", `${microsite.url}/${navigation.target.reference.slug}/${navigation.target.reference.firtContentSlug}`)
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.landingPage1.label, {timeout: 20000}).click()
        cy.url().should("eq", `${microsite.url}/${navigation.landingPage1.reference.slug}`)
    })
})