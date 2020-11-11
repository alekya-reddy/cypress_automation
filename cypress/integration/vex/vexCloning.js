import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'vexCloning.js',
    slug: 'vexcloning-js',
    cloneName: "Clone of vexCloning.js",
    start: 'Jun 24, 2020 8:00pm',
    end: 'Jun 24, 2040 8:00pm',
    timeZone: "(GMT-10:00) Hawaii",
    description: "description",
    externalID: "vexcloningid",
    form: {name: "Standard Form Short"},
    language: "vexCloning.js",
    trackProtection: "Default",
    cookieConsent: true,
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = {
    onDemand: {
        name: "On-Demand",
        cloneName: "Clone of On-Demand",
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        contents: [
            'Website - Used by Cypress automation for VEX testing'
        ]
    },
    webex: {
        name: "Webex",
        cloneName: "Clone of Webex",
        slug: "webex",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        }
    },
    zoom: {
        name: 'Zoom',
        slug: 'zoom',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '1234',
            zoomAuth: "Require Password From Attendee",
            zoomPW: "12345"
        }
    },
    liveCL: {
        name: 'Live content library',
        slug: 'live-content-library',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            video: 'Youtube - Used in Cypress automation for VEX testing',
        }
    },
    private: {
        name: "private-zoom",
        slug: "private-zoom",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Private',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '1234',
            zoomAuth: 'No Password'
        }
    }
}

const appearance = {
    appearance: "vexCloning.js",
    heroImage: {
        category: 'Stock Images',
        url: 'https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg',
        selectImageText: "Add Image"
    },
    heroHeight: "200px",
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle',
    contentTitle: "VEX Content Title",
    contentDescription: "VEX Content Description",
}

const sessionGroups = {
    publicGroup: {
        name: "Has Public Session",
        sessions: [sessions.onDemand.name]
    }, 
    privateGroup: {
        name: "Has Private Session",
        sessions: [sessions.private.name]
    },
    emptyGroup: {
        name: "Empty"
    }
}

const landingPage = {
    name: "Landing-Page",
    cloneName: "Clone of Landing-Page",
    slug: "landing-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "Public Group Block",
            type: "Session Group",
            sessionGroup: sessionGroups.publicGroup.name,
            expectSessions: [sessionGroups.publicGroup.sessions].flat(),
        },
        {
            id: "Private Group Block",
            type: "Session Group",
            sessionGroup: sessionGroups.privateGroup.name,
            expectSessions: [sessionGroups.privateGroup.sessions].flat(),
        },
        {
            id: "Empty Group Block",
            type: "Session Group",
            sessionGroup: sessionGroups.emptyGroup.name,
            expectSessions: []
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
        }
    ]
}

const navigation = [
    {
        label: "Public Session",
        type: "Session",
        source: sessions.onDemand.name
    },
    {
        label: "Private Session",
        type: "Session",
        source: sessions.private.name,
    },
    {
        label: "Landing page",
        type: "Landing Page",
        source: landingPage.name,
    },
    {
        label: "Web Link",
        type: "Link",
        source: 'https://en.wikipedia.org/wiki/SpaceX',
        newTab: false
    },
    {
        label: "Text",
        type: "Text"
    }
]

const verifyEventSetup = (event) => {
    cy.get(authoring.vex.eventNameInput).should("have.value", event.cloneName)
    cy.get(authoring.vex.eventSlugInput).should("not.have.value", event.slug) // the slug should not be cloned
    cy.get(authoring.vex.startTimeInput).should("have.value", event.start)
    cy.get(authoring.vex.endTimeInput).should("have.value", event.end)
    cy.contains("span", event.timeZone).should("exist")
    cy.get(authoring.vex.eventDescription).should("contain", event.description)
    cy.get(authoring.vex.externalIDInput).should("have.value", event.externalID)
    cy.get(`span[title="${event.form.name}"]`).should("exist")
    cy.get(`span[title="${event.language}"]`).should("exist")
    cy.contains(authoring.vex.antRow, "Access Protection").should("contain", event.trackProtection)
    cy.get(authoring.vex.cookieConsentCheckbox).parent().should("have.class", "ant-checkbox-checked")
}

const verifySession = (session, howCloned) => {
    cy.log(howCloned)
    if(howCloned == "cloned event"){
        cy.get(authoring.vex.sessionNameInput).should("have.value", session.name)
    } else if (howCloned == "cloned session"){
        cy.get(authoring.vex.sessionNameInput).should("have.value", session.cloneName)
    }

    if(howCloned == "cloned event"){
        cy.get(authoring.vex.sessionSlugInput).should("have.value", session.slug)
    } else if (howCloned == "cloned session"){
        cy.get(authoring.vex.sessionSlugInput).should("not.have.value", session.slug) // Cannot clone the slug if cloning session within an event
    }

    if(session.visibility == "Public"){
        cy.get(authoring.vex.publicRadio).should("have.attr", "checked")
    } else if (session.visibility == "Private"){
        cy.get(authoring.vex.privateRadio).should("have.attr", "checked")
    }

    if(session.type == "Live"){
        cy.get(authoring.vex.liveRadio).should("have.attr", "checked")
    } else if(session.type == "On Demand"){
        cy.get(authoring.vex.onDemandRadio).should("have.attr", "checked")
    }

    if(session.video){
        cy.contains(authoring.vex.antRow, "On Demand Video").should("contain", session.video)
    }

    if(session.contents){
        session.contents.forEach((content)=>{
            cy.contains("span", content).should("exist")
        })
    }

    if(session.live){
        cy.get(authoring.vex.startTimeInput).should("have.value", session.live.start)
        cy.get(authoring.vex.endTimeInput).should("have.value", session.live.end)
        cy.contains("span", session.live.timeZone).should("exist")
        cy.contains(authoring.vex.antRow, "Live Content Type").within(()=>{
            cy.contains("span", session.live.type).should("exist")
        })

        if(session.live.webexLink){
            cy.get(authoring.vex.webexLinkInput).should("have.value", session.live.webexLink)
        }

        if(session.live.zoomNum){
            cy.get(authoring.vex.zoomNumInput).should("have.value", session.live.zoomNum)
        }

        if(session.live.zoomAuth == "No Password"){
            cy.get(authoring.vex.noPasswordRadio).parent().should("have.class", "ant-radio-checked")
        } else if(session.live.zoomAuth == "Require Password From Attendee"){
            cy.get(authoring.vex.requirePasswordRadio).parent().should("have.class", "ant-radio-checked")
        } else if(session.live.zoomAuth == "Apply Password Automatically For Attendee"){
            cy.get(authoring.vex.applyPasswordRadio).parent().should("have.class", "ant-radio-checked")
        }

        if(session.live.video){
            cy.contains(authoring.vex.antRow, "Live Content Video").should("contain", session.live.video)
        }
    }
}

const verifyAppearance = (appearance) => {
    cy.containsExact("span", appearance.appearance, {timeout: 20000}).should("exist")
    cy.get(`img[src="${appearance.heroImage.url}"]`).should("exist")
    cy.get(authoring.vex.appearance.heroHeightInput).should("have.value", appearance.heroHeight)
    cy.get(authoring.vex.appearance.headerTitle).should('contain', appearance.headerTitle)
    cy.get(authoring.vex.appearance.headerSubtitle).should('contain', appearance.headerSubtitle)
    cy.get(authoring.vex.appearance.contentTitle).should('contain', appearance.contentTitle)
    cy.get(authoring.vex.appearance.contentDescription).should("contain", appearance.contentDescription)
}

const verifySessionGroup = (group) => {
    cy.contains(authoring.vex.groupRow, group.name).should("exist").within(()=>{
        cy.contains("button", "Manage Sessions").click()
    })
    if(group.sessions){
        group.sessions.forEach( session => {
            cy.containsExact("span", session).should("exist")
        })
    }
}

const verifyLandingPage = (page, exceptBlocks = [], howCloned) => {
    if(howCloned == "cloned event"){
        cy.containsExact(authoring.vex.antCell, page.name).should('exist')
    } else {
        cy.containsExact(authoring.vex.antCell, page.cloneName).should('exist')
    }

    if(howCloned == "cloned event"){
        cy.containsExact(authoring.vex.antCell, page.name).parent().within(()=>{
            cy.containsExact(authoring.vex.antCell, page.slug).should("exist")
        }) 
    } else if (howCloned == "cloned landing page"){
        cy.containsExact(authoring.vex.antCell, page.cloneName).parent().within(()=>{
            cy.containsExact(authoring.vex.antCell, page.slug).should("not.exist") // If cloning the landing page within the event, slug should not be cloned
        }) 
    }

    if(howCloned == "cloned event"){
        cy.containsExact(authoring.vex.antCell, page.name).parent().within(()=>{
            cy.containsExact(authoring.vex.antCell, page.visibility).should("exist")
        }) 
    } else if (howCloned == "cloned landing page"){
        cy.containsExact(authoring.vex.antCell, page.cloneName).parent().within(()=>{
            cy.containsExact(authoring.vex.antCell, page.visibility).should("exist")
        }) 
    }

    if(page.setHome && howCloned == "cloned event"){
        // The only situation where the cloned landing page remains set as home page is when event is cloned and the landing page was set as home page
        cy.containsExact(authoring.vex.antCell, page.name).siblings("td:contains('Unset')").should("exist")
    } else if(howCloned == "cloned event") {
        cy.containsExact(authoring.vex.antCell, page.name).siblings("td:contains('Set as Home Page')").should("exist")
    } else {
        // If cloning landing page within an event, even if original set to home, the copy will not be set as home as there can only be 1 home page 
        cy.containsExact(authoring.vex.antCell, page.cloneName).siblings("td:contains('Set as Home Page')").should("exist")
    }

    if(howCloned == "cloned event"){
        authoring.vex.goToPageEditor(page.name)
    } else if(howCloned == "cloned landing page"){
        authoring.vex.goToPageEditor(page.cloneName)
    }
    
    page.blocks.forEach((block)=>{
        if(!exceptBlocks.includes(block.id)){
            authoring.vex.verifyBlock(block)
        } else {
            if(block.className){
                cy.get(`div[class='${block.className}']`).should("not.exist")
            }

            if(block.sessionGroup){
                cy.contains(authoring.vex.pages.sessionGroupRow, block.sessionGroup).should("not.exist")
            }
            
        }
    })

    cy.go("back") // Goes back to landing page set up tab
}

const verifyNavItem = (nav, exceptions = []) => {
    if(exceptions.includes(nav.label)){
        cy.containsExact(authoring.vex.navigation.navTitle, nav.label).should('not.exist')
    } else {
        cy.containsExact(authoring.vex.navigation.navTitle, nav.label).should('exist').parent().within(()=>{
            if(nav.source && !nav.newTab){
                cy.containsExact(authoring.vex.navigation.navSubtitle, `${nav.type}: ${nav.source}`).should('exist')
            } else if(nav.source && nav.newTab){
                cy.containsExact(authoring.vex.navigation.navSubtitle, `${nav.type}: ${nav.source} (new tab)`).should('exist')
            }else if (nav.type == "Text"){
                cy.containsExact(authoring.vex.navigation.navSubtitle, nav.type).should('exist')
            }
        })
    } 
}

// Note that event's black list is not cloned since this list is only for a specific event as a last resort to kick someone out 
// Note that a session's rocket chat settings are also not cloned since doing so would result in 2 separate sessions sharing the same chat 
// Note that empty session groups don't get cloned 

describe("VEX - Clone Event, Session, Landing Page", ()=>{
    it("always passes", ()=>{
        cy.log("pass")
    })
    /*it("Set up if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                Object.values(sessions).forEach(session => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
                authoring.vex.configureAppearance(appearance)
                Object.values(sessionGroups).forEach( group => {
                    authoring.vex.addSessionGroup(group.name)
                    if(group.sessions){
                        authoring.vex.addToGroup(group)
                    }
                })
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
                navigation.forEach((navItem)=>{
                    authoring.vex.addNavItem(navItem)
                })
                // The following makes the text nav item a sublink of the public session nav item 
                authoring.vex.attachSubNav({subject: navigation[4].label, target: navigation[0].label}) // First step puts text above public session
                authoring.vex.attachSubNav({subject: navigation[4].label, target: navigation[0].label}) // Second step makes text sublink of public session
            }
        })
    })

    it("Clone everything within the event, then within the clone, clone a session and a landing page", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.cloneName)
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.cloneEvent({
            name: event.cloneName,
            eventSetup: true,
            sessions: true,
            sessionGroups: true,
            appearance: true,
            landingPages: true,
            navigation: true
        })

        verifyEventSetup(event)

        Object.values(sessions).forEach(session => {
            authoring.vex.goToSessionConfig(session.name)
            verifySession(session, "cloned event")
            authoring.vex.backToEvent(event.cloneName)
        })

        authoring.vex.goToAppearance()
        verifyAppearance(appearance)

        authoring.vex.goToSessionGroup()
        verifySessionGroup(sessionGroups.publicGroup)
        verifySessionGroup(sessionGroups.privateGroup)
        cy.contains(authoring.vex.groupRow, sessionGroups.emptyGroup.name).should("not.exist") // empty session groups don't get cloned 
        
        authoring.vex.goToLandingPage()
        // Since empty session group not cloned, it won't appear in the landing page
        let exceptBlocks = ["Empty Group Block"]
        verifyLandingPage(landingPage, exceptBlocks, "cloned event") 

        authoring.vex.goToNavigation()
        navigation.forEach((nav) => {
            verifyNavItem(nav)
        })

        // Clone session via add session
        authoring.vex.cloneSession({
            name: sessions.webex.cloneName,
            template: sessions.webex.name
        })
        verifySession(sessions.webex, "cloned session")

        // Clone session from within original session 
        authoring.vex.backToEvent(event.cloneName)
        authoring.vex.goToSessionConfig(sessions.onDemand.name)
        verifySession(sessions.onDemand) // This just forces it to wait for supplemental content to load, which tends to cause modals to close, causing test flakiness
        authoring.vex.cloneSession({
            name: sessions.onDemand.cloneName
        })
        verifySession(sessions.onDemand, "cloned session") 
        authoring.vex.backToEvent(event.cloneName)

        // Clone landing page (via clone button)
        authoring.vex.goToLandingPage()
        authoring.vex.cloneLandingPage({
            method: "clone button",
            template: landingPage.name,
            name: landingPage.cloneName
        })
        verifyLandingPage(landingPage, exceptBlocks, "cloned landing page") 
        authoring.vex.deleteLandingPages(landingPage.cloneName)

        // Clone landing page (via add page button)
        authoring.vex.cloneLandingPage({
            method: "add page button",
            template: landingPage.name,
            name: landingPage.cloneName
        })
        verifyLandingPage(landingPage, exceptBlocks, "cloned landing page") 
    })

    it("Clone only select parts of the event by adding new event and choosing clone-from option", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.cloneName)
        authoring.vex.cloneEvent({
            name: event.cloneName,
            template: event.name,
            eventSetup: true,
            sessions: false,
            sessionGroups: false,
            appearance: true,
            landingPages: true,
            navigation: true
        })
        verifyEventSetup(event)

        authoring.vex.goToSessionList()
        Object.values(sessions).forEach(session => {
            cy.get(authoring.vex.sessionName(session.name)).should("not.exist")
        })

        authoring.vex.goToAppearance()
        verifyAppearance(appearance)

        authoring.vex.goToSessionGroup()
        Object.values(sessionGroups).forEach(group => {
            cy.contains(authoring.vex.groupRow, group.name).should("not.exist")
        })

        authoring.vex.goToLandingPage(landingPage) 
        // Since not cloning session groups, none of the session group blocks will appear on landing page
        const exceptBlocks = ["Public Group Block", "Private Group Block", "Empty Group Block"] 
        verifyLandingPage(landingPage, exceptBlocks, "cloned event")

        authoring.vex.goToNavigation()
        navigation.forEach((nav) => {
            // since sessions not cloned, their nav links will no longer exist
            // since 'Text' link is a sublink of "Public Session" link, "Text" will not exist if "Public Session" does not exist
            // Same logic applies to landing pages, but that is not tested here
            const exceptions = ["Public Session", "Private Session", "Text"] 
            verifyNavItem(nav, exceptions)
        })
    })*/

})