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

    openPreview(config){
        const internalTitle = config.internalTitle
        const url = config.url 
        const wait = config.wait ? config.wait : 20000

        cy.get(this.pageTitleLocator).click() // In case preview of the content already open, this will close it
        if(internalTitle){
            cy.get(this.contentSearchInput, {timeout: 20000}).clear().type(internalTitle)
            cy.ifElementWithExactTextExists(this.internalTitleCell, internalTitle, wait, ()=>{
                cy.containsExact(this.internalTitleCell, internalTitle, {timeout: 20000}).click()
                cy.get(this.previewSideBar, {timeout: 20000}).should('be.visible')
                config.contentExists = true // This allows you to check the config object if element exists or not 
            })
            cy.get(this.clearSearchIcon).click()
        } else if(url){
            let url_no_protocol = url.replace(/^https?:\/\//,'')
            cy.get(this.urlCell, {timeout: 20000}).should('exist') // Wait for cells to load before scrolling 
            cy.scrollWithin({
                scroller: this.scrollableTable,
                find: `a[href='${url}']`,
                increment: 5 // This needs to be calibrated correctly. Too small, and it'll crawl too slowly. Too fast, and it'll skip over contents
            })
            cy.ifElementWithExactTextExists(this.urlCell, url_no_protocol, wait, ()=>{
                cy.containsExact(this.urlCell, url_no_protocol).siblings(this.internalTitleCell).click()
                cy.get(this.previewSideBar, {timeout: 20000}).should('be.visible')
                config.contentExists = true
            })
        }
    }

    delete(config){
        const internalTitle = config.internalTitle
        const url = config.url 
        const verify = config.verify

        this.goToPage(this.pageTitle, this.pageUrl)
        this.openPreview(config) // the openPreview method will add property contentExists 
        cy.get("body").then(()=>{
            if(config.contentExists){
                cy.get(this.deleteIcon, {timeout: 5000}).click()
                cy.get(this.deleteContentButton, {timeout: 5000}).click()
            }
        })
        if(verify !== false && url){
            let url_no_protocol = url.replace(/^https?:\/\//,'')
            cy.waitFor({element: `a[href="${url}"]`, to: "not.exist", wait: 20000})
            cy.containsExact(this.urlCell, url_no_protocol).should("not.exist")
        } else if (verify !== false && internalTitle){
            cy.ifNoElementWithExactTextExists(this.internalTitleCell, internalTitle, 10000, ()=>{}) // waits for content to disappear... could use waitFor, but that doesn't check exact text
            cy.containsExact(this.internalTitleCell, internalTitle).should("not.exist")
        }
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

        this.openPreview({internalTitle: search})
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