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

const heroTitle = `Explore Hero Title ${Math.random().toString()}`
const heroSubtitle = `Explore Hero Subtitle ${Math.random().toString()}`


const exploreAppearanceSettings = {
    appearance: 'heroTextFields.js',
    name: 'heroTextFields.js',
    heroTitleFontFamily: "Arial",
    heroTitleBoldFont: true,
    heroTitleFontSize: "large",
    heroTitleFontColor: {r: 10, g: 20, b: 155},
    heroSubtitleFontFamily: "Roboto",
    heroSubtitleBoldFont: false,
    heroSubtitleFontSize: "medium",
    heroSubtitleFontColor: {r: 200, g: 50, b: 9}
}

const explore = {
    name: 'heroTextFields.js',
    experienceType: 'Target',
    trackName: target.name,
    slug: 'herotextfields-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const colorConfigToCSS = (colorConfig) => {
    const { r, g, b} = colorConfig
    const CSS = `rgb(${r}, ${g}, ${b})`
    return CSS;
}
const titleFontSizeToCSS = {small: "32px", medium: "38px", large: "44px"}
const subtitleFontSizeToCSS = {small: "21px", medium: "24px", large: "27px"}
const fontWeightToCSS = (bold) => { return bold ? "700" : "400" }


describe("Explore - Hero Text Fields settings are applied to Explore page", () => {

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

    it("Hero Text Fields settings are applied to Explore page", () => {
        
        authoring.common.login()
        cy.viewport(1450, 1024)
        authoring.configurations.visit.appearances()
        authoring.configurations.deleteAppearance(exploreAppearanceSettings.appearance)
        authoring.configurations.addNewAppearance(exploreAppearanceSettings)
        authoring.configurations.configureExploreAppearance(exploreAppearanceSettings)

        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        authoring.explore.setAppearance(exploreAppearanceSettings.name)

        cy.get(authoring.explore.heroTitleLocator).click()
        cy.get(authoring.explore.heroTitleInput).clear().type(heroTitle + "\n")

        cy.angryClick({
            clickElement: authoring.explore.heroSubtitleLocator,
            checkElement: authoring.explore.heroSubtitleInput
        })
        cy.get(authoring.explore.heroSubtitleInput).clear().type(heroSubtitle + "\n")

        cy.get(authoring.explore.heroTitleLocator)
        .should('have.text', heroTitle)
        .should("have.css", "color", colorConfigToCSS(exploreAppearanceSettings.heroTitleFontColor))
        .should("have.css", "font-size", titleFontSizeToCSS[exploreAppearanceSettings.heroTitleFontSize])
        .should("have.css", "font-weight", fontWeightToCSS(exploreAppearanceSettings.heroTitleBoldFont))
        .should("have.css", "font-family", exploreAppearanceSettings.heroTitleFontFamily)

        cy.get(authoring.explore.heroSubtitleLocator)
        .should('have.text', heroSubtitle)
        .should("have.css", "color", colorConfigToCSS(exploreAppearanceSettings.heroSubtitleFontColor))
        .should("have.css", "font-size", subtitleFontSizeToCSS[exploreAppearanceSettings.heroSubtitleFontSize])
        .should("have.css", "font-weight", fontWeightToCSS(exploreAppearanceSettings.heroSubtitleBoldFont))
        .should("have.css", "font-family", exploreAppearanceSettings.heroSubtitleFontFamily)

        // check consumption
        cy.visit(explore.url)

        cy.get(consumption.explore.hero.heroTitle)
        .should('have.text', heroTitle)
        .should("have.css", "color", colorConfigToCSS(exploreAppearanceSettings.heroTitleFontColor))
        .should("have.css", "font-size", titleFontSizeToCSS[exploreAppearanceSettings.heroTitleFontSize])
        .should("have.css", "font-weight", fontWeightToCSS(exploreAppearanceSettings.heroTitleBoldFont))
        .should("have.css", "font-family", exploreAppearanceSettings.heroTitleFontFamily)

        cy.get(consumption.explore.hero.heroSubtitle)
        .should('have.text', heroSubtitle)
        .should("have.css", "color", colorConfigToCSS(exploreAppearanceSettings.heroSubtitleFontColor))
        .should("have.css", "font-size", subtitleFontSizeToCSS[exploreAppearanceSettings.heroSubtitleFontSize])
        .should("have.css", "font-weight", fontWeightToCSS(exploreAppearanceSettings.heroSubtitleBoldFont))
        .should("have.css", "font-family", exploreAppearanceSettings.heroSubtitleFontFamily)

    })
})


