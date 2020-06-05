import { createConsumptionInstance } from '../../support/pageObject.js';
import { constants } from '../../support/constants.js';

const consumption = createConsumptionInstance({
    env: Cypress.env('TEST_ENV'), 
    org: 'automation', 
    // No idea why, but need to use lookbook domain on consumption or Vex will be blank and promoters will not show up
    get customBaseUrl(){ return `https://${this.org}.${constants.lookbookhqDomain}`; } 
});

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
        supplementalContent: [
            'PDF - Used by Cypress automation for VEX testing',
            'Website - Used by Cypress automation for VEX testing'
        ],
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
        supplementalContent: ['Image - Used by Cypress automation for VEX testing'],
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

describe('VEX - Consumption', function(){
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
                    cy.waitForIframeToLoad(consumption.vex.youtubeIframe, consumption.vex.videoPlayer, 3000)
                    cy.getIframeBody(consumption.vex.youtubeIframe).within(()=>{
                        cy.get(consumption.vex.videoPlayer).should('exist')
                    })
                    break;
                case 'Vimeo':
                    cy.waitForIframeToLoad(consumption.vex.vimeoIframe, consumption.vex.videoPlayer, 3000)
                    cy.getIframeBody(consumption.vex.vimeoIframe).within(()=>{
                        cy.get(consumption.vex.videoPlayer).should('exist')
                    })
                    break;
                case 'Vidyard':
                    cy.waitForIframeToLoad(consumption.vex.vidyardIframe, consumption.vex.videoPlayer, 3000)
                    cy.getIframeBody('iframe').within(()=>{
                        cy.get(consumption.vex.videoPlayer).should('exist')
                    })
                    break;
                case 'Wistia':
                    cy.get(consumption.vex.wistiaPlayer).should('exist')
                    break;
                case 'Brightcove':
                    // Not currently supported 
                    break;
            }
        })
    })

    /*it('Sessions set to private should not be visible and should not be accessible', function(){

    })

    it('A session should have the correct settings based on how it was configured', function(){

    })

    it('The three media types - Pdf, image, and webpage - should render correctly on VEX, and video should still play in the corner', function(){

    })

    it('The event page should have the correct title, description and sessions. The breadcrumb navigation at the top should work', function(){

    })*/
})