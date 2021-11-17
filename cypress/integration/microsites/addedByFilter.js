import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const event = {
    name: 'AddedbyfilterTest.js'
}
const nonexistingevent = 'noevent'

const event1 = {
    name: 'AddedByFilterAuthor.js'
}

const Microsites = {
    name: 'eventslug.js',
    slug: 'eventslug-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}

const string = {
    name: 'event'
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
        cy.get(authoring.microsites.searchButton).click().type(nonexistingevent)
        cy.contains(authoring.microsites.noMicrositeFound).should('exist')
        
})

          it("Search Microsite with slug", ()=>{
          cy.request({url: Microsites.url, failOnStatusCode: false}).then((response)=>{
              if(response.status == 404){ 
                  authoring.common.login()
                  authoring.microsites.visit()
                  authoring.microsites.addMicrosite(Vex)
        }
    })
                 authoring.common.login()
                 authoring.microsites.visit()
                //only Microsite with exact slug should return as search results
                 cy.get(authoring.microsites.searchButton).click().type(Microsites.slug)
                 cy.contains(Microsites.name).should('exist')
                 cy.get(authoring.microsites.clearSearch).click()

                //all Microsite page that has the string in name or slug will return as search results 
                 cy.get(authoring.microsites.searchButton).click().type(string.name)
                 cy.get('tr[class="ant-table-row ant-table-row-level-0"]').should('exist').should('contain', string.name)
    })

})