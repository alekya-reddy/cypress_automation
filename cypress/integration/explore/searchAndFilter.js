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

const targetExplore = {
    name: 'searchAndFilter.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'searchAndFilter-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Search and Filters validation - explore page", () => {

    it("Verify that by clicking on Edit we can modify track associated with the Explore page", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.deleteExplore(targetExplore.name)
        authoring.explore.addExplore(targetExplore)
        authoring.explore.configureExplore(targetExplore)
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(targetExplore.name)
        //authoring.explore.editExplore(recommendExplore)

        // cy.contains(authoring.explore.pageSidebar.container, `Recommend Track: ${recommend.name}`)

        // // Verify consumption
        // cy.visit(targetExplore.url)
        // target.contents.forEach(targetContent => {
        //     cy.contains(consumption.explore.body.card, targetContent).should("not.exist")
        // })
        // recommend.contents.forEach(recommendContent => {
        //     cy.contains(consumption.explore.body.card, recommendContent).should("exist")
        // })

        // authoring.explore.visit()
        // authoring.explore.goToExplorePage(targetExplore.name)
        // authoring.explore.editExplore(targetExplore)
        // cy.contains(authoring.explore.pageSidebar.container, `Target Track: ${target.name}`)

        // // Verify consumption
        // cy.visit(targetExplore.url)
        // target.contents.forEach(targetContent => {
        //     cy.contains(consumption.explore.body.card, targetContent).should("exist")
        // })
        // recommend.contents.forEach(recommendContent => {
        //     cy.contains(consumption.explore.body.card, recommendContent).should("not.exist")
        // })

    })

})