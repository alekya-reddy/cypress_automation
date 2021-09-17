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
        this.contentTitle = 'div[class="textLayer"]>span';
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
            playAndpauseButton: "span[class='material-icons']"
        }
          
        this.iframeForEmbeddedForm = {
            iframe: "iframe[title='Content Window']",
            email: "input[name='emailAddress']",
            submitButton: "input[class='submit-button-style ']",
            submittedMsg: "div[class='title']"
        }
    } 
}
