import { Common } from "./Common";

export class Website extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/website`;
        this.websiteAnalyticsUrl = `${this.baseUrl}/authoring/content-library/website/analytics`;
        this.pageTitle = "Website Promoters";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

}