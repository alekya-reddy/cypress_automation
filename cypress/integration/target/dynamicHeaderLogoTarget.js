import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = contents["Website Common Resource"]

const headerAppearance = {
    appearance: "dynamicHeaderLogoTarget.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
}

const target = {
    name: 'dynamicHeaderLogoTarget.js',
    slug: 'dynamicheaderlogotarget',
    contents: [webContent.title],
    appearance: headerAppearance.appearance,
    header: "on",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}

const company = {
    ip: "76.9.217.70",
    name: "PathFactory",
    logo: "//logo.clearbit.com/pathfactory.com",
}

const nonCompany = {
    ip: "171.117.159.107",
}

describe("Target - Dynamic Header Logo", () => {
    it("Setup appearance and target tracks if not already done", () => {
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addNewAppearance({name: headerAppearance.appearance})
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })
    })

    it("Verify that dynamic logo works", () => {
        // Note: Dynamic logo is the logo in the header. 6sense will know which company you belong to when you visit a target.
        // The dynamic logo will be that company's logo.

        // Toggle on dynamic logo in header appearance settings and verify that the target track has the correct logo when visiting with spoofed pathfactory IP address
        authoring.common.login()
        authoring.configurations.configureHeaderAppearance({appearance: target.appearance, dynamicLogo: "on"})

        cy.visit(target.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.common.header.locator).within(() => {
            cy.get(`img[src="${company.logo}"]`).should("exist")
        })

        // Verify that dynamic logo is a default value when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(target.url + "?lbhqip=" + nonCompany.ip)
        cy.get(consumption.common.header.locator).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })

        // Turn off dynamic logo and visit with pathfactory ip - the default logo should show
        authoring.configurations.visit.appearances()
        authoring.configurations.configureHeaderAppearance({appearance: target.appearance, dynamicLogo: "off"})
        cy.visit(target.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.common.header.locator).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })
    })
})