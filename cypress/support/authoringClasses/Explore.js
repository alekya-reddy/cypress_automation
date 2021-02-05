import { Common } from "./Common";

export class Explore extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/explore`;
        this.pageTitle = "Explore Pages";
        this.createExploreModal = {
            nameInput: "input[name='name']",
            experienceType: 'input[name="experienceType"]',
            dropdownSelect: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(1)',
            dropdownSelectField: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(2) > input'
        };
        this.pageSidebar = {
            container: "div[data-qa-hook='page-sidebar']",
            customUrlLabel: "label:contains('URL Slug')",
            appearanceLabel: "label:contains('Appearance')",
            headerToggle: 'div[data-qa-hook="header"]'
        };
        this.popoverElements = {
            customUrlInput: "#slug"
        };
    }

    visit(){
        cy.visit(this.pageUrl);
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

    goToExplore(name){
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.cellName, name).should("exist").within(() => {cy.get("a").click()})
        cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
    }

    configureExplore(options){
        const { name, slug, appearance, verify } = options
        // These toggle options should have values of "on" or "off"
        const { header } = options


        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== name){
                this.goToExplore(name)
            }
        })

        if(slug){
            this.setCustomUrl(slug, verify)
        }

        if(appearance){
            this.setAppearance(appearance, verify)
        }

        if(header){
            this.toggle(this.pageSidebar.headerToggle, header)
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

}