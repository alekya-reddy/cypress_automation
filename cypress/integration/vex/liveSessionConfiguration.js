import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'liveSessionConfiguration.js',
    slug: 'livesessionconfiguration-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; },
}

const sessions = [
    {
        name: 'Live zoom before start',
        slug: 'live-zoom-before-start',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomAuth: 'No Password',
            video: false,
            status: 'upcoming'
        },
        video: false,
        contents: false,
        expect: "pending"
    },
    {
        name: 'Live zoom after end',
        slug: 'live-zoom-after-end',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomAuth: 'No Password',
            video: false,
            status: 'ended'
        },
        video: false,
        contents: false,
        expect: "zoom"
    },
    {
        name: 'Live zoom current',
        slug: 'live-zoom-current',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            endStr: 'Jun 24, 2040 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2040',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomAuth: 'No Password',
            video: false,
            status: 'live'
        },
        video: false,
        contents: [
            'PDF - Used by Cypress automation for VEX testing',
            'Website - Used by Cypress automation for VEX testing',
            'Image - Used by Cypress automation for VEX testing'
        ],
        expect: 'zoom'
    },
    {
        name: 'Live zoom with on-demand before start',
        slug: 'live-zoom-with-on-demand-before-start',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomAuth: 'No Password',
            video: false,
            status: 'upcoming'
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        contents: false,
        expect: 'pending'
    },
    {
        name: 'Live zoom with on-demand after end',
        slug: 'live-zoom-with-on-demand-after-end',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2000 8:00pm',
            end: 'Jun 24, 2010 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomAuth: 'No Password',
            video: false,
            status: 'ended'
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        contents: false,
        expect: 'youtube'
    },
    {
        name: 'Live zoom with on-demand current',
        slug: 'live-zoom-with-on-demand-current',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomAuth: 'No Password',
            video: false,
            status: 'live'
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        contents: false,
        expect: 'zoom'
    },
    {
        name: 'Live content before start',
        slug: 'live-content-before-start',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomAuth: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'upcoming'
        },
        video: false,
        contents: false,
        expect: 'pending'
    },
    {
        name: 'Live content after end',
        slug: 'live-content-after-end',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2000 8:00pm',
            end: 'Jun 24, 2010 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomAuth: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'ended'
        },
        video: false,
        contents: false,
        expect: 'ended'
    },
    {
        name: 'Live content current',
        slug: 'live-content-current',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomAuth: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'live'
        },
        video: false,
        contents: false,
        expect: 'youtube'
    },
    {
        name: 'Live content with on-demand after end',
        slug: 'live-content-with-on-demand-after-end',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2000 8:00pm',
            end: 'Jun 24, 2010 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomAuth: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'ended'
        },
        video: 'Vimeo - Used in Cypress automation for VEX testing',
        contents: false,
        expect: 'vimeo'
    }
]
const sessions_simulive = [
    {
        name: 'Live content current with simulive video',
        slug: 'live-content-current-with-simulive-video',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'now',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomAuth: false,
            video: 'Wistia - Used in Cypress automation for VEX testing',
            status: 'live',
            isSimulive: true
        },
        video: false,
        contents: false,
        expect: 'simulive'
    },
    {
        name: 'Live content after end with simulive video',
        slug: 'live-content-after-end-with-simulive-video',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomAuth: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'ended',
            isSimulive: true
        },
        video: false,
        contents: false,
        expect: 'simulive'
    }
]

const contentSource = authoring.common.env.orgs['automation-vex'].resources

// In this test file, we set up live sessions with different start and end times
// These sessions can use 'zoom' for a real-live experience
// These can also be 'fake-live' where an existing content library video is passed off as a 'live' video 
// Live zoom sessions can also have on-demand video configured as a fallback when the live zoom session ends 
// Note: Will not be using a real zoom id number, so zoom won't actually connect to a meeting. That's ok. Zoom's sdk is not in our control - just test that it is there. 
describe('VEX - Virtual Event Live Sessions', function() {
    it("Setup if not already done", () => {
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login();
                authoring.vex.visit() 
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                sessions.forEach(session => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
            }
        })
    })
    it('Add and configure any live sessions which do not already exist', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)

        // Do some testing to make sure live config UI works as expected
        const clonedSession = {
            name: "cloned session",
            slug: "cloned",
            get url(){ return `${event.url}/${this.slug}` },
            live: {
                end: 'Jun 24, 2020 8:00pm'
            }
        }
        authoring.vex.removeSession(clonedSession.name)
        authoring.vex.cloneSession({name: clonedSession.name, template: sessions[2].name})

        // If on-demand is toggled on and live is off, then should not see any of the live configuration options
        cy.get(authoring.vex.onDemandRadio).click()
        cy.get(authoring.vex.liveRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.containsExact('legend', 'On Demand Session').should('exist')
        cy.containsExact('legend', 'Live Session').should('not.exist')
        cy.get(authoring.vex.startTimeEditInput(0)).should('not.exist')
        cy.get(authoring.vex.endTimeEditInput(0)).should('not.exist')
        cy.get(authoring.vex.timeZonePicker).should('not.exist')
        cy.get(authoring.vex.liveTypePicker).should('not.exist')

        // Should not be able to delete any added on-demand video if toggled to on-demand
        authoring.vex.pickOnDemandVideo('Youtube - Used in Cypress automation for VEX testing')
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.recordSavedMessage, {timeout: 20000}).should("exist")
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").should("not.exist")
        
        // If on-demand is toggled off and live is on, then should see the live configuration options 
        cy.get(authoring.vex.liveRadio).click()
        cy.get(authoring.vex.onDemandRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.containsExact('legend', 'On Demand Session').should('exist') // On demand config should always be visible 
        cy.containsExact('legend', 'Live Session').should('exist')
        cy.get(authoring.vex.startTimeEditInput(0)).should('exist')
        cy.get(authoring.vex.endTimeEditInput(0)).should('exist')
        cy.get(authoring.vex.timeZonePicker).should('exist')
        cy.get(authoring.vex.liveTypePicker).should('exist')

        // If live content type is content library, should not see zoom configuration options
        cy.get(authoring.vex.liveTypePicker).click()
        cy.get(authoring.vex.antDropdownContainer).within(()=>{
            cy.get(authoring.vex.selectOption('Content Library')).click()
        })
        cy.get(authoring.vex.zoomNumInput).should('not.exist')
        cy.get(authoring.vex.noPasswordRadio).should('not.exist')
        cy.get(authoring.vex.applyPasswordRadio).should('not.exist')

        // Pressing 'Select Live Video' button should open up video picker 
        cy.get(authoring.vex.selectLiveContentButton).should('exist').click()
        cy.get(authoring.vex.contentPickerSearchBar).should('exist') 
        cy.get(authoring.vex.modal).within(()=>{
            cy.contains("h3", "Select Live Content Video").should('exist')
            cy.get(authoring.vex.cancelButton).click()
        })

        // If live content type is zoom, should see zoom configuration options 
        cy.get(authoring.vex.liveTypePicker).click()
        cy.get(authoring.vex.antDropdownContainer).within(()=>{
            cy.get(authoring.vex.selectOption('Zoom')).click()
        })
        cy.get(authoring.vex.zoomNumInput).should('exist')
        cy.get(authoring.vex.noPasswordRadio).should('exist')
        cy.get(authoring.vex.applyPasswordRadio).should('exist')
        cy.contains('button', 'Select Live Video').should('not.exist')

        // If zoom's 'apply password' option is selected, then should see zoom password input 
        cy.get(authoring.vex.applyPasswordRadio).click()
        cy.get(authoring.vex.noPasswordRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.zoomPWInput).should('exist')

        // If zoom's 'no password' option is selected, then should not see zoom password input 
        cy.get(authoring.vex.noPasswordRadio).click()
        cy.get(authoring.vex.applyPasswordRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.zoomPWInput).should('not.exist')

        // Save the current settings
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.recordSavedMessage, {timeout: 20000}).should("exist")

        // Once saved, the on-demand video should have option to delete it if session is of type "live"
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").should("exist").click()
        cy.get(".ant-popover-buttons").within(()=>{
            cy.contains('button', "Delete").click()
        })
        cy.contains("The on demand video was removed successfully.", {timeout: 20000}).should("exist")
        cy.containsExact("div", 'Youtube - Used in Cypress automation for VEX testing').should("not.exist")
        cy.contains(authoring.vex.removeonDemandVideo,"Delete").should("not.exist")

        // Set the end date to the past so that this would, in theory, cause the session to fallback to on-demand in any exists.
        // In our case, we deleted the on-demand so it should instead remain on zoom on consumption side
        authoring.vex.configureSession(clonedSession)
        cy.visit(clonedSession.url + "?lb_email=getoutofmyway@gmail.com")
        consumption.vex.expectZoom()
        cy.go("back")
    })
    it('Go to consumption, visit the live sessions, and verify that we see the expected behavior', function(){
        sessions.forEach((session)=>{
            cy.visit(event.url + "/?lb_email=bobman%40gmail.com") // visit with lb_email query string so don't have to fuss around with registration form 
            cy.contains(consumption.vex.sessionCardTitle, session.name). should('exist').click()
            cy.url().should('eq', session.url)
            
            // For each session, what are we expecting to see? Zoom? Waiting screen? A specific content library video?
            if(session.expect == 'pending'){
                // If visiting before the scheduled live session...
                cy.contains(consumption.vex.sessionPageTitle, session.name).should('exist')
                cy.contains('div', `${session.live.start} - ${session.live.end}`).should('exist')
            } else if (session.expect == 'zoom'){
                consumption.vex.expectZoom()
            } else if (session.expect == 'youtube'){
                consumption.vex.expectYoutube()
            } else if (session.expect == 'vimeo'){
                consumption.vex.expectVimeo()
            }
        })

        // Visit each session again, except this time visit the url directly
        // There was a bug where visiting url directly would result in 500 error if session is live and no on-demand fallback is configured 
        sessions.forEach((session)=>{
            cy.visit(session.url) // Cypress will automatically fail if get status 500
        })

        // On the event page on consumption side, the session cards should contain the correct information about their live status, date and name 
        // These sessions should be sorted into the correct categories ("Agenda" or "On Demand")
        cy.visit(event.url)
        sessions.forEach((session)=>{
            if(session.live.status == 'live' || (session.live.status == 'ended' && !session.video) ){
                // If live session is currently live, it should be in the "Agenda" section 
                // Or if a live session has ended and has no on-demand fallback, it still behaves like it's live until somebody manually turns it off 
                cy.containsExact("h2", "On Demand Sessions").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("not.exist")
                })
                cy.containsExact("h2", "Agenda").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist").should('contain', session.live.start).within(()=>{
                        if(session.live.status == 'live'){
                            cy.containsExact('div', 'Live').should('exist') // If live session is currently live, then it should have 'live' label
                        }
                    })
                })
            } else if(session.live.status == 'upcoming'){
                // If live session is upcoming, it should be in the "Agenda" section 
                cy.containsExact("h2", "On Demand Sessions").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("not.exist")
                })
                cy.containsExact("h2", "Agenda").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist").should('contain', session.live.start).within(()=>{
                        cy.containsExact('div', 'Live').should('not.exist') // live session is still pending, so no live label
                    })
                })
            } else if(session.live.status == 'ended' && session.video){ 
                // If session has ended, and there is an on-demand video configured as a fall back, then these cards should go in the 'on demand' section
                cy.containsExact("h2", "On Demand Sessions").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist").should('contain', session.live.start).within(()=>{
                        cy.containsExact('div', 'Live').should('not.exist')
                        cy.containsExact("div", "On Demand").should("exist")
                    })
                })
                cy.containsExact("h2", "Agenda").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("not.exist")
                })
            } 
        })

        // Go to one of the live zoom sessions to do further testing there
        cy.contains(consumption.vex.sessionCardTitle, sessions[2].name).click()
        cy.url().should('eq', sessions[2].url)

        // Cycle through the zoom session's content to make sure they display and that zoom iframe still exists
        sessions[2].contents.forEach((content)=>{
            cy.contains('a', content).should('exist').click()
            cy.get('iframe').should('have.length', 2)
            cy.get(consumption.vex.zoomIframe).should('exist')
            cy.get(`iframe[src="${contentSource[content][authoring.common.env.TEST_ENV]}"]`).should('exist')
        })
        // Close the supplemental content and verify that only the zoom iframe is still open
        cy.get(consumption.vex.closeContentButton).click()
        cy.get('iframe').should('have.length', 1)
        cy.get(consumption.vex.zoomIframe).should('exist')
    })
    it("Setup to test session with Simulive video enabled for a live session", () => {
        authoring.common.login();
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        authoring.vex.removeSession(sessions_simulive[0].name)
        authoring.vex.addSession(sessions_simulive[0].name)
        authoring.vex.configureSession(sessions_simulive[0])
    })
    it('Go to consumption, visit the simulive video mode enabled for a live session, and verify that we see the expected behavior', function(){
        cy.pause()
        cy.visit(event.url + "/?lb_email=bobman%40gmail.com") // visit with lb_email query string so don't have to fuss around with registration form
        cy.contains(consumption.vex.sessionCardTitle, sessions_simulive[0].name). should('exist').click()
        cy.url().should('eq', sessions_simulive[0].url)
        if (sessions_simulive[0].expect == 'simulive'){
            consumption.vex.expectSimulive()
        }
    })
    it("Setup to test session with Simulive video enabled and the live session ended", () => {
        authoring.common.login();
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        authoring.vex.removeSession(sessions_simulive[1].name)
        authoring.vex.addSession(sessions_simulive[1].name)
        authoring.vex.configureSession(sessions_simulive[1])
    })
    it('Go to consumption, visit the simulive video mode enabled session, and verify that we see the expected behavior', function(){
        cy.visit(event.url + "/?lb_email=bobman%40gmail.com") // visit with lb_email query string so don't have to fuss around with registration form
        cy.contains(consumption.vex.sessionCardTitle, sessions_simulive[1].name).should('exist').click()
        cy.url().should('eq', sessions_simulive[1].url)
        if (sessions_simulive[1].expect == 'simulive'){
            cy.wait(3000)
            cy.contains("This live video has ended")
            consumption.vex.expectSimulive()
        }
    })
})