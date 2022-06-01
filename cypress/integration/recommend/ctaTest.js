import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})
const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const recommend = {
    name: 'ctaTest.js',
    slug: 'ctatest-js',
    contents: [webContent.title],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/commonresource`
    },

}

const ctas =[
        {
            ctaNumber: "CTA 1",
            ctaName: "formCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        }, 
        {
            ctaNumber: "CTA 2",
            ctaName: "linkCTA",
            location: "After assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        },
        {
            ctaNumber: "CTA 3",
            ctaName: "emailCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: false

        }
    ]

describe("Recommend CTA buttons", () => {
it("Add and delete CTA buttons", () => {
    authoring.common.login()
    authoring.recommend.visit()
    //authoring.recommend.goToTrack(recommend.name)
    authoring.recommend.deleteTrack(recommend.name)
    authoring.recommend.addTrack(recommend)
    authoring.recommend.configure(recommend)

    // turn CTA toggle ON
    authoring.common.toggle(authoring.recommend.pageSidebar.sidebarToggle, 'ON')    
    ctas.forEach((cta)=>{
    authoring.recommend.configureSidebarwithCtas(cta)
    })

    cy.visit(recommend.url) 
    cy.wait(1000)
    cy.contains("button", "formcta").should("exist")
        //verify specific alignment selected gets applied to the cells
     cy.get(consumption.recommend.ctaButtonClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                                       .should("have.css", "color", "rgb(72, 61, 30)")
                    
    cy.window().then((win) => {
    cy.get(consumption.recommend.ctaButtonClass).then(($el) => {
    expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                                    
       })
  })

  cy.contains("a", "linkcta").should("exist")
       cy.get(consumption.recommend.ctaLinkClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                  .should("have.css", "color", "rgb(72, 61, 30)")
     cy.window().then((win) => {
     cy.get(consumption.recommend.ctaLinkClass).then(($el) => {
     expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                
             })
        })

    cy.contains("a", "emailcta").should("exist")
     cy.get(consumption.recommend.ctaLinkClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                  .should("have.css", "color", "rgb(72, 61, 30)")
      cy.window().then((win) => {
     cy.get(consumption.recommend.ctaLinkClass).then(($el) => {
    expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                
                     })
               })
      })

      it("Add and delete CTA buttons", () => {
        authoring.common.login()
        authoring.recommend.visit()
        authoring.recommend.goToTrack(recommend.name)
    
        // turn CTA toggle ON
        authoring.common.toggle(authoring.recommend.pageSidebar.topicSidebarToggle, 'ON')    
        ctas.forEach((cta)=>{
        authoring.recommend.configureTopicSidebarwithCtas(cta)
        })
    
        cy.visit(recommend.url) 
        cy.wait(1000)
        cy.contains("button", "formcta").should("exist")
            //verify specific alignment selected gets applied to the cells
         cy.get(consumption.recommend.ctaButtonClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                                           .should("have.css", "color", "rgb(72, 61, 30)")
                        
        cy.window().then((win) => {
        cy.get(consumption.recommend.ctaButtonClass).then(($el) => {
        expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                                        
           })
      })
    
      cy.contains("a", "linkcta").should("exist")
           cy.get(consumption.recommend.ctaLinkClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                      .should("have.css", "color", "rgb(72, 61, 30)")
         cy.window().then((win) => {
         cy.get(consumption.recommend.ctaLinkClass).then(($el) => {
         expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                    
                 })
            })
    
        cy.contains("a", "emailcta").should("exist")
           cy.get(consumption.recommend.ctaLinkClass).should("have.css", "background-color", "rgb(4, 151, 125)")
                                                      .should("have.css", "color", "rgb(72, 61, 30)")
          cy.window().then((win) => {
         cy.get(consumption.recommend.ctaLinkClass).then(($el) => {
        expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                    
                         })
              })
    
          })
})