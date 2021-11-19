import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'publicTitle.js',
    contents: [webContent.title, youtubeContent.title]
};

const explore = {
    name: 'publicTitle.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'publictitle-js',
    heroTitle: 'Original Title',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Explore - Change Public Title", () => {

    it("Set up if not already done", ()=>{
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Change Public Title value", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        // change page title and verify consumption
        authoring.explore.setPageTitle('Wonderful Title')

        cy.visit(explore.url)
        cy.title().should('eq', 'Wonderful Title')

        // go back to authoring and remove public title - explore hero Title should be shown
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        cy.get(authoring.explore.pageSidebar.pageTitleLabel).siblings("span").click()
        cy.get(authoring.explore.popover).get(authoring.explore.popoverElements.pageTitleInput).clear()
        cy.contains('button', 'Update').click()

        cy.visit(explore.url)
        //cy.title().should('eq', explore.heroTitle)
        cy.title().should('eq', explore.name)

    })
})


