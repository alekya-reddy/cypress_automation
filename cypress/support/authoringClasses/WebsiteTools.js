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
        this.modalBody = 'div[class="ant-modal-body"]';
        this.domainCard = "div[id^='domain-card-']";
        this.websitePath = "input[id='websitePath']";
        this.enterselectOption = function(option){ return `input[id="${option}"]` };
        this.promoterList = "div[name='promoterList']";
        this.selectOpen = "span[class='ant-select-selection-item']";
        this.selectOption = function(option){ return `div[class="ant-select-item-option-content"]:contains("${option}")` };
        this.websiteurlPath = function(option){ return `td[id="${option}"]`};
        this.formSratergy = "li[id='show-page-form-strategy']>a";
        this.addFormButton = ".ant-col-4>button";
        this.formPath = "input[id='website-form-path']";
        this.addForm = "input[id='website-form-id']";
        this.titleBar = 'div[data-qa-hook="title-bar"]>button>a';
        this.Pagecontrols = "div[data-qa-hook='title-bar']>h1"
        this.selectOpen = "span[class='ant-select-selection-item']";
        this.contentPickerSearchBar = 'input[name="content-picker-search-bar"]';
        this.contentPickerItem = 'div[data-qa-hook="content-picker-item"]';
        this.modal = 'div[data-qa-hook="modal"]';
        this.targetElementID = 'input[name="targetElementID"]';
        this.addFeaturedContent = 'button[class="ant-btn ant-btn-primary"]>span:nth-child(2)';
        this.featuredID = 'button[id="featuredContentIds"]';
        this.selectContent = 'button[class="ant-btn"]>span';
        this.addButton = 'div[class="ant-modal-footer"]>button:nth-child(2)';
        this.trackOpen = '.ant-modal-body .ant-form-item:nth-of-type(2) .ant-select-selection-search-input';
        this.contentSelect = '.ant-modal-body .ant-form-item:nth-of-type(3) .ant-select-selection-search-input';
        this.pencilIcon = 'div[data-qa-hook="title-bar"]>div>span>i'    
}

addContentToFeatured(config){
    const contentType = config.contentType

    cy.get(this.featuredID).click()
    cy.get(this.addFeaturedContent).contains("Add Featured Content Item").click()

    if(contentType=="contentLibrary"){
        const content = config.content
       
    cy.get(this.selectContent).contains("Select Content").click()
    cy.get(this.contentPickerSearchBar).clear().type(content)
    cy.get(this.contentPickerItem).contains(content).click()
    cy.get('button[type="submit"]').contains("Select Content").click()
    cy.get(this.addButton).click()
    }
    if(contentType=="Target Content Track"){
        const content = config.content
        const track =   config.track
        cy.contains("span" ,"Add Featured Content Item").click({force: true})
    cy.get('span[title="Content Library"]').click()
    cy.get(this.selectOption(contentType)).click()
    cy.get( this.trackOpen ).click()
    cy.get(this.selectOption(track)).click()
    cy.get(this.contentSelect).click()
    cy.get(this.selectOption(content)).click()
    cy.wait(1000)
    cy.get(this.addButton).click({force: true})
    }  
    if(contentType=="Recommend Content Track"){
        const content = config.content
        const track =   config.track
        cy.contains("span" ,"Add Featured Content Item").click({force: true})
    cy.get('span[title="Content Library"]').click()
    cy.get(this.selectOption(contentType)).click()
    cy.get(this.trackOpen).click() 
    cy.get(this.selectOption(track)).click()
    cy.get(this.contentSelect).click()
    cy.get(this.selectOption(content)).click()
    cy.wait(1000)
    cy.get(this.addButton).click({force: true})
    }
    
    cy.get('button[type="submit"]:contains("Set Featured Content")').click({force: true})
    cy.get(this.modal).should('not.exist')
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