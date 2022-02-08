import { Common } from "./Common";

export class ContentIntelligence extends Common {
    constructor(env, org, tld, userName, password, baseUrl) {
        super(env, org, tld, userName, password, baseUrl);
        this.contentConfigurations = `${this.baseUrl}/authoring/content-library/content-configurations`;
        this.contentStrategy = `${this.baseUrl}/authoring/content-intelligence`;
        this.contentIntelligenceTab="#content-intelligence",
        this.topKeywordsTab = 'div[id="tab-panel"]',
        this.modalContainer = 'div[class*="modal-container"]',
        this.pageSearch = 'input[name="search"]'

    }

    visit(){
        cy.visit(this.contentStrategy);
    }

}