import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const appearance = {
    name: "fontStyle.js"
}
const DefaultTabsColor = "rgb(33, 53, 66)"

describe("Appearances controls for Guide", () => {
    it("Appearances controls for Guide", () => {
        authoring.common.login()
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)
        cy.visit(authoring.configurations.pageUrls.guide)
        cy.contains('div', appearance.name).should("exist").click()
        cy.contains('b', "Guide Settings").should("exist")
        cy.contains('label', "Guide background color").should("exist")
        cy.contains('label', "Recommendation tab font style").should("exist")
        
        //Ensure that recommendationTabs color applied to For You and Trending tabs
        cy.get(authoring.configurations.appearances.recommendationTabsColor).should("have.css", "background-color", DefaultTabsColor)
        cy.get(authoring.configurations.appearances.ForYouTabForGuide).should("have.css", "color", DefaultTabsColor)
        cy.get(authoring.configurations.appearances.TrendingTabForGuide).should("have.css", "color", DefaultTabsColor)

        //Ensure that by default, the color of this control should match the color selected by a customer in headline background color
        cy.get(authoring.configurations.appearances.buttonBackgroundColorForGuide).should("have.css", "background-color", DefaultTabsColor)

        //Updated the labels
        cy.contains('label', "Button background color").should("exist")
        cy.contains('label', "Button font style").should("exist")
        cy.contains('label', "Content font style").should("exist")
        cy.contains('label', "Thumbnail aspect ratio (width)").should("exist")
        cy.contains('label', "Thumbnail aspect ratio (height)").should("exist")
        cy.contains('label', "Image fallback").should("exist")

    })
})