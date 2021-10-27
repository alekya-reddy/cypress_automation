import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: "automation-microsites", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-microsites', tld: 'lookbookhq' })

const microsite = {
    name: "SeoTest",
    slug: "seotest",
    appearance: "SEOappearance.js",
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
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg"
    },

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
    thumbnail: {
    category: 'Stock Images',
    url: '/stock/sm/animal-dog-pet-labrador.jpg' 
    }
}

describe('Microsites SEO attributes', function() {
    it('Verify that microsites taking proper SEO attributes', function() {
        authoring.common.login()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)

        authoring.microsites.addLandingPages(landingPage.name)
        cy.contains('td', landingPage.name).siblings("td").within(() => {
            cy.contains("span", "Edit").click({force: true})
        })
        cy.contains("div", "This title will be shown in the title tag, meta title and og title").should("exist")
        cy.contains("div", "This image will show in the og image")
        cy.contains("div", "This description will show in the meta description, and og description").should("exist")
        cy.contains("button", "Submit").click()
        cy.contains('.ant-modal-content', "Edit Landing Page").should('not.be.visible').should("exist")
        authoring.microsites.editLandingPage(landingPage)

        //Verify SEO attributes and helper text

        cy.visit(landingPage.url)
        cy.wait(2000)
        cy.get('meta[property="og:description"]').should("have.attr", "content", landingPage.pageDescription); 
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576"); 
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingPage.pageDescription);
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", landingPage.pageTitle);  
        cy.get('meta[name="description"]').should("have.attr", "content", landingPage.pageDescription); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", landingPage.pageTitle);
        //cloned landing page
        authoring.microsites.visit();
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.clonePages(landingpageCloned)
        cy.contains('td', landingpageCloned.name).siblings("td").within(() => {
            cy.contains("span", "Edit").click({force: true})
        })
        //verify that cloned landing page has same SEO attributes as main page
        cy.get(authoring.microsites.landingPages.pageTitle).should('have.value', landingPage.pageTitle)
        cy.get(authoring.microsites.landingPages.pageDescription).contains(landingPage.pageDescription).should("exist")
        cy.get('img[src*="/stock/sm/animal-dog-pet-cute.jpg"]').should("exist")

         authoring.microsites.editLandingPage(landingpageCloned)
         cy.visit(landingpageCloned.url)
         cy.wait(2000)
         //Verify SEO attributes mapping correct values 
         cy.get('meta[property="og:description"]').should("have.attr", "content", landingpageCloned.pageDescription); 
         cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
         cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576"); 
         cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-labrador.jpg"); 
         cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-labrador.jpg"); 
         cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingpageCloned.pageDescription); 
         cy.get('meta[property="og:title"]').should("have.attr", "content", landingpageCloned.pageTitle);  
         cy.get('meta[name="description"]').should("have.attr", "content", landingpageCloned.pageDescription); 
         cy.get('meta[name="twitter:title"]').should("have.attr", "content", landingpageCloned.pageTitle);
       
    })

    it('Verify that no thumbnail set will pull from default appearance header image', function() {
        authoring.common.login()
        cy.visit(authoring.configurations.pageUrls.appearances)

        authoring.microsites.visit();
        //verify if no thumbnail set it pull values from default header appearance or background-image
        authoring.microsites.goToMicrositeConfig(microsite.name)
        authoring.microsites.tabToLandingPages()
        cy.contains('td', landingPage.name).siblings("td").within(() => {
            cy.contains("span", "Edit").click({force: true})
        })
        cy.contains('span', "Clear").click()
        cy.contains('span', "Submit").click()

        cy.visit(landingPage.url)
        cy.wait(2000)
        cy.get('meta[property="og:description"]').should("have.attr", "content", landingPage.pageDescription); 
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576"); 
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/car-road-snow-winter.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/car-road-snow-winter.jpg"); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", landingPage.pageDescription); 
        cy.get('meta[property="og:title"]').should("have.attr", "content", landingPage.pageTitle);  
        cy.get('meta[name="description"]').should("have.attr", "content", landingPage.pageDescription); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", landingPage.pageTitle);
    })
})