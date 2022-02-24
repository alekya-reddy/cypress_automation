import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})

const explore1 = {
    name: "MultiEdit1",
}

const explore2 = {
    name: "MultiEdit2",
}

const explore3 = {
    name: "MultiEdit3",
}

const folderName = "MultiSelectFeatures"
const SearchEngineValue = "Index, Follow"
const appearanceValue = "Default"

    
describe('Explore Multi-Select', function() {
        it('Bulk Update For Multi-Select In Explore', function() {
            authoring.common.login();
            authoring.explore.visit();
            cy.contains('span', folderName).click()
            cy.contains('td', explore1.name).prev().click()
            cy.contains('td', explore2.name).prev().click()
            cy.contains('td', explore3.name).prev().click()
            cy.get(authoring.common.multiEditIcon).should("exist").click()
            cy.get(authoring.common.antModal).should("exist").within(()=>{
                cy.contains('label', "Search Engine Directive").should("exist")
                cy.contains('label', "Appearance").should("exist")
                cy.get(authoring.common.multiEditInput).eq(0).click()
                cy.get(authoring.common.multiEditInputType).eq(0).type("Index, Follow" + "\n")
                cy.get(authoring.common.multiEditInput).eq(1).click()
                cy.get(authoring.common.multiEditInputType).eq(1).type("Default" + "\n")       
                cy.contains('span', "Update").click()

            })    
                cy.contains('a', explore1.name).click()
                cy.contains('label', "Appearance").next().should('have.text', "Default")
                cy.contains('label', "Search Engine Directive").next().should('have.text', "Index, Follow")
                
                cy.go("back")
                cy.contains('span', folderName).click()
                cy.contains('a', explore2.name).click()
                cy.contains('label', "Appearance").next().should('have.text', "Default")
                cy.contains('label', "Search Engine Directive").next().should('have.text', "Index, Follow")

                cy.go("back")
                cy.contains('span', folderName).click()
                cy.contains('a', explore3.name).click()
                cy.contains('label', "Appearance").next().should('have.text', "Default")
                cy.contains('label', "Search Engine Directive").next().should('have.text', "Index, Follow")
    })
             
    it('Move Option For Multi-Select In Target/Recommend', function() {
        authoring.common.login();
        authoring.explore.visit();
        cy.contains('span', folderName).click()
        cy.wait(2000)
        cy.contains("div",folderName,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('3')
        })
        cy.contains('td', explore1.name).prev().click()
        cy.contains('td', explore2.name).prev().click()
        cy.contains('td', explore3.name).prev().click()
        cy.get('#pf-multi-select-move-to').should("exist").click()
        cy.get(authoring.common.antModal).should("exist").within(()=>{
            cy.get(authoring.common.multiEditInput).click()
             cy.get(authoring.common.multiEditInputType).type("Root" + "\n")
             cy.wait(200)
            cy.contains('span', "Update").click()

        })
        cy.wait(2000)
        cy.contains("div",folderName,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('0')
        })

        cy.contains('span', "Root").click()
        cy.contains('td', explore1.name).prev().click()
        cy.contains('td', explore2.name).prev().click()
        cy.contains('td', explore3.name).prev().click()
        cy.get('#pf-multi-select-move-to').should("exist").click()
        cy.get(authoring.common.antModal).should("exist").within(()=>{
            cy.get(authoring.common.multiEditInput).click()
             cy.get(authoring.common.multiEditInputType).type(folderName + "\n")
             cy.wait(200)
            cy.contains('span', "Update").click()

        })
        cy.wait(2000)
        cy.contains("div",folderName,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('3')
        })

    })
                
})