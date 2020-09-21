import { CommonCX } from "./CommonCX";

export class VexCX extends CommonCX {
    constructor(env, org, customBaseUrl){
        super(env, org, customBaseUrl);
        this.eventHeroTitle = "div[class^='pf-event-hero-title']";
        this.eventHeroSubtitle = "div[class^='pf-event-hero-subtitle']";
        this.eventContentTitle = ".pf-event-main-title";
        this.eventContentDescription = ".pf-event-main-description";
        this.zoomRootDiv = '#zmmtg-root';
        this.zoomIframe = "iframe[src^='/api/virtual_event_sessions']";
        this.sessionPageTitle = "div[class^='pf-event-session-title']";
        this.sessionCardTitle = "div[class^='pf-event-session-card-title']";
        this.firstNameInput = "#firstName"; // Should remove in future as this is now in CommonCX.js 
        this.lastNameInput = "#lastName";  // Should remove in future as this is now in CommonCX.js 
        this.emailInput = "#email";  // Should remove in future as this is now in CommonCX.js 
        this.meetingPWInput = "#meetingPassword";
        this.closeContentButton = "button[title='Close']";
        this.sessionGroup = ".pf-event-sessions";
        this.sessionListItem = ".pf-event-session-list-item";
        this.youtube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            iframe: 'iframe[title="YouTube video player"]',
            videoPlayer: 'video',
            play: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'getCurrentTime()', undefined, state) },
            paused: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) }
        };
        this.vimeo = {
            // Playing around on the dev console on regular browser, I'm blocked from accessing iframe due to cross-frame issue. I'm amazed I can bypass that through Cypess
            iframe: 'iframe[src*="vimeo"]',
            videoPlayer: 'video',
            play: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) }
        };
        this.vidyard = {
            iframe: 'iframe[class*="vidyard-iframe"]',
            videoPlayer: 'video',
            splashScreen: '[class^="splash-screen-thumbnail"]',
            play: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function(state){ cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            clickSplashScreen: function(){ cy.invokeWithinFrame(this.iframe, this.splashScreen, 'click()') }
        };
        this.wistia = {
            // Wistia doesn't need an iframe, which is nice...
            videoPlayer: 'video',
            play: function(){ cy.invokeJS(this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeJS(this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeJS(this.videoPlayer, 'currentTime', state) },
            paused: function(state){ cy.invokeJS(this.videoPlayer, 'paused', state) }
        };
        this.brightcove = {
            videoPlayer: 'video',
            play: function(){ cy.invokeJS(this.videoPlayer, 'play()') },
            pause: function(){ cy.invokeJS(this.videoPlayer, 'pause()') },
            getCurrentTime: function(state){ cy.invokeJS(this.videoPlayer, 'currentTime', state) },
            paused: function(state){ cy.invokeJS(this.videoPlayer, 'paused', state) }
        };
        this.zoom = {
            iframe: "iframe",
            container: '#zmmtg-root'
        };
        this.webex = {
            iframe: "iframe[src^='/api/virtual_event_sessions/']",
            video: "video",
            meetingControls: ".meeting-controls",
            meetingInfo: ".meeting-info"
        }
        this.rocketChat = {
            iframe: "iframe[src*='rocket.pathfactory']",
            container: "#rocket-chat",
            messageInput: "textarea[name='msg']",
            moderatorViewButton: "button:contains('Open Moderator View')"
        };
        this.messages = {
            maxAttendeesReached: "Unfortunately you are unable to join this session as the maximum number of attendees has been reached."
        }
    }

    expectZoom(){
        cy.waitForIframeToLoad(this.zoom.iframe, this.zoom.container, 10000)
        cy.getIframeBody(this.zoom.iframe).within(()=>{
            cy.get(this.zoom.container).should('exist')
        })
    }

    expectYoutube(){
        cy.waitForIframeToLoad(this.youtube.iframe, this.youtube.videoPlayer, 5000)
        cy.getIframeBody(this.youtube.iframe).within(()=>{
            cy.get(this.youtube.videoPlayer).should('exist')
        })
    }

    expectVimeo(){
        cy.waitForIframeToLoad(this.vimeo.iframe, this.vimeo.videoPlayer, 10000)
        cy.getIframeBody(this.vimeo.iframe).within(()=>{
            cy.get(this.vimeo.videoPlayer).should('exist')
        })
    }

    expectVidyard(){
        cy.waitForIframeToLoad(this.vidyard.iframe, this.vidyard.videoPlayer, 3000)
        cy.getIframeBody(this.vidyard.iframe).within(()=>{
            cy.get(this.vidyard.videoPlayer).should('exist')
        })
    }

    expectRocketChat(){
        cy.waitForIframeToLoad(this.rocketChat.iframe, this.rocketChat.container, 10000)
        cy.getIframeBody(this.rocketChat.iframe).within(()=>{
            cy.get(this.rocketChat.container).should('exist')
        })
    }

    expectWebex(link){
        cy.waitForIframeToLoad(this.webex.iframe, this.webex.meetingControls, 10000)
        cy.getIframeBody(this.webex.iframe).within(()=>{
            cy.get(this.webex.video, {timeout: 10000}).should('exist')
            cy.get(this.webex.meetingControls, {timeout: 10000}).should('exist')
            link ? cy.contains(this.webex.meetingInfo, link, {timeout: 10000}).should('exist') : null
        })
    }

    chat(config){
        const message = config.message
        const user = config.user 

        cy.getIframeBody(this.rocketChat.iframe).within(()=>{
            cy.get(this.rocketChat.container).should('exist')
            cy.get(this.rocketChat.messageInput).type(`${message}\n`)
            cy.contains(message).should('exist')
            cy.contains(user).should("exist")
        })
    }
}