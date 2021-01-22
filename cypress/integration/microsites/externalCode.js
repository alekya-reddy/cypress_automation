import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-microsites", tld: "lookbookhq"})

function waitAndAddAttr (attributeValue) {
    setTimeout(() => {
        if (document.querySelector("#pf-microsite-header")) { 
             document.querySelector("#pf-microsite-header").setAttribute(attributeValue, attributeValue);
        } else {
            console.log("Keep waiting, smarty pants!");
            waitAndAddAttr(attributeValue);
        }
    }, 100)
}
const codeGenerator = (attributeValue) => `<script>${waitAndAddAttr.toString()}; waitAndAddAttr("${attributeValue}");</script>`
const micrositeExternalCode = {name: "microsite externalCode.js", interceptCode: codeGenerator("microsite")}
const targetExternalCode = {name: "target externalCode.js", interceptCode: codeGenerator("target")}
const recommendExternalCode = {name: "recommend externalCode.js", interceptCode: codeGenerator("recommend")}

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const microsite = {
    name: "externalCode.js",
    slug: "externalcode-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    externalCode: micrositeExternalCode.name
}

const target = {
    name: "target externalCode.js",
    slug: "target-ec",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title],
    externalCode: targetExternalCode.name
}

const recommend = {
    name: "rec externalCode.js",
    slug: "rec-ec",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl(){
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title],
    externalCode: recommendExternalCode.name
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${microsite.url}/${this.slug}`
    },
    blocks: [
        {
            type: "track",
            track: target.name
        },
        {
            type: "track",
            track: recommend.name
        }
    ]
}

describe("Microsites - External Code", () => {
    it("Setup if not already done", ()=>{
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addExternalCode(micrositeExternalCode)
                authoring.configurations.addExternalCode(targetExternalCode)
                authoring.configurations.addExternalCode(recommendExternalCode)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
                authoring.microsites.addMicrosite(microsite.name)
                authoring.microsites.setup(microsite)
                authoring.microsites.addTracks({recommend: recommend.name, target: target.name})
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
            }
        })
    })

    it("Add, remove external code from microsites setup area", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        const allCodes = [microsite.externalCode, target.externalCode, recommend.externalCode]
        authoring.microsites.removeExternalCode(allCodes) // This is just a clean up step
        authoring.microsites.addExternalCode(allCodes)
        authoring.microsites.removeExternalCode([target.externalCode, recommend.externalCode])
        cy.contains("button", "Save").click()
        cy.contains(authoring.common.messages.recordSaved, {timeout: 10000}).should("exist")
    })

    it("Verify on consumption that external codes from microsite, target and recommend are working", () => {
        // To verify the external code is working, check the navigation header for the attributes that the code has added
        // On microsite home and landing pages, only the microsite external code should be active
        cy.visit(microsite.url)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "target")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "recommend")

        cy.visit(landingPage.url)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "target")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "recommend")

        // On Target, only microsite and target external codes should be active
        cy.visit(target.micrositeUrl)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "target", "target")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "recommend")

        // On Recommend, only microsite and recommend external codes should be active
        cy.visit(recommend.micrositeUrl)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "microsite", "microsite")
        cy.get(consumption.microsites.navigation.header).should("not.have.attr", "target")
        cy.get(consumption.microsites.navigation.header).should("have.attr", "recommend", "recommend")
    })
})