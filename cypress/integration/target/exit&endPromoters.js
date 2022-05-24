import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Website Common Resource", "Youtube Shared Resource","Ramipril Tab Pm English 20151214","Oracle Cloud captions"]

const email = "ExitForm@pathfactory.com"

const targetwithEndPromoter = {
    name: "target-exitForm.js",
    slug: "target-form",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    exit: "off",
    endPromoter: "on",
    endPromoterOptions1: {
        link: "http://www.google.com/",
        ctaLabel: "link",
        delay: "1"
    },
      
     endPromoterOptions2: {
        cta: "Standard Form Email Only",
        delay: "1"
    },
}

const targetwithForm = {
        name: "target-exitForm.js",
        formsStrategyOptions: {
     trackRule: {
        form: "dynamicFieldMergeTarget.js",
        timeOnTrack: '0',
        showToUnknown: "on",
        showToKnown: "on",
        dismissable: "on"
    }
  }
}

describe("Target - Add New content", () => {
            
         it("Validate exit promoter", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.configure(targetwithForm)
            cy.clearCookies()
            cy.visit(target.url + "/commonresource")
            //Ensure When form stratergy has set then that form always should take precedence over exit form
            cy.get('#qa-custom-form').should("exist")
            cy.contains('#qa-modal', "Exit Promoter Test").should("not.exist")
            //Ensure when user use 'X' button on formstratergy it shouldn't appear again and exit form should shows up
            cy.get(consumption.common.closeModalButton).should("exist").click()

            cy.wait(3000)

            cy.contains('#qa-modal', "Exit Promoter Test").should("exist")
            cy.get('#qa-standard-form').should("exist")
            

         })

         it.only("Validate end promoter", () => {
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
            cy.get('#qa-flow-next-teaser-wrapper').click()
            cy.wait(100)
            cy.get('#qa-flow-next-teaser-wrapper').click()
            cy.wait(100)
            cy.get('#qa-flow-next-teaser-wrapper').click()
            cy.wait(100)
            cy.contains('a', "link").click()
         })

         it.only("Validate end promoter", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.configure(targetwithEndPromoter)
            authoring.target.configureEndPromoter(targetwithEndPromoter.endPromoterOptions2)
            cy.visit(targetwithEndPromoter.url + "/commonresource")
            cy.wait(100)
            cy.get('#qa-flow-next-teaser-wrapper').click()
            cy.wait(100)
            cy.get('#qa-flow-next-teaser-wrapper').click()
            cy.wait(100)
            cy.get('#qa-flow-next-teaser-wrapper').click()
            cy.wait(100)
           cy.get('#endPromoterCTA').click()
           cy.get('#qa-standard-form').should("exist")
           cy.get(consumption.common.closeModalButton).should("exist").click()
           cy.wait(100)
           cy.get('#endPromoterCTA').should("exist").click()
           cy.wait(100)
           cy.get(consumption.common.standardForm.emailInput).type(email)
           cy.contains('button', "Submit").click()
           cy.reload()
           cy.get('#endPromoterCTA').should("exist")
        
         })
           
    })