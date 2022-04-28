import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-explore', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-explore"].resources
const webContent = contents["Website Common Resource"]


const recommend = {
    name: 'dynamicFieldMergeExplore.js',
    slug: 'dynamicfieldmergeexplore',
    contents: [webContent.title],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}

const explore = {
    name: 'dynamicFieldMergeExplore.js',
    experienceType: "Recommend",
    trackName: recommend.name,
    slug: 'dynamicfieldmergeexp',
    ctaToggle: "on",
    cta: [
        { 
            type: "Hero",
            ctaName: "CTAFormDynamicfieldMergeExplore.js",
            position: "Center",
        },    
        {
            type: "Body",
            ctaName: "CTALinkDynamicfieldMergeExplore.js",
            position: "Center",
        },    
    ],
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}

const company = {
    ip: "76.9.217.70",
    name: "Bolt Logistics",
}

const nonCompany = {
    ip: "171.117.159.107",
}

const ctaURLwithIP = `https://google.com?company_name=Bolt%20Logistics&lbhqip=${company.ip}`
const ctaURLwithoutIP = `https://google.com?company_name=&lbhqip=${nonCompany.ip}`

describe("Explore - Dynamic Merge Field", () => {
    it("Setup Recommend Track if not already done", () => {
        cy.request({url: recommend.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
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

    it("Verify that dynamic mergefield works in CTA links and Custom html forms", () => {
        // Note: A field merge is a variable in the Explore (inside a CTA link, Form-custom html block). It could be any one of 6sense's datapoints 
        // about a visitor, content, Experence such as company name, content title , Experience name etc. Depending on the data returned by 6sense, you will see the value 
        // of that variable displayed in the html block / links (refere: DEV-12557)
        authoring.common.login()
        cy.visit(explore.url + `?lbhqip=${company.ip}`)
        // verify on CTA custom html form
        cy.get(consumption.explore.hero.heroCTA).click()
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 20000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", "company name=" + company.name).should("exist")
            cy.contains("p", "ExperienceName=" + explore.name ).should("exist")
        })
        cy.get(consumption.common.closeModalButton).click()
        cy.waitFor({element: consumption.common.customFormIframe, to: "not.exist"})
        // verify on CTA link 
        cy.get(consumption.explore.body.bodyCTA).should("have.attr", "href", ctaURLwithIP)

        // Verify that dynamic Field merge is a default value when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(explore.url + "?lbhqip=" + nonCompany.ip)
        // verify on CTA custom html form
        cy.get(consumption.explore.hero.heroCTA).click()
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 20000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", "company name=").should("exist")
            cy.contains("p", "ExperienceName=" + explore.name ).should("exist")
        })
        cy.get(consumption.common.closeModalButton).click()
        cy.waitFor({element: consumption.common.customFormIframe, to: "not.exist"})
        // verify on CTA link
        cy.get(consumption.explore.body.bodyCTA).should("have.attr", "href", ctaURLwithoutIP)
    })
})
