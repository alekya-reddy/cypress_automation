import { Common } from "./Common";

export class Settings extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.settingsRoute = `${this.baseUrl}/authoring/content-library/settings/organization`;
        this.redirectCells ='tr[class*="ant-table-row ant-table-row-level"]';
        this.incomingPath = 'input[name="fromPathRule"]';
        this.redirectPath = 'input[name="toPathRule"]';
        
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
            nameInput: "#name",
            apiCellName: `td[data-qa-hook="api-key-name"]`
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
            pageUrl:  `${this.settingsRoute}/sharing-links`,
            pageTitle: "Custom Query Strings",
            nameInput: "#name",
            valueInput: "#queryStrings"
        };
        this.accessProtection = {
            pageUrl:  `${this.settingsRoute}/access-protection-settings`,
            pageTitle: "Access Protection",
        };
        this.searchEngineDirective = {
            pageUrl:  `${this.settingsRoute}/search-engine-directive`,
            pageTitle: "Search Engine Directive",
        };
        this.redirectRules = {
            pageUrl:  `${this.settingsRoute}/redirect-rules`,
            pageTitle: "Redirect Rules",
        }
    }

    visitCookieConsent(){
        cy.visit(this.cookieConsent.pageUrl);
    }

    visitoceAccount(){
        cy.visit(this.oceAccount.pageUrl);
    }

    visitredirectRule(){
        cy.visit(this.redirectRules.pageUrl);
    }

    configureCookieConsent(config){
        let option = config.option 

        this.goToPage(this.cookieConsent.pageTitle, this.cookieConsent.pageUrl)
        cy.get(this.cookieConsent.cookieConsentSelect).click()
        cy.get(this.dropdown.option(option)).click()
        cy.contains("button", "Save").click()
        cy.contains(this.messages.recordSaved,{timeout:20000}).should('exist')
    }

    addAPIConfigurations(name) {
        cy.contains("button", "Generate Key").click()
        cy.get(this.modal).within(() => {
            cy.get(this.apiConfigurations.nameInput).clear().type(name)
            cy.contains("button", "Generate API Key").click()
        })
        cy.contains(this.apiConfigurations.apiCellName, name).should("exist")
    }

    deleteAPIConfigurations(name) {
        cy.ifElementWithExactTextExists(this.apiConfigurations.apiCellName, name, 4000, () => {
            cy.contains(this.apiConfigurations.apiCellName, name).parent().within(()=>{
                cy.get(this.anotherDeleteIcon).click()
            })
            cy.get(this.popover).within(()=>{
                cy.contains("button", "Delete").click()
            })
        })
        cy.contains(this.apiConfigurations.apiCellName, name).should("not.exist")
    }


    addQueryString(options) {
        const {name, value} = options
        cy.contains("button", "Query String").click()
        cy.get(this.customQueryStrings.nameInput).clear().type(name)
        cy.get(this.customQueryStrings.valueInput).clear().type(value)
        cy.contains("button", "Save").click()

        cy.contains("div", name).should("exist")
    }

    deleteQueryString(name) {
        cy.ifElementWithExactTextExists("div", name, 4000, () => {
            cy.contains("div", name).parent().within(() => {
                cy.get(this.deleteIcon).click()
            })
            cy.get(this.popover).within(()=>{
                cy.contains("button", "Delete").click()
            })
        })
        cy.contains("div", name).should("not.exist")
    }

}

