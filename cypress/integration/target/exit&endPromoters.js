import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-target", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: 'automation-target', tld: 'lookbookhq' })

const webContent = ["Website Common Resource", "Youtube Shared Resource","Ramipril Tab Pm English 20151214","Oracle Cloud captions"]

const target = {
    name: "target-exitForm.js",
    slug: "target-exit",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    exit: "on",
    exitOptions1: {
        promoterHeadline: "Exit Promoter Test",
        message: "Automation of forms on Exit",
        maxNumber: "3",
        delay: "2"
    },
    exitOptions2: {
        item: "Ramipril Tab Pm English 20151214",
        delay: "1"
    },
    exitOptions3: {
        form: "Standard Form Email Only",
        delay: "0"
    }
}

const email = "ExitForm@pathfactory.com"
const grandparent = document.querySelector('span')

const targetwithEndPromoter = {
    name: "target-exitForm.js",
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
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        authoring.target.addContent([webContent[0]])
        authoring.target.addContent([webContent[1]])
        authoring.target.addContent([webContent[2]])
        authoring.target.addContent([webContent[3]])
        authoring.target.configure(target)
        authoring.target.configureExit(target.exitOptions1)
        //cy.visit(target.url + "/commonresource")

        cy.wait(2000)
        document.getElementById('root').onmouseleave = MouseLeave;
        function MouseLeave() {
            document.getElementById('root')
        }
        // document.onload = () => {}
        // grandparent.addEventListener("mouseleave", e =>{
        //       console.log("e")
        // })

        // document.getElementById('root').addEventListener("mouseleave", function(e){
        //           e.
        // })

       // document.querySelector(' .enter p').addEventListener('mouseleave', leaving)
        cy.contains('#qa-modal', "Exit Promoter Test").should("exist").within(() => {
            cy.contains('div', "Ramipril Tab Pm English 20151214").should("exist")
            cy.contains('div', "Oracle Cloud captions").should("exist")
            cy.contains('div', "Youtube Shared Resource").should("exist").click()
        })

        cy.wait(500)
        cy.contains('span', "Starship | SN8 | High-Altitude Flight Test").should("exist")
        cy.wait(2000)
 
        cy.contains('#qa-modal', "Exit Promoter Test").should("exist").within(() => {
            cy.contains('div', "Ramipril Tab Pm English 20151214").should("exist")
            cy.contains('div', "Oracle Cloud captions").should("exist")
        })

         })

         it("Validate exit promoter", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.goToTrack(target.name)
            authoring.target.configureExit(target.exitOptions2)
            cy.clearCookies()
            cy.visit(target.url + "/commonresource")
            cy.wait(1000)
            cy.contains('#qa-modal', "Exit Promoter Test").should("exist").within(() => {
                cy.contains('div', "Ramipril Tab Pm English 20151214").should("exist").click()
            cy.wait(100)
              // cy.contains('span', "Manufacturer's Standard").should("exist")
            })

         })

         it("Validate exit promoter", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.goToTrack(target.name)
            authoring.target.configureExit(target.exitOptions3)
            cy.clearCookies()
            cy.visit(target.url + "/commonresource")
            cy.wait(5000)
            cy.contains('#qa-modal', "Exit Promoter Test").should("exist").within(() => {
            cy.wait(100)
            cy.get('#qa-standard-form').should("exist")
        })
            //when user click 'X' on form make sure it shouldn't appear again untill user refersh the page
            cy.get(consumption.common.closeModalButton).should("exist").click()
            cy.reload()
            cy.wait(3000)
            cy.contains('#qa-modal', "Exit Promoter Test").should("exist")
            cy.get('#qa-standard-form').should("exist")
            cy.get(consumption.common.standardForm.emailInput).type(email)
            cy.contains('button', "Submit").click()

            cy.reload()
            //ensure once user submit the form it shouldn't re-Appear
            cy.wait(3000)
            cy.contains('#qa-modal', "Exit Promoter Test").should("not.exist")
         })
            
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

         it("Validate end promoter", () => {
            authoring.common.login()
            authoring.target.visit()
            authoring.target.configure(targetwithEndPromoter)
            authoring.target.configureEndPromoter(targetwithEndPromoter.endPromoterOptions1)
            cy.visit(target.url + "/commonresource")
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
            cy.visit(target.url + "/commonresource")
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