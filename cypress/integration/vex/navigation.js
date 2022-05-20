import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'navigation.js',
    slug: 'navigation-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const publicSession = {
    name: "Public Session",
    slug: "public-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const privateSession = {
    name: "Private Session",
    slug: "private-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Private',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const deleteSession = {
    name: "Delete Session",
    slug: "delete-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing'
}

const publicLandingPage = {
    name: "Public Landing Page",
    slug: "public-landing-page",
    visibility: 'Public',
    blocks: [
        {
            type: "HTML",
            content: "I am a public landing page"
        }
    ]
}

const privateLandingPage = {
    name: "Private Landing Page",
    slug: "private-landing-page",
    visibility: 'Private',
    blocks: [
        {
            type: "HTML",
            content: "This is a paragraph..."
        }
    ]
}

const deleteLandingPage = {
    name: "Delete Landing Page",
    slug: "delete-landing-page",
    visibility: 'Public',
    blocks: [
        {
            type: "HTML",
            content: "This is a paragraph..."
        }
    ]
}

const  webLink = event.url

const textLink = "I am text"

const nav1 = [
    {
        label: publicSession.name,
        type: "Session",
        source: publicSession.name,
        verify: true,
        reference: publicSession
    },
    {
        label: privateSession.name,
        type: "Session",
        source: privateSession.name,
        verify: true,
        reference: privateSession 
    },
    {
        label: deleteSession.name,
        type: "Session",
        source: deleteSession.name,
        verify: true,
        reference: deleteSession
    },
    {
        label: publicLandingPage.name,
        type: "Landing Page",
        source: publicLandingPage.name,
        verify: true,
        reference: publicLandingPage
    },
    {
        label: privateLandingPage.name,
        type: "Landing Page",
        source: privateLandingPage.name,
        verify: true,
        reference: privateLandingPage 
    },
    {
        label: deleteLandingPage.name,
        type: "Landing Page",
        source: deleteLandingPage.name,
        verify: true,
        reference: deleteLandingPage
    },
    {
        label: "Web Link",
        type: "Link",
        source: webLink,
        newTab: false,
        verify: true
    },
    {
        label: "Link New Tab",
        type: "Link",
        source: webLink,
        newTab: true,
        verify: true
    },
    {
        label: textLink,
        type: "Text",
        verify: true
    }
]

const nav2 = [
    {
        label: "Single Tiered",
        type: "Text",
        verify: true
    },
    {
        label: "Level 3",
        type: "Text",
        verify: true
    },
    {
        label: "Level 2",
        type: "Text",
        verify: true
    },
    {
        label: "Level 1",
        type: "Text",
        verify: true
    },
    {
        label: "Private",
        type: "Session",
        source: privateSession.name
    }  
]

const navigation_edit = [
    {
        to_edit:"Link New Tab",
        label: "Level 3",
        type: "Text",
        verify: true 
    },
    {
        to_edit: publicLandingPage.name,
        label: "Web Link",
        type: "Link",
        source: webLink,
        newTab: false,
        verify: true
    },
    {
        to_edit:privateLandingPage.name,
        label: "Landing To Text ",
        type: "Text",
        verify: true
     },
    {
        to_edit:textLink,
        label: publicSession.name,
        type: "Session",
        source: publicSession.name,
        verify: true,
        reference: publicSession
    }
]

const sessions = [publicSession, privateSession]
const landingPages = [publicLandingPage, privateLandingPage]

describe("VEX - Navigation Builder", ()=>{
    it("Set up event, sessions, and landing pages if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event);
                sessions.forEach((session)=>{
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
                authoring.vex.addLandingPages(publicLandingPage.name)
                authoring.vex.configureLandingPage(publicLandingPage)
                authoring.vex.addLandingPages(privateLandingPage.name)
                authoring.vex.configureLandingPage(privateLandingPage)
            }
        })
    })

    it("Add, edit and remove navigation links", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        // Complete the set-up: these session page and landing page need to be added/removed each run (the others are permanent)
        authoring.vex.removeSession(deleteSession.name)
        authoring.vex.addSession(deleteSession.name)
        authoring.vex.configureSession(deleteSession)
        authoring.vex.backToEvent(event.name)
        authoring.vex.deleteLandingPages(deleteLandingPage.name)
        authoring.vex.addLandingPages(deleteLandingPage.name)
        authoring.vex.editLandingPage(deleteLandingPage)
        authoring.vex.goToPageEditor(deleteLandingPage.name)
        authoring.vex.addBasicBlock()
        cy.go("back")

        // Clear out any nav items 
        authoring.vex.deleteAllNavItems()

        // Add each type of navigation link (session, landing page, link, text)
        nav1.forEach((navItem)=>{
            authoring.vex.addNavItem(navItem)
        })
        cy.wait(1000) // Give db time to update before checking consumption 

        // Verify on consumption 
        cy.viewport(1500, 1000)
        cy.visit(event.url)
        cy.wait(5000)
        cy.get(consumption.vex.vexHeader).should("exist").within(()=>{
            nav1.forEach((navItem)=>{
                if(navItem.type == "Session" || navItem.type == "Landing Page"){
                    if(navItem.reference.visibility == "Public"){
                        cy.contains("a", navItem.label).should('exist').invoke('attr','href').then(val=>{
                            expect(val).to.contains(`/${event.slug}/${navItem.reference.slug}`)
                        })
                    } else {
                        cy.contains("a", navItem.label).should("not.exist")
                    }
                } else if(navItem.type == "Link"){
                    if(navItem.newTab){
                        cy.contains("a", navItem.label).should('exist').should("have.attr", "href", navItem.source).should("have.attr", "target", "_blank")
                    } else {
                        cy.contains("a", navItem.label).should('exist').should("have.attr", "href", navItem.source).should("have.attr", "target", "_self")
                    }
                } else if (navItem.type == "Text"){
                    cy.contains(".pf-menu-item", navItem.label).should('exist')
                }
            })
        })

        // Click the session and landing page links to verify they redirect correctly
        cy.contains("a", nav1[3].label).click() // public landing page link
        cy.contains(publicLandingPage.blocks[0].content).should("exist")
        cy.go("back")
        cy.contains("a", nav1[5].label).click() // delete landing page link
        cy.contains(deleteLandingPage.blocks[0].content).should("exist")
        cy.go("back")
        cy.contains("a", nav1[0].label).click() // Session link
        cy.wait(20000)
        consumption.vex.expectYoutube()
        cy.go("back")
        cy.wait(3000)
        cy.contains("a", nav1[6].label).click() // weblink - important that it redirects to the same domain or else cypress won't allow it!
        cy.contains("Browse Sessions").should("exist")
        cy.go("back")
        cy.go("back")

        // Delete session and landing page, then verify removed from navigation and consumption 
        authoring.vex.removeSession(deleteSession.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(deleteLandingPage.name)
        authoring.vex.goToNavigation()
        cy.ifElementWithExactTextExists(authoring.vex.navigation.navTitle, deleteLandingPage.name, 1000, ()=>{
            cy.reload()
        }) 
        cy.containsExact(authoring.vex.navigation.navTitle, deleteSession.name).should("not.exist")
        cy.containsExact(authoring.vex.navigation.navTitle, deleteLandingPage.name).should("not.exist")
        
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader, {timeout: 10000}).within(()=>{
            cy.contains("a", deleteSession.name).should('not.exist')
            cy.contains("a", deleteLandingPage.name).should("not.exist")
        })
        cy.go("back")

        //Edit navigation items and verify on consumption
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        Object.values(navigation_edit).forEach((navItem) => {
            authoring.vex.editNavItem(navItem)
        })

        cy.visit(event.url)
        cy.wait(5000)
        cy.get(consumption.vex.cxheader).within(() => {
            cy.contains("a", navigation_edit[3].label).should("exist")
            cy.contains("a", navigation_edit[1].label).should("exist")
            cy.contains("div", navigation_edit[0].label).should("exist")
            cy.contains("div", navigation_edit[2].label).should("exist")
        })

        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        // Remove all remaining nav items
        cy.waitFor({element: `${authoring.vex.navigation.navTitle}:contains('${nav1[0].label}')`, to: "exist", wait: 10000})
        authoring.vex.deleteNavItems(nav1[1].label, true) // Just want to do 1 nav item deletion that verifies it is deleted - the rest can be cleared en-masse without checking
        authoring.vex.deleteAllNavItems()

        //Add bunch of text links
        nav2.forEach((navItem)=>{
            authoring.vex.addNavItem(navItem)
        })
        cy.wait(5000)
        //Reorder the text links to have menu structure (sublinks)
        authoring.vex.attachSubNav({subject: nav2[2].label, target: nav2[3].label}) // makes level 2 a sublink of level 1
        authoring.vex.attachSubNav({subject: nav2[1].label, target: nav2[2].label}) // makes level 3 a sublink of level 1, below 2 
        authoring.vex.attachSubNav({subject: nav2[1].label, target: nav2[1].label}) // makes level 3 a sublink of level 2 
        authoring.vex.attachSubNav({subject: nav2[0].label, target: nav2[4].label}) // makes "Single Tiered" a sublink of "Private"
        cy.wait(1000)

        // Verify on consumption that all removed items are gone, and text links have proper menu structure
        cy.visit(event.url)
        cy.contains(consumption.vex.vexHeaderPopupMenu, nav2[3].label).should('exist').trigger("mouseover")
        cy.contains(consumption.vex.vexHeaderMenuNoPopup, nav2[2].label).should('exist')
        cy.contains(consumption.vex.vexHeaderMenuNoPopup, nav2[1].label).should('exist')
        cy.contains("div", nav2[0].label).should('not.exist')
        cy.contains("a", nav2[4].label).should("not.exist")

        nav1.forEach((navItem)=>{
            cy.get(consumption.vex.vexHeader).within(()=>{
                cy.contains(navItem.label).should("not.exist")
           })
        })
    })
})