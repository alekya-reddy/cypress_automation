import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const linkandshare = {
    name: 'linkAndShareFlow.js'
}

const recommend = {
    name: 'recommend-link&share.js',
}

describe("Add LinksandShare and Verify Tracks On Sidebar", () => {
    it("Configure Recommend With LinksandShare", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.linksAndSharings).should("exist")
        authoring.configurations.deleteLinksAndSharing("test123")
        authoring.configurations.addLinksAndSharing("test123")

        cy.contains('Not added to any Recommend Tracks').should('exist')
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)

        authoring.recommend.addLinksAndShare("linkAndShareFlow.js") 
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.get(authoring.common.pageContainer).contains('linkAndShareFlow.js').click()
        
        cy.containsExact("div", recommend.name).parent().click({force: true})
        cy.get(authoring.recommend.pageControl).should('exist')
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
