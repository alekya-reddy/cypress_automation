import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const event = {
    name: 'micrositeSearchDirective1.js'
}
const noevent = 'kinjal'

const event1 = {
    name: 'AddedByFilterAuthor.js'
}

describe("Microsites - Added By and Search filter", ()=>{
    it("Added By and Search filters should work", ()=>{
        authoring.common.login()
        authoring.microsites.visit()
        //This will check added by and search filter functionality together
        cy.get(authoring.microsites.clickAddedBy).click()
        cy.get(authoring.microsites.addedbyButton).contains('cy-admin').click()
        cy.get(authoring.microsites.searchButton).click().type(event.name)
        cy.contains(event.name).should('exist')
        cy.get(authoring.microsites.addedBycancel).click()
        cy.get(authoring.microsites.clearSearch).click()
        cy.get(authoring.microsites.clickAddedBy).click()
        cy.get(authoring.microsites.addedbyButton).contains('cy-author').click()
        cy.get(authoring.microsites.searchButton).click().type(event1.name)
        cy.contains(event1.name).should('exist')
        cy.get(authoring.microsites.clearSearch).click()
        //This is to verify no microsites found msg by  
        cy.get(authoring.microsites.searchButton).click().type(noevent)
        cy.contains(authoring.microsites.noMicrositeFound).should('exist')
        
})

})