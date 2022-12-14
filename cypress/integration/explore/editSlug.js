import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'sharedTarget',
    contents: [webContent.title, youtubeContent.title]
};

const explore = {
    name: 'editSlug.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'editslug-js',
    newSlug: 'slug-custom',
    get url(){
        return `${authoring.common.baseUrl}/l/`
    }
};

const explorePage = {
    name: 'eventslug.js',
    experienceType: 'Target',
    trackName: 'sharedTarget',
    slug: 'eventslug-js',
    get url(){
        return `${authoring.common.baseUrl}/l/`
    }
};

const string = {
    name: 'events'
}

describe("Explore - Edit Slug", () => {

    it("Set up if not already done", ()=>{
        cy.request({url: explore.url + explore.slug, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Explore Page Slug (Custom URL) can be changed", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)

        // change to new slug and verify consumption
        authoring.explore.setCustomUrl(explore.newSlug)
        cy.visit(explore.url + explore.newSlug)
        // check that tracks are there
        target.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content).should("exist")
        })
        cy.contains(consumption.explore.body.card, webContent.title).click()
        // redirected to the track
        cy.contains("span", webContent.title).should("exist")
        // click on 'Home' button
        cy.get(consumption.common.backToHomePageButton).click()
        // explore home page is shown
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        // verify edit slug modal and Cancel edit
        cy.get(authoring.explore.pageSidebar.customUrlLabel).siblings("span").click()
        cy.get(authoring.explore.popover).get(authoring.explore.popoverElements.customUrlInput).clear().type(explore.slug + "\n")
        cy.get(authoring.explore.modal).within(()=>{
            cy.contains('h3', 'Are you sure you want to change the URL of this explore page?')
            cy.contains("button", "Cancel").click()
        })
        cy.get(authoring.explore.popover).within(()=>{
            cy.contains("button", "Cancel").click()
        })
        cy.get(authoring.explore.pageSidebar.customUrlLabel).siblings("span").should("contain", explore.newSlug)

        // change to nthe old slug and verify consumption
        authoring.explore.setCustomUrl(explore.slug)
        cy.visit(explore.url + explore.slug)
        // check that tracks are there
        target.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content).should("exist")
        })
        cy.contains(consumption.explore.body.card, webContent.title).click()
        // redirected to the track
        cy.contains("span", webContent.title).should("exist")
        // click on 'Home' button
        cy.get(consumption.common.backToHomePageButton).click()
        // explore home page is shown
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        // check that when visiting consumption with old slug 404 page is shown 
        cy.request({url: explore.url + explore.newSlug, failOnStatusCode: false}).then((response) => {
            console.log(response);
            expect(response.status).to.eq(404)
        })
    })

    it("Search Explore with slug", ()=>{
        cy.request({url: explorePage.url + explorePage.slug, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(explorePage)
      }
  })
               authoring.common.login()
               authoring.explore.visit()
               //all Explore page that has the string in name/slug will return as search results
               cy.get(authoring.explore.searchPage).click().type(explorePage.name)
               cy.contains(explorePage.name).should('exist')
               cy.get(authoring.explore.clearSearch).click()

              //only Microsite with exact slug should return as search results
               cy.get(authoring.explore.searchPage).click().type(explorePage.slug)
               cy.contains(explorePage.name).should('exist')
               cy.get(authoring.explore.clearSearch).click()

              //all Microsite page that has the string in name or slug will return as search results??
               cy.get(authoring.explore.searchPage).click().type(string.name)
               cy.get("td[class='ant-table-cell ant-table-cell-fix-left ant-table-cell-fix-left-last']").should('exist').should('contain', string.name)
   })

})

