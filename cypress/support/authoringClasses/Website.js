import { Common } from "./Common";

export class Website extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/website`;
        this.websiteAnalyticsUrl = `${this.baseUrl}/authoring/content-library/website/analytics`;
        this.pageTitle = "Website Promoters";
        this.websiteCampaignsPageTitle = "Website Campaigns";
        this.addWebsiteURLButton = "#AddWebsiteURLLink";
        this.newURLInput = "#urlPatterns";
        this.websiteURLName = `div[data-qa-hook="table-cell-url-patterns"] > span`;
        this.enabledToggle = `div[data-qa-hook="enabled"]`;
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
        cy.containsExact(this.websiteURLName, url).should("exist")
    }

    deleteWebsite(url, verify){
        this.visit()
        cy.ifElementWithExactTextExists(this.websiteURLName, url, 10000, () => {          
            cy.containsExact(this.websiteURLName, url).click({force: true})
            cy.get(this.deleteIcon, {timeout: 20000}).click()
            cy.contains(this.modal, "Are you sure you want to delete this?").contains("button", "Delete Website Track").click()
        })

        if(verify !== false){
            cy.contains(this.pageTitleLocator, this.websiteCampaignsPageTitle, {timeout: 20000}).should("exist")
            cy.containsExact(this.websiteURLName, url).should("not.exist")
        }
    }

    configureWebsite(options) {
        const {url, enabled} = options
        cy.containsExact(this.websiteURLName, url).click({force: true})
        if(enabled) {
            this.toggle(this.enabledToggle, enabled)
        }
    }

    setAppearance(appearance){
        cy.get(this.pagePreview.appearanceLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(appearance)).click({force:true})
            cy.contains("button", "Update").click()
        })
    }

    setLanguage(language){
        cy.get(this.pagePreview.languageLabel).siblings("span").click({force:true})
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(language)).click()
            cy.contains("button", "Update").click()
        })
    }
}