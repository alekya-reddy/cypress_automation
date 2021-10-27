import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'SeoTest',
    slug: "seotest",

    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg"
    },
    pageTitle: "SEO value Title",
    pageDescription: "SEO value description",
}

const appearance = {
    name: "SEOAppearance.js"
}

const event2 = {
    name: 'clonedEvent',
    slug: 'clonedevent',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    clone: 'SeoTest',
    pageTitle: "Cloned Page Title",
    pageDescription: "Cloned Page Description",
    thumbnail: {
    category: 'Stock Images',
    url: '/stock/sm/animal-dog-pet-labrador.jpg' 
}
  }

describe('VEX - Virtual Event', function() {
    it('Verify that VEX taking proper SEO attributes', function() {
        authoring.common.login()
        authoring.vex.visit();
        authoring.vex.deleteVirtualEvent(event2.name)
        authoring.vex.deleteVirtualEvent(event.name)
        //verify that new SEO fileds added in VEX
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)

        //Verify SEO attributes mapping correct values 
        cy.visit(event.url)
        cy.wait(2000)
        cy.get('meta[property="og:description"]').should("have.attr", "content", event.pageDescription); 
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576"); 
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-cute.jpg"); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", event.pageDescription);
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", event.pageTitle);  
        cy.get('meta[name="description"]').should("have.attr", "content", event.pageDescription); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", event.pageTitle);

    })

    it('Verify that cloned event has same value and chaging them doesnt affect original VEX', function() {
        authoring.common.login()
        authoring.vex.visit();
        //clone VEX and verify that changing their values doesn't affect original VEX
        authoring.vex.addVirtualEvent(event2)
        cy.contains('a', "clonedEvent").click()
        cy.get(authoring.vex.pageTitle).should('have.value', event.pageTitle)
        cy.get(authoring.vex.pageDescription).contains(event.pageDescription).should("exist")
        cy.get('img[src*="/stock/sm/animal-dog-pet-cute.jpg"]').should("exist")
        authoring.vex.visit();
        authoring.vex.configureEvent(event2)

        cy.visit(event2.url)
        cy.wait(2000)
        //Verify SEO attributes mapping correct values 
        cy.get('meta[property="og:description"]').should("have.attr", "content", event2.pageDescription); 
        cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
        cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576"); 
        cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-labrador.jpg"); 
        cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/animal-dog-pet-labrador.jpg"); 
        cy.get('meta[property="twitter:description"]').should("have.attr", "content", event2.pageDescription);
        cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
        cy.get('meta[property="og:title"]').should("have.attr", "content", event2.pageTitle);  
        cy.get('meta[name="description"]').should("have.attr", "content", event2.pageDescription); 
        cy.get('meta[name="twitter:title"]').should("have.attr", "content", event2.pageTitle);
    
    })

        it.only('Verify that no thumbnail set will pull from default appearance header image', function() {
            authoring.common.login()
            authoring.vex.visit();
            //verify if no thumbnail set it pull values from default header appearance or background-image
            cy.contains('a', event.name).click()
            cy.contains('span', "Clear").click()
            cy.contains('span', "Save").click()
            cy.contains('div', "The record was saved successfully.").should("exist")
            
            authoring.vex.configureAppearance("SEOAppearance.js")

            cy.visit(event.url)
            cy.get('meta[property="og:description"]').should("have.attr", "content", event.pageDescription); 
            cy.get('meta[property="og:image:height"]').should("have.attr", "content", "384"); 
            cy.get('meta[property="og:image:width"]').should("have.attr", "content", "576"); 
            cy.get('meta[property="og:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/car-road-snow-winter.jpg"); 
            cy.get('meta[name="twitter:image"]').should("have.attr", "content", "https://img.qa-pathfactory.com/stock/sm/car-road-snow-winter.jpg"); 
            cy.get('meta[property="twitter:description"]').should("have.attr", "content", event.pageDescription);
            cy.get('meta[property="og:type"]').should("have.attr", "content", "website");  
            cy.get('meta[property="og:title"]').should("have.attr", "content", event.pageTitle);  
            cy.get('meta[name="description"]').should("have.attr", "content", event.pageDescription); 
            cy.get('meta[name="twitter:title"]').should("have.attr", "content", event.pageTitle);

        })

    })