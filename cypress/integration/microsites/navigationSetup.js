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

const link3 = target.url

const link4 =landingPage1.url

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
    text2: {
        label: "Text2",
        type: "Text",
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
    },
    link3: {
        label: "Link3",
        type: "Link",
        source: link3,
        newTab: false
    },
    text3: {
        label: "Text3",
        type: "Text",
    } 
}
const navigation_edit = {
     
    edit_recommend_to_target: {
        to_edit: "Recommend",
        label: "Target2", 
        type: "Track",
        source: target.name,
        reference: target
    },
     edit_link_to_link: {
       to_edit: "Link1",
        label: "Link1_edited",
        type: "Link",
        source: "https://www.google.com",
        newTab: false
     },
    edit_landing_page_to_link: {
        to_edit: "Home Landing Page",
        label: "Link4",
        type: "Link",
        source: link4,
        newTab: false
    },
    edit_text_to_other_text: {
        to_edit: "Text2",
        label: "Text5",
        type: "Text",
    },
     edit_link_to_text: {
       to_edit: "Link2",
        label: "Link2_edited to Text",
        type: "Text",
     }
}

describe("Microsites - Navigation setup", () => {
    it("Build a navigation header for microsites", () => {
        authoring.common.login()

        // Setup
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
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

        //Rearrange the links, creating sublinks 
        authoring.microsites.attachSubNav({subject: navigation.link1.label, target: navigation.landingPage1.label})
        authoring.microsites.attachSubNav({subject: navigation.link2.label, target: navigation.landingPage2.label})        
        authoring.microsites.attachSubNav({subject: navigation.text2.label, target: navigation.text3.label})
        authoring.microsites.attachSubNav({subject: navigation.link3.label, target: navigation.text3.label})
        authoring.microsites.attachSubNav({subject: navigation.link3.label, target: navigation.text2.label})
        

        // Attempt to remove one of the tracks and verify that cannot do this while it's used in navigation 
        authoring.microsites.removeTracks(recommend.name, false)
        cy.contains("Before deleting a track(s) from microsite, delete it from landing page/Navigation config").should("exist")
        cy.contains(authoring.microsites.antModal, "Are you sure?").within(() => { cy.contains("button", "Cancel").click() })
        // Delete one of the landing pages and verify its link and attached sublink are gone 
        authoring.microsites.removeLandingPages(landingPage2.name)
        authoring.microsites.tabToNavigation()
        cy.containsExact(authoring.microsites.navigation.navTitle, landingPage2.name).should('not.exist') 

        // Verify can delete nav items 
        authoring.microsites.removeNavItems(navigation.deleteLink.label)
        authoring.microsites.addNavItem(navigation.recommend)
    })


    it("Go to consumption and verify that the navigation header is correct", () => {
        cy.visit(microsite.url)
        cy.wait(5000) // Wait for DOM to settle to reduce likelihood of failure at step trigger("mouseover")
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
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link1.label, {timeout: 20000}).should("be.visible").within(() => {
            cy.get("a").should("have.attr", "href", navigation.link1.source)
        })
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.landingPage2.label).should("not.exist")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link2.label).should("not.exist")

        // Click the target link and verify that it goes to correct link and that navigation header is still visible
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label).click()
        cy.url().should("eq", `${microsite.url}/${navigation.target.reference.slug}/${navigation.target.reference.firtContentSlug}`)
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.landingPage1.label, {timeout: 20000}).click()
        cy.wait(3000)
        cy.url().should("eq", `${microsite.url}/${navigation.landingPage1.reference.slug}`)
        cy.wait(3000)
        // Mouseover Text navigation menu, Verify dropdowns, click on the link from dropdowns and verify that it goes tp correct url
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.text3.label).should("be.visible").trigger("mouseover")
        cy.contains(consumption.microsites.navigation.menuWithSubmenu, navigation.text2.label).should("be.visible").trigger("mouseover")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link3.label, {timeout: 20000}).should("be.visible").within(() => {
            cy.get("a").should("have.attr", "href", navigation.link3.source)
        })
        cy.contains(consumption.microsites.navigation.menuItem, navigation.link3.label,{timeout: 20000}).click()
        cy.url().should("eq", navigation.link3.source)
    })
    it("Edit and Go to consumption and verify that the navigation header is correct", () => {
        //go to authoring
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        Object.values(navigation_edit).forEach((navItem) => {
            authoring.microsites.editNavItem(navItem)
         })
        
        cy.visit(microsite.url)
        cy.wait(5000) // Wait for DOM to settle to reduce likelihood of failure at step trigger("mouseover")
        //edit_recommend_to_target
        cy.contains(consumption.microsites.navigation.menuItem, navigation_edit.edit_recommend_to_target.label).should("exist").within(() => {
            cy.get("a").should("have.attr", "href", `${microsite.url}/${navigation_edit.edit_recommend_to_target.reference.slug}/${navigation_edit.edit_recommend_to_target.reference.firtContentSlug}`)
        })

        //edit_landing_page_to_link
        cy.contains(consumption.microsites.navHeaderLink, navigation_edit.edit_landing_page_to_link.label).should("exist")
        cy.contains(consumption.microsites.navHeaderLink, navigation_edit.edit_landing_page_to_link.label).trigger("mouseover")
        cy.contains("a", navigation_edit.edit_link_to_link.label)   
    

        //edit_text_to_other_text
        cy.contains(consumption.microsites.navHeaderText, navigation.text3.label).trigger("mouseover")
        cy.contains(consumption.microsites.navigation.menuItem, navigation_edit.edit_text_to_other_text.label).should("exist")

        //edit_link_to_text
        cy.contains(consumption.microsites.navigation.menuItem, navigation_edit.edit_link_to_text.label).should("exist")
    })
})