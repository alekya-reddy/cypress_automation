import { CommonCX } from "./CommonCX";

export class TargetCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.sidebar = "#sidebar-container"; 
        this.flowContent = "#qa-flow-content";
    }

    
}