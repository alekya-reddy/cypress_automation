import { Common } from "./Common";

export class Widgets extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/config/widgets`;
        this.pageTitle = "Widgets Configuration";
        this.widgetNameInput = "#name";
        this.widgetCodeEditor = "#code > textarea";
        this.widgetPreviewName = "div[data-qa-hook='preview-section-widget-name']";
        this.deleteWidgetIcon = "i[title='Delete Widget']";
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addWidget(config){
        let name = config.name
        let code = config.code
        let checkSuccess = config.checkSuccess == false ? false : true 

        cy.contains("button", "Add Widget").click()
        cy.get(this.modal).within(()=>{
            cy.get(this.widgetNameInput).clear().type(name)

            if (code){
                cy.get(this.widgetCodeEditor).type(code, {force: true})
            }
            cy.contains("button", "Add Widget").click() 
        })
        if(checkSuccess){
            cy.get(this.modal).should("not.exist")
            cy.containsExact(this.table.cellName, name).should('exist')
            if(code){
                cy.contains(this.table.cellCode, code).should('exist')
            }
        }
    }

    editWidget(config){
        let name = config.name 
        let newName = config.newName 
        let newCode = config.newCode

        this.openWidgetPreview(name)
        if(newName){
            cy.get(this.widgetPreviewName).click().within(()=>{
                cy.get(this.widgetNameInput).clear().type(newName)
                cy.contains("button", "Save").click()
                cy.contains(newName).should("exist")
            })
            cy.containsExact(this.table.cellName, newName).should('exist')
        }

        if(newCode){
            cy.get("code").click()
            cy.contains(this.modal, "Update Widget").within(()=>{
                cy.get(this.widgetCodeEditor).clear({force: true}).type(newCode, {force: true})
                cy.contains("button", "Save Widget").click()
            })
            cy.get(this.modal).should('not.exist')
            cy.contains(this.table.cellCode, newCode).should('exist')
        }
    }

    deleteWidgets(list){
        let widgets = [list].flat() 

        widgets.forEach((widget)=>{
            cy.ifElementWithExactTextExists(this.table.cellName, widget, 1500, ()=>{
                this.openWidgetPreview(widget)
                cy.contains(this.previewSideBar, widget).should('exist').within(()=>{
                    cy.get(this.deleteWidgetIcon).click()
                })
                cy.contains(this.modal, "Delete Widget?").within(()=>{
                    cy.contains("button", "Delete Widget").click()
                })
            })
            cy.ifNoElementWithExactTextExists(this.modal, "Delete Widget?", 10000, ()=>{}) // This just smart-waits for modal to disappear
            cy.ifNoElementWithExactTextExists(this.table.cellName, widget, 10000, ()=>{}) // This just smart-waits for widget to disappear
            cy.containsExact(this.table.cellName, widget).should("not.exist")
        })
    }

    openWidgetPreview(widget){
        cy.angryClick({clickElement: this.table.cellName + `:contains('${widget}')`, checkElement: `${this.widgetPreviewName}:contains('${widget}')`})
    }

}