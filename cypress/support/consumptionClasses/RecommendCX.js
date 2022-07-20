import { CommonCX } from "./CommonCX";

export class RecommendCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.sidebar = "#sidebar-outer";
        this.sidebarTitle = "#sidebar-title";
        this.sidebarBackground = "#sidebar-outer";
        this.topicSidebarDropdown = "#qa-topic-sidebar-dropdown";
        this.topicSidebarHeaderTitle = "#qa-topic-sidebar-header-title";
        this.contentTitle = 'div[class="textLayer"]>span';
        this.ctaButtonClass = 'button[class*="pf-multi-cta pf-cta"]';
        this.ctaLinkClass = 'a[class*="pf-multi-cta pf-cta"]';

        this.youtube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            iframe: 'iframe[title="YouTube video player"]',
            videoPlayer: 'video',
            play: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            audioMuteNotification:"div[id='video-tooltip']",
            playButton:"button[aria-label='Play (k)']",
            unmuteButton:"button[aria-label='Unmute (m)']",
            muteButton:"button[aria-label='Mute (m)']",
            pauseButton:"button[aria-label='Pause (k)']",
            settings:'[aria-label="Settings"]',
            menuContent:"div.ytp-menuitem-content"
        };

        this.vimeo = {
            // Playing around on the dev console on regular browser, I'm blocked from accessing iframe due to cross-frame issue. I'm amazed I can bypass that through Cypess
            iframe: 'iframe[src*="vimeo"]',
            videoPlayer: 'video',
            play: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            playButton: "[aria-label='Play']",
            volumeButtons: "[class='volume'] div",
            closeAudioNotification: "#video-tooltip-close-icon",
            audioMuteNotification: "div[id='video-tooltip']",
            captions:"[aria-label='Choose captions']",
            message:"[id='video-captions']"
        };
    } 
}