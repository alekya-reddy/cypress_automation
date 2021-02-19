import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const headerAppearance = {
    appearance: "dynamicHeaderLogoExplore.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
}

const recommend = {
    name: 'dynamicHeaderLogoExplore.js',
    slug: 'dynamicheaderlogoexplore',
    contents: [webContent.title],
    header: "on",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}

const explore = {
    name: 'dynamicHeaderLogoExplore.js',
    experienceType: "Recommend",
    trackName: recommend.name,
    slug: 'dynamicheaderlogoexp',
    appearance: headerAppearance.appearance,
    header: "on",
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
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

describe("Explore - Dynamic Header Logo", () => {
    it("Setup appearance and Recommend Track if not already done", () => {
        cy.request({url: recommend.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addNewAppearance({name: headerAppearance.appearance})
                authoring.configurations.configureHeaderAppearance(headerAppearance)
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
            }
        })
    })

    it("Setup Explore page if not already done", () => {
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Verify that dynamic logo works", () => {
        // Note: Dynamic logo is the logo in the header. 6sense will know which company you belong to when you visit explore page.
        // The dynamic logo will be that company's logo.

        // Toggle on dynamic logo in header appearance settings and verify that the explore page has the correct logo when visiting with spoofed pathfactory IP address
        authoring.common.login()
        authoring.configurations.configureHeaderAppearance({appearance: explore.appearance, dynamicLogo: "on"})

        cy.visit(explore.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.common.header.locator).within(() => {
            cy.get(`img[src="${company.logo}"]`).should("exist")
        })

        // Verify that dynamic logo is a default value when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(explore.url + "?lbhqip=" + nonCompany.ip)
        cy.get(consumption.common.header.locator).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })

        // Turn off dynamic logo and visit with pathfactory ip - the default logo should show
        authoring.configurations.visit.appearances()
        authoring.configurations.configureHeaderAppearance({appearance: explore.appearance, dynamicLogo: "off"})
        cy.visit(explore.url + `/?lbhqip=${company.ip}`)
        cy.get(consumption.common.header.locator).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })
    })
})