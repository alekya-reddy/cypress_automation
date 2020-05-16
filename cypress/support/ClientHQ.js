import { Common } from "./Common";

export class ClientHQ extends Common { 
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.clientHQUrl = `${this.baseUrl}/authoring/content-library/settings/organization-management`;
        this.websiteToolsToggle = '[data-qa-hook="enableWebsiteJourney"]';
    }

    visit(){
        cy.visit(this.clientHQUrl);
    }

    clientHQToggle(toggle, on_off){
        cy.visit(this.clientHQUrl)
        cy.contains('a', /^automation$/).click()
        this.toggle(toggle, on_off)
        cy.contains('Save').click()
    }

}