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
    } 
}