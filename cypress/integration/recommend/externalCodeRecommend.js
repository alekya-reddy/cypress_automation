import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const recommendLanguageName = {name: "Recommend External Language Name ", interceptCode: `<div id="vex_test3-ec">{{language.name}}</div>`}
const recommendLanguageCode = {name: "Recommend External Language Code", interceptCode: `<div id="vex_test4-ec">{{language.code}}</div>`}
const testSpecificCodes = [recommendLanguageName, recommendLanguageCode]
const parentFolderName = ['Root']
const childFolderName = ['AutomationFolderChild']

const recommend = {
    name: "recommend-externalcode.js",
    slug: "recommend-ec",
    contents: [webContent.title],
    externalCode: recommendLanguageName.name,
    language: "ExternalLanguage.js",
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

const recommend2 = {
    name: "EditedTrack"
}

const recommend3 = {
    name: "deleteRecommend1.js",
}

const recommend4 = {
    name: "deleteRecommend2.js",
}

const recommendUsedInExplore = {
    name: "DoNotDelete",
}

const ExploreFromRecommend = "DoNotDelete"

describe("Recommend - Language External Code and Forms", () => {
    it("Setup if not already done", ()=>{
        cy.request({url: recommend.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.configurations.deleteExternalCode(testSpecificCodes.map(code => code.name))
                testSpecificCodes.forEach(code => {
                    authoring.configurations.addExternalCode(code)
                    cy.contains(authoring.common.table.cellName, exploreExternalCode.name, {timeout: 5000}).click()
                    cy.get(authoring.configurations.rightSidebarPreview).parent().within(()=>{
                        cy.contains("Not added to any Recommend Tracks").should("exist")
                    })

                })
                authoring.configurations.addNewLanguage({name: recommend.language, code: "elg"})
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

        cy.visit(authoring.configurations.pageUrls.externalCode)
        cy.contains(authoring.common.table.cellName, recommendCodes[1], { timeout: 5000 }).click()
        cy.containsExact("div", recommend.name).parent().click({force: true})  
        cy.containsExact(authoring.common.pageTitleLocator, recommend.name, {timeout: 5000})
        
        // check consumption
        cy.visit(recommend.url)
        cy.get(`div:contains("${recommend.language}")`).should("exist")
        cy.get(`div:contains("${"elg"}")`).should("exist")
        cy.waitForIframeToLoad(consumption.common.customFormIframe, "p", 10000)
        cy.get('iframe[title="Content Window"]').should("exist")
        cy.getIframeBody(consumption.common.customFormIframe).within(()=>{
            cy.contains("p", recommend.language ).should("exist")
            cy.contains("p", "elg" ).should("exist")
        })
    })

    it("Check Root folder option as a Edit folder", () => {
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.deleteTrack(recommend2.name)
        authoring.recommend.addTrack(recommend2)     
        authoring.recommend.editTrackRecommend({parentFolder: childFolderName})
        authoring.recommend.editTrackRecommend({parentFolder: parentFolderName})
        cy.contains("label","Folder").next().contains("a", "Root").should("exist")

    })
        
      
     it('Verify Delete Option And Error Msg For Multi-Select When Track has been used in Microsite/Explore', function() {
        authoring.common.login();
        authoring.recommend.visit();
        authoring.recommend.addTrack(recommend3)
        authoring.recommend.addTrack(recommend4)
        cy.go("back")
        cy.contains('td', recommend3.name).prev().click()
        cy.contains('td', recommend4.name).prev().click()
        cy.contains('td', recommendUsedInExplore.name).prev().click()
        cy.contains('h5', " Select: ").should("exist")
        cy.contains('h5', "3").should("exist")
        cy.contains('button', " Delete").should("exist").click()
        cy.get(authoring.common.modalBody).within(()=>{
            cy.contains('span', "Yes").should("exist").click()
        })
            cy.contains('div', "Track(s) cannot be deleted").should("exist")
            cy.contains('p', "Before you delete the following track(s), you need to remove it from the following Explore page(s) and/or Microsite(s) and/or Route(s):").should("exist")
            cy.contains('li', "DoNotDelete").should("exist")
            cy.contains('span', "OK").should("exist").click()
        cy.contains('td', recommend3.name).should("not.exist")
        cy.contains('td', recommend4.name).should("not.exist")
        cy.contains('td', recommendUsedInExplore.name).should("exist")

     })
    
})