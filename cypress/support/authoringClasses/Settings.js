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
        };
        this.oceAccount = {
            pageUrl: `${this.settingsRoute}/oce-account`,
            pageTitle: "OCE Account",
            oce_oauthClientId: '#oauthClientId',
            oce_oauthClientSecret: '#oauthClientSecret',
            oce_instanceUrl: '#instanceUrl',
            oce_idcsUrl: '#idcsUrl',
            oce_serviceInstanceBaseUrl: '#serviceInstanceBaseUrl'
        };
        this.clientHQ = {
            pageUrl: `${this.baseUrl}/authoring/content-library/settings/organization-management`,
            pageTitle: "Client HQs"
        };
        this.settings = {
            pageUrl: `${this.settingsRoute}/settings`,
            pageTitle: "Settings",
        };
        this.analytics = {
            pageUrl: `${this.settingsRoute}/analytics`,
            pageTitle: "Analytics",
        };
        this.eloquaAccount = {
            pageUrl: `${this.settingsRoute}/eloqua-account`,
            pageTitle: "Eloqua Account",
        };
        this.apiConfigurations = {
            pageUrl: `${this.settingsRoute}/api-configurations`,
            pageTitle: "API Configurations",
        };
        this.salesforce = {
            pageUrl:  `${this.settingsRoute}/crm-integrations`,
            pageTitle: "Salesforce",
        };
        this.sso = {
            pageUrl:  `${this.settingsRoute}/single-sign-on`,
            pageTitle: "Single Sign On",
        };
        this.salesToolsConfiguration = {
            pageUrl:  `${this.settingsRoute}/sales-configuration`,
            pageTitle: "Sales Tools Configuration",
        };
        this.sixsense = {
            pageUrl:  `${this.settingsRoute}/six-sense`,
            pageTitle: "6sense",
        };
        this.customQueryStrings = {
            pageUrl:  `${this.settingsRoute}/custom-query-strings`,
            pageTitle: "Custom Query Strings",
        };
        this.accessProtection = {
            pageUrl:  `${this.settingsRoute}/access-protection-settings`,
            pageTitle: "Access Protection",
        };
        this.searchEngineDirective = {
            pageUrl:  `${this.settingsRoute}/search-engine-directive`,
            pageTitle: "Search Engine Directive",
        };
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

    visitoceAccount(){
        cy.visit(this.oceAccount.pageUrl);
    }
}

