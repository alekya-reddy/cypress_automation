import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const content = {
    internalTitle: "Form-Asset - webpage embedded",
    url: "https://lp.pathfactory.com/setoTest.html"
}

const target = {
    name: 'formAsset.js',
    slug: 'formAsset',
    contentslug: 'website-shared-resource',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${this.contentslug}`
    }
}

const email = 'cypress@automation.com'

describe("Add Form To Target Track and Verify Analytics", function() {

    it("Setup Target track if not already done", () => { 
        cy.request({url: target.url, failOnStatusCode: false}).then((response)=>{
             if(response.status == 404){ 
                authoring.common.login()
                authoring.target.addTrack(target)
                authoring.target.configure(target)
                authoring.target.addContentTarget(content.internalTitle)

             }
        })
        authoring.common.login()
        authoring.target.visit()
        authoring.target.goToTrack(target.name)
          cy.get(authoring.target.contentClick).click()
          cy.get(authoring.target.previewClick).invoke('removeAttr', 'target')
          cy.get(authoring.target.previewClick).click({force: true})
        //fill form
        cy.waitForIframeToLoad(consumption.target.iframeForEmbeddedForm.iframe ,20000)
        cy.getIframeBody(consumption.target.iframeForEmbeddedForm.iframe).within(()=>{
        cy.get(consumption.target.iframeForEmbeddedForm.email).type(email)
        cy.get(consumption.target.iframeForEmbeddedForm.submitButton).click()

         })
})   
        it("Close sessions", {
            retries: {
              runMode: 0,
              openMode: 0
            }
          }, ()=>{
            if(Cypress.env('TEST_ENV') !== "prod"){
                // Closing sessions in separate it block so can go to different url and clear all cookeis 
                authoring.common.login()
                cy.closeSession()
            } 
        })

it("Verify Target Analytics", () => {
    authoring.common.login()
    authoring.target.visit()
      cy.get(authoring.target.targetAnalytics).click()
      cy.get(authoring.target.visitorButton).trigger('mouseover')
      cy.get(authoring.target.visitorActivities).click()
      cy.wait(30000)
      cy.get(authoring.target.session).contains('Session Details').should("exist")
      cy.get(authoring.target.analyticsRows).within(()=>{
      cy.get(authoring.target.targetAsset).next().contains(email).should("exist")
      
      }) 
})

})