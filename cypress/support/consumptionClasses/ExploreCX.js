import { CommonCX } from "./CommonCX";

export class ExploreCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.hero = {
            heroTitle: ".lx-header-title__text",
            heroSubtitle: ".lx-header-subtitle__text"
        }
        this.body = {
            bodyTitle: ".lx-content-title__text",
            bodyDescription: ".lx-content-description__text",
            card: ".pf-explore-grid-container",
            topicFilterContainer: "#explore-topic-filter-container",
            topicSearchContainer: "#explore-topic-search-container",
        }
    } 
}