import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'dryRun.js',
    slug: 'dryrun-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    form: {name: "Standard Form Short"}
}

const session = {
    name: 'Live content',
    slug: 'live-content',
    get url(){ return `${event.url}/${this.slug}`; },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: 'Jun 24, 2040 8:00pm',
        end: 'Jun 24, 2041 8:00pm',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Content Library',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        status: 'live'
    },
    rocketChat: {
        on_off: "ON",
        moderators: "commander.shepard@gmail.com"
    }
}

const moderator = session.rocketChat.moderators
const notModerator = "tali.zorah@gmail.com"

describe("VEX - Dry run", () => {
    it("Set up if not already done", () => {
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
            }
        })
    })

    it("After registering via form, moderator should have access to a live session that hasn't started yet", () => {
        cy.visit(session.url)
        consumption.vex.fillStandardForm({email: moderator})
        consumption.vex.expectYoutube()
    })

    it("A non-moderator should have no access to a live session that hasn't started yet", () => {
        cy.visit(session.url)
        consumption.vex.fillStandardForm({email: notModerator})
        cy.contains(session.live.start).should("exist")
        cy.get(consumption.vex.youtube.iframe).should("not.exist")
    })

    it("A moderator who registers via lb_email in the query string should have access to a live session that hasn't started yet", () => {
        cy.visit(session.url + `/?lb_email=${moderator}`)
        consumption.vex.expectYoutube()
    })

    // Note: If an event has no form, then the only way for moderator to provide email is via lb_email in query string 
    // This is not a supported scenario as a live event would very likely have forms enabled 
})