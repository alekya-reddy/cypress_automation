import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const form = {
    name: 'VEXform'
}
const event = {
    name: 'virtualEventfoldering.js'
}

describe("Add form and validate sidebar with VEX", () => {
    it("Configure VEX and add form ", () => {
        authoring.common.login()
        authoring.configurations.deleteForm("VEXform")

        authoring.configurations.addForm("VEXform")
        cy.contains('Not added to any Virtual Events').should('exist')

        //Add event and configure form inside it
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name) // Clean up from previous runs
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)
        authoring.vex.configureForm(form)
        //Ensure that added VEX shows on form sidebar and clicking on it will redirect to it's configuartion page
        authoring.configurations.visit.forms()
        cy.reload()
        cy.contains(authoring.common.table.cellName, form.name, { timeout: 20000 }).click()
        cy.get('h5').contains('Virtual Events').next().click()

        cy.get(authoring.vex.pageControl).should('exist')
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.configurations.visit.forms()
        cy.reload()
        cy.contains(authoring.common.table.cellName, form.name, { timeout: 20000 }).click()
        cy.contains('Not added to any Virtual Events').should('exist')

    })

})
