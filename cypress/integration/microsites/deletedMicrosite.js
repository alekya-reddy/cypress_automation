import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: "deletedMicrosite.js",
    slug: "deletedmicrosite-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Delete me",
    slug: "delete-me",
    visibility: 'Public',
    get url(){
        return `${microsite.url}/${this.slug}`
    }
}

describe("Microsites - Deleted microsites and landing pages", () => {
    it("A deleted landing page or microsite should no longer be accessible on consumption side", () => {
        authoring.common.login()

        // Setup
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.editLandingPage(landingPage)

        // Verify urls return a good response
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(200)
        })
        cy.request({url: landingPage.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(200)
        })

        // Verify deleted landing page is no longer accessible
        authoring.microsites.removeLandingPages(landingPage.name)
        cy.request({url: landingPage.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })

        // Verify deleted microsite is no longer accessible
        authoring.microsites.visit()
        authoring.microsites.removeMicrositeWithTrashIcon(microsite.name)
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })
    })
})