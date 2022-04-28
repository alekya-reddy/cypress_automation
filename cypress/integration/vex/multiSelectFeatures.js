import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-vex", tld: "lookbookhq"})

const vex1 = {
    name: "MultiEdit1",
}

const vex2 = {
    name: "MultiEdit2",
}

const vex3 = {
    name: "MultiEdit3",
}

const folderName = "MultiSelectFeatures"
const searchEngineValue = "Index, Follow"
const appearanceValue = "Default"
const languageValue = "English"

    
describe('Explore Multi-Select', function() {
        it('Bulk Update For Multi-Select In VEX', function() {
            authoring.common.login();
            authoring.vex.visit();
            cy.contains('span', folderName).click()
            cy.contains('td', vex1.name).prev().click()
            cy.contains('td', vex2.name).prev().click()
            cy.contains('td', vex3.name).prev().click()
            cy.get(authoring.common.multiEditIcon).should("exist").click()
            cy.get(authoring.common.antModal).should("exist").within(()=>{
                cy.contains('label', "Search Engine Directive").should("exist")
                cy.contains('label', "Appearance").should("exist")
                cy.get(authoring.common.multiEditInput).eq(0).click()
                cy.get(authoring.common.multiEditInputType).eq(0).type("Index, Follow" + "\n")
                cy.get(authoring.common.multiEditInput).eq(1).click()
                cy.get(authoring.common.multiEditInputType).eq(1).type(appearanceValue + "\n")      
                cy.get(authoring.common.multiEditInput).eq(2).click()
                cy.get(authoring.common.multiEditInputType).eq(2).type(languageValue + "\n")   
                cy.contains('span', "Update").click()

            })    
                cy.contains('a', vex1.name).click()
                cy.contains('div', "Search Engine Directive").next().should('have.text', searchEngineValue)
                cy.contains('div', "Language").next().should('have.text', languageValue)
                
                cy.go("back")
                cy.contains('a', vex2.name).click()
                cy.contains('div', "Search Engine Directive").next().should('have.text', searchEngineValue)
                cy.contains('div', "Language").next().should('have.text', languageValue)


                cy.go("back")
                cy.contains('a', vex3.name).click()
                cy.contains('div', "Search Engine Directive").next().should('have.text', searchEngineValue)
                cy.contains('div', "Language").next().should('have.text', languageValue)
    })
             
    it('Move Option For Multi-Select In VEX', function() {
        authoring.common.login();
        authoring.vex.visit();
        cy.contains('span', folderName).click()
        cy.wait(2000)
        cy.contains("div",folderName,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('3')
        })
        cy.contains('td', vex1.name).prev().click()
        cy.contains('td', vex2.name).prev().click()
        cy.contains('td', vex3.name).prev().click()
        cy.get(authoring.common.multiMoveIcon).should("exist").click()
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
        cy.contains('td', vex1.name).prev().click()
        cy.contains('td', vex2.name).prev().click()
        cy.contains('td', vex3.name).prev().click()
        cy.get(authoring.common.multiMoveIcon).should("exist").click()
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
