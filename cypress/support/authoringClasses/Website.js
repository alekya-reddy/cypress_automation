import { Common } from "./Common";

export class Website extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/website`;
        this.websiteAnalyticsUrl = `${this.baseUrl}/authoring/content-library/website/analytics`;
        this.pageTitle = "Website Promoters";
        this.websiteCampaignsPageTitle = "Website Campaigns";
        this.addWebsiteURLButton = "#AddWebsiteURLLink";
        this.deleteWebsiteCampaigns = 'i[class*="Icon__fa-trash"]';
        this.newURLInput = "#urlPatterns";
        this.websiteURLName = `div[data-qa-hook="table-cell-url-patterns"] > span`;
        this.enabledToggle = `div[data-qa-hook="enabled"]`;
        this.websiteAnalytics = 'div[data-qa-hook="title-bar"]>div>div>div>div>a:nth-child(2)>div';
        this.visitorTracking = 'div[data-qa-hook="disableWebsiteCampaignsTracking"]';
        this.gdprCookie = 'div[data-qa-hook="gdprCookieConsentEnabled"]';
        this.inpageEnabled = 'div[data-qa-hook="inPageEnabled"]';
        this.bottombar = 'div[data-qa-hook="bottomBar"]';
        this.cardToggle = 'div[data-qa-hook="card"]';
        this.existToggle = 'div[data-qa-hook="exit"]';
        this.inactivity = 'div[data-qa-hook="inactivity"]';
        this.deleteButton = 'i[title="delete"]';
        this.pagePreview = {
        appearanceLabel: "label:contains('Appearance')",
        languageLabel: "label:contains('Language')",
    }
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addWebsite(url) {
        cy.ifNoElementWithExactTextExists(this.websiteURLName, url, 2000, ()=>{
            cy.get(this.addWebsiteURLButton).click()
            cy.get(this.newURLInput).clear().type(url)
            cy.contains("button", "Save Website URL").click()
        })
        cy.waitFor({element: this.modal, to: "not.exist"})
        cy.wait(2000)
        cy.containsExact(this.websiteURLName, url).should("exist")
    }

    deleteWebsite(url, verify){
        this.visit()
        cy.ifElementWithExactTextExists(this.websiteURLName, url, 10000, () => {          
            cy.containsExact(this.websiteURLName, url).within(() => {

            cy.get(this.deleteWebsiteCampaigns, {timeout: 20000}).trigger('mouseover').should('have.text', "Delete Website Campaigns").click()
            })
            cy.contains("button", "Yes").click()
        })

        if(verify !== false){
            cy.contains(this.pageTitleLocator, this.websiteCampaignsPageTitle, {timeout: 20000}).should("exist")
            cy.containsExact(this.websiteURLName, url).should("not.exist")
        }
    }

    configureWebsite(options) {
        const {url, enabled,appearance,language} = options
        cy.containsExact(this.websiteURLName, url).click({force: true})
        if(enabled) {
            this.toggle(this.enabledToggle, enabled)
        }
        cy.wait(2000)
        if(appearance){
            this.setAppearance(appearance)
        }
        cy.wait(2000)
        if(language){
            this.setLanguage(language)
        }
    }

    setAppearance(appearance){
        cy.get(this.pagePreview.appearanceLabel).siblings("span").click({force:true})
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(appearance)).click()
            cy.contains("button", "Update").click()
        })
    }

    setLanguage(language){
        cy.get(this.pagePreview.languageLabel).siblings("span").click({force:true})

        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.input).click({force:true})
            cy.get(this.dropdown.option(language)).click()
            cy.contains("button", "Update").click()
        })
    }

}
