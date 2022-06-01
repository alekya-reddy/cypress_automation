import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})
const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: 'ctaTest.js',
    slug: 'ctatest-js',
    contents: [webContent.title],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/commonresource`
    },

}

const Flowctas =[
        {
            ctaNumber: "CTA 1",
            flowCTA: "formCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        }, 
        {
            ctaNumber: "CTA 2",
            flowCTA: "linkCTA",
            location: "After assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        },
        {
            ctaNumber: "CTA 3",
            flowCTA: "emailCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: false

        }
    ]

describe("Target CTA buttons", () => {
it("Add and delete CTA buttons", () => {
    authoring.common.login()
    authoring.target.visit()
    //authoring.recommend.goToTrack(recommend.name)
    authoring.target.deleteTrack(target.name)
    authoring.target.addTrack(target)
    authoring.target.configure(target)

    // turn CTA toggle ON
    authoring.common.toggle(authoring.target.pageSidebar.flowToggle, 'ON')    
    Flowctas.forEach((cta)=>{
    authoring.target.configureFlowCTA(cta)
    })

    cy.visit(target.url) 
    cy.wait(1000)
    cy.contains("button", "formcta").should("exist")
        //verify specific alignment selected gets applied to the cells
     cy.get(consumption.target.ctaButtonClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                                       .should("have.css", "color", "rgb(72, 61, 30)")
                    
    cy.window().then((win) => {
    cy.get(consumption.target.ctaButtonClass).then(($el) => {
    expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                                    
       })
  })

  cy.contains("a", "linkcta").should("exist")
       cy.get(consumption.target.ctaLinkClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                  .should("have.css", "color", "rgb(72, 61, 30)")
     cy.window().then((win) => {
     cy.get(consumption.target.ctaLinkClass).then(($el) => {
     expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                
             })
        })

    cy.contains("a", "emailcta").should("exist")
       cy.get(consumption.target.ctaLinkClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                  .should("have.css", "color", "rgb(72, 61, 30)")
      cy.window().then((win) => {
     cy.get(consumption.target.ctaLinkClass).then(($el) => {
    expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                
                     })
               })
      })

    })

