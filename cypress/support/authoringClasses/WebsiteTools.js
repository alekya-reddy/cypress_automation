import { Common } from "./Common";

export class WebsiteTools extends Common {
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.websiteToolsUrl = `${this.baseUrl}/authoring/content-library/website-tools`;
        this.websiteToolsContentConfigurationsUrl = `${this.baseUrl}/authoring/content-library/content-configurations`;
        this.pageTitle = "Website Properties";
        this.contentConfigurationsTitle = "Content Configurations";
        this.pageSidebarLocator = "[data-qa-hook='page-sidebar']";
        this.webdomainLinkLocator = `${this.pageSidebarLocator} > a`;
        this.webdomainInactiveMessage = "[data-qa-hook='page-body'] > span > p";
        this.addProperty = "#domain-card-add";
        this.enterDomainName = "#domain-card-add-input";
        this.antModal = ".ant-modal-content";
        this.domainCard = "div[id^='domain-card-']";
        this.websitePath = "input[id='websitePath']";
        this.enterselectOption = function(option){ return `input[id="${option}"]` };
        this.promoterList = "div[name='promoterList']";
        this.selectOpen = "span[class='ant-select-selection-item']";
        this.selectOption = function(option){ return `div[class="ant-select-item-option-content"]:contains("${option}")` };
        this.websiteurlPath = function(option){ return `td[id="${option}"]` };
        this.formSratergy = "li[id='show-page-form-strategy']>a";
        this.addFormButton = ".ant-col-4>button";
        this.formPath = "input[id='website-form-path']";
        this.addForm = "input[id='website-form-id']";
        this.Pagecontrols = "div[data-qa-hook='title-bar']>h1"
        this.contentPickerSearchBar = 'input[name="content-picker-search-bar"]';
        this.contentPickerItem = 'div[data-qa-hook="content-picker-item"]';
        this.modal = 'div[data-qa-hook="modal"]';
        this.targetElementID = 'input[name="targetElementID"]';
}

addContentToFeatured(content){
    cy.get(this.contentPickerSearchBar).clear().type(content)
    cy.contains(this.contentPickerItem, content).click()
    cy.get(this.modal).contains("button", "Save").click()
}

addContent(contents){
    cy.contains("button", "Add Content").click()
    contents.forEach((content) => {
        cy.get(this.modal).within(()=>{
            cy.get(this.contentPickerSearchBar).clear().type(content)
            cy.contains(this.contentPickerItem, content).click()
        })
    })

    cy.get(this.modal).contains("button", "Save").click()
}



    visit(){
        cy.visit(this.websiteToolsUrl);
    }

    selectWebdomain(webdomain){
        cy.get(this.webdomainLinkLocator).contains(webdomain).click();
    }

}