import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})

const headerAppearance = {
    appearance: "dynamicLogoFieldMerge.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
}

const microsite = {
    name: "dynamicLogoFieldMerge.js",
    slug: "dynamiclogofieldmerge-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: headerAppearance.appearance,
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>{{company.name | default: default text}}</h1>`,
            className: "landingpageblock",
        }
    ]
}

const company = {
    ip: "76.9.217.70",
    name: "PathFactory",
    logo: "//logo.clearbit.com/pathfactory.com",
}

const nonCompany = {
    ip: "171.117.159.107",
}

describe("Microsites - Dynamic Header Logo, and Field Merges", () => {
    it("Set up if not already done", () => {
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addNewAppearance({name: headerAppearance.appearance})
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Verify that dynamic logo and field merge works", () => {
        // Note: Dynamic logo is the logo in the header. 6sense will know which company you belong to when you visit a microsite.
        // The dynamic logo will be that company's logo.
        // Note: A field merge is a variable in the microsite (inside an html block). It could be any one of 6sense's datapoints 
        // about a visitor, such as company name, country etc. Depending on the data returned by 6sense, you will see the value 
        // of that variable displayed inside the html block. 

        // Toggle on dynamic logo in header appearance settings and verify that the microsite has the correct logo and value in the field merge
        // when visiting with spoofed pathfactory IP address
        authoring.common.login()
        authoring.configurations.configureHeaderAppearance({appearance: microsite.appearance, dynamicLogo: "on"})

        cy.visit(landingPage.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.microsites.navigation.header).within(() => {
            cy.get(`img[src="${company.logo}"]`).should("exist")
        })
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.contains("h1", company.name).should("exist")
        })

        // Verify that dynamic logo and field merges are their default values when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(landingPage.url + "?lbhqip=7171.117.159.107")
        cy.get(consumption.microsites.navigation.header).within(() => {
            cy.get('img[src*="/stock/sm/animal-dog-pet-cute.jpg"]').should("exist")
        })
        cy.get(`.${landingPage.blocks[0].className}`).within(() => {
            cy.contains("h1", "default text").should("exist")
        })

        // Turn off dynamic logo and visit with pathfactory ip - the default logo should show
        authoring.configurations.visit.appearances()
        authoring.configurations.configureHeaderAppearance({appearance: microsite.appearance, dynamicLogo: "off"})
        cy.visit(landingPage.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.microsites.navigation.header).within(() => {
            cy.get('img[src*="/stock/sm/animal-dog-pet-cute.jpg"]').should("exist")
        })
    })
})