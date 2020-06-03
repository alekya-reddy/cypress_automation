import { Common } from "./Common";

export class WebdomainSettings extends Common { 
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.orgSettingsBaseUrl = `${this.baseUrl}/authoring/content-library/settings/organization`;
        this.webdomainUrl = `${this.orgSettingsBaseUrl}/website-domains`;
        this.webdomainTitle = 'Website Domains';
        this.webdomainTableCellLocator = '[data-qa-hook="website-domain-url"]';
        this.webdomainToggleLocator = '[data-qa-hook="enabled"]'; 
        this.cookieConsentToggleLocator = '[data-qa-hook="requireCookieConsent"]';
    }

    visit(){
        cy.visit(this.webdomainUrl);
    }

    configureWebdomain(config){
        // Required keys in the config object: domain, enableTracking, cookieConsentRequired
        const domain = config.domain;
        const enableTracking = config.enableTracking;
        const cookieConsentRequired = config.cookieConsentRequired;

        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== this.webdomainTitle){
                cy.visit(this.webdomainUrl)
            }
        })
        cy.get(this.webdomainTableCellLocator).contains(domain).parent().within((parent)=>{
            // It was extremely annoying figuring out how to click this edit pencil which requires a hover over another element to make it visible
            // Cypress doesn't have a hover function, and force clicking an invisible element is one workaround they offered 
            cy.get(this.editIcon).click({force: true})
        })
        this.toggle(this.webdomainToggleLocator, 'on')
        cookieConsentRequired ? this.toggle(this.cookieConsentToggleLocator, 'on') : this.toggle(this.cookieConsentToggleLocator, 'off')
        enableTracking == false ? this.toggle(this.webdomainToggleLocator, 'off') : null 
        cy.get('button').contains('Update').then((button)=>{
            let disabled = button.prop('disabled')  //Gotta use jquery for this 
            if (disabled) {
                cy.contains('Cancel').click()
            } else {
                cy.contains('Update').click() 
            }
        })
    }

}