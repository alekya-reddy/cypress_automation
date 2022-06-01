import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Website Common Resource", "Youtube Shared Resource","Ramipril Tab Pm English 20151214","Oracle Cloud captions"]

const email = "EndForm@pathfactory.com"

const targetwithEndPromoter = {
    name: "target-endForm.js",
    slug: "target-form",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    exit: "off",
    endPromoter: "on",
    endPromoterOptions1: {
        link: "https://www.google.com/",
        ctaLabel: "link",
        delay: "1"
    },
      
     endPromoterOptions2: {
        cta: "Standard Form Email Only",
        delay: "1"
    },
}

const targetwithForm = {
        name: "target-endForm.js",
        formsStrategyOptions: {
     trackRule: {
        form: "Standard Form",
        timeOnTrack: '0',
        showToUnknown: "on",
        showToKnown: "on",
        dismissable: "on"
    }
  }
}

describe("Target - Add New content", () => {

         it("Validate end promoter when type is set to link", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.deleteTrack(targetwithEndPromoter.name)
            authoring.target.addTrack(targetwithEndPromoter)
            authoring.target.addContent([webContent[0]])
            authoring.target.addContent([webContent[1]])
            authoring.target.addContent([webContent[2]])
            authoring.target.addContent([webContent[3]])
            authoring.target.configure(targetwithEndPromoter)
            authoring.target.configureEndPromoter(targetwithEndPromoter.endPromoterOptions1)
            cy.visit(targetwithEndPromoter.url + "/commonresource")
            cy.wait(100)
            //verify endPromoter will show up at the end of visiting  all assets
            cy.get(consumption.target.endPromoterBlock).click()
            cy.wait(100)
            cy.get('#endPromoterCTA').should('not.exist')
            cy.get(consumption.target.endPromoterBlock).click()
            cy.wait(100)
            cy.get('#endPromoterCTA').should('not.exist')
            cy.get(consumption.target.endPromoterBlock).click()
            cy.wait(100)
            cy.get('#endPromoterCTA').should('not.exist')
            //verify it redirects to correct link when type = link has set
            cy.window().then(win => win.location.href = targetwithEndPromoter.endPromoterOptions1.link);
             cy.url().should('contain', targetwithEndPromoter.endPromoterOptions1.link)
      })

         it("Validate end promoter when type is set to cta", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.configure(targetwithEndPromoter)
            authoring.target.configureEndPromoter(targetwithEndPromoter.endPromoterOptions2)
            cy.visit(targetwithEndPromoter.url + "/commonresource")
            cy.wait(100)
            cy.get('#endPromoterCTA').should('not.exist')
            cy.get(consumption.target.endPromoterBlock).click()
            cy.wait(100)
            cy.get('#endPromoterCTA').should('not.exist')
            cy.get(consumption.target.endPromoterBlock).click()
            cy.wait(100)
            cy.get('#endPromoterCTA').should('not.exist')
            cy.get(consumption.target.endPromoterBlock).click()
            cy.wait(100)
            cy.get('#endPromoterCTA').click()
            cy.get('#qa-standard-form').should("exist")
            cy.get(consumption.common.closeModalButton).should("exist").click()
            cy.wait(100)
            cy.get('#endPromoterCTA').should("exist").click()
            cy.wait(100)
           //verify once end promoter filled out and submitted it should close the modal, however endPromoter will still there and popus form when clicking on it
            cy.get(consumption.common.standardForm.emailInput).type(email + "\n")  
            cy.reload()
            cy.get('#endPromoterCTA').should("exist")   

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

         it("Validate end promoter when type is set to cta", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.configure(targetwithForm)
            cy.clearCookies()
            cy.visit(targetwithEndPromoter.url + "/watch")
            //Ensure When form stratergy has set then that form always should take precedence over endform
            cy.get(consumption.target.endPromoterTitle).should('have.text', ' Standard Form').should("exist")
            cy.contains('#qa-modal', "Exit Promoter Test").should("not.exist")
            cy.wait(300)
            //Ensure when user use 'X' button on formstratergy it shouldn't appear again and endform should shows up
            cy.get(consumption.common.closeModalButton).should("exist").click({force:true})
            cy.reload()
            cy.contains('#qa-modal', "Standard Form").should("not.exist")
            cy.wait(3000)
            cy.get('#endPromoterCTA').should("exist").click()
            cy.contains('#qa-modal', "Exit Promoter Test").should("exist")    
         })

         it("Validate end promoter when type is set to cta", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.configure(targetwithForm)
            cy.clearCookies()
            cy.visit(targetwithEndPromoter.url + "/watch")
            //Ensure When form stratergy has set then that form always should take precedence over end form
            cy.get(consumption.target.endPromoterTitle).should('have.text', ' Standard Form').should("exist")
            cy.get('#endPromoterCTA').should("not.exist")
            cy.contains('#qa-modal', "Exit Promoter Test").should("not.exist")
            cy.wait(100)
            cy.get('#emailInput').type(email + "\n")

            //Ensure when user use 'X' button on formstratergy it shouldn't appear again and end form should shows up
            cy.reload()
            cy.get('#endPromoterCTA').should("exist").click()
            cy.get('#qa-standard-form').should("exist") 
            cy.contains('#qa-modal', "Exit Promoter Test").should("exist")  
         })
           
    })