import { createConsumptionInstance } from '../support/pageObject.js';
import { constants } from '../support/constants.js';
import { createAuthoringInstance } from '../support/pageObject.js';

//const authoring = createAuthoringInstance({customBaseUrl: `https://automation.${constants.lookbookhqDomain}`}); 
const consumption = createConsumptionInstance({customBaseUrl: `https://automation.${constants.lookbookhqDomain}`});
//const authoring = createAuthoringInstance();
//const consumption = createConsumptionInstance()
const authoring = createAuthoringInstance({org: 'default', tld: 'lookbookhq', username: 'liming', password: 'Password1234'})

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

    /*it('vimeo', function(){
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
    })*/

    /*it('', function(){
        authoring.common.login()
    })*/

    /*it('', function(){
        let session = sessions[0]
        //cy.visit(session.url)
        //cy.visit('https://default.staging2.lookbookhq.com/customtrackurl2/st-patrick-cat')
        //cy.visit('https://default.pathfactory-staging.com/customtrackurl2/st-patrick-cat')
        //cy.visit('https://newqa.pathfactory-qa.com/customurl/crew-dragon-launch-d')
        //cy.visit('https://newqa.qa.lookbookhq.com/customurl/crew-dragon-launch-d')
        //cy.visit('https://internal.lookbookhq.com/1/tribute-to-hayao-miyazaki-from-dono-on-v')
        //cy.visit('https://internal.pathfactory.com/1/tribute-to-hayao-miyazaki-from-dono-on-v')
        //cy.visit(session.url)
        //cy.wait(5000)
        /*cy.getCookies().then((cookies)=>{
            cookies.forEach((cookie)=>{
                cy.log(cookie.name)
                cy.clearCookie(cookie.name)
            })
        })
        cy.visit(session.url)
        cy.document().then((doc)=>{
            let topIframe = window.top.document.querySelector('iframe')
            cy.log(topIframe)
        })
        cy.reload()*/
        /*cy.request('https://automation.pathfactory-staging.com/vexconsumption-js').then((response)=>{
            //expect(JSON.stringify(response.body)).to.include(`${event.slug}/${sessions[0].slug}`)
            //expect(JSON.stringify(response.body)).to.not.include(`${event.slug}/${sessions[1].slug}`)
            expect(response.body).to.have.string('vexconsumption-js/youtube')
        })
        //cy.visit('https://automation.pathfactory-staging.com/vexappearance-js/youtube')
        //cy.visit('https://automation.staging2.lookbookhq.com')
        //authoring.common.login()
    })

    it('', function(){
        //cy.visit('https://automation.staging2.lookbookhq.com/vexappearance-js/youtube')
        //cy.visit('https://pf-xframe-options.glitch.me')
        //cy.visit('https://www.google.com')
        //cy.wait(10000)
        cy.request('https://automation.pathfactory-staging.com/vexappearance-js/youtube').then((response)=>{
            cy.log(response.headers)
            cy.log(response.body)
        })
        cy.visit('https://automation.pathfactory-staging.com/vexappearance-js/youtube')
    })*/

    it('', function(){
        let title = "Name.com/hello?foo=bar&heads=up"
        authoring.common.login()
        //authoring.contentLibrary.searchContentByTitle(title)
        
        authoring.contentLibrary.deleteContent("Delete Test")
        authoring.contentLibrary.addContentByUrl({internalTitle: "Delete Test", url: "https://www.youtube.com/watch?v=zqE-ultsWt0"})
    })

})