import { Common } from "./Common";

export class ClientHQ extends Common { 
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/settings/organization-management`;
        this.pageTitle = "Client HQs";
        this.domainPreview = '[data-qa-hook="preview-section-default-tld"]';
        this.domainInput = '#defaultTld';
        this.websiteToolsToggle = '[data-qa-hook="enableWebsiteJourney"]';
        this.newNavigationToggle = '[data-qa-hook="enableNewNavigation"]';
        this.virtualEventToggle = '[data-qa-hook="enableVirtualEvents"]';
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    visitOrgConfig(){
        cy.get(this.pageTitleLocator).invoke('text').then((title)=>{
            if(title !== `Configure ${this.org}`){
                this.visit()
                cy.containsExact('a', this.org).click()
            }
        })
    }

    clientHQToggle(toggle, on_off){
        this.visitOrgConfig()
        this.toggle(toggle, on_off)
        cy.contains('Save').click()
        cy.get('body').should('contain', 'Organization Updated Successfully!')
    }

    switchDomain(domain){
        this.visitOrgConfig()
        cy.get(this.domainPreview).within(()=>{
            cy.get(this.editPencil).click()
            cy.get(this.domainInput).click()
            cy.get(`div[aria-label="${domain}"]`).click()
            cy.contains('button', 'Ok').click()
        })
        cy.get(this.domainPreview).should('contain', domain)
        cy.contains('button', 'Save').click()
        cy.get('body').should('contain', 'Organization Updated Successfully!')
    }
}