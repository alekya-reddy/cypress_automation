import { Common } from "./Common";

export class Target extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/target`;
        this.pageTitle = "Target Tracks";
        this.deleteTrackIcon = "i[title='Delete Track']";
        this.createTrackModal = {
            nameInput: "input[name='name']"
        };
        this.pageSidebar = {
            container: "div[data-qa-hook='page-sidebar']",
            customUrlLabel: "label:contains('Custom URL')",
            customUrlInput: "#customUrl" 
        };
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addTrack(options){
        const name = options.name 

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Create Target Track").click()
        cy.contains(this.modal, "Create Target Track").within(()=>{
            cy.get(this.createTrackModal.nameInput).clear().type(name)
            cy.contains("button", "Create Target Track").click()
        })
        cy.contains(this.modal, "Create Target Track").should("not.exist")
        cy.containsExact("h1", name, {timeout: 10000}).should("exist")
    }

    goToTrack(name){
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.cellName, name).should("exist").get("a").click()
        cy.get(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
    }

    deleteTrack(name, verify){
        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.pageSearch, {timeout: 20000}).clear().type(name)
        cy.ifElementWithExactTextExists(this.table.cellName, name, 2000, () => {
            cy.containsExact(this.table.cellName, name).should("exist").within(() => { 
                cy.get("a").click()
            })
            cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
            cy.get(this.deleteTrackIcon, {timeout: 20000}).click()
            cy.contains(this.modal, "Do you want to delete this Track?").contains("button", "Yes").click()
        })

        if(verify !== false){
            cy.contains(this.pageTitleLocator, this.pageTitle, {timeout: 20000}).should("exist")
            cy.get(this.pageSearch).clear().type(name)
            cy.containsExact(this.table.cellName, name).should("not.exist")
            cy.get(this.clearSearchIcon).click()
        }
    }

    configure(options){
        const name = options.name
        const slug = options.slug
        const contents = options.contents
        const verify = options.verify

        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== name){
                this.goToTrack(name)
            }
        })

        if(slug){
            cy.get(this.pageSidebar.customUrlLabel).siblings("span").click()
            cy.get(this.popover).get(this.pageSidebar.customUrlInput).clear().type(slug + "\n")

            if(verify !== false){
                cy.get(this.pageSidebar.customUrlLabel).siblings("span").should("contain", slug)
            }
        }

        if(contents){
            cy.contains("button", "Add Content").click()
            contents.forEach((content) => {
                cy.get(this.modal).within(()=>{
                    cy.get(this.contentPickerSearchBar).clear().type(content)
                    cy.contains(this.contentPickerItem, content).click()
                })
            })
            cy.get(this.modal).contains("button", "Add Content").click()

            if(verify !== false){
                cy.get(this.modal).should('not.exist')
                contents.forEach((content) => {
                    cy.containsExact("strong", content).should("exist")
                })
            }
        }
    }
}

