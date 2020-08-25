import { CommonCX } from "./CommonCX";

export class VexCX extends CommonCX {
    constructor(env, org, customBaseUrl){
        super(env, org, customBaseUrl);
        this.eventHeroTitle = "div[class^='pf-event-hero-title']";
        this.eventHeroSubtitle = "div[class^='pf-event-hero-subtitle']";
        this.zoomRootDiv = '#zmmtg-root';
        this.zoomIframe = "iframe[src^='/api/virtual_event_sessions']";
        this.sessionPageTitle = "div[class^='pf-event-session-title']";
        this.sessionCardTitle = "div[class^='pf-event-session-card-title']";
        this.firstNameInput = "#firstName";
        this.lastNameInput = "#lastName";
        this.emailInput = "#email";
        this.meetingPWInput = "#meetingPassword";
        this.closeContentButton = "button[title='Close']";
        this.sessionGroup = ".pf-event-sessions";
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
    }
}