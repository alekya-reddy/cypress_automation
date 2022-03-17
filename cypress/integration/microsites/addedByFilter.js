import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const microsite = {
    name: 'AddedbyfilterTest.js'
}
const nonexistingmicrosite = 'noevent'

const microsite1 = {
    name: 'AddedByFilterAuthor.js'
}

const microsite2 = {
    name: 'deleteMicrosite2.js'
}

const microsite3 = {
    name: 'deleteMicrosite3.js'
}

const microsite4 = {
    name: 'deleteMicrosite4.js'
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
        cy.get(authoring.microsites.searchButton).click().type(microsite.name)
        cy.contains(microsite.name).should('exist')
        cy.get(authoring.microsites.addedBycancel).click()
        cy.get(authoring.microsites.clearSearch).click()
        cy.get(authoring.microsites.clickAddedBy).click()
        cy.get(authoring.microsites.addedbyButton).contains('cy-author').click()
        cy.get(authoring.microsites.searchButton).click().type(microsite1.name)
        cy.contains(microsite1.name).should('exist')
        cy.get(authoring.microsites.clearSearch).click()
        //This is to verify no microsites found msg by  
        cy.get(authoring.microsites.searchButton).click().type(nonexistingmicrosite)
        cy.contains(authoring.microsites.noMicrositeFound).should('exist')
        
})

          it("Search Microsite with slug", ()=>{
          cy.request({url: Microsites.url, failOnStatusCode: false}).then((response)=>{
              if(response.status == 404){ 
                  authoring.common.login()
                  authoring.microsites.visit()
                  authoring.microsites.removeMicrosite(Microsites.name)
                  authoring.microsites.addMicrosite(Microsites)
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

    it('Verify Delete Option For Multi-Select', function() {
        authoring.common.login();
        authoring.microsites.visit();
        authoring.microsites.addMicrosite(microsite2)
        authoring.microsites.addMicrosite(microsite3)
        authoring.microsites.addMicrosite(microsite4)
        cy.contains('td', microsite2.name).prev().click()
        cy.contains('td', microsite3.name).prev().click()
        cy.contains('td', microsite4.name).prev().click()
        cy.contains('h5', " Select: ").should("exist")
        cy.contains('h5', "3").should("exist")
        cy.contains('button', " Delete").should("exist").click()
        cy.get(authoring.common.modalBody).within(()=>{
            cy.contains('span', "Yes").should("exist").click()
        })
        cy.contains('td', microsite2.name).should("not.exist")
        cy.contains('td', microsite3.name).should("not.exist")
        cy.contains('td', microsite4.name).should("not.exist")

     })

})