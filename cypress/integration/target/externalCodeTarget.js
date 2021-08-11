import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = contents["Website Common Resource"]

const targetLanguageName = {name: "Target External Language Name ", interceptCode: `<div id="vex_test3-ec">{{language.name}}</div>`}
const targetLanguageCode = {name: "Target External Language Code", interceptCode: `<div id="vex_test4-ec">{{language.code}}</div>`}
const testSpecificCodes = [targetLanguageName, targetLanguageCode]

const target = {
    name: "target-externalcode.js",
    slug: "target-ec",
    contents: [webContent.title],
    externalCode: targetLanguageName.name,
    language: "ExternalLanguage.js",
    formsStrategy: "on",
    formsStrategyOptions: {
        trackRule: {
            form: "target-externalcode.js",
            timeOnTrack: '0',
            showToUnknown: "on",
            showToKnown: "off",
            dismissable: "on"
        }
    },
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

describe("Target - Language External Code and Forms", () => {
    it("Setup if not already done", ()=>{
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.deleteExternalCode(testSpecificCodes.map(code => code.name))
                testSpecificCodes.forEach(code => {
                    authoring.configurations.addExternalCode(code)
                    cy.contains(authoring.common.table.cellName, exploreExternalCode.name, {timeout: 5000}).click()
                    cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
                        cy.contains("Not added to any Target Tracks").should("exist")
                    })
                })
                authoring.configurations.addNewLanguage({name: target.language, code: "elg"})
                authoring.target.deleteTrack(target.name)
                authoring.target.addTrack(target)
                authoring.target.configure(target)
            }
        })
    })

    it("Add, remove external code from Target", () => {
        authoring.common.login()
        authoring.target.visit()
        authoring.target.goToTrack(target.name)

        const targetCodes = [targetLanguageName.name, targetLanguageCode.name]
        authoring.target.removeExternalCode(targetCodes) // This is just a clean up step
        authoring.target.addExternalCode(targetCodes) // Add to recommend target code field

        cy.visit(authoring.configurations.pageUrls.externalCode)
        cy.contains(authoring.common.table.cellName, targetCodes[1], { timeout: 5000 }).click()
        cy.containsExact("div", target.name).parent().click({force: true})  
        cy.containsExact(authoring.common.pageTitleLocator, target.name, {timeout: 5000})
        
        // check consumption
        cy.visit(target.url)
        cy.get(`div:contains("${target.language}")`).should("exist")
        cy.get(`div:contains("${"elg"}")`).should("exist")
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 10000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", target.language ).should("exist")
            cy.contains("p", "elg" ).should("exist")
        })
    })

})