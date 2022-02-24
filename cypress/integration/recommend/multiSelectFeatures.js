import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})

const recommend1 = {
    name: "MultiEdit1",
}

const recommend2 = {
    name: "MultiEdit2",
}

const recommend3 = {
    name: "MultiEdit3",
}

const folderName = "MultiSelectFeatures"
const SearchEngineValue = "Index, Follow"
const appearanceValue = "Default"
const languageValue = "English"
const linksSharingValue = "Default"

    
describe('Target/Recommend Multi-Select', function() {
        it('Bulk Update For Multi-Select In Target/Recommend', function() {
            authoring.common.login();
            authoring.recommend.visit();
            cy.contains('span', folderName).click()
            cy.contains('td', recommend1.name).prev().click()
            cy.contains('td', recommend2.name).prev().click()
            cy.contains('td', recommend3.name).prev().click()
            cy.get(authoring.common.multiEditIcon).should("exist").click()
            cy.get(authoring.common.antModal).should("exist").within(()=>{
                cy.contains('label', "Search Engine Directive").should("exist")
                cy.contains('label', "Appearance").should("exist")
                cy.contains('label', "Language").should("exist")
                cy.contains('label', "Links and Sharing").should("exist")
                cy.get(authoring.common.multiEditInput).eq(0).click()
                cy.get(authoring.common.multiEditInputType).eq(0).type("Index, Follow" + "\n")
                cy.get(authoring.common.multiEditInput).eq(1).click()
                cy.get(authoring.common.multiEditInputType).eq(1).type("Default" + "\n")
                cy.get(authoring.common.multiEditInput).eq(2).click()
                cy.get(authoring.common.multiEditInputType).eq(2).type("English" + "\n")
                cy.get(authoring.common.multiEditInput).eq(3).click()
                cy.get(authoring.common.multiEditInputType).eq(3).type("Default" + "\n")        
                cy.contains('span', "Update").click()

            })    
                cy.contains('a', recommend1.name).click()
                cy.contains('label', "Appearance").next().should('have.text', "Default")
                cy.contains('label', "Language").next().should('have.text', "English")
                cy.contains('label', "Links & Sharing").next().should('have.text', "Default")
                cy.contains('label', "Search Engine Directive").next().should('have.text', "Index, Follow")
                
                cy.go("back")
                cy.contains('a', recommend2.name).click()
                cy.contains('label', "Appearance").next().should('have.text', "Default")
                cy.contains('label', "Language").next().should('have.text', "English")
                cy.contains('label', "Links & Sharing").next().should('have.text', "Default")
                cy.contains('label', "Search Engine Directive").next().should('have.text', "Index, Follow")

                cy.go("back")
                cy.contains('a', recommend3.name).click()
                cy.contains('label', "Appearance").next().should('have.text', "Default")
                cy.contains('label', "Language").next().should('have.text', "English")
                cy.contains('label', "Links & Sharing").next().should('have.text', "Default")
                cy.contains('label', "Search Engine Directive").next().should('have.text', "Index, Follow")
    })
             
    it('Move Option For Multi-Select In Target/Recommend', function() {
        authoring.common.login();
        authoring.recommend.visit();
        cy.contains('span', folderName).click()
        cy.wait(2000)
        cy.contains("div",folderName,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('3')
        })
        cy.contains('td', recommend1.name).prev().click()
        cy.contains('td', recommend2.name).prev().click()
        cy.contains('td', recommend3.name).prev().click()
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
        cy.contains('td', recommend1.name).prev().click()
        cy.contains('td', recommend2.name).prev().click()
        cy.contains('td', recommend3.name).prev().click()
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