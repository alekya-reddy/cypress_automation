import { Common } from "./Common";

export class Settings extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.settingsRoute = `${this.baseUrl}/authoring/content-library/settings/organization`;
        this.cookieConsent = {
            pageUrl: `${this.settingsRoute}/cookie-consent`,
            pageTitle: "Cookie Consent",
            cookieConsentSelect: "#cookie-consent-select",
            options: {
                disable: "Disable Cookie Consent",
                enableForAll: "Enable Cookie Consent for all web visitors",
                enableForIP: "Enable Cookie Consent for web visitors with an originating IP from selected countries",
                custom: "Enable Custom Cookie Consent"
            }
        }
    }

    visitCookieConsent(){
        cy.visit(this.cookieConsent.pageUrl);
    }

    configureCookieConsent(config){
        let option = config.option 

        this.goToPage(this.cookieConsent.pageTitle, this.cookieConsent.pageUrl)
        cy.get(this.cookieConsent.cookieConsentSelect).click()
        cy.get(this.dropdown.option(option)).click()
        cy.contains("button", "Save").click()
        cy.contains(this.messages.recordSaved).should('exist')
    }

}

