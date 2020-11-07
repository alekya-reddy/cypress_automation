import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'vexCloning.js',
    slug: 'vexcloning-js',
    start: 'Jun 24, 2020 8:00pm',
    end: 'Jun 24, 2040 8:00pm',
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
        sessions: sessions.onDemand.name
    }, 
    privateGroup: {
        name: "Has Private Session",
        sessions: sessions.private.name
    },
    emptyGroup: {
        name: "Empty"
    }
}

const landingPage = {
    name: "Landing-Page",
    slug: "landing-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroups.publicGroup.name,
            expectSessions: [sessionGroups.publicGroup.sessions].flat(),
        },
        {
            type: "Session Group",
            sessionGroup: sessionGroups.privateGroup.name,
            expectSessions: [sessionGroups.privateGroup.sessions].flat(),
        },
        {
            type: "Session Group",
            sessionGroup: sessionGroups.emptyGroup.name,
            expectSessions: []
        },
        {
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

// Note that event's black list is not cloned since this list is only for a specific event as a last resort to kick someone out 
// Note that a session's rocket chat settings are also not cloned since doing so would result in 2 separate sessions sharing the same chat 
// Note that empty session groups don't get cloned 

describe("VEX - Clone Event, Session, Landing Page", ()=>{
    it("Set up if not already done", ()=>{
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
                authoring.vex.goToEventConfig(event.name) // remove later
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
                navigation.forEach((navItem)=>{
                    authoring.vex.addNavItem(navItem)
                })
            }
        })
    })

    /*it("Clone everything within the event, then within the clone, clone a session and a landing page", ()=>{
       
    })

    it("Clone select portions of the event", ()=>{

    })*/
})