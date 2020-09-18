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
            startStr: 'Jun 24, 2040 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2040',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2041 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2041',
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
            startStr: 'Jun 24, 2010 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2010',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2011 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2011',
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
            status: 'ended'
        },
        video: false,
        contents: false,
        expect: "ended"
    },
    {
        name: 'Live zoom current',
        slug: 'live-zoom-current',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            startStr: 'Jun 24, 2010 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2010',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
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
            startStr: 'Jun 24, 2040 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2040',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2041 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2041',
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
            startStr: 'Jun 24, 2000 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2000',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2010 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2010',
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
            startStr: 'Jun 24, 2010 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2010',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
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
            startStr: 'Jun 24, 2040 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2040',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2041 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2041',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
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
            startStr: 'Jun 24, 2000 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2000',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2010 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2010',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
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
            startStr: 'Jun 24, 2010 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2010',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
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
            startStr: 'Jun 24, 2000 8:00pm',
            start: {
                picker: authoring.vex.startTimeInput,
                month: 'Jun',
                year: '2000',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
            endStr: 'Jun 24, 2010 8:00pm',
            end: {
                picker: authoring.vex.endTimeInput,
                month: 'Jun',
                year: '2010',
                day: '24',
                hour: '08',
                minute: '00',
                xm: 'PM'
            },
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

const contentSource = {
    'Image - Used by Cypress automation for VEX testing' : (function (server){
        if(server == 'pathfactory-staging'){
            return 'https://cdn.pathfactory-staging.com/assets/74/contents/12954/d8058125-c1a5-41d3-9f66-cf8176fe2040.png';
        } else if (server == 'pathfactory-qa'){
            return 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png';
        } else if (server == 'prod'){
            return 'https://cdn.pathfactory.com/assets/10668/contents/181009/31cacbc2-e385-4a58-881e-8fb175dbfa5b.png';
        }
    })(Cypress.env("TEST_ENV")), 
    'PDF - Used by Cypress automation for VEX testing' : (function (server){
        if(server == 'pathfactory-staging'){
            return 'https://cdn.pathfactory-staging.com/assets/74/contents/12955/ae090cdf-c888-41f1-9c5c-5f20fee9acce.pdf';
        } else if (server == 'pathfactory-qa'){
            return 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf';
        } else if (server == 'prod'){
            return 'https://cdn.pathfactory.com/assets/10668/contents/181010/26a87f6a-9067-4247-b2ef-30764379b980.pdf';
        }
    })(Cypress.env("TEST_ENV")),
    'Website - Used by Cypress automation for VEX testing' : 'https://en.wikipedia.org/wiki/SpaceX'
}

// In this test file, we set up live sessions with different start and end times
// These sessions can use 'zoom' for a real-live experience
// These can also be 'fake-live' where an existing content library video is passed off as a 'live' video 
// Live zoom sessions can also have on-demand video configured as a fallback when the live zoom session ends 
// Note: Will not be using a real zoom id number, so zoom won't actually connect to a meeting. That's ok. Zoom's sdk is not in our control - just test that it is there. 
describe('VEX - Virtual Event Live Sessions', function() {
   it('Add and configure any live sessions which do not already exist', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        let check = {sessionAlreadyExists: false}
        sessions.forEach((session)=>{
            // Only add session if doesn't already exist. This way, can save time on the set up
            cy.get("body").then(()=>{ check.sessionAlreadyExists = false })
            cy.ifElementWithExactTextExists(authoring.vex.sessionCardTitle, session.name, 2000, ()=>{
                check.sessionAlreadyExists = true
            })
            cy.get("body").then(()=>{
                if(check.sessionAlreadyExists == false){
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    cy.containsExact('a', event.name).click()
                }
            })
        })

        // Do some testing to make sure live config UI works as expected 
        authoring.vex.goToSessionConfig(sessions[2].name)

        // If on-demand is toggled on and live is off, then should not see any of the live configuration options
        cy.get(authoring.vex.onDemandRadio).click()
        cy.get(authoring.vex.liveRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.containsExact('legend', 'On Demand Session').should('exist')
        cy.containsExact('legend', 'Live Session').should('not.exist')
        cy.get(authoring.vex.startTimeInput).should('not.exist')
        cy.get(authoring.vex.endTimeInput).should('not.exist')
        cy.get(authoring.vex.timeZonePicker).should('not.exist')
        cy.get(authoring.vex.liveTypePicker).should('not.exist')
        
        // If on-demand is toggled off and live is on, then should see the live configuration options 
        cy.get(authoring.vex.liveRadio).click()
        cy.get(authoring.vex.onDemandRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.containsExact('legend', 'On Demand Session').should('exist') // On demand config should always be visible 
        cy.containsExact('legend', 'Live Session').should('exist')
        cy.get(authoring.vex.startTimeInput).should('exist')
        cy.get(authoring.vex.endTimeInput).should('exist')
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

        // Pressing 'Select on demand video' should open a different video picker
        cy.get(authoring.vex.selectVideoButton).click()
        cy.get(authoring.vex.modal).within(()=>{
            cy.contains("h3", "Select On Demand Video").should('exist')
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

        // If zoom's 'no password' option is selected, then should not see zoom password input 
        cy.get(authoring.vex.noPasswordRadio).click()
        cy.get(authoring.vex.applyPasswordRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.zoomPWInput).should('not.exist')

        // If zoom's 'apply password' option is selected, then should see zoom password input 
        cy.get(authoring.vex.applyPasswordRadio).click()
        cy.get(authoring.vex.noPasswordRadio).parent().should('not.have.class', 'ant-radio ant-radio-checked')
        cy.get(authoring.vex.zoomPWInput).should('exist')

        // Sometimes bugs are found if we save a change on authoring and verify on consumption side
        // Whereas if we only verify on consumption side for a configuration on authoring that was saved long ago, the bug would not be revealed
        // So, for 1 of the sessions, delete it and re-add it so that it will be added using the latest code. 
        cy.containsExact('a', event.name).click()
        authoring.vex.removeSession(sessions[2].name)
        authoring.vex.addSession(sessions[2].name)
        authoring.vex.configureSession(sessions[2])
    })

    it('Go to consumption, visit the live sessions, and verify that we see the expected behavior', function(){
        sessions.forEach((session)=>{
            cy.visit(event.url)
            if(session.expect == 'ended'){
                // If session has ended and there is no on-demand fallback, it should no longer be accessible 
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('not.exist')
            } else {
                cy.contains(consumption.vex.sessionCardTitle, session.name). should('exist').click()
                cy.url().should('eq', session.url)
            }

            // If the session page asks to register, fill out form and get it out of way so can proceed with test 
            cy.ifElementExists(consumption.vex.emailInput, 500, ()=>{
                cy.get(consumption.vex.emailInput).clear().type("bobman@gmail.com")
                cy.contains("button", "Submit").click()
            })
            
            // For each session, what are we expecting to see? Zoom? Waiting screen? A specific content library video?
            // Note: There isn't a good way to check that a specific content library video is playing, so only going to identify if it's youtube or vimeo 
            // For example, if you have a live session that uses youtube as live video content, and vimeo as on-demand fallback, if session has ended, you would expect to see vimeo. If session in progress, expect to see youtube
            if(session.expect == 'pending'){
                // If visiting before the scheduled live session...
                cy.contains(consumption.vex.sessionPageTitle, session.name).should('exist')
                cy.contains('div', `${session.live.startStr} - ${session.live.endStr}`).should('exist')
            } else if (session.expect == 'zoom'){
                // If live zoom session currently in progress...
                cy.waitForIframeToLoad('iframe', consumption.vex.zoomRootDiv, 10000)
                cy.getIframeBody('iframe').within(()=>{
                    cy.get(consumption.vex.zoomRootDiv).should('exist')
                })
            } else if (session.expect == 'youtube'){
                // If 'fake-live' session is in progress (using a content-library video and passing it off as 'live')
                // or if live zoom session has ended and an on-demand video is available as a fallback...
                cy.waitForIframeToLoad('iframe', consumption.vex.youtube.videoPlayer, 10000)
                cy.getIframeBody('iframe').within(()=>{
                    cy.get(consumption.vex.youtube.videoPlayer).should('exist')
                })
            } else if (session.expect == 'vimeo'){
                cy.waitForIframeToLoad(consumption.vex.vimeo.iframe, consumption.vex.vimeo.videoPlayer, 10000)
                cy.getIframeBody(consumption.vex.vimeo.iframe).within(()=>{
                    cy.get(consumption.vex.vimeo.videoPlayer).should('exist')
                })
            }
        })

        // Visit each session again, except this time visit the url directly
        // There was a bug where visiting url directly would result in 500 error if session is live and no on-demand fallback is configured 
        sessions.forEach((session)=>{
            if(session.expect !== 'ended'){
                cy.visit(session.url) // Cypress will automatically fail if get status 500
            }
        })

        // On the event page on consumption side, the session cards should contain the correct information about their live status 
        // These sessions should be sorted into the correct categories ("Agenda" or "On Demand")
        cy.visit(event.url)
        sessions.forEach((session)=>{
            if(session.live.status == 'live'){
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('exist') // If live session is currently live, then it should have 'live' label
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('contain', session.live.startStr) 

                // If live session is currently live, it should be in the "Agenda" section 
                cy.containsExact("h4", "On Demand Sessions").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("not.exist")
                })
                cy.containsExact("h4", "Agenda").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist")
                })
            } else if(session.live.status == 'upcoming'){
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('not.exist') // live session is still pending, so no live label
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('contain', session.live.startStr)

                // If live session is upcoming, it should be in the "Agenda" section 
                cy.containsExact("h4", "On Demand Sessions").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("not.exist")
                })
                cy.containsExact("h4", "Agenda").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist")
                })
            } else if(session.live.status == 'ended' && session.video){ 
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('not.exist')
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('contain', session.live.startStr)

                // If session has ended, and there is an on-demand video configured as a fall back, then these cards should go in the 'on demand' section
                cy.containsExact("h4", "On Demand Sessions").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("exist")
                })
                cy.containsExact("h4", "Agenda").parent().within(()=>{
                    cy.contains(consumption.vex.sessionCardTitle, session.name).should("not.exist")
                })
            } else if (session.live.status == 'ended' && !session.video){
                // If a live session has ended and there's no on-demand configured as a fall back, it should no longer exist on the event page
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('not.exist')
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
            cy.get(`iframe[src="${contentSource[content]}"]`).should('exist')
        })

         // Close the supplemental content and verify that only the zoom iframe is still open
         cy.get(consumption.vex.closeContentButton).click()
         cy.get('iframe').should('have.length', 1)
         cy.get(consumption.vex.zoomIframe).should('exist')
    })

})