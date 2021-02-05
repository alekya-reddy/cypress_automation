import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const headerAppearance = {
    appearance: "dynamicHeaderLogoRecommend.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/animal-dog-pet-cute.jpg",
    }
}

const recommend = {
    name: 'dynamicHeaderLogoRecommend.js',
    slug: 'dynamicheaderlogorec',
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

describe("Recommend - Dynamic Header Logo", () => {
    it("Setup appearance and recommend track if not already done", () => {
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

    it("Verify that dynamic logo works", () => {
        // Note: Dynamic logo is the logo in the header. 6sense will know which company you belong to when you visit recommend.
        // The dynamic logo will be that company's logo.

        // Toggle on dynamic logo in header appearance settings and verify that the recommend track has the correct logo when visiting with spoofed pathfactory IP address
        authoring.common.login()
        authoring.configurations.configureHeaderAppearance({appearance: recommend.appearance, dynamicLogo: "on"})

        cy.visit(recommend.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.recommend.header).within(() => {
            cy.get(`img[src="${company.logo}"]`).should("exist")
        })

        // Verify that dynamic logo is a default value when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(recommend.url + "?lbhqip=" + nonCompany.ip)
        cy.get(consumption.recommend.header).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })

        // Turn off dynamic logo and visit with pathfactory ip - the default logo should show
        authoring.configurations.visit.appearances()
        authoring.configurations.configureHeaderAppearance({appearance: recommend.appearance, dynamicLogo: "off"})
        cy.visit(recommend.url + `/?lbhqip=${company.ip}`)
        cy.get(consumption.recommend.header).within(() => {
            cy.get(`img[src*="${headerAppearance.thumbnail.url}"]`).should("exist")
        })
    })
})