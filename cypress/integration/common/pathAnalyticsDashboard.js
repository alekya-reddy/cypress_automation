import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'


const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org

const campaignTools = {
   url : "https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com/authoring/content-library/path-analytics/campaign-tools"
}

const websiteTools = {
    url : "https://automation."+authoring.common.env.TEST_ENV+"-pathfactory.com/authoring/content-library/path-analytics/website-tools-pa"
}

describe("PathAnalytics Dashboard", function() {

    it("Verify Analytics Page Loads", () => {
        authoring.common.login()
        cy.visit(campaignTools.url)
        cy.contains('div',"Overview", {timeout: 25000}).should("exist")
        cy.contains('button', "Search").should("exist")
        cy.wait(8000)
        cy.waitForIframeToLoad('iframe', 10000)
        cy.getIframeBody('iframe').within(() => {
        cy.contains('span',"Engaged Intent", {timeout: 10000}).should("exist")
        cy.contains('span',"Accounts").should("exist")
        cy.contains('span',"Visitors").should("exist")
        cy.contains('span',"Content Assets Viewed").should("exist")
        cy.get('div[id="lk-dashboard-container"]').should("exist")

    })
})
        it("Verify Analytics Page Loads", () => {
        authoring.common.login()
        cy.visit(campaignTools.url+"/visitors")
        cy.contains('div',"Visitor Overview", {timeout: 20000}).should("exist")
        cy.wait(8000) 
        cy.waitForIframeToLoad('iframe', 10000)
        cy.getIframeBody('iframe').within(() => {  
            cy.contains('span',"Unknown Visitors").should("exist")
            cy.contains('span',"Known Visitors").should("exist")
            cy.contains('span',"Bingers").should("exist")
            cy.contains('span',"Binge Rate").should("exist")   

       })
    })

    it("Verify Analytics Page Loads", () => {
        authoring.common.login()
       cy.visit(campaignTools.url+"/content")
       cy.contains('div',"Content Overview", {timeout: 20000}).should("exist")
       cy.wait(8000)     
       cy.waitForIframeToLoad('iframe',  10000)
       cy.getIframeBody('iframe').within(() => {
       cy.contains('span',"Incremental Asset Views", {timeout: 10000}).should("exist")
       cy.contains('span',"Content Performance").should("exist")
       cy.contains('span',"Bottom Assets").should("exist")
       cy.contains('span',"Top Assets").should("exist")

       }) 
    }) 

        it("Verify Analytics Page Loads", () => {
            authoring.common.login()
           cy.visit(campaignTools.url+"/accounts")
           cy.contains('div',"Account Overview", {timeout: 20000}).should("exist")
           cy.wait(8000)   
           cy.waitForIframeToLoad('iframe', 10000)
           cy.getIframeBody('iframe').within(() => {  
           cy.contains('strong'," Filters").should("exist").click()
           cy.get('table[class="explore-filters clearfix"]').should("exist")
           cy.contains('span',"Returning Accounts").should("exist")
           cy.contains('span',"Overall Account Engagement").should("exist")
           cy.contains('span',"Bottom Accounts").should("exist")
           cy.contains('span',"Top Accounts").should("exist")

           })    
    }) 
            it("Verify Analytics Page Loads", () => {
                authoring.common.login()
               cy.visit(campaignTools.url+"/reports")
               cy.contains('div', "Account Insights" ,{timeout: 20000}).should("exist")
               cy.contains('a',"Visitor Performance").should("exist").click()
               cy.wait(8000)
               cy.waitForIframeToLoad('iframe', 10000)
               cy.getIframeBody('iframe').within(() => {  
               cy.contains('h1',"Contextual Overview").should("exist")
               cy.contains('h1',"Visit Behavior").should("exist")
            
               })        
        }) 

        it("Verify Analytics Page Loads", () => {
            authoring.common.login()
           cy.visit(campaignTools.url+"/reports")
           cy.get('div[data-qa-hook="path-analytics-tile"]', {timeout: 20000}).should("exist")
           cy.contains('a',"Visitor Performance").should("exist").click()
           cy.wait(8000)
           cy.waitForIframeToLoad('iframe', 10000)
           cy.getIframeBody('iframe').within(() => {  
           cy.contains('h1',"Contextual Overview").should("exist")
           cy.contains('h1',"Visit Behavior").should("exist")
        
           })
    }) 

    it("Verify Analytics Page Loads", () => {
        authoring.common.login()
       cy.visit(websiteTools.url)
       cy.contains('div',"Overview", {timeout: 20000}).should("exist")
       cy.wait(8000)
       cy.waitForIframeToLoad('iframe', 10000)
       cy.getIframeBody('iframe').within(() => { 
       cy.contains('span',"Asset Views (Recommendation Lift)").should("exist")
       cy.contains('h3',"UTM/Referrer Parameters by Unique Visitor").should("exist")
       cy.contains('b',"Trends").should("exist")
     
    })
}) 

it("Verify Analytics Page Loads", () => {
    authoring.common.login()
   cy.visit(websiteTools.url+"/account-overview")
   cy.contains('div',"Account Overview", {timeout: 20000}).should("exist")
   cy.wait(8000)
   cy.waitForIframeToLoad('iframe', 10000)
   cy.getIframeBody('iframe').within(() => {    
   cy.contains('span',"Account - Geographic Distribution").should("exist")
   cy.contains('span',"Account Insights").should("exist")
   cy.contains('b'," Account Engagement").should("exist")
 
   })
}) 

it("Verify Analytics Page Loads", () => {
    authoring.common.login()
   cy.visit(websiteTools.url+"/visitor-overview")
   cy.contains('div',"Visitor Overview", {timeout: 20000}).should("exist")
   cy.wait(8000)
   cy.waitForIframeToLoad('iframe', 10000)
   cy.getIframeBody('iframe').within(() => {    
   cy.contains('span',"Visitors (Recommendation Lift)").should("exist")
   cy.contains('span',"Visitor Engagement").should("exist")

   })
})   

it("Verify Analytics Page Loads", () => {
    authoring.common.login()
   cy.visit(websiteTools.url+"/content-analysis")
   cy.contains('div',"Content Analysis", {timeout: 20000}).should("exist")
   cy.wait(8000)
   cy.waitForIframeToLoad('iframe', 10000)
   cy.getIframeBody('iframe').within(() => {    
   cy.contains('span',"Asset with OG Image").should("exist")
   cy.contains('span',"Asset Level Summary").should("exist")

   })
}) 

it("Verify Analytics Page Loads", () => {
    authoring.common.login()
   cy.visit(websiteTools.url+"/content-compliance")
   cy.contains('div',"Content Compliance", {timeout: 20000}).should("exist")
   cy.wait(8000)
   cy.waitForIframeToLoad('iframe', 10000)
   cy.getIframeBody('iframe').within(() => {    
   cy.contains('span',"Avg SEO Compliance of Web Pages").should("exist")
   cy.contains('span',"Web Page Detail").should("exist")

   })
}) 

it("Verify Analytics Page Loads", () => {
    authoring.common.login()
   cy.visit(websiteTools.url+"/content-engagement")
   cy.contains('div',"Content Engagement", {timeout: 20000}).should("exist")
   cy.wait(8000)
   cy.waitForIframeToLoad('iframe', 10000)
   cy.getIframeBody('iframe').within(() => {    
   cy.contains('span',"Page Views (Recommendation Lift)").should("exist")
   cy.contains('span',"Content Summary").should("exist")

   })
}) 

it("Verify Analytics Page Loads", () => {
    authoring.common.login()
   cy.visit(websiteTools.url+"/recommendations-overview")
   cy.contains('div',"Recommendation Overview", {timeout: 20000}).should("exist")
   cy.wait(8000)
   cy.waitForIframeToLoad('iframe', 10000)
   cy.getIframeBody('iframe').within(() => {    
   cy.contains('b',"Recommendation Analytics").should("exist")
   cy.contains('h3',"Overall Lift in Engagement").should("exist")
   cy.contains('span',"Recommendation Type Breakdown - Page Views").should("exist")

      })
  })

})
