import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const target = {
    name: "reverseProxy",
    slug: "reverseproxy",
    url: "https://reverseproxy.pathfactory-"+authoring.common.env.TEST_ENV+"-wp.com/test-authoring/reverseproxy/what-buying-a-new-ca",
}


const recommend = {
  name: "reverse proxy recommend",
  slug: "reverseproxyrecommend",
  url: "https://reverseproxy.pathfactory-"+authoring.common.env.TEST_ENV+"-wp.com/test-authoring/reverseproxyrecommend/dovobet-oint-pm-3-01",
}

const explore = {
  name: "reverse proxy explore recommend",
  slug: "reverse-proxy-explor",
  url: "https://reverseproxy.pathfactory-"+authoring.common.env.TEST_ENV+"-wp.com/test-authoring/l/reverse-proxy-explor"
}

const microsites = {
  name: "Test reverse proxy",
  slug: "test",
  url: "https://reverseproxy.pathfactory-"+authoring.common.env.TEST_ENV+"-wp.com/test-authoring/test"
}

describe("Reverse Proxy For Campaign Tools", function() {
    it("Configure Reverse-Proxy in Authoring", () => {

        authoring.common.login()
        cy.get(authoring.common.nameSetting).click()
        cy.get(1000)
        cy.get(authoring.common.clientHq).should("exist").click()
        cy.get(authoring.common.orgSearch).click().type("Authoring" + "\n")
        cy.get(authoring.common.orgSelect).contains("Authoring").should("exist").click()
        cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
        cy.get(authoring.common.orgModal).should("exist")
        cy.get(authoring.common.orgButton).click()
        cy.get(authoring.common.imperzonation).contains("You are impersonated into the Authoring instance").should("exist")
        cy.get(authoring.common.nameSetting).click()
        cy.get(authoring.common.orgDropdown).click()
        cy.get(authoring.common.orgValue).type("reverseproxy.pathfactory-"+authoring.common.env.TEST_ENV+"-wp.com/test-authoring"+"\n")
        cy.wait(1000)
        cy.get(authoring.common.orgSave).click()
        cy.wait(500)
        cy.contains("span", "The record was saved successfully.").should('be.visible')
        cy.wait(2000)

        authoring.target.visit()
        authoring.target.goToTrack(target.name)
        cy.wait(1000)
        cy.get(authoring.target.contentClick).click()
        cy.wait(500)
        cy.get(authoring.target.previewLink).contains(target.url).should("exist")

        authoring.recommend.visit()
        authoring.recommend.goToTrack(recommend.name)
        cy.get(authoring.recommend.recommendCell).contains("Reverse Proxy Pdf").click({force: true}) 
        cy.wait(500)
        cy.get(authoring.recommend.previewLink).contains(recommend.url).should("exist")

        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsites.name)
        cy.get(authoring.microsites.micrositeLink).contains(microsites.url).should("exist")
 
})

it("Reverse Proxy For Campaign Tools", function() {
cy.visit(target.url)
cy.url().should('contain', target.url)
cy.wait(1000)
cy.get(consumption.target.contentFrame).should("exist")

cy.visit(recommend.url)
cy.url().should('contain', recommend.url)
cy.get(consumption.recommend.contentTitle).contains("PRODUCT MONOGRAPH").should("exist")

cy.visit(explore.url)
cy.url().should('contain', explore.url)
cy.wait(1000)
cy.get(consumption.explore.exploreTitle).should("exist")

cy.visit(microsites.url)
cy.url().should('contain', microsites.url)
})

it("Set Custom Org Back", function() {
authoring.common.login()
cy.get(authoring.common.nameSetting).click()
cy.get(1000)
cy.get(authoring.common.clientHq).should("exist").click()
cy.get(authoring.common.orgSearch).click().type("Authoring" + "\n")
cy.get(authoring.common.orgSelect).contains("Authoring").should("exist").click()
cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
cy.get(authoring.common.orgModal).should("exist")
cy.get(authoring.common.orgButton).click()
cy.get(authoring.common.imperzonation).contains("You are impersonated into the Authoring instance").should("exist")
cy.get(authoring.common.nameSetting).click()
cy.get(authoring.common.orgDropdown).click()
cy.get(authoring.common.orgValue).type("custom.pathfactory-"+authoring.common.env.TEST_ENV+"-test.com"+"\n")
cy.wait(1000)
cy.get(authoring.common.orgSave).click()
cy.contains("span", "The record was saved successfully.").should('be.visible')

})

})