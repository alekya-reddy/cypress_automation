import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'sessionSortFilters.js',
    slug: 'sessionsortfilters-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = {
    publicOnDemand: {
        name: "public on demand",
        slug: "pod",
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
    publicLive: {
        name: 'public live',
        slug: 'pl',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 20, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '1234',
            zoomAuth: "No Password"
        }
    },
    privateLive: {
        name: "private live",
        slug: "pvl",
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
    },
    hawaii1: {
        name: 'hawaii-1',
        slug: 'hawaii-1',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 20, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-10:00) Hawaii',
            type: 'Zoom',
            zoomNum: '1234',
            zoomAuth: "No Password"
        }
    },
    hawaii2: {
        name: 'hawaii-2',
        slug: 'hawaii-2',
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-10:00) Hawaii',
            type: 'Zoom',
            zoomNum: '1234',
            zoomAuth: "No Password"
        }
    }
}

const description = '{{session.page_title}} {{session.start_time}} {{session.end_time}} {{session.time_zone}}';

const sessionExists = (options) => {
    const exists = options.yes
    const notExists = options.no
    
    exists.forEach(session => {
        cy.get(authoring.vex.sessionName(session)).should('exist')
    })

    notExists.forEach(session => {
        cy.get(authoring.vex.sessionName(session)).should('not.exist')
    })
}

describe("VEX - Session searching, sorting and filters", ()=>{
    it("Set up event and sessions if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                Object.values(sessions).forEach(session => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
            }
        })
    })

    it("Test the session search, sort and filter", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        
        // Test the search function
        authoring.vex.searchSession(sessions.publicOnDemand.name)
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('not.exist')
        authoring.vex.clearSessionSearch()
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')

        // Test the type filter
        authoring.vex.filterSessionType({onDemand: true, live: false})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('not.exist')
        authoring.vex.filterSessionType({onDemand: false, live: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')
        authoring.vex.filterSessionType({onDemand: true, live: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')
        authoring.vex.filterSessionType({onDemand: false, live: false}) // turning off all filters is same as turning all on
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')

        // Test the visibility filter
        authoring.vex.filterSessionVisibility({public: true, private: false})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')
        authoring.vex.filterSessionVisibility({public: false, private: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('not.exist')
        authoring.vex.filterSessionVisibility({public: true, private: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')
        authoring.vex.filterSessionVisibility({public: false, private: false})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')

        // Test combination of visibiity and type filters
        authoring.vex.filterSessionVisibility({public: true, private: false})
        authoring.vex.filterSessionType({onDemand: false, live: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii1.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.hawaii2.name)).should('exist')

        // Turn off all filters
        authoring.vex.filterSessionVisibility({public: false, private: false})
        authoring.vex.filterSessionType({onDemand: false, live: false})
        // Test sort by start date
        authoring.vex.toggleSortByDate("ascend")
        cy.viewport(2000, 1000) // Need to expland viewport or else the urls will get truncated in the DOM
        cy.get(authoring.vex.sessionUrlCell).eq(0).should("contain", sessions.publicOnDemand.url)
        cy.get(authoring.vex.sessionUrlCell).eq(1).should("contain", sessions.publicLive.url)
        cy.get(authoring.vex.sessionUrlCell).eq(2).should("contain", sessions.hawaii1.url)
        cy.get(authoring.vex.sessionUrlCell).eq(3).should("contain", sessions.privateLive.url)
        cy.get(authoring.vex.sessionUrlCell).eq(4).should("contain", sessions.hawaii2.url)
        authoring.vex.toggleSortByDate("descend")
        cy.get(authoring.vex.sessionUrlCell).eq(4).should("contain", sessions.publicOnDemand.url)
        cy.get(authoring.vex.sessionUrlCell).eq(3).should("contain", sessions.publicLive.url)
        cy.get(authoring.vex.sessionUrlCell).eq(2).should("contain", sessions.hawaii1.url)
        cy.get(authoring.vex.sessionUrlCell).eq(1).should("contain", sessions.privateLive.url)
        cy.get(authoring.vex.sessionUrlCell).eq(0).should("contain", sessions.hawaii2.url)

        // Not going to test the sort by created date - not very important 
    })

    it("On demand session user can pass Page Title, Start Time, End time and Time Zone as field merge but on consumption side it will only show Page Title", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(sessions.publicOnDemand.name)
        cy.get(authoring.vex.sessionDescription.editor).clear().type(description, { parseSpecialCharSequences: false })
        cy.get(authoring.common.saveButton).click()

        cy.visit(sessions.publicOnDemand.url)
        cy.contains('div', sessions.publicOnDemand.name).should("exist")

    })

    it("Live session user can pass Page Title, Start Time, End time and Time Zone as field merge on consumption side, it will show the same", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(sessions.publicLive.name)
        cy.get(authoring.vex.sessionDescription.editor).clear().type(description, { parseSpecialCharSequences: false })
        cy.get(authoring.common.saveButton).click()

        cy.visit(sessions.publicLive.url)
        cy.contains('div', sessions.publicLive.name).should("exist")
        cy.contains('p', "public live Jun 20, 2020 8:00pm EDT (GMT-04:00) Jun 24, 2041 8:00pm EDT (GMT-04:00) Eastern Time (US & Canada)").should("exist")

    })

})