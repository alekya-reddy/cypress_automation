import { CommonCX } from "./CommonCX";

export class TargetCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.flowHeader = "#qa-header-common";
        this.flowHeaderShare = "#qa-share-common"
        this.flowSidebar = "#sidebar-container"; 
        this.flowContent = "#qa-flow-content";
        this.flowActiveItem = "#flow-active-item";
        this.signpostContainer = "#signposts-container";
        this.endPromoterTitle = "#qa-modal-header-title";
        this.bottombarTitle = "#qa-bottom-bar-title";
        this.contentFrame = 'iframe[title="Content Window"]';
        this.limeLightVideo = {
            splashScreen: "div[id='lookbook-video-player']>div>div>div>video",
            videoControlButton: "div[class='vjs-control-bar']>button:nth-child(1)",
            videoTime: "div[class='vjs-time-tooltip']",
            videoPauseButton: "button[title='Pause']",
            videoPlayButton: "button[title='Play']"  
        }
    
        this.parmonicVideo = {
            videoControlButton: "div[class='shaka-big-play']>svg",
            videoTime: "div[class='pw-player-button pw-duration']",
            playAndpauseButton: "div:nth-of-type(1) > .bottom-icon"
        }
          
        this.iframeForEmbeddedForm = {
            iframe: "iframe[title='Content Window']",
            email: "input[name='emailAddress']",
            submitButton: "input[class='submit-button-style ']",
            submittedMsg: "div[class='title']"
        }

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
    } 
}
