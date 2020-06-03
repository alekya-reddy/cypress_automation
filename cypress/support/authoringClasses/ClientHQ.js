import { Common } from "./Common";

export class ClientHQ extends Common { 
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/settings/organization-management`;
        this.pageTitle = "Client HQs";
        this.websiteToolsToggle = '[data-qa-hook="enableWebsiteJourney"]';
        this.newNavigationToggle = '[data-qa-hook="enableNewNavigation"]';
        this.virtualEventToggle = '[data-qa-hook="enableVirtualEvents"]';
    }

    visit(){
        cy.visit(this.clientHQUrl);
    }

    clientHQToggle(toggle, on_off){
        cy.visit(this.pageUrl)
        cy.contains('a', /^automation$/).click()
        this.toggle(toggle, on_off)
        cy.contains('Save').click()
    }

}