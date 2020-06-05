import { CommonCX } from "./CommonCX";

export class VexCX extends CommonCX {
    constructor(env, org, customBaseUrl){
        super(env, org, customBaseUrl);
        this.youtubeIframe = 'iframe[title="YouTube video player"]';
        this.vimeoIframe = 'iframe[src*="vimeo"]';
        this.vidyardIframe = 'iframe[class*="vidyard-iframe"]';
        this.videoPlayer = 'video'; // The element to check for to verify video player has loaded into iframe
        this.wistiaPlayer = 'div[class="w-ui-container"]';
    }
}