import { Common } from "./Common";

export class ContentLibrary extends Common{
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/content`;
        this.pageTitle = 'Content Library';
        this.contentSearchInput = "input[name='page-search']";
        this.internalTitleCell = "div[data-qa-hook='table-cell-internal-title']";
        this.urlCell = "div[data-qa-hook='table-cell-url']";
        this.previewSideBar = "div[data-qa-hook='page-preview']";
        this.deleteContentButton = "button:contains('Delete Asset from Content Library')";
        this.addContentButton = "button:contains('Add Content')";
        this.urlInput = "#multiple-urls";
        this.internalTitleInput = '#internalTitle';
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    deleteContent(title, callback = false){
        // If you expect content deletion to fail, pass in callback to handle what to do in that event 

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.contentSearchInput).clear().type(title)
        cy.get(this.internalTitleCell, {timeout: 20000}) // This forces a smart-wait for the contents to load 
        cy.ifElementWithExactTextExists(this.internalTitleCell, title, 500, () => {
            cy.containsExact(this.internalTitleCell, title).click()
            cy.get(this.previewSideBar).within(()=>{
                cy.get(this.deleteIcon).click()
            })
            cy.get(this.deleteContentButton).click()
            if(callback){
                callback();
                return;
            }
            cy.containsExact(this.internalTitleCell, title).should('not.exist')
            cy.get(this.clearSearchIcon).click()
        })
    }

    addContentByUrl(config){
        const internalTitle = config.internalTitle;
        const url = config.url;

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.addContentButton).click()
        cy.get(this.urlInput).type(url)
        cy.get(this.modal).contains('button', 'Add').click()
        cy.get(this.modal).within(()=>{
            cy.get(this.internalTitleInput).clear().type(internalTitle)
        })
        cy.contains('button', 'Done').click()
        cy.containsExact(this.urlCell, url.replace(/^https?\:\/\//i, "")).should('exist')
    }

}