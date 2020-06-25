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
            zoomPW: 'No Password',
            video: false,
            status: 'upcoming'
        },
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
            zoomPW: 'No Password',
            video: false,
            status: 'ended'
        },
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
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Zoom',
            zoomNum: '111 111 111',
            zoomPW: 'No Password',
            video: false,
            status: 'live'
        },
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
            zoomPW: 'No Password',
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'upcoming'
        },
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
            zoomPW: 'No Password',
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'ended'
        },
        contents: false,
        expect: 'on-demand'
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
            zoomPW: 'No Password',
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'live'
        },
        contents: false,
        expect: 'zoom'
    },
    {
        name: 'Live on-demand before start',
        slug: 'live-on-demand-before-start',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomPW: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'upcoming'
        },
        contents: false,
        expect: 'pending'
    },
    {
        name: 'Live on-demand after end',
        slug: 'live-on-demand-after-end',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2000 8:00pm',
            end: 'Jun 24, 2010 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomPW: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'ended'
        },
        contents: false,
        expect: 'on-demand'
    },
    /*{
        // Currently there is a bug where having this configuration set to public will cause all of consumption side to go blank
        // Once this has been fixed, go to qa and staging autonation-vex org and set this back to public 
        name: 'Live on-demand current',
        slug: 'live-on-demand-current',
        get url(){ return `${event.url}/${this.slug}`; },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2040 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Content Library',
            zoomNum: false,
            zoomPW: false,
            video: 'Youtube - Used in Cypress automation for VEX testing',
            status: 'live'
        },
        contents: false,
        expect: 'on-demand'
    }*/
]

const contentSource = {
    'Image - Used by Cypress automation for VEX testing' : Cypress.env('TEST_ENV') == 'pathfactory-staging' ? 'https://cdn.pathfactory-staging.com/assets/74/contents/12954/d8058125-c1a5-41d3-9f66-cf8176fe2040.png' : 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
    'PDF - Used by Cypress automation for VEX testing' : Cypress.env('TEST_ENV') == 'pathfactory-staging' ? 'https://cdn.pathfactory-staging.com/assets/74/contents/12955/ae090cdf-c888-41f1-9c5c-5f20fee9acce.pdf' : 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
    'Website - Used by Cypress automation for VEX testing' : 'https://en.wikipedia.org/wiki/SpaceX'
}

// In this test file, we set up live sessions with different start and end times
// These sessions can use 'zoom' for a real-live experience
// These can also be 'fake-live' where an existing content library video is passed off as a 'live' video 
// Live zoom sessions can also have on-demand video configured as a fallback when the live zoom session ends 
describe('VEX - Virtual Event Live Sessions', function() {
    it('Add and configure any live sessions which do not already exist', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        sessions.forEach((session)=>{
            // Only add session if doesn't already exist. This way, can save time on the set up
            cy.ifNoElementWithExactTextExists(authoring.vex.sessionCardTitle, session.name, 1000, ()=>{
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
                cy.containsExact('a', event.name).click()
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
        cy.contains('button', 'Select Live Video').should('exist').click()
        cy.get(authoring.vex.contentPickerSearchBar).should('exist') 
        cy.get(authoring.vex.modal).eq(1).within(()=>{
            cy.contains('button', 'Cancel').click()
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
            cy.visit(session.url)
            if(session.expect == 'pending'){
                // If visiting before the scheduled live session...
                cy.get('body').should('contain', 'The session will start soon.')
                cy.get('body').should('contain', `Please come back at`) // Once the finicky date picker is fixed, we can now reliably expect the correct 'come back at' date 
            } else if (session.expect == 'ended'){
                // If session has ended and no on-demand video is set as a fallback...
                cy.get('body').should('contain', 'The session has finished.')
            } else if (session.expect == 'zoom'){
                // If live zoom session currently in progress...
                cy.waitForIframeToLoad('iframe', consumption.vex.zoomRootDiv, 10000)
                cy.getIframeBody('iframe').within(()=>{
                    cy.get(consumption.vex.zoomRootDiv).should('exist')
                })
            } else if (session.expect == 'on-demand'){
                // If 'fake-live' session is in progress (using an on-demand video and passing it off as 'live')
                // or if live zoom session has ended and an on-demand video is available as a fallback...
                cy.waitForIframeToLoad('iframe', consumption.vex.youtube.videoPlayer, 10000)
                cy.getIframeBody('iframe').within(()=>{
                    cy.get(consumption.vex.youtube.videoPlayer).should('exist')
                })
            }
        })

        // On the event page on consumption side, the session cards should contain the correct information about their live status 
        // Are these sessions currently live? or upcoming? 
        // Kinda hard to check that these are sorted into 'upcoming' or 'on-denand' section because there is no distinction between the sections
        // So check for presence of date on the card title - this indirectly checks which of these 2 sections the session is sorted into 
        cy.visit(event.url)
        sessions.forEach((session)=>{
            if(session.live.status == 'live'){
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('exist')
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('contain', 'EDT') // Ideally, check for the exact date, but date picker input keeps shifting day and hour
            } else if(session.live.status == 'upcoming'){
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('not.exist')
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('contain', 'EDT')
            } else if(session.live.status == 'ended' && session.live.video){
                // If session has ended, and there is an on-demand video configured as a fall back, then these cards should go in the 'on demand' section 
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('not.exist')
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('not.contain', 'EDT')
            } else if (session.live.status == 'ended' && !session.live.video){
                // If session has ended and there's no on-demand configured as a fall back, it still goes into the 'upcoming' section, illogical as this may be 
                cy.contains(consumption.vex.sessionCardTitle, session.name).within(()=>{
                    cy.containsExact('div', 'Live').should('not.exist')
                })
                cy.contains(consumption.vex.sessionCardTitle, session.name).should('contain', 'EDT')
            }  
        })

        // Make sure clicking one of the live zoom sessions takes you to the correct url 
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
         cy.contains('a', '[Close Content]').click()
         cy.get('iframe').should('have.length', 1)
         cy.get(consumption.vex.zoomIframe).should('exist')
    })
})