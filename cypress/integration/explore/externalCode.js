import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-explore", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: "automation-explore", tld: "lookbookhq"})

// Yes, this external code is absurdly complicated, but it's meant to simulate the weird external codes our customers have
function waitAndAddAttr (attributeValue) {
    setTimeout(() => {
        if (document.querySelector("#pf-explore-header")) { 
             document.querySelector("#pf-explore-header").setAttribute(attributeValue, attributeValue);
        } else {
            console.log("Keep waiting, smarty pants!");
            waitAndAddAttr(attributeValue);
        }
    }, 100)
}
const codeGenerator = (attributeValue) => `<script id="${attributeValue}">${waitAndAddAttr.toString()}; waitAndAddAttr("${attributeValue}");</script>`
// These codes test script codes
const exploreExternalCode = {name: "explore externalCode.js", interceptCode: codeGenerator("explore"), locator: "#explore"}
// These codes test html-element codes
const anotherExternalCode = {name: "External Code 1 - Shared Resource", interceptCode: `<div id="ec-shared-1">External Code 1 - Shared Resource</div>`, locator: "#ec-shared-1"}
// A harmless global external code that won't break any tests if left on permanently - it just console.logs a message
const globalExternalCode = {name: "External Code 3 - Shared Resource", interceptCode: `<script id="global">console.log("Global External Code")</script>`, locator: "#global"}
const targetLanguageName = {name: "Target External Language Name ", interceptCode: `<div id="vex_test3-ec">{{language.name}}</div>`}
const targetLanguageCode = {name: "Target External Language Code", interceptCode: `<div id="vex_test4-ec">{{language.code}}</div>`}
const testSpecificCodes = [targetLanguageName, targetLanguageCode, exploreExternalCode, anotherExternalCode]
const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: "target externalCode.js",
    slug: "target-ec",
    language: "ExternalLanguage.js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: [webContent.title]
}

const explore = {
    name: "externalCode.js",
    slug: "externalcode-js",
    experienceType: 'Target',
    trackName: target.name,
    externalCode: exploreExternalCode.name,
    get url(){
        return `${authoring.common.baseUrl}/l/${this.slug}`
    }
}

describe("Explore - External Code", () => {
    it("Setup if not already done", ()=>{
        cy.request({url: explore.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.deleteExternalCode(testSpecificCodes.map(code => code.name))
                testSpecificCodes.forEach(code => {
                    authoring.configurations.addExternalCode(code)
                })
                authoring.configurations.addNewLanguage({name: target.language, code: "elg"})
                authoring.target.deleteTrack(target.name)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
                authoring.explore.addExplore(explore)
                authoring.explore.configureExplore(explore)
            }
        })
    })

    it("Add, remove external code from explore", () => {
        authoring.common.login()
        authoring.explore.visit()
        authoring.explore.goToExplorePage(explore.name)
        //authoring.explore.configureExplore(explore)
        
        const exploreCodes = [exploreExternalCode.name, anotherExternalCode.name, targetLanguageName.name, targetLanguageCode.name]
        authoring.explore.removeExternalCode(exploreCodes) // This is just a clean up step
        authoring.explore.addExternalCode(exploreCodes) // Includes verification

        // check that external code that was applied to explore has a tag that redirects to that explore page
        authoring.configurations.visit.externalCode()
        cy.contains(authoring.common.table.cellName, exploreExternalCode.name, {timeout: 5000}).click()
        cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
            cy.contains("Not added to any Recommend Tracks").should("exist")
            cy.contains("Not added to any Target Tracks").should("exist")
            cy.contains("Not added to any Microsites").should("exist")
            cy.contains("Not added to any Appearance Configurations").should("exist")
            cy.contains(explore.name)
        })

        cy.contains(authoring.common.table.cellName, anotherExternalCode.name, {timeout: 5000}).click()
        cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
            cy.contains("Not added to any Recommend Tracks").should("exist")
            cy.contains("Not added to any Target Tracks").should("exist")
            cy.contains("Not added to any Microsites").should("exist")
            cy.contains("Not added to any Appearance Configurations").should("exist")
            cy.containsExact("div", explore.name).parent().click({force: true})    
        })
        cy.containsExact(authoring.common.pageTitleLocator, explore.name, {timeout: 5000})

        authoring.explore.removeExternalCode(anotherExternalCode.name)
        authoring.configurations.visit.externalCode()
        cy.contains(authoring.common.table.cellName, anotherExternalCode.name, {timeout: 5000}).click()
        cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
            cy.contains("div", explore.name).should("not.exist")
        })

        // check consumption
        cy.visit(explore.url)
        cy.get(globalExternalCode.locator).should("exist") // From global external code
        cy.get(exploreExternalCode.locator).should("exist")
        cy.get(`div:contains("${target.language}")`).should("exist")
        cy.get(`div:contains("${"elg"}")`).should("exist")
    })
})