import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const recommendLanguageName = {name: "Recommend External Language Name ", interceptCode: `<div id="vex_test3-ec">{{language.name}}</div>`}
const recommendLanguageCode = {name: "Recommend External Language Code", interceptCode: `<div id="vex_test4-ec">{{language.code}}</div>`}
const testSpecificCodes = [recommendLanguageName, recommendLanguageCode]

const recommend = {
    name: "recommend-externalcode.js",
    slug: "recommend-ec",
    contents: [webContent.title],
    externalCode: recommendLanguageName.name,
    language: "English",
    formsStrategyOptions: {
        trackRule: {
            form: "recommend-externalcode.js",
            timeOnTrack: '0',
            showToUnknown: "on",
            showToKnown: "off",
            dismissable: "on"
        }
    },
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/commonresource`
    }
}

describe("Recommend - Language External Code and Forms", () => {
    it("Setup if not already done", ()=>{
        cy.request({url: recommend.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.deleteExternalCode(testSpecificCodes.map(code => code.name))
                testSpecificCodes.forEach(code => {
                    authoring.configurations.addExternalCode(code)
                })
                authoring.recommend.deleteTrack(recommend.name)
                authoring.recommend.addTrack(recommend)
                authoring.recommend.configure(recommend)
            }
        })
    })

    it("Add, remove external code from Recommend", () => {
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.goToTrack(recommend.name)

        const recommendCodes = [recommendLanguageName.name, recommendLanguageCode.name]
        authoring.recommend.removeExternalCode(recommendCodes) // This is just a clean up step
        authoring.recommend.addExternalCode(recommendCodes) // Add to recommend external code field
        // check consumption
        cy.visit(recommend.url)
        cy.get(`div:contains("${recommend.language}")`).should("exist")
        cy.get(`div:contains("${"en"}")`).should("exist")
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 10000)
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", recommend.language ).should("exist")
            cy.contains("p", "en" ).should("exist")
        })
    })

})