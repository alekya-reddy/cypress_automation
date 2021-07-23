import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-vex", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const headerAppearance = {
    appearance: "dynamicLogoFieldMerge.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
}

const event = {
    name: 'dynamicHeaderLogoVex.js',
    slug: 'dynamicheaderlogovex',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: headerAppearance.appearance
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${vex.url}/${this.slug}`
    },
    visibility: 'Public'
}

const company = {
    ip: "76.9.217.70",
    name: "PathFactory",
    logo: "//logo.clearbit.com/pathfactory.com",
}

const nonCompany = {
    ip: "171.117.159.107",
}


describe("VEX - Dynamic Header Logo", () => {
    it("Set up if not already done", () => {
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addNewAppearance({name: headerAppearance.appearance})
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.configureAppearance(headerAppearance)
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })

    it("Verify that dynamic logo works", () => {
        // Note: Dynamic logo is the logo in the header. 6sense will know which company you belong to when you visit a virtual event.
        // The dynamic logo will be that company's logo.

        // Toggle on dynamic logo in header appearance settings and verify that the vex has the correct logo when visiting with spoofed pathfactory IP address
        authoring.common.login()
        authoring.configurations.configureHeaderAppearance({appearance: event.appearance, dynamicLogo: "on"})

        cy.visit(event.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.vex.vexHeader).within(() => {
            cy.get(`img[src="${company.logo}"]`).should("exist")
        })

        // Verify that dynamic logo is a default value when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(event.url + "?lbhqip=" + nonCompany.ip)
        cy.get(consumption.vex.vexHeader).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })

        // Turn off dynamic logo and visit with pathfactory ip - the default logo should show
        authoring.configurations.visit.appearances()
        authoring.configurations.configureHeaderAppearance({appearance: event.appearance, dynamicLogo: "off"})
        cy.visit(event.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.vex.vexHeader).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })
    })
})