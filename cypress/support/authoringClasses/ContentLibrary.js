import { Common } from "./Common";

export class ContentLibrary extends Common{
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/content`;
        this.pageTitle = 'Content Library';
        this.contentSearchInput = "input[name='page-search']";
        this.internalTitleCell = "div[data-qa-hook='table-cell-internal-title']";
        this.urlCell = "div[data-qa-hook='table-cell-url']";
        this.sideBarElements = {
            publicTitle: "#content-sidebar-title",
            publicTitleInput: "textarea[name='title']",
            description: "#content-sidebar-description",
            descriptionInput: "textarea[name='description']",
            internalTitle: "#content-sidebar-name",
            internalTitleInput: "textarea[name='internalTitle']",
            slug: "div[data-qa-hook='preview-section-custom-url-slug']",
            slugInput: "#slug",
            thumbnail: "#content-sidebar-thumbnail"
        };
        this.deleteContentButton = "button:contains('Delete Asset from Content Library')";
        this.addContentButton = "button:contains('Add Content')";
        this.urlInput = "#multiple-urls";
        this.internalTitleInput = '#internalTitle';
        this.advancedEditButton = "button:contains('Advanced Edit')";
        this.advancedEditElements = {
            publicTitleInput: "#title",
            internalTitleInput: '#internalTitle',
            descriptionInput: "#description"
        };
        
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    searchAndClickContent(content){
        cy.get(this.contentSearchInput).clear().type(content)
        cy.get(this.internalTitleCell, {timeout: 20000}) // This forces a smart-wait for the contents to load 
        cy.ifElementWithExactTextExists(this.internalTitleCell, content, 500, () => {
            cy.containsExact(this.internalTitleCell, content).click()
        })
        cy.get(this.clearSearchIcon).click()
    }

    deleteContent(title, callback = false){
        // If you expect content deletion to fail, pass in callback to handle what to do in that event 

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.contentSearchInput).clear().type(title)
        cy.get(this.internalTitleCell, {timeout: 20000}) // This forces a smart-wait for the contents to load 
        cy.ifElementWithExactTextExists(this.internalTitleCell, title, 500, () => {
            cy.ifNoElementWithExactTextExists(this.sideBarElements.internalTitle, title, 500, ()=>{
                cy.containsExact(this.internalTitleCell, title).click()
            })
            cy.get(this.previewSideBar).within(()=>{
                cy.get(this.deleteIcon).click()
            })
            cy.get(this.deleteContentButton).click()
            if(callback){
                callback();
                return;
            }
        })
        cy.ifNoElementWithExactTextExists(this.internalTitleCell, title, 10000, ()=>{}) // This just does a smart wait for content to disappear 
        cy.containsExact(this.internalTitleCell, title).should('not.exist')
        cy.get(this.clearSearchIcon).click()
    }

    deleteContentByUrl(config){
        let urls = [config.urls].flat() 
        let verifyDeleted = config.verifyDeleted == false ? false : true

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.reload()
        cy.scrollIntoViewWithin({
            scroller: this.scrollableTable,
            increment: 10
        })
        urls.forEach((url)=>{
            let url_no_protocol = url.replace(/^https?:\/\//,'')
            cy.ifElementWithExactTextExists(this.urlCell, url_no_protocol, 500, () => {
                cy.containsExact(this.urlCell, url_no_protocol).siblings(this.internalTitleCell).click()
                cy.get(this.previewSideBar).within(()=>{
                    cy.get(this.deleteIcon).click()
                })
                cy.get(this.deleteContentButton).click()
                if(verifyDeleted) {
                    cy.containsExact(this.urlCell, url_no_protocol).should('not.exist')
                }
            })
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
            cy.get(this.internalTitleInput, {timeout: 10000}).clear().type(internalTitle)
        })
        cy.contains('button', 'Done').click()
        cy.get(this.modal).should('not.exist', {timeout: 10000})
        cy.scrollIntoViewWithin({
            scroller: this.scrollableTable,
            element: this.urlCell,
            text: url.replace(/^https?\:\/\//i, "")
        })
        cy.containsExact(this.urlCell, url.replace(/^https?\:\/\//i, ""), {timeout: 10000}).should('exist')
    }

    sideBarEdit(config){
        const search = config.search 
        const publicTitle = config.publicTitle
        const internalTitle = config.internalTitle 
        const description = config.description 
        const slug = config.slug 
        const thumbnail = config.thumbnail // requires fields "category" and "url" or "name", see function pickThumbnail in common class  
        const contentType = config.contentType
        const topics = config.topics
        const funnelStages = config.funnelStages
        const businessUnits = config.businessUnits 
        const externalID = config.externalID 
        const url = config.url 
        const engagementTime = config.engagementTime
        const engagementScore = config.engagementScore

        this.searchAndClickContent(search)
        cy.contains(this.previewSideBar, search).should('exist') 
        if(thumbnail){
            cy.get(this.sideBarElements.thumbnail).click()
            this.pickThumbnail(thumbnail)
        }
        if(publicTitle){
            cy.get(this.sideBarElements.publicTitle).click()
            cy.get(this.sideBarElements.publicTitle).within(()=>{
                cy.get(this.sideBarElements.publicTitleInput).clear().type(publicTitle)
                cy.contains("button", "Save").click()
            })
            cy.contains(this.sideBarElements.publicTitle, publicTitle).should('exist')
        }
        if(internalTitle){
            cy.angryClick({
                clickElement: this.sideBarElements.internalTitle,
                checkElement: this.sideBarElements.internalTitleInput
            })
            cy.get(this.sideBarElements.internalTitle).within(()=>{
                cy.get(this.sideBarElements.internalTitleInput).clear().type(internalTitle)
                cy.contains("button", "Save").click()
            })
            cy.contains(this.sideBarElements.internalTitle, internalTitle).should('exist')
        }
        if(description){
            cy.angryClick({
                clickElement: this.sideBarElements.description,
                checkElement: this.sideBarElements.descriptionInput
            })
            cy.get(this.sideBarElements.description).within(()=>{
                cy.get(this.sideBarElements.descriptionInput).clear().type(description)
                cy.contains("button", "Save").click()
            })
            cy.contains(this.sideBarElements.description, description).should('exist')
        }
        if(slug){
            cy.angryClick({
                clickElement: this.sideBarElements.slug,
                checkElement: this.sideBarElements.slugInput
            })
            cy.get(this.sideBarElements.slug).within(()=>{
                cy.get(this.sideBarElements.slugInput).clear().type(slug)
                cy.contains("button", "Save").click()
            })
            cy.get(this.modal).within(()=>{
                cy.contains("button", "Change").click()
            })
            cy.contains(this.sideBarElements.slug, slug).should('exist')
        }
    }

}