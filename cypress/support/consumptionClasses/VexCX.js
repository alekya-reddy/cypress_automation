import { CommonCX } from "./CommonCX";

export class VexCX extends CommonCX {
    constructor(env, org, customBaseUrl){
        super(env, org, customBaseUrl);
        this.youtubeIframe = 'iframe[title="YouTube video player"]';
        this.vimeoIframe = 'iframe[src*="vimeo"]';
        this.vidyardIframe = 'iframe[class*="vidyard-iframe"]';
        this.videoPlayer = 'video'; // The element to check for to verify video player has loaded into iframe
        this.wistiaPlayer = 'div[class="w-ui-container"]';
        this.eventSessionTitle = 'div[class*="pf-event-session-item-title"]';
        this.youTube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            _iframeLocator: 'iframe[title="YouTube video player"]',
            _videoPlayerLocator: 'video',
            play: function(){ cy.invokeWithinFrame(this._iframeLocator, this._videoPlayerLocator, 'play()') },
            pause: function(){ cy.invokeWithinFrame(this._iframeLocator, this._videoPlayerLocator, 'pause()') },
            getCurrentTime: function(){ cy.invokeWithinFrame(this._iframeLocator, this._videoPlayerLocator, 'getCurrentTime()') },
            paused: function(){ cy.invokeWithinFrame(this._iframeLocator, this._videoPlayerLocator, 'paused') }
        }
    }
}