import { Common } from "./Common";

export class ContentLibrary extends Common{
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/content`;
        this.contentInsightsUrl = `${this.baseUrl}/authoring/content-library/content/insights`;
        this.pageTitle = 'Content Library';
        this.contentInsightsTitle = "Content Library Insights";
        this.sidebarComponent = {
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
            persona: "div[data-qa-hook='preview-section-personas']",
            industry: "div[data-qa-hook='preview-section-industries']",
            tagsCheckbox: "div[data-qa-hook='checkbox']",
            expiry: "div[data-qa-hook='preview-section-expiry-date']",
            expiryInput: "#expiryDate",
            externalID: "div[data-qa-hook='preview-section-external-id']",
            externalIDInput: "#externalId",
            scoreThreshold: "div[data-qa-hook='preview-section-engagement-score']",
            thresholdInput: "input[name='engagementThreshold']",
            seoTitle: "#content-sidebar-seo-title",
            seoTitleInput: "textarea[name='seoTitle']",
            previewTargetTracks: "div[data-qa-hook='preview-section-target-tracks']",
            experienceTagsLocator: "span[class^='ExperienceTags']"
        };
        this.advancedEditComponent = {
            publicTitleInput: "#title",
            internalTitleInput: '#internalTitle',
            descriptionInput: "#description"
        };
        this.addContentComponent = {
            urlInput: "#multiple-urls"
        };
        this.deleteContentButton = "button:contains('Delete Asset from Content Library')";
        this.addContentButton = "button:contains('Add Content')";
        this.advancedEditButton = "button:contains('Advanced Edit')";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    openPreview(config){
        const internalTitle = config.internalTitle
        const url = config.url 
        const wait = config.wait ? config.wait : 20000

        cy.get(this.pageTitleLocator).click() // In case preview of the content already open, this will close it
        if(url){
            let url_no_protocol = url.replace(/^https?:\/\//,'')
            cy.get(this.pageSearch, {timeout: 20000}).clear().type(url_no_protocol)
            cy.ifElementWithExactTextExists(this.table.urlCell, url_no_protocol, wait, ()=>{
                cy.containsExact(this.table.urlCell, url_no_protocol).siblings(this.table.internalTitleCell).click()
                cy.get(this.previewSideBar, {timeout: 20000}).should('be.visible')
                config.contentExists = true
            })
            cy.get(this.clearSearchIcon).click()
        } else if(internalTitle){
            cy.get(this.pageSearch, {timeout: 20000}).clear().type(internalTitle)
            cy.ifElementWithExactTextExists(this.table.internalTitleCell, internalTitle, wait, ()=>{
                cy.containsExact(this.table.internalTitleCell, internalTitle, {timeout: 20000}).click()
                cy.get(this.previewSideBar, {timeout: 20000}).should('be.visible')
                config.contentExists = true // This allows you to check the config object if element exists or not 
            })
            cy.get(this.clearSearchIcon).click()
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
        cy.get(this.addContentComponent.urlInput).type(url)
        cy.get(this.modal).contains('button', 'Add').click()
        cy.get(this.modal).within(()=>{
            cy.get(this.advancedEditComponent.internalTitleInput, {timeout: 90000}).clear().type(internalTitle)
        })
        cy.contains('button', 'Done').click()
        cy.get(this.modal).should('not.exist', {timeout: 10000})
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
        const personas = config.personas ? [config.personas].flat() : false
        const industries = config.industries ? [config.industries].flat() : false
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

        if(url){
            this.openPreview({url: url})
        } else if(internalTitle){
            this.openPreview({internalTitle: internalTitle})
        }  

        if(thumbnail){
            cy.get(this.sidebarComponent.thumbnail).click()
            this.pickThumbnail(thumbnail)
        }

        if(publicTitle){
            cy.get(this.sidebarComponent.publicTitle).click()
            cy.get(this.sidebarComponent.publicTitle).within(()=>{
                cy.get(this.sidebarComponent.publicTitleInput).clear().type(publicTitle)
                cy.contains("button", "Save").click()
            })
            if(verify !== false) { cy.contains(this.sidebarComponent.publicTitle, publicTitle).should('exist') }
        }

        if(description){
            cy.angryClick({
                clickElement: this.sidebarComponent.description,
                checkElement: this.sidebarComponent.descriptionInput
            })
            cy.get(this.sidebarComponent.description).within(()=>{
                cy.get(this.sidebarComponent.descriptionInput).clear().type(description)
                cy.contains("button", "Save").click()
            })
            if(verify !== false) { cy.contains(this.sidebarComponent.description, description).should('exist') }
        }

        if(seoTitle){
            this.addSEOTitle(seoTitle)
        }

        if(contentType){
            cy.angryClick({
                clickElement: this.sidebarComponent.contentType,
                checkElement: this.dropdown.box
            })
            cy.get(this.sidebarComponent.contentType).within(()=>{
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(contentType)).click()
                cy.contains("button", "Save").click()
                if(verify !== false) { cy.contains(contentType).should("exist") }
            })
        }

        if(topics){
            cy.angryClick({
                clickElement: this.sidebarComponent.topics,
                checkElement: this.dropdown.box
            })
            cy.get(this.sidebarComponent.topics).within(()=>{
                // First clear away the existing topics
                if(Cypress.$(".Select-value-icon").length > 0){
                    cy.get(".Select-value-icon").each(()=>{
                        cy.get(".Select-value-icon").eq(0).click()
                    })
                }
                // Now add the ones you want
                topics.forEach((topic)=>{
                    cy.get(this.dropdown.box).click()
                    cy.get(this.dropdown.option(topic)).click()
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
            cy.get(this.sidebarComponent.sourceUrl).click()
            cy.get(this.addContentComponent.urlInput).clear().type(newUrl)
            cy.get(this.modal).contains("button", "Add").click()
            if(verify !== false) { cy.get(this.sidebarComponent.sourceUrl, {timeout: 20000}).should("contain", newUrl) }
        }

        if(slug){
            cy.angryClick({
                clickElement: this.sidebarComponent.slug,
                checkElement: this.sidebarComponent.slugInput
            })
            cy.get(this.sidebarComponent.slug).within(()=>{
                cy.get(this.sidebarComponent.slugInput).clear().type(slug)
                cy.contains("button", "Save").click()
            })
            cy.get(this.modal).within(()=>{
                cy.contains("button", "Change").click()
            })
            if(verify !== false){
                cy.contains(this.sidebarComponent.slug, slug).should('exist')
            }
        }

        if(newInternalTitle){
            cy.angryClick({
                clickElement: this.sidebarComponent.internalTitle,
                checkElement: this.sidebarComponent.internalTitleInput
            })
            cy.get(this.sidebarComponent.internalTitle).within(()=>{
                cy.get(this.sidebarComponent.internalTitleInput).clear().type(newInternalTitle)
                cy.contains("button", "Save").click()
            })
            if(verify !== false){
                cy.contains(this.sidebarComponent.internalTitle, newInternalTitle).should('exist')
            }
        }

        if(funnelStages){
            cy.angryClick({
                clickElement: this.sidebarComponent.funnelStage,
                checkElement: this.sidebarComponent.funnelStageCheckbox
            })
            cy.get(this.sidebarComponent.funnelStage).within(()=>{
                // Need to uncheck any checked funnel stages first 
                cy.get(this.sidebarComponent.funnelStageCheckbox).each((checkbox)=>{
                    cy.get(checkbox).invoke("attr", "class").then((checkboxClass)=>{
                        if(!checkboxClass.includes("unchecked")){
                            cy.get(checkbox).click()
                        }
                    })
                })
                // Then check the funnel stages you want 
                funnelStages.forEach((funnelStage)=>{
                    cy.contains(this.sidebarComponent.funnelStageCheckbox, funnelStage).click()
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
                clickElement: this.sidebarComponent.estimatedCost,
                checkElement: this.sidebarComponent.estimatedCostInput
            })
            cy.get(this.sidebarComponent.estimatedCost).within(()=>{
                cy.get(this.sidebarComponent.estimatedCostInput).clear().type(estimatedCost)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains("div", estimatedCost).should("exist") }
            })
        }

        if(language){
            cy.wait(500)
            cy.angryClick({
                clickElement: this.sidebarComponent.language,
                checkElement: this.dropdown.box
            })
            cy.get(this.sidebarComponent.language).within(()=>{
                cy.wait(500)
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(language)).click()
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains("div", language).should("exist") }
            })
        }

        if(businessUnits){
            cy.angryClick({
                clickElement: this.sidebarComponent.businessUnit,
                checkElement: this.sidebarComponent.tagsCheckbox
            })
            cy.get(this.sidebarComponent.businessUnit).within(()=>{
                // Need to uncheck any checked business units first 
                cy.get(this.sidebarComponent.tagsCheckbox).each((checkbox)=>{
                    cy.get(checkbox).invoke("attr", "class").then((checkboxClass)=>{
                        if(!checkboxClass.includes("unchecked")){
                            cy.get(checkbox).click()
                        }
                    })
                })
                // Then check the business units you want 
                businessUnits.forEach((businessUnit)=>{
                    cy.contains(this.sidebarComponent.tagsCheckbox, businessUnit).click()
                })
                cy.contains("button", "Save").click()
                if(verify !== false){
                    businessUnits.forEach((businessUnit)=>{
                        cy.contains(businessUnit).should("exist")
                    })
                }
            })
        }

                if(personas){
                    cy.wait(500)
                    cy.angryClick({
                        clickElement: this.sidebarComponent.persona,
                        checkElement: this.sidebarComponent.tagsCheckbox
                    })
                    cy.get(this.sidebarComponent.persona).within(()=>{
                        cy.wait(500)
                        // Need to uncheck any checked personas first 
                        cy.get(this.sidebarComponent.tagsCheckbox).each((checkbox)=>{
                            cy.get(checkbox).invoke("attr", "class").then((checkboxClass)=>{              
                                if(!checkboxClass.includes("unchecked")){
                                    cy.get(checkbox).click()
                                }
                            })
                         })
                         // Then check the personas you want 
                        personas.forEach((persona)=>{
                            cy.contains(this.sidebarComponent.tagsCheckbox, persona).click()
                        })
                        cy.contains("button", "Save").click()
                        if(verify !== false){
                            personas.forEach((persona)=>{
                                cy.contains(persona).should("exist")
                            })
                        }
                     })
                }
        
                if(industries){
                    cy.wait(500)
                    cy.angryClick({
                        clickElement: this.sidebarComponent.industry,
                        checkElement: this.sidebarComponent.tagsCheckbox
                    })
                    cy.get(this.sidebarComponent.industry).within(()=>{
                        cy.wait(500)
                        // Need to uncheck any checked industries first 
                        cy.get(this.sidebarComponent.tagsCheckbox).each((checkbox)=>{
                            cy.get(checkbox).invoke("attr", "class").then((checkboxClass)=>{
                                if(!checkboxClass.includes("unchecked")){
                                    cy.get(checkbox).click()
                                }
                            })
                        })
                        // Then check the industries you want 
                        industries.forEach((industry)=>{
                            cy.contains(this.sidebarComponent.tagsCheckbox, industry).click()
                        })
                        cy.contains("button", "Save").click()
                        if(verify !== false){
                            industries.forEach((industry)=>{
                                cy.contains(industry).should("exist")
                            })
                        }
                    })
                }        

        if(expiry){
            cy.angryClick({
                clickElement: this.sidebarComponent.expiry,
                checkElement: this.sidebarComponent.expiryInput
            })
            cy.get(this.sidebarComponent.expiry).within(()=>{
                cy.get(this.sidebarComponent.expiryInput).clear().type(expiry)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(expiry).should('exist') }
            })
        }

        if(externalID){
            cy.angryClick({
                clickElement: this.sidebarComponent.externalID,
                checkElement: this.sidebarComponent.externalIDInput
            })
            cy.get(this.sidebarComponent.externalID).within(()=>{
                cy.get(this.sidebarComponent.externalIDInput).clear().type(externalID)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(externalID).should('exist') }
            })
        }

        if(score && threshold){
            cy.angryClick({
                clickElement: this.sidebarComponent.scoreThreshold,
                checkElement: this.sidebarComponent.thresholdInput
            })
            cy.get(this.sidebarComponent.scoreThreshold).within(()=>{
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(score)).click()
                cy.get(this.sidebarComponent.thresholdInput).clear().type(threshold)
                cy.contains("button", "Save").click()
                if(verify !== false){ cy.contains(`Visitors given a score of ${score} when content viewed for ${threshold}s`).should("exist") }
            })
        }
    }
    addSEOTitle(seoTitle, verify){
        cy.angryClick({
            clickElement: this.sidebarComponent.seoTitle,
            checkElement: this.sidebarComponent.seoTitleInput
        })
        cy.get(this.sidebarComponent.seoTitle).within(()=>{
            cy.get(this.sidebarComponent.seoTitleInput).clear().type(seoTitle)
            cy.contains("button", "Save").click()
            if(verify !== false){ cy.contains(seoTitle).should("exist") }
        })
    }
    removeSEOTitle(){
        cy.angryClick({
            clickElement: this.sidebarComponent.seoTitle,
            checkElement: this.sidebarComponent.seoTitleInput
        })
        cy.get(this.sidebarComponent.seoTitle).within(()=>{
            cy.get(this.sidebarComponent.seoTitleInput).clear()
            cy.contains("button", "Save").click()
        })
    }

}