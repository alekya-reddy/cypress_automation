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
        authoring.configurations.visit.widgets()
        cy.contains(authoring.configurations.pageTitleLocator, authoring.configurations.pageTitles.widgets).should('exist')
        authoring.configurations.deleteWidgets([widget.name, widget.newName])
        authoring.configurations.addWidget(widget)
        authoring.configurations.editWidget(widget)

        // Do some widget name input error validation in the add widget modal, and test cancel button for add widget modal 
        authoring.configurations.addWidget({name: widget.newName, checkSuccess: false})
        cy.contains("has already been taken").should('exist')
        cy.contains("button", "Cancel").click()
        cy.contains(authoring.configurations.modal, "Add Widget").should("not.exist")
        authoring.configurations.addWidget({name: " ", checkSuccess: false})
        cy.contains("can't be blank").should('exist')
        cy.contains("button", "Cancel").click()

        // Do some widget name input error validation in the sidebar
        authoring.configurations.addWidget(widget)
        cy.containsExact(authoring.configurations.table.cellName, widget.name).click()
        cy.get(authoring.configurations.widgets.previewName).click()
        cy.get(authoring.configurations.widgets.nameInput).clear().type(widget.newName)
        cy.contains("button", "Save").click()
        cy.contains("has already been taken").should('exist')
        cy.get(authoring.configurations.widgets.nameInput).clear() 
        cy.contains("button", "Save").click()
        cy.contains("can't be blank").should('exist')
        cy.contains("button", "Cancel").click()
        cy.get(authoring.configurations.widgets.nameInput).should('not.exist')*/
    })
})