import { CommonCX } from "./CommonCX";

export class RecommendCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.sidebar = "#sidebar-outer";
        this.topicSidebarDropdown = "#qa-topic-sidebar-dropdown";
    } 
}