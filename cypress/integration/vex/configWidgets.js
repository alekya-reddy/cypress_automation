import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const widget = {
    name: "I am a widget",
    code: `<h1>Hello world`, // typing <h1> will automatically add </h1>
    newName: "New Name",
    newCode: `<h1>Bye world`
}

describe("Widget Configuration", ()=>{
    it("Test widget CRUD operations - Create, update, destroy", ()=>{
        cy.log("Widgets has been removed from authoring as it currently is being used anywhere")
        /*authoring.common.login()
        authoring.widgets.visit()
        cy.contains(authoring.widgets.pageTitleLocator, authoring.widgets.pageTitle).should('exist')
        authoring.widgets.deleteWidgets([widget.name, widget.newName])
        authoring.widgets.addWidget(widget)
        authoring.widgets.editWidget(widget)

        // Do some widget name input error validation in the add widget modal, and test cancel button for add widget modal 
        authoring.widgets.addWidget({name: widget.newName, checkSuccess: false})
        cy.contains("has already been taken").should('exist')
        cy.contains("button", "Cancel").click()
        cy.contains(authoring.widgets.modal, "Add Widget").should("not.exist")
        authoring.widgets.addWidget({name: " ", checkSuccess: false})
        cy.contains("can't be blank").should('exist')
        cy.contains("button", "Cancel").click()

        // Do some widget name input error validation in the sidebar
        authoring.widgets.addWidget(widget)
        cy.containsExact(authoring.widgets.table.cellName, widget.name).click()
        cy.get(authoring.widgets.widgetPreviewName).click()
        cy.get(authoring.widgets.widgetNameInput).clear().type(widget.newName)
        cy.contains("button", "Save").click()
        cy.contains("has already been taken").should('exist')
        cy.get(authoring.widgets.widgetNameInput).clear() 
        cy.contains("button", "Save").click()
        cy.contains("can't be blank").should('exist')
        cy.contains("button", "Cancel").click()
        cy.get(authoring.widgets.widgetNameInput).should('not.exist')*/
    })
})