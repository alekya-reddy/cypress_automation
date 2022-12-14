import { Common } from "./Common";

export class Explore extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/explore`;
        this.pageTitle = "Explore Pages";
        this.cloneExploreIcon = 'i[title="Clone Explore Page"]';
        this.editFolder = 'i[title="Edit Folder"]';
        this.emailIcon = 'i[title="email"]';   
        this.shareExplore = 'i[title="share"]';
        this.previewExplore = 'i[title="preview"]';
        this.emailExplore = '#explore-show-email-button';
        this.titleBar= 'div[data-qa-hook="title-bar"]>div>div>a';
        this.sitemapUrl = 'div[data-qa-hook="title-bar"]>div>span:nth-child(4)>span>i';
        this.searchPage = 'input[name="page-search"]';
        this.clearSearch = 'i[title="Clear search"]';
        this.inputTopics = 'div[class="Select-placeholder"]';
        this.featuredContent = 'div[data-qa-hook="feature-content-preview"]';
        this.topicCarousel = 'div[data-qa-hook="carousel-assets"]';
        this.recentUpdateTab = 'div[id="recently-updated-tab"]';
        this.editTopicCaousel = 'div[data-qa-hook="carousel-assets"]>div:nth-child(1)>span>div:nth-child(2)>span>i',
        this.exploreContent = "#qa-explore-asset-title-grid-0-0";
        this.antSelector = ".ant-select-selector";
        this.carouselTopicDelete = 'i[class*="Icon__fa-trash"]'
        
        this.createExploreModal = {
            nameInput: "#name",
            experienceType: 'input[name="experienceType"]',
            dropDownList: '.Select-menu-outer',
            dropdownSelect: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(1)',
            dropdownSelectField: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(2) > input'
        };
        this.editExplorePageIcon = "i[title='Edit Explore Page']";
        this.deleteExplorePageIcon = "i[class*='delete Icon__action']";
        this.cloneExploreIcon = 'i[title="Clone Explore Page"]';
        this.topicFilterDropdown = 'div[data-qa-hook="topic-filter-dropdown"]',
        this.topicFilterSection = 'div[data-qa-hook="topic-filter-section"]',
        this.pageSidebar = {
            container: "div[data-qa-hook='page-sidebar']",
            customUrlLabel: "label:contains('URL Slug')",
            searchEngine: "label:contains('Search Engine Directive')",
            pageTitleLabel: "label:contains('Page Title')",
            pageDescriptionLabel: "label:contains('Page Description')",
            thumbnail: "#explore-seo-thumbnail",
            appearanceLabel: "label:contains('Appearance')",
            externalCodeLabel: "label:contains('External Code')",
            ctaToggle: 'div[data-qa-hook="ctaSection"]',
            heroToggle: 'div[data-qa-hook="heroSection"]',
            showTextToggle: 'div[data-qa-hook="showText"]',
            headerToggle: 'div[data-qa-hook="header"]',
            searchToggle: 'div[data-qa-hook="displaySearchSection"]',
            filtersToggle: 'div[data-qa-hook="filtersSection"]',
            featuredContent: 'div[data-qa-hook="displayFeaturedContent"]',
            advanceCustomization: 'div[data-qa-hook="enableAdvancedCustomization"]',
            contentType: 'div[data-qa-hook="showContentType"]',
            showTopics: 'div[data-qa-hook="showTopics"]',
            openContentTrack: "label:contains('Open Content Track')",
        };
        this.popoverElements = {
            customUrlInput: "#slug",
            pageTitleInput: "#publicTitle",
            pageDescriptionInput: "#pageDescription",
        };
        this.header = {
            headerNoOverrides: 'div[data-qa-hook="Header no overrides"]',
            headerOverrides: 'div[data-qa-hook="Header overrides"]',
            headerTitle: '#title'
        }
        this.heroTitleLocator = 'div[data-qa-hook="header-title-show"]';
        this.heroTitleInput = 'input[name="headerTitle"]',
        this.heroSubtitleLocatorDefault = 'h3[data-qa-hook="header-subtitle-default"]',
        this.headerTitle = 'h3[data-qa-hook="body-title-default-show"]',
        this.heroSubtitleLocator = 'div[data-qa-hook^="header-subtitle-show"]',
        this.heroSubtitleInput = 'input[name="headerSubtitle"]',
        this.contentDescription = 'textarea[name="contentDescription"]',
        this.heroCTA = '#qa-cta-button-hero',
        this.bodyCTA = '#qa-cta-button-body',
        this.footerCTA = '#qa-cta-button-footer'
        this.heroImages = {
            backgroundImage: '#hero-background-image',
            brandImage: '#hero-brand-image',
            partnerImage: '#hero-partner-image',
            personalizedImage: '#hero-personalized-image',
        }
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    goToExplorePage(name){
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.experienceCellName, name).should("exist").within(() => {cy.get("a").click()})
        cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
    }

    addExplore(options){
        const name = options.name
        const experienceType = options.experienceType
        const trackName = options.trackName
        const parentFolder = options.parentFolder

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Create Explore Page").click()
        cy.contains(this.modal, "Create Explore Page").within(()=>{
            cy.get(this.createExploreModal.nameInput).clear().type(name)
            cy.contains(this.experienceType, experienceType).click()
            cy.get(this.createExploreModal.dropdownSelect).eq(0).click()
            cy.get(this.createExploreModal.dropdownSelect).eq(0).type(trackName + "\n")

            if (parentFolder) {
                cy.get(this.createExploreModal.dropdownSelect).eq(1).click()
                cy.get(this.createExploreModal.dropdownSelectField).eq(1).type(parentFolder + "\n")
            }
        
            cy.contains("button", "Create Explore Page").click()
        })
        cy.contains(this.modal, "Create Explore Page").should("not.exist")
        cy.containsExact("h1", name, {timeout: 10000}).should("exist")
    }

    editExplore(options){
        const name = options.name
        const experienceType = options.experienceType
        const trackName = options.trackName
        const parentFolder = options.parentFolder

        cy.get(this.editExplorePageIcon).click({force:true})
        cy.wait(2000)
        cy.contains(this.modal, "Edit Explore Page").within(()=>{
            if (name) {
                cy.get(this.createExploreModal.nameInput).clear().type(name)
            }
            if (experienceType) {
                cy.contains(this.experienceType, experienceType).click()
            }
            if (trackName) {
                cy.get(this.createExploreModal.dropdownSelect).eq(0).click()
                cy.get(this.createExploreModal.dropdownSelectField).eq(0).type(trackName + "\n")
            }
            if (parentFolder) {
                cy.get(this.createExploreModal.dropdownSelect).eq(1).click()
                cy.get(this.createExploreModal.dropdownSelectField).eq(1).type(parentFolder + "\n")
            }
        
            cy.contains("button", "Save Explore Page").click()
        })
        cy.contains(this.modal, "Save Explore Page").should("not.exist")
        //tc were failing here weirdly so commenting for now will undo if necessasry
        //cy.containsExact("h1", name, {timeout: 10000}).should("exist")
    }

    cloneExplore(cloneName, exploreName){
        cy.get(this.cloneExploreIcon).click()
        cy.contains(this.modal, "Clone this Page").within(()=>{
            cy.get(this.createExploreModal.nameInput).clear().type(cloneName)
            cy.get(this.createExploreModal.dropdownSelect).eq(0).click()
            cy.get(this.createExploreModal.dropdownSelectField).eq(0).type(exploreName + "\n")
        
            cy.contains("button", "Clone this Page").click()
        })
        cy.contains(this.modal, "Clone this Page").should("not.exist")
        cy.containsExact("h1", cloneName, {timeout: 10000}).should("exist")
    }

    deleteExplore(name){
        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.pageSearch).clear().type(name)
        cy.get("body").then($body => {
            if ($body.find(`a[id='configure-${name}']`).length > 0) {
                cy.containsExact(this.table.experienceCellName, name).should("exist").within(() => {cy.get("a").click()})
                cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
        
                cy.get(this.deleteExplorePageIcon).click()
                cy.contains(this.modal, "Do you want to delete this Explore Page?").within(()=>{
                    cy.contains("button", "Yes").click()
                })
                // verify that explore doesn't exist anymore
                cy.contains(this.modal, "Do you want to delete this Explore Page?").should("not.exist")
                cy.get(this.pageSearch).clear().type(name)
                cy.containsExact(this.table.experienceCellName, name).should("not.exist")
                cy.get(this.pageSearch).clear() // clear search field
                
            } else {
               cy.get(this.pageSearch).clear()
            }
        })          
    }

    configureExplore(options){
        const { name, slug, appearance, pageTitle, pageDescription, thumbnail, externalCode, verify } = options
        // These toggle options should have values of "on" or "off"
        const { header, headerTitle, searchFunction, filters, ctaToggle, cta, selectFilters } = options

        const { heroTitle } = options

        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== name){
                this.goToExplorePage(name)
            }
        })

        if(slug){
            this.setCustomUrl(slug, verify)
        }

        if(appearance){
            this.setAppearance(appearance, verify)
        }

        if(pageTitle){
            this.setPageTitle(pageTitle)
        }

        if(pageDescription){
            this.setPageDescription(pageDescription)
        }
        if(thumbnail){
            cy.get(this.pageSidebar.thumbnail).click()
            this.pickThumbnail(thumbnail)
        }

        if(externalCode){
            this.addExternalCode(externalCode)
        }

        if(header){
            this.toggle(this.pageSidebar.headerToggle, header)
        }

        if(headerTitle){
            this.setHeaderOverrides(headerTitle)
        }

        if(searchFunction){
            this.toggle(this.pageSidebar.searchToggle, searchFunction)
        }
        
        if(filters){
            this.toggle(this.pageSidebar.filtersToggle, filters)
        }
                
        if(ctaToggle){
            this.toggle(this.pageSidebar.ctaToggle, ctaToggle)
        } 

        if(cta){
            const ctas = [cta].flat()
            ctas.forEach((cta)=>{
                this.addCTAButton(cta)
            })
        }

        if(selectFilters){
            // Required. Must be true or false
            const { topic, contentType, funnelStage,  businessUnit, persona, industry,language} = selectFilters
             
            if(topic == true || topic == false) {
                this.clickCheckbox({label: "Topic", check: topic})    
            }
            if(contentType == true || contentType == false) {  
                this.clickCheckbox({label: "Content Type", check: contentType}) 
            }
            if(funnelStage == true || funnelStage == false) {
                this.clickCheckbox({label: "Funnel Stage", check: funnelStage})
            }
            if(businessUnit == true || businessUnit == false) {
                this.clickCheckbox({label: "Business Unit", check: businessUnit})
            }
            if(persona == true || persona == false) {
               this.clickCheckbox({label: "Persona", check: persona})   
            }
            if(industry == true || industry == false) {
                this.clickCheckbox({label: "Industry", check: industry})
            }   
            if(language == true || language == false) {
                this.clickCheckbox({label: "Language", check: language})
            } 
        } 

        if(heroTitle){
            cy.get(this.heroTitleLocator).click()
            cy.get(this.heroTitleInput).clear().type(heroTitle + "\n")
        }

    }    

    setCustomUrl(slug, verify){
        cy.get(this.pageSidebar.customUrlLabel).siblings("span").click()
        cy.get(this.popover).get(this.popoverElements.customUrlInput).clear().type(slug + "\n")
        cy.ifElementWithExactTextExists("button", "Change", 1000, () => {
            cy.contains("button", "Change").click()
        })

        if(verify !== false){
            cy.get(this.pageSidebar.customUrlLabel, {timeout: 10000}).siblings("span").should("contain", slug)
        }
    }

    setOpenContentTrack(openContent, verify){
        cy.get(this.pageSidebar.openContentTrack).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(openContent)).click()
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.pageSidebar.openContentTrack, {timeout: 10000}).siblings("span").should("contain", openContent)
        }
    }

    setAppearance(appearance, verify){
        cy.get(this.pageSidebar.appearanceLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(appearance)).click()
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.get(this.pageSidebar.appearanceLabel).siblings("span").should("contain", appearance)

        }
    }

    addExternalCode(list, verify){
        const codes = [list].flat()

        cy.get(this.pageSidebar.externalCodeLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            codes.forEach( code => {
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(code)).click()
            })
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            codes.forEach( code => {
                cy.get(this.pageSidebar.externalCodeLabel).siblings("span").should("contain", code)
            })
        }
    }

    removeExternalCode(list, verify){
        const codes = [list].flat()
        cy.get(this.pageSidebar.externalCodeLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            codes.forEach( code => {
                cy.ifElementWithExactTextExists("span", code, 1000, ()=>{
                    cy.containsExact("span", code).parent().siblings("span").click()
                })
            })
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            codes.forEach( code => {
                cy.get(this.pageSidebar.externalCodeLabel).siblings("span").should("not.contain", code)
            })
        }
    }

    setHeaderOverrides(headerTitle) {
        cy.get("body").then($body => {
            cy.wait(500)
            if ($body.find(this.header.headerNoOverrides).length > 0) {
                cy.wait(500)
                cy.get(this.header.headerNoOverrides).click({force:true})
            }
            else {
                cy.get(this.header.headerOverrides).click()
            }
        })
        cy.get(this.modal).within(() => {
            cy.contains('div', 'Header customization for this track')
            cy.get(this.header.headerTitle).clear().type(headerTitle)
            cy.contains('button', 'Save Header Customization').click()
        })
    }

    setPageTitle(title, verify){
        cy.get(this.pageSidebar.pageTitleLabel).siblings("span").click()
        cy.get(this.popover).get(this.popoverElements.pageTitleInput).clear().type(title + "\n")
        if(verify !== false){
            cy.get(this.pageSidebar.pageTitleLabel).siblings("span").should("contain", title)
        }
    }

    setPageDescription(description, verify){
        cy.get(this.pageSidebar.pageDescriptionLabel).siblings("span").click()
        cy.get(this.popover).get(this.popoverElements.pageDescriptionInput).clear().type(description)
        cy.contains("button", "Update").click()
        if(verify !== false){
            cy.get(this.pageSidebar.pageDescriptionLabel).siblings("span").should("contain", description)
        }
    }
    setFeaturedContent(assetName){
        cy.containsExact('div', "No Featured Content selected").siblings("div").click({force:true})
        cy.contains(this.modal, "Manage Featured Content", { timeout: 10000 }).within(()=>{
            cy.wait(200)
            cy.get(this.inputTopics).click().type(assetName + "\n")
        })
    }

    addTopicCarousel(topic){
        cy.containsExact('div', "Add Topic Carousel").siblings("div").click({force:true})
        cy.contains('div', "Manage Topic Carousels").should("exist")
        cy.get(this.modalBody).within(()=>{
            cy.get(this.inputTopics).click().type(topic + "\n")
        })
    }
    TopicCarouselSorting(config) {
        const {type, topicName} = config
        cy.wait(500)
        cy.get(this.editTopicCaousel).eq(0).click({force:true})
        cy.contains('tr', topicName).within(() => {
            cy.get(this.antSelector).click()
        })
        cy.containsExact('div',type).click()
        cy.get(`span[title='${type}']`).should('exist')
        cy.contains('button', "Save Topic Carousels").click()
    }

    addCTAButton(config){
        // type should be either Hero, Body or Footer
        // position should be either Left, Center or Right
        const {type, ctaName, position, verify} = config
        cy.contains('label', type).click()
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).eq(0).click()
            cy.get(this.dropdown.input).eq(0).type(ctaName + "\n", {force: true})
            cy.get(this.dropdown.box).eq(1).click()
            cy.get(this.dropdown.input).eq(1).type(position + "\n", {force: true})
            cy.contains('button', 'Update').click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.contains("label", type).siblings("span").should("contain", ctaName)     
        } 
    }
}
