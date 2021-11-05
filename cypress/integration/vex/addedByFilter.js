import { createAuthoringInstance ,createConsumptionInstance} from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'AddedbyfilterTest.js'
}
const nonexistingevent = 'noevent'

const event1 = {
    name: 'AddedbyfilterTestAuthor.js'
}

const Vex = {
    name: 'eventslug.js',
    slug: 'eventslug-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
}

const string = {
    name: 'events'
}

describe("VEX - Added By and Search filter", ()=>{
    it("Added By and Search filters should work", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        cy.get(authoring.vex.clickAddedBy).click()
        cy.get(authoring.vex.addedbyButton).contains('cy-admin').click()

        //all VEX page that has the string in name or slug will return as search results 
        cy.get(authoring.vex.eventsearchButton).click().type(event.name)
        cy.contains(event.name).should('exist')
        cy.get(authoring.vex.addedBycancel).click()
        cy.get(authoring.vex.clearSearch).click()
        cy.get(authoring.vex.clickAddedBy).click()
        cy.get(authoring.vex.addedbyButton).contains('cy-author').click()
        cy.get(authoring.vex.eventsearchButton).click().type(event1.name)
        cy.contains(event1.name).should('exist')
        cy.get(authoring.vex.clearSearch).click()
        
        cy.get(authoring.vex.eventsearchButton).click().type(nonexistingevent)
        cy.contains(authoring.vex.noEventFoundmsg).should('exist')
        cy.get(authoring.vex.clearSearch).click()
    })
        
        it("Search VEX with slug", ()=>{
            cy.request({url: Vex.url, failOnStatusCode: false}).then((response)=>{
                if(response.status == 404){ 
                    authoring.common.login()
                    authoring.vex.visit()
                    authoring.vex.addVirtualEvent(Vex)
                }
            })
            
            authoring.common.login()
            authoring.vex.visit()
            //only VEX with exact slug should return as search results
            cy.get(authoring.vex.eventsearchButton).click().type(Vex.slug)
            cy.contains(Vex.name).should('exist')
            cy.get(authoring.vex.clearSearch).click()

            //all VEX page that has the string in name or slug will return as search results 
            cy.get(authoring.vex.eventsearchButton).click().type(string.name)
            cy.get('tr[class="ant-table-row ant-table-row-level-0"]').should('exist').should('contain', string.name)

 })

})