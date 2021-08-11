import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'


const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const linkandshare = {
    name: 'linkAndShareSearch.js'
}

const  searchAppearance = {
    appearance: "searchAppearance.js",
}


describe("Add Configurations and Verify Search functionality", () => {
    it("Add LinkandShare and Verify Search functionality", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.linksAndSharings)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.linksAndSharings).should("exist")

        authoring.configurations.deleteLinksAndSharing(linkandshare.name)
        authoring.configurations.addLinksAndSharing(linkandshare.name)

        authoring.configurations.searchLinksAndSharing('linkAndSha')
        cy.get(authoring.common.pageContainer).contains(linkandshare.name).should("exist")
        cy.get(authoring.configurations.clearSearch).should("exist").click()
   
    })

    it("Add Language and Verify Search functionality", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.languages)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.languages).should("exist")
        authoring.configurations.deleteLanguage("SearchTest.js")
        authoring.configurations.addNewLanguage({name: "SearchTest.js", code: "elg"})
        authoring.configurations.searchLinksAndSharing('SearchTest.js')
        cy.containsExact("div", "SearchTest.js").parent().should("exist")
        cy.get(authoring.configurations.clearSearch).should("exist").click()

    })

    it("Add Appearance and Verify Search functionality", () => {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.appearances)
        cy.contains(authoring.common.pageTitleLocator, authoring.configurations.pageTitles.appearances).should("exist")
        authoring.configurations.deleteAppearance("searchAppearance.js")
        authoring.configurations.addNewAppearance({name: searchAppearance.appearance})
        authoring.configurations.searchLinksAndSharing('searchAppearance.js')
        cy.containsExact("div", "searchAppearance.js").parent().should("exist")
        cy.get(authoring.configurations.clearSearch).should("exist").click()

    })


})