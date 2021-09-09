import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const appearance = {
    name: "appearance.js"
}

const recommend = {
    name: 'appearance.recommend',
}

const target = {
    name: 'appearance.target',
}

const target1 = {
    name: 'appearance.target1',
}

const explore = {
    name: 'appearance.explore',
    experienceType: "Target",
    trackName: target1.name

}

const microsites = {
    name: 'appearance.microsite',
    appearance: 'appearance.js'
}

const website = {
    url: "http://google.com/languages",
    enabled: "on"
}

const vex = {
    name: 'appearance.vex'
}

const domainName = "pathfactory-qa-wp.com"
const websitePath = "test"


describe("Add Appearance and Verify LastUpdated Date", () => {
    it("Add Appearance", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.appearances)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.appearances).should("exist")
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)

        cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
            cy.contains("Not added to any Recommend Tracks").should("exist")
            cy.contains("Not added to any Target Tracks").should("exist")
            cy.contains("Not added to any Explore Pages").should("exist")
            cy.contains("Not added to any Microsites").should("exist")
            cy.contains("Not added to any Website Tools Pages").should("exist")
            cy.contains("Not added to any Website Campaign Pages").should("exist")
            cy.contains("Not added to any Virtual Events").should("exist")

            })

        it('LastUpdated Date',()=>{

         authoring.configurations.lastUpdatedDate()
         cy.get(authoring.configurations.updatedDate, { timeout: 15000 }).invoke('text').then(dateText => {
        //I have used javascript function directly to match date on UI
         const today = authoring.configurations.lastUpdatedDate();
         expect(Date.parse(dateText)).to.be.lte(Date.parse(today));
                        })
                  })
   })

   it("Add appearance to all tools", () => {
       authoring.common.login()
      authoring.recommend.visit()
      authoring.recommend.deleteTrack(recommend.name)
      authoring.recommend.addTrack(recommend)
       authoring.recommend.setAppearance(appearance.name)

      authoring.target.visit()
      authoring.target.deleteTrack(target.name)
      authoring.target.addTrack(target)
      authoring.target.setAppearance(appearance.name)

      authoring.explore.visit()
      authoring.explore.deleteExplore(explore.name)
      authoring.explore.addExplore(explore)
      authoring.explore.setAppearance(appearance.name)

    authoring.microsites.visit()
    authoring.microsites.removeMicrosite(microsites.name)
    authoring.microsites.addMicrosite(microsites)
    authoring.microsites.goToMicrositeConfig(microsites.name)
    authoring.microsites.setup(microsites)

    authoring.website.visit()
    cy.contains(authoring.common.pageTitleLocator, authoring.website.websiteCampaignsPageTitle).should("exist")
    authoring.website.deleteWebsite(website.url)
    authoring.website.addWebsite(website.url)
    authoring.website.configureWebsite(website)
    authoring.website.setAppearance(appearance.name)

    authoring.vex.visit()
    authoring.vex.deleteVirtualEvent(vex.name)
    authoring.vex.addVirtualEvent(vex)
    authoring.vex.goToEventConfig(vex.name)
    cy.containsExact("a", "Appearance Setup", { timeout: 20000 }).click()
    cy.get(authoring.vex.searchItem).should('be.visible').click({ force: true })
    cy.get(authoring.vex.searchInput).type(appearance.name + "\n", {force: true})
    cy.contains('button:visible', "Save").click()

    authoring.websiteTools.visit()
    cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
        cy.contains("button", "Delete").click()
    })
    cy.contains(authoring.common.antModal, "Are you sure?").contains("button", "Delete").click()
    cy.get(authoring.websiteTools.addProperty).click()
        cy.get(authoring.websiteTools.antModal).within(() => {
            cy.get(authoring.websiteTools.enterDomainName).type(domainName)
            cy.get(authoring.websiteTools.addProperty).click()
        })
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.contains("a","Add Website Path").click()
        cy.get(authoring.websiteTools.websitePath).type(websitePath)
        cy.contains("span","Guide").click()
        cy.contains("span","Concierge").click()
        cy.get(authoring.websiteTools.selectOpen).eq(0).type(appearance.name+ '\n')
        cy.contains("span","Save").click()

 })

 it("Verify Added Appearance To Appearance Sidebar", () => {
    authoring.common.login()
    cy.visit(authoring.configurations.pageUrls.appearances)
    
    cy.get(authoring.configurations.appearances.searchforAppearance).contains(appearance.name).click()
    cy.containsExact("div", recommend.name).parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, recommend.name, {timeout: 5000})
    cy.go('back')

    cy.containsExact("div", target.name).parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, target.name, {timeout: 5000})
    cy.go('back')

    cy.containsExact("div", explore.name).parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, explore.name, {timeout: 5000})
    cy.go('back')

    cy.containsExact("div", microsites.name).parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, microsites.name, {timeout: 5000})
    cy.go('back')

    cy.containsExact("div", website.url).parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, 'Website Campaigns', {timeout: 5000})
    cy.go('back')

    cy.containsExact("div", vex.name).parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, vex.name, {timeout: 5000})
    cy.go('back')

    cy.containsExact("div", 'pathfactory-qa-wp.com/test').parent().click({force: true})
    cy.containsExact(authoring.common.pageTitleLocator, domainName, {timeout: 5000})
    cy.go('back')

 })

})