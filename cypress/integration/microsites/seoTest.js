import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: "automation-microsites", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-microsites', tld: 'lookbookhq' })

const microsite = {
    name: "SeoTest",
    slug: "seotest",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'public',
    pageTitle: 'It is Title',
    pageDescription: 'It is Description',
    // thumbnail: {
    //     category: "Stock Images",
    //     url: "/stock/sm/animal-dog-pet-cute.jpg"
    // },

}

const landingpageCloned = {
    name: "cloned Page",
    slug: "cloned-page",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'public',
    clone: 'Main Page',
    pageTitle: "Cloned Page Title",
    pageDescription: "Cloned Page Description",
    // thumbnail: {
    // category: 'Stock Images',
    // url: '/stock/sm/animal-dog-pet-labrador.jpg' 
    // }
}

describe('VEX - Virtual Event', function() {
    it('Verify that VEX taking proper SEO attributes', function() {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)

        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.editLandingPage(landingPage)
        //Verify SEO attributes and helper text

        authoring.microsites.visit();
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.clonePages(landingpageCloned)
        cy.contains("button", "Edit").eq(1).click()
        //verify that cloned page has same SEO attributes as main page
        // cy.get(authoring.microsites.pageTitle).should('have.value', landingPage.pageTitle)
        // cy.get(authoring.microsites.pageDescription).contains(landingPage.pageDescription).should("exist")
        // cy.get('img[src*="/stock/sm/animal-dog-pet-cute.jpg"]').should("exist")

        // authoring.microsites.editLandingPage(landingPage)


    })
})