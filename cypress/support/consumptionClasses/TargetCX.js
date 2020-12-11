import { CommonCX } from "./CommonCX";

export class TargetCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.flowHeader = "#qa-header-common";
        this.flowSidebar = "#sidebar-container"; 
        this.flowContent = "#qa-flow-content";
        this.signpostContainer = "#signposts-container";
        this.endPromoterTitle = "#qa-modal-header-title";
        this.bottombarTitle = "#qa-bottom-bar-title";
    }

    
}