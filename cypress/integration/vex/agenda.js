import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'agenda.js',
    slug: 'agenda-js',
    start: 'Jun 24, 2020 8:00pm',
    end: 'Jun 24, 2040 8:00pm',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = [
    {
        name: "before range",
        slug: "before-range",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 25, 2010 8:00pm',
            end: 'Jun 26, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        expect: null
    },
    {
        name: "overlaps start",
        slug: "overlaps-start",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 23, 2019 8:00pm',
            end: 'Jun 24, 2021 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        expect: null
    },
    {
        name: "within range",
        slug: "within-range",
        get url(){
            return `${event.url}/${this.slug}`
        },
        description: "within range description",
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 25, 2021 8:00pm',
            end: 'Jun 24, 2022 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        expect: "Day 367"
    },
    {
        name: "overlaps end",
        slug: "overlaps-end",
        get url(){
            return `${event.url}/${this.slug}`
        },
        description: "overlaps end description",
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2039 8:00pm',
            end: 'Jun 24, 2044 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        expect: "Day 6940"
    }, 
    {
        name: "after range",
        slug: "after-range",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2041 8:00pm',
            end: 'Jun 24, 2044 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        expect: null
    } 
]

describe("VEX - Agenda", ()=>{
    it("Automatically set up for the test if not already done", ()=>{
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
            }
        })
    })

    it("Go to consumption and verify that sessions that start within range show up as tabs", ()=>{
        sessions.forEach((session)=>{
            cy.visit(event.url)
            cy.containsExact("div", "All Sessions", {timeout: 10000}).should('exist').siblings("div").should("have.length", 2)
            if (session.expect){
                cy.containsExact("div", session.expect).should('exist').click()
                cy.contains(consumption.vex.sessionListItem, session.name).should('exist')
                cy.contains(session.description).should("exist")
            }
        })
    })
})