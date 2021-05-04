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
        this.selectOption = function(option){ return `div[class="ant-select-item-option-content"]:contains("${option}")` };
        this.websiteurlPath = function(option){ return `td[id="${option}"]` };
    }

    visit(){
        cy.visit(this.websiteToolsUrl);
    }

    selectWebdomain(webdomain){
        cy.get(this.webdomainLinkLocator).contains(webdomain).click();
    }

}