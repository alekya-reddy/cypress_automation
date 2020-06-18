import { createConsumptionInstance } from '../../support/pageObject.js';

const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexConsumption.js',
    slug: 'vexconsumption-js',
    get url(){ return `${consumption.common.baseUrl}/${this.slug}`; }
}

const sessions = [
    {
        name: 'Youtube',
        supplementalContent: [
            'Image - Used by Cypress automation for VEX testing',
            'PDF - Used by Cypress automation for VEX testing',
            'Website - Used by Cypress automation for VEX testing'
        ],
        visibility: 'Public',
        slug: 'youtube',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Youtube description',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    {
        name: 'Vimeo',
        supplementalContent: [],
        visibility: 'Public',
        slug: 'vimeo',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Vimeo description',
        type: 'On Demand',
        video: 'Vimeo - Used in Cypress automation for VEX testing'
    },
    {
        name: 'Vidyard',
        supplementalContent: [],
        visibility: 'Public',
        slug: 'vidyard',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Vidyard description',
        type: 'On Demand',
        video: 'Vidyard - Used in Cypress automation for testing VEX'
    },
    {
        name: 'Wistia',
        supplementalContent: [],
        visibility: 'Public',
        slug: 'wistia',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Wistia description',
        type: 'On Demand',
        video: 'Wistia - Used in Cypress automation for VEX testing'
    },
    {
        name: 'Brightcove',
        supplementalContent: [],
        visibility: 'Public',
        slug: 'brightcove',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Brightcove description',
        type: 'On Demand',
        video: 'Brightcove - Used in Cypress automation to test VEX'
    },
    {
        name: 'Private',
        supplementalContent: [
            'Image - Used by Cypress automation for VEX testing',
            'PDF - Used by Cypress automation for VEX testing',
            'Website - Used by Cypress automation for VEX testing'
        ],
        visibility: 'Private',
        slug: 'private',
        get url(){ return `${event.url}/${this.slug}`; },
        description: 'Private description',
        type: 'On Demand',
        video: 'Slingshots of the Oceanic on Vimeo'
    }
]

// The below is configured for automation org
/*
const contentSource = {
    'Image - Used by Cypress automation for VEX testing' : Cypress.env('TEST_ENV') == 'pathfactory-staging' ? 'https://cdn.pathfactory-staging.com/assets/12/contents/12876/bae16c4c-c2b9-40c4-930a-8188a145fbbb.png' : 'https://cdn.pathfactory-qa.com/assets/20/contents/17245/a4db9dff-4c5d-4535-b623-eb6709aacb8d.png',
    'PDF - Used by Cypress automation for VEX testing' : Cypress.env('TEST_ENV') == 'pathfactory-staging' ? 'https://cdn.pathfactory-staging.com/assets/preprocessed/12/c4b50a8d-1963-4cea-993f-3d9fcc749c9d/c4b50a8d-1963-4cea-993f-3d9fcc749c9d.pdf' : 'https://cdn.pathfactory-qa.com/assets/preprocessed/20/52d3aabd-f911-448f-a4dc-be937e8ea399/52d3aabd-f911-448f-a4dc-be937e8ea399.pdf',
    'Website - Used by Cypress automation for VEX testing' : 'https://en.wikipedia.org/wiki/SpaceX'
}
*/

const contentSource = {
    'Image - Used by Cypress automation for VEX testing' : Cypress.env('TEST_ENV') == 'pathfactory-staging' ? 'https://cdn.pathfactory-staging.com/assets/74/contents/12954/d8058125-c1a5-41d3-9f66-cf8176fe2040.png' : 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
    'PDF - Used by Cypress automation for VEX testing' : Cypress.env('TEST_ENV') == 'pathfactory-staging' ? 'https://cdn.pathfactory-staging.com/assets/74/contents/12955/ae090cdf-c888-41f1-9c5c-5f20fee9acce.pdf' : 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
    'Website - Used by Cypress automation for VEX testing' : 'https://en.wikipedia.org/wiki/SpaceX'
}

describe('VEX - Consumption', function(){

    it('The event page should have the correct sessions displayed, and the links to sessions page, and the link back to event page, should work', function(){
        cy.visit(event.url)

        // Expect the number of sessions to be equal to the number of public sessions we have added to the event 
        let privateSessions = sessions.filter((session)=>{ return session.visibility == 'Private'; })
        cy.get('body').find(consumption.vex.eventSessionTitle).should('have.length', sessions.length - privateSessions.length) 

        sessions.forEach((session)=>{
            if(session.name == 'Private') { return } // Skip this case, will test in another it function
            cy.containsExact(consumption.vex.eventSessionTitle, session.name).should('exist').click()
            cy.url().should('eq', session.url)
            cy.contains('a', event.name).click()
        })
    })

    it('Videos from supported video hosting sites should display on VEX', function(){
        sessions.forEach((session)=>{
            if(session.name == 'Private'){
                return; // Skip the private case here, will test in next it function 
            } 

            cy.visit(session.url)
            cy.containsExact('div', session.name).should('exist')
            cy.containsExact('div', session.description).should('exist')
    
            switch(session.name){
                case 'Youtube':
                    cy.waitForIframeToLoad(consumption.vex.youtube.iframe, consumption.vex.youtube.videoPlayer, 3000)
                    cy.getIframeBody(consumption.vex.youtube.iframe).within(()=>{
                        cy.get(consumption.vex.youtube.videoPlayer).should('exist')
                    })
                    break;
                case 'Vimeo':
                    cy.waitForIframeToLoad(consumption.vex.vimeo.iframe, consumption.vex.vimeo.videoPlayer, 3000)
                    cy.getIframeBody(consumption.vex.vimeo.iframe).within(()=>{
                        cy.get(consumption.vex.vimeo.videoPlayer).should('exist')
                    })
                    break;
                case 'Vidyard':
                    cy.waitForIframeToLoad(consumption.vex.vidyard.iframe, consumption.vex.vidyard.videoPlayer, 3000)
                    cy.getIframeBody(consumption.vex.vidyard.iframe).within(()=>{
                        cy.get(consumption.vex.vidyard.videoPlayer).should('exist')
                    })
                    break;
                case 'Wistia':
                    cy.get(consumption.vex.wistia.videoPlayer).should('exist')
                    break;
                case 'Brightcove':
                    // Not currently supported 
                    break;
            }
        })
    })

    it('Sessions set to private should not be visible and should not be accessible', function(){
        sessions.forEach((session)=>{
            if(session.name == 'Private'){
                cy.request({url: session.url, failOnStatusCode: false}).then((response)=>{
                    expect(response.status).to.eq(404)
                })

                cy.visit(event.url)
                cy.containsExact(consumption.vex.eventSessionTitle, session.name).should('not.exist')
            }
        })
    })

    it('A session should have the correct name, description, supplemental content', function(){
        let session = sessions.find((session)=>{
            // This finds the session from within the array that is needed for this test - so that order of array doesn't matter
            return session.name == 'Youtube';
        })

        cy.visit(session.url)
        cy.containsExact('div', session.name).should('exist')
        cy.containsExact('div', session.description).should('exist')
        cy.get(`a:contains("${event.name}")`).eq(1).siblings('span').invoke('text').then((text)=>{
            // This is checking for the 'bread crumb' navigation at the top that shows you which session you have navigated to 
            expect(text).to.eq(session.name) 
        })
        cy.get('ul').within(()=>{
            // This checks that the number of supplemental content is exactly what was added to this session 
            cy.get(`a[href*="${event.slug}"]`).should('have.length', session.supplementalContent.length)
        })
        session.supplementalContent.forEach((content)=>{
            // This checks that the correct supplemental content are listed 
            cy.containsExact('a', content).should('exist')
        })
    })

    it('The three media types - Pdf, image, and webpage - should render correctly on VEX, and video should still play in corner', function(){
        const session = sessions.find((session)=>{
            return session.name == 'Youtube';
        })

        cy.visit(session.url)

        // On first page visit, only 1 iframe should be on screen  - the video's
        cy.get('iframe').should('have.length', 1)
        cy.get(consumption.vex.youtube.iframe).should('exist')

        // Verify can pause, play video, and check video current time 
        cy.waitForFrameElementCondition(consumption.vex.youtube.iframe, consumption.vex.youtube.videoPlayer, 3000, (elem)=> { return elem.paused == false; })
        consumption.vex.youtube.pause()
        cy.wait(3000)
        consumption.vex.youtube.play()
        cy.wait(3000)
        consumption.vex.youtube.pause()
        let state = {} // Technique to pull values out asynchronously - pass in objects - they get mutated within the cy commands
        consumption.vex.youtube.getCurrentTime(state)
        // calling state.result at this line would result in undefined because this line is run before any cy commands has been executed 
        cy.get('body').then(()=>{
            // Get the object property in a subsequent cy command - this guarantees property will be accessed after previous command has mutated object 
            expect(state.result).to.be.within(3,4)
            state.lastTime = state.result; // Save the current time for use later 
        })

        // Resume playing video - it wil play as cycle through content
        consumption.vex.youtube.play()

        // Cycle through the contents and verify source is correct 
        session.supplementalContent.forEach((content)=>{
            cy.contains('a', content).should('exist').click()
            cy.get('iframe').should('have.length', 2)
            cy.get(consumption.vex.youtube.iframe).should('exist')
            cy.get(`iframe[src="${contentSource[content]}"]`).should('exist')
        })

        // Verify video still playing 
        consumption.vex.youtube.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.false // Check it's not paused, therefore is playing 
        })

        // Close the supplemental content and verify that only the video is displayed
        cy.contains('a', '[Close Content]').should('exist').click()
        cy.get('iframe').should('have.length', 1)
        cy.get(consumption.vex.youtube.iframe).should('exist')

        // Redundant check to make sure video has been playing - this time by checking its time stamp 
        consumption.vex.youtube.getCurrentTime(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.greaterThan(state.lastTime)
        })
    })
})