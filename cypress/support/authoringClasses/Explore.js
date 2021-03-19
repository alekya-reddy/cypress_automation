import { Common } from "./Common";

export class Explore extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/explore`;
        this.pageTitle = "Explore Pages";
        this.cloneExploreIcon = 'i[title="Clone Explore Page"]';
        
        this.createExploreModal = {
            nameInput: "input[name='name']",
            experienceType: 'input[name="experienceType"]',
            dropdownSelect: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(1)',
            dropdownSelectField: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(2) > input'
        };
        this.editExplorePageIcon = 'i[title="Edit Explore Page"]';
        this.deleteExplorePageIcon = 'i[title="Delete Explore Page"]';
        this.topicFilterDropdown = 'div[data-qa-hook="topic-filter-dropdown"]',
        this.topicFilterSection = 'div[data-qa-hook="topic-filter-section"]',
        this.pageSidebar = {
            container: "div[data-qa-hook='page-sidebar']",
            customUrlLabel: "label:contains('URL Slug')",
            publicTitleLabel: "label:contains('Public Title')",
            appearanceLabel: "label:contains('Appearance')",
            ctaToggle: 'div[data-qa-hook="ctaSection"]',
            headerToggle: 'div[data-qa-hook="header"]',
            searchToggle: 'div[data-qa-hook="displaySearchSection"]',
            filtersToggle: 'div[data-qa-hook="filtersSection"]',
        };
        this.popoverElements = {
            customUrlInput: "#slug",
            publicTitleInput: "#publicTitle"
        };
        this.header = {
            headerNoOverrides: 'div[data-qa-hook="Header no overrides"]',
            headerOverrides: 'div[data-qa-hook="Header overrides"]',
            headerTitle: '#title'
        }
        this.heroTitleLocator = 'div[data-qa-hook="header-title-show"]';
        this.heroTitleInput = 'input[name="headerTitle"]',
        this.heroCTA = '#qa-cta-button-hero',
        this.bodyCTA = '#qa-cta-button-body',
        this.footerCTA = '#qa-cta-button-footer'
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    goToExplorePage(name){
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.cellName, name).should("exist").within(() => {cy.get("a").click()})
        cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
    }

    addExplore(options){
        const name = options.name
        const experienceType = options.experienceType
        const trackName = options.trackName

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Create Explore Page").click()
        cy.contains(this.modal, "Create Explore Page").within(()=>{
            cy.get(this.createExploreModal.nameInput).clear().type(name)
            cy.contains(this.experienceType, experienceType).click()
            cy.get(this.createExploreModal.dropdownSelect).eq(0).click()
            cy.get(this.createExploreModal.dropdownSelectField).eq(0).type(trackName + "\n")
        
            cy.contains("button", "Create Explore Page").click()
        })
        cy.contains(this.modal, "Create Explore Page").should("not.exist")
        cy.containsExact("h1", name, {timeout: 10000}).should("exist")
    }

    editExplore(options){
        const name = options.name
        const experienceType = options.experienceType
        const trackName = options.trackName

        cy.get(this.editExplorePageIcon).click()
        cy.contains(this.modal, "Edit Explore Page").within(()=>{
            cy.get(this.createExploreModal.nameInput).clear().type(name)
            cy.contains(this.experienceType, experienceType).click()
            cy.get(this.createExploreModal.dropdownSelect).eq(0).click()
            cy.get(this.createExploreModal.dropdownSelectField).eq(0).type(trackName + "\n")
        
            cy.contains("button", "Save Explore Page").click()
        })
        cy.contains(this.modal, "Save Explore Page").should("not.exist")
        cy.containsExact("h1", name, {timeout: 10000}).should("exist")
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
        cy.get(this.pageSearch).clear().type(name)

        cy.get("body").then($body => {
            if ($body.find(`a[title='${name}']`).length > 0) {
                cy.containsExact(this.table.cellName, name).should("exist").within(() => {cy.get("a").click()})
                cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
        
                cy.get(this.deleteExplorePageIcon).click()
                cy.contains(this.modal, "Do you want to delete this Explore Page?").within(()=>{
                    cy.contains("button", "Yes").click()
                })
                // verify that explore doesn't exist anymore
                cy.contains(this.modal, "Do you want to delete this Explore Page?").should("not.exist")
                cy.get(this.pageSearch).clear().type(name)
                cy.containsExact(this.table.cellName, name).should("not.exist")
                cy.get(this.pageSearch).clear() // clear search field
                
            } else {
               cy.get(this.pageSearch).clear()
            }
        })          
    }

    configureExplore(options){
        const { name, slug, appearance, publicTitle, verify } = options
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

        if(publicTitle){
            this.setPublicTitle(publicTitle)
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
            const { topic, contentType, funnelStage,  businessUnit, persona, industry} = selectFilters
             
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
            cy.get(this.pageSidebar.customUrlLabel).siblings("span").should("contain", slug)
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

    setHeaderOverrides(headerTitle) {
        cy.get("body").then($body => {
            if ($body.find(this.header.headerNoOverrides).length > 0) {
                cy.get(this.header.headerNoOverrides).click()
            }
            else {
                cy.get(this.header.headerOverrides).click()
            }
        })
        cy.get(this.modal).within(() => {
            cy.contains('h3', 'Header Overrides for this Track')
            cy.get(this.header.headerTitle).clear().type(headerTitle)
            cy.contains('button', 'Save Header Overrides').click()
        })
    }

    setPublicTitle(title, verify){
        cy.get(this.pageSidebar.publicTitleLabel).siblings("span").click()
        cy.get(this.popover).get(this.popoverElements.publicTitleInput).clear().type(title + "\n")
        if(verify !== false){
            cy.get(this.pageSidebar.publicTitleLabel).siblings("span").should("contain", title)
        }
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