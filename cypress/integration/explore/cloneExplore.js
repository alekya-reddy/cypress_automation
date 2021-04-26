import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]
const youtubeContent = contents["Youtube Shared Resource"]

const target = {
    name: 'cloneExplore.js',
    contents: [webContent.title, youtubeContent.title]
};


const explorePage = {
    name: 'cloneExplore.js',
    experienceType: 'Target',
    trackName: target.name,
    externalCode: "cloneExplore.js",
    slug: 'cloneexplore-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
};

const cloneExplorePage = {
    name: 'cloned cloneExplore.js',
    slug: 'clonedpage-js',
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}


describe("Explore - Clone Explore", () => {

    it("Delete Cloned Explore Page if exist", () => {
        cy.request({url: cloneExplorePage.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 200){ 
                authoring.common.login()
                authoring.explore.visit()
                authoring.explore.deleteExplore(cloneExplorePage.name)
            }
        })
    })

    it("Clone Explore page - Validation", () => {
        authoring.common.login()
        authoring.explore.visit()   
        cy.contains("button", "Create Explore Page").click()
        cy.contains(authoring.common.modal, "Create Explore Page").within(()=>{
            // verify cloning with an empty name
            cy.contains(authoring.explore.experienceType, "Explore (Clone)").click()
            cy.get(authoring.explore.createExploreModal.dropdownSelect).eq(0).click()
            cy.get(authoring.explore.createExploreModal.dropdownSelectField).eq(0).type(explorePage.name + "\n")
            cy.contains("button", "Create Explore Page").click()
            cy.contains("can't be blank")
            // verify creating explore with existing name
            cy.get(authoring.explore.createExploreModal.nameInput).clear().type(explorePage.name)
            cy.contains("button", "Create Explore Page").click()
            cy.contains("has already been taken")
        })      
    })

    it("Clone Explore page and check consumption", () => {
        // go to explore consumption and save all styling
        cy.visit(explorePage.url)

        let appearance = {}
        cy.get(consumption.explore.headerTitle).invoke('text').then((headerTitle) => {
            appearance.headerTitle = headerTitle
        })
        cy.get(consumption.explore.headerTitle).invoke('css', 'font-family').then((headerFont) => {
            appearance.headerFont = headerFont
        })
        cy.get(consumption.explore.headerTitle).invoke('css', 'color').then((headerColor) => {
            appearance.headerColor = headerColor
        })
        cy.get(consumption.explore.hero.heroTitle).invoke('text').then((heroTitle) => {
            appearance.heroTitle = heroTitle
        })
        cy.get(consumption.explore.hero.heroTitle).invoke('css', 'color').then((heroTitleColor) => {
            appearance.heroTitleColor = heroTitleColor
        })
        cy.get(consumption.explore.hero.heroSubtitle).invoke('text').then((heroSubtitle) => {
            appearance.heroSubtitle = heroSubtitle
        })
        cy.get(consumption.explore.hero.heroBackground).invoke('css', 'background-color').then((heroBackgroundColor) => {
            appearance.heroBackgroundColor = heroBackgroundColor
        })
        cy.get(consumption.explore.hero.heroCTA).invoke('text').then((heroCTAText) => {
            appearance.heroCTAText = heroCTAText
        })
        cy.get(consumption.explore.hero.heroCTA).invoke('css', 'color').then((heroCTAColor) => {
            appearance.heroCTAColor = heroCTAColor
        })
        cy.get(consumption.explore.hero.heroCTA).invoke('css', 'background-color').then((heroCTABackgrondColor) => {
            appearance.heroCTABackgrondColor = heroCTABackgrondColor
        })
        cy.get(consumption.explore.body.bodyTitle).invoke('text').then((bodyTitle) => {
            appearance.bodyTitle = bodyTitle
        })
        cy.get(consumption.explore.body.bodyTitle).invoke('css', 'color').then((bodyTitleColor) => {
            appearance.bodyTitleColor = bodyTitleColor
        })
        cy.get(consumption.explore.body.bodyDescription).invoke('text').then((bodyDescription) => {
            appearance.bodyDescription = bodyDescription
        })
        cy.get(consumption.explore.body.searchButton).invoke('css', 'color').then((searchButtonColor) => {
            appearance.searchButtonColor = searchButtonColor
        })
        cy.get(consumption.explore.body.searchButton).invoke('css', 'background-color').then((searchButtonBackgroundColor) => {
            appearance.searchButtonBackgroundColor = searchButtonBackgroundColor
        })
        cy.get(consumption.explore.featuredContentGrid(0,0)).invoke('css', 'font-family').then((featuredContentFont) => {
            appearance.featuredContentFont = featuredContentFont
        })
        cy.get(consumption.explore.featuredContentGrid(0,0)).invoke('css', 'color').then((featuredContentColor) => {
            appearance.featuredContentColor = featuredContentColor
        })
        cy.get(consumption.explore.featuredContentGrid(0,0)).invoke('css', 'background-color').then((featuredContentBackgroundColor) => {
            appearance.featuredContentBackgroundColor = featuredContentBackgroundColor
        })

        // clone explore page
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explorePage.name)
        authoring.explore.cloneExplore(cloneExplorePage.name, explorePage.name)

        // change page slug in order to preview
        authoring.explore.setCustomUrl(cloneExplorePage.slug)
        // compare explore page with cloned, everything should be the same
        cy.visit(cloneExplorePage.url)
        cy.do(() => {
            cy.get(consumption.explore.headerTitle)
                .should('have.text', appearance.headerTitle)
                .should('have.css', 'font-family', appearance.headerFont)
                .should('have.css', 'color', appearance.headerColor)

            cy.get(consumption.explore.hero.heroTitle)
                .should('have.text', appearance.heroTitle)
                .should('have.css', 'color', appearance.heroTitleColor)
            cy.get(consumption.explore.hero.heroSubtitle).should('have.text', appearance.heroSubtitle)
            cy.get(consumption.explore.hero.heroBackground).should('have.css', 'background-color', appearance.heroBackgroundColor)

            cy.get(consumption.explore.hero.heroCTA)
                .should('have.text', appearance.heroCTAText)
                .should('have.css', 'color', appearance.heroCTAColor)
                .should('have.css', 'background-color', appearance.heroCTABackgrondColor)
            
            cy.get(consumption.explore.body.bodyTitle)
                .should('have.text', appearance.bodyTitle)
                .should('have.css', 'color', appearance.bodyTitleColor)
            cy.get(consumption.explore.body.bodyDescription).should('have.text', appearance.bodyDescription)

            cy.get(consumption.explore.body.searchButton)
                .should('have.css', 'color', appearance.searchButtonColor)
                .should('have.css', 'background-color', appearance.searchButtonBackgroundColor)

            cy.get(consumption.explore.featuredContentGrid(0,0))
                .should('have.css', 'font-family', appearance.featuredContentFont)
                .should('have.css', 'color', appearance.featuredContentColor)
                .should('have.css', 'background-color', appearance.featuredContentBackgroundColor)
        })
        // check that tracks are cloned
        target.contents.forEach(content => {
            cy.contains(consumption.explore.body.card, content).should("exist")
        })
        // click on a card
        cy.contains(consumption.explore.body.card, webContent.title).click()
        // redirected to the track
        cy.contains("span", webContent.title).should("exist")
        // click on 'Home' button
        cy.get(consumption.common.backToHomePageButton).click()
        // explore page is shown
        cy.do(() => {
            cy.get(consumption.explore.hero.heroTitle).should('have.text', appearance.heroTitle)
        })

        // check that external code that was applied to the cloned explore has a tag that redirects to that explore page
        authoring.configurations.visit.externalCode()
        cy.contains(authoring.common.table.cellName, explorePage.externalCode, {timeout: 5000}).click()
        cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
            cy.contains("Not added to any Recommend Tracks").should("exist")
            cy.contains("Not added to any Target Tracks").should("exist")
            cy.contains("Not added to any Microsites").should("exist")
            cy.contains("Not added to any Appearance Configurations").should("exist")
            cy.containsExact("div", cloneExplorePage.name).parent().click({force: true})    
        })
        cy.containsExact(authoring.common.pageTitleLocator, cloneExplorePage.name, {timeout: 5000})

        // delete cloned explore page
        authoring.explore.visit()
        authoring.explore.deleteExplore(cloneExplorePage.name)

        // check that explore tag not in External Codes list anymore
        authoring.configurations.visit.externalCode()
        cy.contains(authoring.common.table.cellName, explorePage.externalCode, {timeout: 5000}).click()
        cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
            cy.containsExact("div", cloneExplorePage.name).should("not.exist")
        })
    })
})


