import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const recommend = {
    name: 'ctaTest.js',
    slug: 'ctatest-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },

}


    const cta0 = 
        {
            ctaNumber: "CTA 1",
            ctaName: "formCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e"

        }
        const cta1 = 
        {
            ctaNumber: "CTA 2",
            ctaName: "linkCTA",
            location: "After assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e"

        }
        const cta2 = 
        {
            ctaNumber: "CTA 3",
            ctaName: "dynamicFieldMergeRecommend.js",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e"

        }


describe("Explore CTA buttons", () => {
it("Add and delete CTA buttons", () => {
    authoring.common.login()
    authoring.recommend.visit()
    authoring.recommend.goToTrack(recommend.name)
    // turn CTA toggle ON
    authoring.common.toggle(authoring.recommend.pageSidebar.topicSidebarToggle, 'ON')    
    authoring.recommend.configureTopicSidebar(cta0)
    //cy.contains('div', "+ Add CTA").click({force: true})
    cy.wait(100)
    authoring.recommend.configureTopicSidebar(cta1)
    cy.wait(100)
    //cy.contains('div', "+ Add CTA").click({force: true})
    cy.wait(100)
    authoring.recommend.configureTopicSidebar(cta2)

})
it("Add and delete CTA buttons", () => {
    authoring.common.login()
    authoring.recommend.visit()
    authoring.recommend.goToTrack(recommend.name)
    // turn CTA toggle ON
    authoring.common.toggle(authoring.recommend.pageSidebar.sidebarToggle, 'ON')    
    authoring.recommend.configureTopicSidebar1(cta0)
    //cy.contains('div', "+ Add CTA").click({force: true})
    cy.wait(100)
    authoring.recommend.configureTopicSidebar1(cta1)
    cy.wait(100)
    //cy.contains('div', "+ Add CTA").click({force: true})
    cy.wait(100)
    authoring.recommend.configureTopicSidebar1(cta2)

})
})