import { CommonCX } from "./CommonCX";

export class ExploreCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.headerTitle = "#qa-header-title"
        this.hero = {
            heroTitle: ".lx-header-title__text",
            heroSubtitle: ".lx-header-subtitle__text",
            heroBackground: "#qa-explore-header-background",
            heroCTA: "#qa-cta-button-hero"
        }
        this.body = {
            bodyTitle: ".lx-content-title__text",
            bodyDescription: ".lx-content-description__text",
            card: ".pf-explore-grid-container",
            topicFilterContainer: "#explore-topic-filter-container",
            topicSearchContainer: "#explore-topic-search-container",
            searchButton: 'div[class*="pf-explore-search-button"]'
        }
        this.headerTitle = '#qa-header-title'
    } 
            
    featuredContentGrid(i,j) {
        return `#qa-explore-asset-type-featured-grid-${i}-${j}` 
    }
}