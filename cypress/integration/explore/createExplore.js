import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'sharedTarget',
    contents: [webContent.title, youtubeContent.title],
    // get url(){
    //     return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    // }
}

const recommend = {
    name: 'sharedRecommend',
    contents: ["Do-Not-Edit Cisco Systems - Wikipedia", "Do-Not-Edit Capybara - Wikipedia"],
    // get url(){
    //     return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    // }
}

const exploreTarget = {
    name: 'createExploreTarget.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'createexploret',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}

const exploreRecommend = {
    name: 'createExploreRecommend.js',
    experienceType: 'Recommend',
    trackName: recommend.name,
    slug: 'createexplorer',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}

describe("Explore - create new explore", () => {
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
        cy.contains("a", exploreTarget.name).click()
        cy.containsExact("h1", exploreTarget.name, {timeout: 10000}).should("exist")

        // Verify consumption
        cy.visit(exploreTarget.url)
        cy.contains(consumption.explore.hero.heroTitle, "Browse our Content")

        // Check that target tracks are there
        target.contents.forEach(content => {
            cy.contains('.pf-explore-grid-container', content).should("exist")
        })

        // Edit Explore page name 

        // Edit track

        // Check consumption

        // Delete Explore page
        
        



    })
})


