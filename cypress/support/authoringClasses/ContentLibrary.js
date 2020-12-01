import { Common } from "./Common";

export class ContentLibrary extends Common{
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/content`;
        this.pageTitle = 'Content Library';
        this.sideBarElements = {
            publicTitle: "#content-sidebar-title",
            publicTitleInput: "textarea[name='title']",
            description: "#content-sidebar-description",
            descriptionInput: "textarea[name='description']",
            internalTitle: "#content-sidebar-name",
            internalTitleInput: "textarea[name='internalTitle']",
            slug: "div[data-qa-hook='preview-section-custom-url-slug']",
            slugInput: "#slug",
            thumbnail: "#content-sidebar-thumbnail",
            contentType: "div[data-qa-hook='preview-section-content-type']",
            topics: "div[data-qa-hook='preview-section-topics']",
            sourceUrl: "div[data-qa-hook='preview-section-source-url']",
            funnelStage: "div[data-qa-hook='preview-section-funnel-stages']",
            funnelStageCheckbox: "div[data-qa-hook='checkbox']",
            estimatedCost: "div[data-qa-hook='preview-section-estimated-cost']",
            estimatedCostInput: "#estimatedCost",
            language: "div[data-qa-hook='preview-section-language']",
            businessUnit: "div[data-qa-hook='preview-section-business-units']",
            businessUnitCheckbox: "div[data-qa-hook='checkbox']",
            expiry: "div[data-qa-hook='preview-section-expiry-date']",
            expiryInput: "#expiryDate",
            externalID: "div[data-qa-hook='preview-section-external-id']",
            externalIDInput: "#externalId",
            scoreThreshold: "div[data-qa-hook='preview-section-engagement-score']",
            thresholdInput: "input[name='engagementThreshold']",
            seoTitle: "#content-sidebar-seo-title",
            seoTitleInput: "textarea[name='seoTitle']"
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
        const noScroll = config.noScroll

        cy.get(this.pageTitleLocator).click() // In case preview of the content already open, this will close it
        if(internalTitle){
            cy.get(this.pageSearch, {timeout: 20000}).clear().type(internalTitle)
            cy.ifElementWithExactTextExists(this.table.internalTitleCell, internalTitle, wait, ()=>{
                cy.containsExact(this.table.internalTitleCell, internalTitle, {timeout: 20000}).click()
                cy.get(this.previewSideBar, {timeout: 20000}).should('be.visible')
                config.contentExists = true // This allows you to check the config object if element exists or not 
            })
            cy.get(this.clearSearchIcon).click()
        } else if(url){
            let url_no_protocol = url.replace(/^https?:\/\//,'')
            cy.get(this.table.urlCell, {timeout: 20000}).should('exist') // Wait for cells to load before scrolling 
            if(!noScroll){
                cy.scrollWithin({
                    scroller: this.scrollableTable,
                    find: `a[href='${url}']`,
                    increment: 5 // This needs to be calibrated correctly. Too small, and it'll crawl too slowly. Too fast, and it'll skip over contents
                })
            }
            cy.ifElementWithExactTextExists(this.table.urlCell, url_no_protocol, wait, ()=>{
                cy.containsExact(this.table.urlCell, url_no_protocol).siblings(this.table.internalTitleCell).click()
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
            cy.containsExact(this.table.urlCell, url_no_protocol).should("not.exist")
        } else if (verify !== false && internalTitle){
            cy.ifNoElementWithExactTextExists(this.table.internalTitleCell, internalTitle, 10000, ()=>{}) // waits for content to disappear... could use waitFor, but that doesn't check exact text
            cy.containsExact(this.table.internalTitleCell, internalTitle).should("not.exist")
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
            cy.get(this.internalTitleInput, {timeout: 90000}).clear().type(internalTitle)
        })
        cy.contains('button', 'Done').click()
        cy.get(this.modal).should('not.exist', {timeout: 10000})
        cy.scrollIntoViewWithin({
            scroller: this.scrollableTable,
            element: this.urlCell,
            text: url.replace(/^https?\:\/\//i, "")
        })
        cy.containsExact(this.table.urlCell, url.replace(/^https?\:\/\//i, ""), {timeout: 10000}).should('exist')
    }

    sideBarEdit(config){
        const publicTitle = config.publicTitle
        const internalTitle = config.internalTitle // Search key
        const newInternalTitle = config.newInternalTitle 
        const description = config.description 
        const slug = config.slug 
        const thumbnail = config.thumbnail // requires fields "category" and "url" or "name", see function pickThumbnail in common class  
        const contentType = config.contentType
        const topics = config.topics ? [config.topics].flat() : false
        const funnelStages = config.funnelStages ? [config.funnelStages].flat() : false 
        const businessUnits = config.businessUnits ? [config.businessUnits].flat() : false
        const externalID = config.externalID 
        const url = config.url // Search key 
        const newUrl = config.newUrl
        const threshold = config.threshold
        const score = config.score
        const estimatedCost = config.estimatedCost
        const language = config.language
        const expiry = config.expiry  // requires object expiry: { m, d, y} - format text MM, DD, YYYY // format YYYY-MM-DD
        const seoTitle = config.seoTitle
        const verify = config.verify

        if(internalTitle){
            this.openPreview({internalTitle: internalTitle})
        } else if(url){
            this.openPreview({url: url})
        }   

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
            if(verify !== false) { cy.contains(this.sideBarElements.publicTitle, publicTitle).should('exist') }
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
            if(verify !== false) { cy.contains(this.sideBarElements.description, description).should('exist') }
        }

        if(seoTitle){
            cy.angryClick({
                clickElement: this.sideBarElements.seoTitle,
                checkElement: this.sideBarElements.seoTitleInput
            })
            cy.get(this.sideBarElements.seoTitle).within(()=>{
                cy.get(this.sideBarElements.seoTitleInput).clear().type(seoTitle)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(seoTitle).should("exist") }
            })
        }

        if(contentType){
            cy.angryClick({
                clickElement: this.sideBarElements.contentType,
                checkElement: this.selectList
            })
            cy.get(this.sideBarElements.contentType).within(()=>{
                cy.get(this.selectList).click()
                cy.get(this.dropDownOption(contentType)).click()
                cy.contains("button", "Save").click()
                if(verify !== false) { cy.contains(contentType).should("exist") }
            })
        }

        if(topics){
            cy.angryClick({
                clickElement: this.sideBarElements.topics,
                checkElement: this.selectList
            })
            cy.get(this.sideBarElements.topics).within(()=>{
                // First clear away the existing topics 
                cy.get(".Select-value-icon").each((removeTopic)=>{
                    cy.get(".Select-value-icon").eq(0).click()
                })
                // Now add the ones you want
                topics.forEach((topic)=>{
                    cy.get(this.selectList).click()
                    cy.get(this.dropDownOption(topic)).click()
                })
                cy.contains("button", "Save").click()
                if(verify !== false) { 
                    topics.forEach((topic)=>{
                        cy.contains(topic, {timeout: 10000}).should("exist") 
                    })
                }
            })
        }

        if(newUrl){
            cy.get(this.sideBarElements.sourceUrl).click()
            cy.get(this.urlInput).clear().type(newUrl)
            cy.get(this.modal).contains("button", "Add").click()
            if(verify !== false) { cy.get(this.sideBarElements.sourceUrl, {timeout: 20000}).should("contain", newUrl) }
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
            if(verify !== false){
                cy.contains(this.sideBarElements.slug, slug).should('exist')
            }
        }

        if(newInternalTitle){
            cy.angryClick({
                clickElement: this.sideBarElements.internalTitle,
                checkElement: this.sideBarElements.internalTitleInput
            })
            cy.get(this.sideBarElements.internalTitle).within(()=>{
                cy.get(this.sideBarElements.internalTitleInput).clear().type(newInternalTitle)
                cy.contains("button", "Save").click()
            })
            if(verify !== false){
                cy.contains(this.sideBarElements.internalTitle, newInternalTitle).should('exist')
            }
        }

        if(funnelStages){
            cy.angryClick({
                clickElement: this.sideBarElements.funnelStage,
                checkElement: this.sideBarElements.funnelStageCheckbox
            })
            cy.get(this.sideBarElements.funnelStage).within(()=>{
                // Need to uncheck any checked funnel stages first 
                cy.get(this.sideBarElements.funnelStageCheckbox).each((checkbox)=>{
                    cy.get(checkbox).invoke("attr", "class").then((checkboxClass)=>{
                        if(!checkboxClass.includes("unchecked")){
                            cy.get(checkbox).click()
                        }
                    })
                })
                // Then check the funnel stages you want 
                funnelStages.forEach((funnelStage)=>{
                    cy.contains(this.sideBarElements.funnelStageCheckbox, funnelStage).click()
                })
                cy.contains("button", "Save").click()
                if(verify !== false){
                    funnelStages.forEach((funnelStage)=>{
                        cy.contains(funnelStage).should("exist")
                    })
                }
            })
        }

        if(estimatedCost){
            cy.angryClick({
                clickElement: this.sideBarElements.estimatedCost,
                checkElement: this.sideBarElements.estimatedCostInput
            })
            cy.get(this.sideBarElements.estimatedCost).within(()=>{
                cy.get(this.sideBarElements.estimatedCostInput).clear().type(estimatedCost)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains("div", estimatedCost).should("exist") }
            })
        }

        if(language){
            cy.angryClick({
                clickElement: this.sideBarElements.language,
                checkElement: this.selectList
            })
            cy.get(this.sideBarElements.language).within(()=>{
                cy.get(this.selectList).click()
                cy.get(this.dropDownOption(language)).click()
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains("div", language).should("exist") }
            })
        }

        if(businessUnits){
            cy.angryClick({
                clickElement: this.sideBarElements.businessUnit,
                checkElement: this.sideBarElements.businessUnitCheckbox
            })
            cy.get(this.sideBarElements.businessUnit).within(()=>{
                // Need to uncheck any checked business units first 
                cy.get(this.sideBarElements.businessUnitCheckbox).each((checkbox)=>{
                    cy.get(checkbox).invoke("attr", "class").then((checkboxClass)=>{
                        if(!checkboxClass.includes("unchecked")){
                            cy.get(checkbox).click()
                        }
                    })
                })
                // Then check the business units you want 
                businessUnits.forEach((businessUnit)=>{
                    cy.contains(this.sideBarElements.businessUnitCheckbox, businessUnit).click()
                })
                cy.contains("button", "Save").click()
                if(verify !== false){
                    businessUnits.forEach((businessUnit)=>{
                        cy.contains(businessUnit).should("exist")
                    })
                }
            })
        }

        if(expiry){
            cy.angryClick({
                clickElement: this.sideBarElements.expiry,
                checkElement: this.sideBarElements.expiryInput
            })
            cy.get(this.sideBarElements.expiry).within(()=>{
                cy.get(this.sideBarElements.expiryInput).clear().type(expiry)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(expiry).should('exist') }
            })
        }

        if(externalID){
            cy.angryClick({
                clickElement: this.sideBarElements.externalID,
                checkElement: this.sideBarElements.externalIDInput
            })
            cy.get(this.sideBarElements.externalID).within(()=>{
                cy.get(this.sideBarElements.externalIDInput).clear().type(externalID)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(externalID).should('exist') }
            })
        }

        if(score && threshold){
            cy.angryClick({
                clickElement: this.sideBarElements.scoreThreshold,
                checkElement: this.sideBarElements.thresholdInput
            })
            cy.get(this.sideBarElements.scoreThreshold).within(()=>{
                cy.get(this.selectList).click()
                cy.get(this.dropDownOption(score)).click()
                cy.get(this.sideBarElements.thresholdInput).clear().type(threshold)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(`Visitors given a score of ${score} when content viewed for ${threshold}s`).should("exist") }
            })
        }
    }

}