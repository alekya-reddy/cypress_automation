import { Common } from "./Common";

export class WebsiteTools extends Common {
    constructor(env, org, userName, password){
        super(env, org, userName, password);
        this.websiteToolsUrl = `${this.baseUrl}/authoring/content-library/website-tools`;
        this.pageSidebarLocator = "[data-qa-hook='page-sidebar']";
        this.webdomainLinkLocator = `${this.pageSidebarLocator} > a`;
        this.webdomainInactiveMessage = "[data-qa-hook='page-body'] > span > p";
    }

    visit(){
        cy.visit(this.websiteToolsUrl);
    }

    selectWebdomain(webdomain){
        cy.get(this.webdomainLinkLocator).contains(webdomain).click();
    }

}