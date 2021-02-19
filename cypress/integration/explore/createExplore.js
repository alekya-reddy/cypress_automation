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

const recommend = {
    name: 'sharedRecommend',
    contents: ["Do-Not-Edit Cisco Systems - Shared Resource", "Do-Not-Edit Capybara - Shared Resource"]
};

const exploreTarget = {
    name: 'Target createExplore.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'createexploret',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const exploreRecommend = {
    name: 'Recommend createExplore.js',
    experienceType: 'Recommend',
    trackName: recommend.name
};

describe("Explore - create new explore", () => {

    it("Delete Explore Pages if exist", () => {
        authoring.common.login()
        authoring.explore.visit() 
        authoring.explore.deleteExplore(exploreTarget.name)
        authoring.explore.deleteExplore(exploreRecommend.name)
    })

    it("Create new Explore page validation", () => {
        authoring.common.login()
        authoring.explore.visit()   
        cy.contains("button", "Create Explore Page").click()
        cy.contains(authoring.common.modal, "Create Explore Page").within(()=>{
            // Verify creating a blank page
            cy.contains("button", "Create Explore Page").click()
            cy.contains("can't be blank")
            cy.contains("Must select an experience")
            // Verify creating explore with existing name
            cy.get(authoring.explore.createExploreModal.nameInput).clear().type("cloneExplore.js")
            cy.contains("button", "Create Explore Page").click()
            cy.contains("has already been taken")  
        })      
    })

    it("Create new Explore page and check consumption", () => {
        authoring.common.login()
        authoring.explore.addExplore(exploreTarget)
        authoring.explore.configureExplore(exploreTarget)
        
        cy.contains("label", "Target Track: ").click()
        cy.containsExact("h1", target.name, {timeout: 10000}).should("exist")
        // Make sure Explore page is added to selected Track
        cy.contains("a", exploreTarget.name).click()
        cy.containsExact("h1", exploreTarget.name, {timeout: 10000}).should("exist")

        // Verify consumption
        cy.visit(exploreTarget.url)
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        // Check that target tracks are there
        target.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content).should("exist")
        })
        // Click on a card
        cy.contains(consumption.explore.body.card, webContent.title).click()
        // Redirected to the track
        cy.contains("span", webContent.title).should("exist")
        // Click on 'Home' button
        cy.get(consumption.common.backToHomePageButton).click()
        // Explore page is shown
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        // Edit Explore page name and Edit track
        authoring.explore.visit()
        authoring.explore.goToExplore(exploreTarget.name)
        authoring.explore.editExplore(exploreRecommend) // includes verification

        // Veify that explore with previous name doesn't exist
        cy.get(authoring.common.pageControls).within(()=>{
            cy.containsExact("a", "Explore Pages").click()
        })
        cy.get(authoring.common.pageSearch).clear().type(exploreTarget.name)
        cy.containsExact(authoring.common.table.cellName, exploreTarget.name).should("not.exist")

        // Check consumption, we haven't changed slug
        cy.visit(exploreTarget.url)
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        // Check that recommend tracks are there
        recommend.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content).should("exist")
        })
        // Click on a card
        cy.contains(consumption.explore.body.card, recommend.contents[0]).click()
        // Redirected to the track
        cy.contains(consumption.recommend.topicSidebarHeaderTitle, recommend.contents[0]).should("exist")
        // Click on 'Home' button
        cy.get(consumption.common.backToHomePageButton).click()
        // Explore page is shown
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        // Delete Explore page
        authoring.explore.visit()
        authoring.explore.deleteExplore(exploreRecommend.name)
    })
})


