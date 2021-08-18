import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const form =  "forms_WT"
const domainName = "pathfactory-qa-wt-form.com"
const websitePath = "automation-analytics"

describe("Forms Sidebar Configuration on Website Tools", () => {
    it("Add property and Forms to Website tools", () => {
        authoring.common.login()
        authoring.configurations.deleteForm("forms_WT")

        authoring.configurations.addForm("forms_WT")
        cy.contains('Not added to any Website Tools Pages').should('exist')

        authoring.websiteTools.visit()
        //Add a new website property
        cy.get(authoring.websiteTools.addProperty).click()
        cy.get(authoring.websiteTools.antModal).within(() => {
            cy.get(authoring.websiteTools.enterDomainName).type(domainName)
            cy.get(authoring.websiteTools.addProperty).click()
        })
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.get(authoring.websiteTools.formSratergy).click()
        cy.get(authoring.websiteTools.addFormButton).click()
        cy.get(authoring.websiteTools.formPath).type(websitePath)
        cy.get(authoring.websiteTools.addForm).type(form +"\n",{force: true})
        cy.contains("span","Save").click()
        //Ensure that added property shows on form sidebar and clicking on it will redirect to it's configuartion
        authoring.configurations.visit.forms()
        cy.reload()
        cy.contains(authoring.common.table.cellName, form, {timeout: 5000}).click()
        cy.get('h5').contains('Website Tools Pages').next().click()
        cy.get(authoring.websiteTools.Pagecontrols).should('exist')

        authoring.websiteTools.visit()
        //Delete the website property
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Delete").click()
        })
        cy.contains(authoring.common.antModal, "Are you sure?").contains("button", "Delete").click()
        authoring.configurations.visit.forms()
        cy.reload()
        cy.contains(authoring.common.table.cellName, form, {timeout: 5000}).click()
        cy.contains('Not added to any Website Tools Pages').should('exist')

  })
})

