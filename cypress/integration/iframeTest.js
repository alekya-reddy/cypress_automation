import { createConsumptionInstance } from '../support/pageObject.js';
import { constants } from '../support/constants.js';

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
    /*it('Testing wikipedia iframed in glitch', function(){
            cy.visit('https://pathfactory-new-website.glitch.me/has-title-and-thumbnail')
            cy.getIframeBody("#frame-id").contains('h1', 'Chestnuts Long Barrow').should('exist')
            cy.getIframeBody("#frame-id").contains('a', 'About Wikipedia').click()
            cy.wait(3000)
            cy.getIframeBody("#frame-id").contains('h1', 'Wikipedia:About').should('exist')
    })*/

    /*it("Test VEX that has youtube in iframe", function(){
        cy.visit('https://automation.staging2.lookbookhq.com/vexconsumption-js/youtube')
        cy.waitForIframeToLoad("#widget2", "#player", 30000)
        cy.getIframeBody("#widget2").within(()=>{
            cy.get('#player').should('exist') //.contains('a', 'Falcon Heavy & Starman', {timeout: 5000}).should('exist')
        }) 
        
        //cy.shouldExistInIframe("#widget2", "#player").within(()=>{ cy.get('[class="html5-video-container"]').should('exist') }) 
    })*/

    it('vimeo', function(){
        let state = {}
        let session = sessions[1]
        cy.visit(session.url)
        cy.waitForFrameElementCondition(consumption.vex.vimeo.iframe, consumption.vex.vimeo.videoPlayer, 7000, (elem)=> { return elem.paused == false; })
        consumption.vex.vimeo.pause()
        cy.wait(1000)
        consumption.vex.vimeo.play()
        consumption.vex.vimeo.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.false 
        })
        cy.wait(3000)
        consumption.vex.vimeo.pause()
        consumption.vex.vimeo.getCurrentTime(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.within(3,4)
        })
        consumption.vex.vimeo.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.true
        })
    })

    it('vidyard', function(){
        let state = {}
        let session = sessions[2]
        cy.visit(session.url)
        cy.waitForFrameElementCondition(consumption.vex.vidyard.iframe, consumption.vex.vidyard.videoPlayer, 5000, (elem)=> { return elem.paused == false; })
        consumption.vex.vidyard.pause()
        cy.wait(3000)
        consumption.vex.vidyard.clickSplashScreen()
        consumption.vex.vidyard.play()
        consumption.vex.vidyard.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.false 
        })
        cy.wait(6000)
        consumption.vex.vidyard.pause()
        consumption.vex.vidyard.getCurrentTime(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.within(5,7)
        })
        consumption.vex.vidyard.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.true
        })
    })

    it('wistia', function(){
        let state = {}
        let session = sessions[3]
        cy.visit(session.url)
        cy.get(consumption.vex.wistia.videoPlayer).should('exist')
        consumption.vex.wistia.pause()
        cy.wait(1000)
        consumption.vex.wistia.play()
        consumption.vex.wistia.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.false 
        })
        cy.wait(10000)
        consumption.vex.wistia.pause()
        consumption.vex.wistia.getCurrentTime(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.within(10,11)
        })
        consumption.vex.wistia.paused(state)
        cy.get('body').then(()=>{
            expect(state.result).to.be.true
        })
    })
})