import { Common } from "./Common";

export class ContentIntelligence extends Common {
    constructor(env, org, tld, userName, password, baseUrl) {
        super(env, org, tld, userName, password, baseUrl);
        this.contentConfigurations = `${this.baseUrl}/authoring/content-library/content-configurations`;
        this.contentStrategy = `${this.baseUrl}/authoring/content-intelligence`;
        this.contentIntelligenceTab="#app-header #content-intelligence"

    }

}