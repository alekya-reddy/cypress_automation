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

        this.iframeForEmbeddedForm = {
            iframe: "iframe[title='Content Window']",
            email: "input[name='emailAddress']",
            submitButton: "input[class='submit-button-style ']",
            submittedMsg: "div[class='title']"
        }
    } 
}
