import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const domainName = "pathfactory-qa-wp.com"
const websitePath = "automation-analytics"
const contentpoolName = "Wordpress"
const queryString = "?lb-mode=preview"
const consumptionURL = "http://"+domainName+"/"+websitePath+"/"+queryString
const targetElementID = "content"

const featuredContent= [
{
    contentType: 'contentLibrary',
    content: 'Australia - Wikipedia',
},

{
    contentType: 'Target Content Track',
    track: 'T2 Promoters',
    content: 'What Buying a New Car Can Teach B2B Marketers about the Buyer’s Journey',
},

{
    contentType: 'Recommend Content Track',
    track: 'Analytics',
    content: 'Lb Battlecard Corporate Web',
}
]

describe("Configure and Validate Content adding option with view options", () => {
    it("Configure Content adding options on WT", () => {
        authoring.common.login()
        authoring.websiteTools.visit()
        cy.ifElementExists(`div[title="${domainName}"]`, 1000, ()=>{
            cy.contains("button", "Delete").click()
         cy.contains(authoring.common.antModal, "Are you sure?").contains("button", "Delete").click()
     })
        cy.get(authoring.websiteTools.addProperty).click()
            cy.get(authoring.websiteTools.antModal).within(() => {
                cy.get(authoring.websiteTools.enterDomainName).type(domainName)
                cy.get(authoring.websiteTools.addProperty).click()
            })
            cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
                cy.contains("button", "Manage").click()
            })
            cy.contains("a","Add Website Path").click()
            cy.get(authoring.websiteTools.websitePath).type(websitePath)
            cy.contains("span","Guide").click()
            cy.contains("span","Concierge").click()
            cy.get(authoring.websiteTools.targetElementID).type(targetElementID)
            cy.contains("span","Featured").click()
            featuredContent.forEach((content)=>{
                authoring.websiteTools.addContentToFeatured(content)
            })
            cy.get(authoring.websiteTools.promoterList).click()
            cy.get(authoring.websiteTools.selectOption("both")).click()
            cy.contains("span","Save").click()
    })

    it("View content in Overlay on Consumption", () => {
        cy.visit(consumptionURL)
        cy.wait(2000)
        cy.get(consumption.websiteTools.contentList).should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('What Buying a New Car Can Teach B2B Marketers about the Buyer’s Journey').should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('Lb Battlecard Corporate Web').should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('Australia - Wikipedia').should("exist").click()

        cy.waitForIframeToLoad(consumption.websiteTools.overlayIframe.iframe, 10000)
        cy.wait(1000)
        cy.getIframeBody(consumption.websiteTools.overlayIframe.iframe).within(() => {
           cy.get(consumption.websiteTools.overlayIframe.content).should("exist")
        })
        
    })

    it("Change external link", ()=>{
        authoring.common.login()
        authoring.websiteTools.visit()
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
        cy.get(authoring.websiteTools.pencilIcon).should("exist").click()
        cy.wait(1000)
        cy.get(authoring.websiteTools.modalBody).within(()=>{
            cy.get(authoring.websiteTools.selectOpen).eq(1).click()        
         })
            cy.contains("Open in New Tab").click() 
            cy.contains("span","Save").click()
    })

    it("View content in New Tab on Consumption", () => {
        cy.visit(consumptionURL)
        cy.wait(2000)
        cy.get(consumption.websiteTools.contentList).should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('What Buying a New Car Can Teach B2B Marketers about the Buyer’s Journey').should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('Lb Battlecard Corporate Web').should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('Australia - Wikipedia').should("exist").click()
        cy.get("a").should("have.attr", "href", "#content")
        
    })

    it("Change external link", ()=>{
        authoring.common.login()
        authoring.websiteTools.visit()
        cy.contains(authoring.websiteTools.domainCard, domainName).within(()=>{
            cy.contains("button", "Manage").click()
        })
         cy.get(authoring.websiteTools.pencilIcon).should("exist").click()
            cy.wait(1000)
            cy.get(authoring.websiteTools.modalBody).within(()=>{
                cy.get(authoring.websiteTools.selectOpen).eq(1).click()        
             })
             cy.contains("Open in Current Window").click()
             cy.contains("span","Save").click()
    })
    
    it("View content in Current Window on Consumption", () => {
        cy.visit(consumptionURL)
        cy.wait(2000)
        cy.get(consumption.websiteTools.contentList).should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('What Buying a New Car Can Teach B2B Marketers about the Buyer’s Journey').should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('Lb Battlecard Corporate Web').should("exist")
        cy.get(consumption.websiteTools.featuredblock).contains('Australia - Wikipedia').should("exist").click()
        cy.get('body').should('contain', "Australia")

    })
          
})