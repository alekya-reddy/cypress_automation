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
    name: 'header.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'header-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Explore - Header feature", () => {

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

    it("Add, override and remove Header", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplore(explore.name)
        // turn header toggle on and override headet title
        authoring.common.toggle(authoring.explore.pageSidebar.headerToggle, 'ON')
        authoring.explore.setHeaderOverrides('Automation Headline')
        
        // verify on consumption header title changed
        cy.visit(explore.url)
        cy.contains(consumption.explore.headerTitle, 'Automation Headline')

        // go back to authoring and remove override title
        authoring.explore.visit()
        authoring.explore.goToExplore(explore.name)
        cy.get(authoring.explore.header.headerOverrides).click()
        cy.get(authoring.explore.modal).within(() => {
            cy.get(authoring.explore.header.headerTitle).clear()
            cy.contains('button', 'Save Header Overrides').click()
        })

        // verify on consumption that header title fallback to default value, which is 'Recommended Content' 
        cy.visit(explore.url)
        cy.contains(consumption.explore.headerTitle, 'Recommended Content')   
    })
})


