import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const linkandshare = {
    name: 'linkAndShareFlow.js'
}

const target = {
    name: 'target-link&share.js',

}

describe("Add LinksandShare and Verify Tracks On Sidebar", () => {
    it("Configure Target With LinksandShare", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.linksAndSharings).should("exist")
        authoring.configurations.deleteLinksAndSharing("linkAndShareFlow.js")
        authoring.configurations.addLinksAndSharing("linkAndShareFlow.js")

        cy.contains('Not added to any Target Tracks').should('exist')
        authoring.target.visit()
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        authoring.target.configure(target)

        authoring.target.addLinksAndShare("linkAndShareFlow.js") 
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.get(authoring.common.pageContainer).contains('linkAndShareFlow.js').click()
        cy.get('h5').contains('Last updated').should("exist")

        cy.containsExact("div", target.name).parent().click({force: true})
        cy.get(authoring.target.pageControl).should('exist')
        cy.go('back', {timeout:5000})

    })

        it('Date',()=>{

         authoring.configurations.lastUpdatedDate()
         cy.get(authoring.configurations.updatedDate, { timeout: 15000 }).invoke('text').then(dateText => {
           //I have used javascript function directly to match date on UI
         const today = authoring.configurations.lastUpdatedDate();
         expect(Date.parse(dateText)).to.be.lte(Date.parse(today));
                 })
           })
    })
