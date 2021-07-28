import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-vex", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-vex", tld: "lookbookhq"})

// Yes, this external code is absurdly complicated, but it's meant to simulate the weird external codes our customers have
function waitAndAddAttr (attributeValue) {
    setTimeout(() => {
        if (document.querySelector(".pf-event-header")) { 
             document.querySelector(".pf-event-header").setAttribute(attributeValue, attributeValue);
        } else {
            console.log("Keep waiting, smarty pants!");
            waitAndAddAttr(attributeValue);
        }
    }, 100)
}
const codeGenerator = (attributeValue) => `<script id="${attributeValue}">${waitAndAddAttr.toString()}; waitAndAddAttr("${attributeValue}");</script>`

// These codes test script codes
const eventExternalCode = {name: "event externalCode.js", interceptCode: codeGenerator("event"), locator: "#event"}
// These codes test html-element codes
const vexAppearanceExternalCode = {name: "VEX Test External Code", interceptCode: `<div id="vex_test-ec">VEX Test External Code</div>`}
const vexAppearanceExternalCode2 = {name: "VEX Test 2 External Code", interceptCode: `<div id="vex_test2-ec">VEX Test 2 External Code</div>`}
const vexAppearanceExternalCode3 = {name: "VEX External Language Name ", interceptCode: `<div id="vex_test3-ec">{{language.name}}</div>`}
const vexAppearanceExternalCode4 = {name: "VEX External Language Code", interceptCode: `<div id="vex_test4-ec">{{language.code}}</div>`}
// A harmless global external code that won't break any tests if left on permanently - it just console.logs a message
const globalExternalCode = {name: "External Code 3 - Shared Resource", interceptCode: `<script id="global">console.log("Global External Code")</script>`, locator: "#global"}
const testSpecificCodes = [vexAppearanceExternalCode, vexAppearanceExternalCode2, vexAppearanceExternalCode3, vexAppearanceExternalCode4, eventExternalCode]

const vexAppearance = {
    name: "externalCodeVex.js",
    appearance: "externalCodeVex.js",
    externalCodes:  [vexAppearanceExternalCode.name, vexAppearanceExternalCode2.name, eventExternalCode.name, vexAppearanceExternalCode3.name, vexAppearanceExternalCode4.name]
}


const event = {
    name: "externalCodeVex.js",
    slug: "externalcodevex-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    language: "ExternalLanguage.js",
    form: {name: "externalCodeVex.js"}
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public'
}

describe("VEX - External Code", () => {
    it("Setup if not already done", ()=>{
        // If vex is not created, automatically tear down all resources, and add them back.
        // If vex exists, assume entire setup is correct and move on to the actual test
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.addNewLanguage({name: event.language, code: "elg"})
                authoring.configurations.deleteAppearance(vexAppearance.name)
                authoring.configurations.addNewAppearance(vexAppearance)
                authoring.configurations.configureVEXAppearance(vexAppearance)
                authoring.vex.visit()
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.addLandingPages(landingPage.name)
            }
        })
    })

    it("Add, remove external code from vex setup area", () => {

        authoring.common.login()
        authoring.configurations.deleteExternalCode(testSpecificCodes.map(code => code.name))
        testSpecificCodes.forEach(code => {
            authoring.configurations.addExternalCode(code)
        })
        
        authoring.configurations.addNewAppearance(vexAppearance)
        authoring.configurations.configureVEXAppearance(vexAppearance)
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.configureAppearance(vexAppearance.appearance)
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)

        
        // Check that all external codes are present in Landing Page editor
        cy.get(globalExternalCode.locator).should("exist") // Comes from global external code
        cy.get(eventExternalCode.locator).should("exist")
        cy.get(`div:contains("${vexAppearanceExternalCode.name}")`).should("exist").should("have.length", 1) // make sure no duplicates
        cy.get(`div:contains("${vexAppearanceExternalCode2.name}")`).should("exist").should("have.length", 1) // make sure no duplicates

        // Check consumption
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader, {timeout: 10000}).should("exist")
        cy.get(globalExternalCode.locator).should("exist") // From global external code
        cy.get(`div:contains("${vexAppearanceExternalCode.name}")`).should("exist").should("have.length", 1) // make sure no duplicates
        cy.get(`div:contains("${vexAppearanceExternalCode2.name}")`).should("exist")
        cy.get(`div:contains("${event.language}")`).should("exist")
        cy.get(`div:contains("${"elg"}")`).should("exist")
        cy.get(consumption.vex.vexHeader).should("have.attr", "event", "event")
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 10000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", event.language ).should("exist")
            cy.contains("p", "elg" ).should("exist")
        })
        

        // Delete external code from External Code configuration
        authoring.vex.visit()
        authoring.configurations.deleteExternalCode(vexAppearanceExternalCode2.name)
        authoring.configurations.deleteExternalCode(vexAppearanceExternalCode3.name)
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)

        // Check that all external codes are present in Landing Page editor
        cy.get(globalExternalCode.locator).should("exist")
        cy.get(eventExternalCode.locator).should("exist")
        cy.get(`div:contains("${vexAppearanceExternalCode.name}")`).should("exist").should("have.length", 1) // make sure no duplicates
        cy.get(`div:contains("${vexAppearanceExternalCode2.name}")`).should("not.exist") 
        

        // Check consumption
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader, {timeout: 10000}).should("exist")
        cy.get(globalExternalCode.locator).should("exist") // From global external code
        cy.get(`div:contains("${vexAppearanceExternalCode.name}")`).should("exist").should("have.length", 1) // make sure no duplicates
        cy.get(`div:contains("${vexAppearanceExternalCode2.name}")`).should("not.exist")
        cy.get(`div:contains("${event.language}")`).should("not.exist")
        cy.get(consumption.vex.vexHeader).should("have.attr", "event", "event")


        // Go back to the appearance and delete one external code from appearances
        authoring.configurations.visit.appearances()
        authoring.configurations.goToCampaignAppearance(vexAppearance.name, "virtual-event")
        authoring.configurations.removeAppearanceExternalCode(vexAppearanceExternalCode.name)
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToLandingPage()
        authoring.vex.goToPageEditor(landingPage.name)

        // Check that all external codes are present in Landing Page editor
        cy.get(globalExternalCode.locator).should("exist") // Comes from global external code
        cy.get(eventExternalCode.locator).should("exist")
        cy.get(`div:contains("${vexAppearanceExternalCode.name}")`).should("not.exist")
        cy.get(`div:contains("${vexAppearanceExternalCode2.name}")`).should("not.exist") 

        // Check consumption
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader, {timeout: 10000}).should("exist")
        cy.get(globalExternalCode.locator).should("exist") // From global external code
        cy.get(`div:contains("${vexAppearanceExternalCode.name}")`).should("not.exist")
        cy.get(`div:contains("${vexAppearanceExternalCode2.name}")`).should("not.exist")
        cy.get(consumption.vex.vexHeader).should("have.attr", "event", "event")

    })
})