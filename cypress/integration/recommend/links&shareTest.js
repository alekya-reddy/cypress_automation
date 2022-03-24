import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const linkandshare = {
    name: 'linkAndShareFlow.js'
}

const recommend = {
    name: 'recommend-link&share.js',
    slug: 'linkandshare-js',
    contents: [webContent.title],
    header: "on",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/commonresource`
    }
}

describe("Add LinksandShare and Verify Tracks On Sidebar", () => {
    it("Configure Recommend With LinksandShare", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.linksAndSharings).should("exist")
        authoring.configurations.deleteLinksAndSharing("linkAndShareFlow.js")
        authoring.configurations.addLinksAndSharing("linkAndShareFlow.js")
        cy.get('#emailSubject').type("Test Email Subject")
        cy.get('label[for="emailEnabled"]').siblings('div').click()            
        cy.contains('Not added to any Recommend Tracks').should('exist')
        cy.contains('button', "Save").click()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)

        authoring.recommend.addLinksAndShare("linkAndShareFlow.js") 
        cy.visit(recommend.url)
        cy.get('#email-button').should('exist')
//we won't be able to automate if email subject text appears or not as it opens third party window
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
