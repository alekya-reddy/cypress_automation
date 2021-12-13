import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const content1 = contents["3-featuredContentLayout.js"]
const content2 = contents["Cup - Wikipedia"]
const content3 = contents["Automation B2 Bpdf"]

const recommend = {
    name: 'carouselRec',
    contents: ["3-featuredContentLayout.js", "Cup - Wikipedia", "Do-Not-Edit Capybara - Shared Resource"]
};

const topics = ["Computing", "Software", "Marketing"]

const exploreRecommend = {
    name: 'Carousel Feature',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'carousel-feature',
    appearance:'carouselview',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Explore - create new explore", () => {

    it("Add Explore and featured content", () => {
        authoring.common.login()
        authoring.explore.visit() 
        authoring.explore.deleteExplore(exploreRecommend.name)
        authoring.explore.addExplore(exploreRecommend)
        authoring.explore.configureExplore(exploreRecommend)        
        recommend.contents.forEach((content) => {
          authoring.explore.setFeaturedContent(content)
        })
        cy.contains('button', "Save Assets").click()
        cy.contains(authoring.common.modal, "Manage Featured Content").should("not.exist")
    })

    it("Add topics into carousel without exluding featured content and verify that contents visible on authoring and consumption side", () => {
        authoring.common.login()
        authoring.explore.visit() 
        authoring.explore.goToExplorePage(exploreRecommend.name)
        cy.wait(200)
        topics.forEach((topic) => {
            authoring.explore.addTopicCarousel(topic)
  })
          cy.contains('button', "Save Topic Carousels").click()
          cy.contains(authoring.common.modal, "Manage Topic Carousels").should("not.exist")
          cy.wait(500)
            cy.get(authoring.explore.featuredContent).within(()=>{
            cy.contains('div', recommend.contents[0]).should("exist")
            cy.contains('div', recommend.contents[1]).should("exist")
            cy.contains('div', recommend.contents[2]).should("exist")
 })
        cy.get(authoring.explore.topicCarousel).within(()=>{
        cy.contains('div', recommend.contents[0]).should("exist")
        cy.contains('div', recommend.contents[1]).should("exist")
        cy.contains('div', recommend.contents[2]).should("exist")
 })  
   
       cy.visit(exploreRecommend.url)
       cy.contains('div', recommend.contents[0]).should("exist")
       cy.contains('div', recommend.contents[1]).should("exist")
       cy.contains('div', recommend.contents[2]).should("exist")
 })
    it("Exclude contents from topic carousel and verify that content not visible on authoring and consumption side", () => {
        authoring.common.login()
        authoring.explore.visit() 
        authoring.explore.goToExplorePage(exploreRecommend.name)
        cy.wait(500)
        cy.get(authoring.explore.editTopicCaousel).click()
        cy.get(authoring.common.checkboxContainer).contains("Exclude featured assets from topic carousel", {timeout: 30000} ).click()
        cy.contains('button', "Save Topic Carousels").click()
        cy.contains(authoring.common.modal, "Manage Topic Carousels").should("not.exist")
        cy.wait(500)
        cy.get(authoring.explore.topicCarousel).within(()=>{
            cy.contains('div', recommend.contents[0]).should("not.exist")
            cy.contains('div', recommend.contents[1]).should("not.exist")
            cy.contains('div', recommend.contents[2]).should("not.exist")
       })  
           
       cy.visit(exploreRecommend.url)
           cy.contains('div', recommend.contents[0]).should("not.exist")
           cy.contains('div', recommend.contents[1]).should("not.exist")
           cy.contains('div', recommend.contents[2]).should("not.exist")
    })

})