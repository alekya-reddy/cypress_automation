import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'AddedbyfilterTest.js'
}
const noevent = 'kinjal'

const event1 = {
    name: 'AddedbyfilterTestAuthor.js'
}

describe("VEX - Added By and Search filter", ()=>{
    it("Added By and Search filters should work", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        cy.get(authoring.vex.clickAddedBy).click()
        cy.get(authoring.vex.addedbyButton).contains('cy-admin').click()
        cy.get(authoring.vex.eventsearchButton).click().type(event.name)
        cy.contains(event.name).should('exist')
        cy.get(authoring.vex.addedBycancel).click()
        cy.get(authoring.vex.clearSearch).click()
        cy.get(authoring.vex.clickAddedBy).click()
        cy.get(authoring.vex.addedbyButton).contains('cy-author').click()
        cy.get(authoring.vex.eventsearchButton).click().type(event1.name)
        cy.contains(event1.name).should('exist')
        cy.get(authoring.vex.clearSearch).click()
        
        cy.get(authoring.vex.eventsearchButton).click().type(noevent)
        cy.contains(authoring.vex.noEventFoundmsg).should('exist')
        cy.get(authoring.vex.clearSearch).click()
        

 })

})