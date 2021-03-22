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
    name: 'heroImages.js',
    experienceType: 'Target',
    trackName: target.name,
    appearance: 'heroImages.js',
    slug: 'heroimages-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

describe("Explore - Hero Image settings are applied to Explore page", () => {

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

    it("Explore Appearance Hero Image settings are applied to Explore page", () => {
        
        // verify Default setting for hero images + Fixed Cover Image
        authoring.common.login()
        cy.viewport(1450, 1024)
        authoring.configurations.visit.appearances()
        authoring.configurations.clickAppearance(explore.appearance)
        authoring.configurations.clickAppearanceTab("Explore")
        cy.get(authoring.explore.createExploreModal.dropdownSelect).eq(0).click()
        cy.get(authoring.explore.createExploreModal.dropdownSelectField).eq(0).type("Cover Image" + "\n")
        cy.contains('label', 'Fixed').click()

        let backgroundColor = null

        cy.get(authoring.configurations.appearances.explore.heroBackgroundColorPicker).invoke('css', 'background-color').then((heroBackgroundColor) => {
            backgroundColor = heroBackgroundColor
        })
        cy.contains("button", "Save Explore Settings").click()

        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        authoring.explore.setAppearance(explore.appearance)

        cy.get(authoring.explore.heroImages.backgroundImage).should('exist')
        cy.get(authoring.explore.heroImages.brandImage).should('not.exist')
        cy.get(authoring.explore.heroImages.partnerImage).should('not.exist')
        cy.get(authoring.explore.heroImages.personalizedImage).should('not.exist')

        // check consumption
        cy.visit(explore.url)

        cy.do(() => {
            cy.get(consumption.explore.hero.heroBackground).should('have.css', 'background-color', backgroundColor)
        })
        cy.get(consumption.explore.hero.fixedHeroImage).should('exist')
        cy.get(consumption.explore.hero.brandImage).should('not.exist')
        cy.get(consumption.explore.hero.partnerImage).should('not.exist')
        cy.get(consumption.explore.hero.personalizedImage).should('not.exist')

        // verify Branded Hero Image
        authoring.configurations.visit.appearances()
        authoring.configurations.clickAppearance(explore.appearance)
        authoring.configurations.clickAppearanceTab("Explore")
        cy.get(authoring.explore.createExploreModal.dropdownSelect).eq(0).click()
        cy.get(authoring.explore.createExploreModal.dropdownSelectField).eq(0).type("Branded" + "\n")
        cy.contains("button", "Save Explore Settings").click()

        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)

        cy.get(authoring.explore.heroImages.backgroundImage).should('exist')
        cy.get(authoring.explore.heroImages.brandImage).should('exist')
        cy.get(authoring.explore.heroImages.partnerImage).should('not.exist')
        cy.get(authoring.explore.heroImages.personalizedImage).should('not.exist')

        // check consumption
        cy.visit(explore.url)

        cy.get(consumption.explore.hero.fixedHeroImage).should('exist')
        cy.get(consumption.explore.hero.brandImage).should('exist')
        cy.get(consumption.explore.hero.partnerImage).should('not.exist')
        cy.get(consumption.explore.hero.personalizedImage).should('not.exist')

        // verify Partner Hero Image
        authoring.configurations.visit.appearances()
        authoring.configurations.clickAppearance(explore.appearance)
        authoring.configurations.clickAppearanceTab("Explore")
        cy.get(authoring.explore.createExploreModal.dropdownSelect).eq(0).click()
        cy.get(authoring.explore.createExploreModal.dropdownSelectField).eq(0).type("Partnership" + "\n")
        cy.contains("button", "Save Explore Settings").click()

        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)

        cy.get(authoring.explore.heroImages.backgroundImage).should('exist')
        cy.get(authoring.explore.heroImages.brandImage).should('exist')
        cy.get(authoring.explore.heroImages.partnerImage).should('exist')
        cy.get(authoring.explore.heroImages.personalizedImage).should('not.exist')

        // check consumption
        cy.visit(explore.url)

        cy.get(consumption.explore.hero.fixedHeroImage).should('exist')
        cy.get(consumption.explore.hero.brandImage).should('exist')
        cy.get(consumption.explore.hero.partnerImage).should('exist')
        cy.get(consumption.explore.hero.personalizedImage).should('not.exist')

        // verify Personalized Hero Image + FILL Cover Image
        authoring.configurations.visit.appearances()
        authoring.configurations.clickAppearance(explore.appearance)
        authoring.configurations.clickAppearanceTab("Explore")
        cy.get(authoring.explore.createExploreModal.dropdownSelect).eq(0).click()
        cy.get(authoring.explore.createExploreModal.dropdownSelectField).eq(0).type("Personalized" + "\n")
        cy.contains('label', 'Fill').click()
        cy.contains("button", "Save Explore Settings").click()

        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)

        cy.get(authoring.explore.heroImages.backgroundImage).should('exist')
        cy.get(authoring.explore.heroImages.brandImage).should('exist')
        cy.get(authoring.explore.heroImages.partnerImage).should('exist')
        cy.get(authoring.explore.heroImages.personalizedImage).should('exist')

        // check consumption
        cy.visit(explore.url)

        cy.get(consumption.explore.hero.fixedHeroImage).should('not.exist')
        cy.get(consumption.explore.hero.fillHeroImage).should('exist')
        cy.get(consumption.explore.hero.brandImage).should('exist')
        cy.get(consumption.explore.hero.partnerImage).should('exist')
        cy.get(consumption.explore.hero.personalizedImage).should('exist')

    })
})


