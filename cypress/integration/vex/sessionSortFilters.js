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
    }
}

describe("VEX - Session searching, sorting and filters", ()=>{
    it("Set up event and sessions if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.addVirtualEvent(event.name)
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
        authoring.vex.clearSessionSearch()
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')

        // Test the type filter
        authoring.vex.filterSessionType({onDemand: true, live: false})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')
        authoring.vex.filterSessionType({onDemand: false, live: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        authoring.vex.filterSessionType({onDemand: true, live: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        authoring.vex.filterSessionType({onDemand: false, live: false}) // turning off all filters is same as turning all on
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')

        // Test the visibility filter
        authoring.vex.filterSessionVisibility({public: true, private: false})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')
        authoring.vex.filterSessionVisibility({public: false, private: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        authoring.vex.filterSessionVisibility({public: true, private: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')
        authoring.vex.filterSessionVisibility({public: false, private: false})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('exist')

        // Test combination of visibiity and type filters
        authoring.vex.filterSessionVisibility({public: true, private: false})
        authoring.vex.filterSessionType({onDemand: false, live: true})
        cy.get(authoring.vex.sessionName(sessions.publicOnDemand.name)).should('not.exist')
        cy.get(authoring.vex.sessionName(sessions.publicLive.name)).should('exist')
        cy.get(authoring.vex.sessionName(sessions.privateLive.name)).should('not.exist')

        // Test sort by start date - will do this later once feature includes grouping by timezone 

        // Not going to test the sort by created date - not very important 
    })
})