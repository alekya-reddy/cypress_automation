import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: 'dynamicFieldMergeTarget.js',
    slug: 'dynamicfieldmergetarget',
    contents: [webContent.title],
    flow: "on",
    flowCTA: "dynamicFieldMergeTarget.js",
    formsStrategy: "on",
    formsStrategyOptions: {
        trackRule: {
            form: "dynamicFieldMergeTarget.js",
            timeOnTrack: '0',
            showToUnknown: "on",
            showToKnown: "off",
            dismissable: "on"
        }
    },
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${webContent.slug}`
    }
}

const company = {
    ip: "76.9.217.70",
    name: "PathFactory",
}

const nonCompany = {
    ip: "171.117.159.107",
}
const ctaURLwithIP = `https://google.com?company_name=${company.name}&lbhqip=${company.ip}`
const ctaURLwithoutIP = `https://google.com?company_name=&lbhqip=${nonCompany.ip}`


describe("Target - Dynamic field Merge", () => {
    it("Setup Target track if not already done", () => {
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })
    })

    it("Verify that dynamic mergefield works in CTA links and Custom html forms", () => {
        // Note: A field merge is a variable in the Explore (inside a CTA link, Form-custom html block). It could be any one of 6sense's datapoints 
        // about a visitor, content, Experence such as company name, content title , Experience name etc. Depending on the data returned by 6sense, you will see the value 
        // of that variable displayed in the html block / links (refere: DEV-12557)

        authoring.common.login()
        cy.visit(target.url + `?lbhqip=${company.ip}`)
        // verify on custom html form
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 20000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", "company name=" + company.name).should("exist")
            cy.contains("p", "ExperienceName=" + target.name ).should("exist")
            cy.contains("p", "Content Title=" + webContent.title).should("exist")
        })
    
        // Verify that dynamic Field merge is a default value when visiting with a spoofed IP address for which there is 
        // no available information
        cy.visit(target.url + "?lbhqip=" + nonCompany.ip)
        // verify on custom html form
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 20000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", "company name=").should("exist")
            cy.contains("p", "ExperienceName=" + target.name ).should("exist")
            cy.contains("p", "Content Title=" + webContent.title).should("exist")
        })
        cy.get(consumption.common.closeModalButton).click()
        cy.waitFor({element: consumption.common.customFormIframe, to: "not.exist"})

        // verify on CTA link with non company IP
         cy.get(consumption.common.ctaButton).should("have.attr", "href", ctaURLwithoutIP)

        // verify on CTA link with company IP
        cy.visit(target.url + `?lbhqip=${company.ip}`)
        cy.get(consumption.common.ctaButton).should("have.attr", "href", ctaURLwithIP)

    })
})