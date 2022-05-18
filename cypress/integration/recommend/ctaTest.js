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
            ctaName: "googleCTA",
            location: "Before assets",
            buttonColor: "#04977d",
            fontColor: "#483d1e",
            addcta: true

        }
    ]

describe("Explore CTA buttons", () => {
it.only("Add and delete CTA buttons", () => {
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
    cy.contains("button", "formcta").should("exist")
        //verify specific alignment selected gets applied to the cells
     cy.get('[class*="pf-multi-cta pf-cta-1"]').should("have.css", "background-color", "rgb(4, 151, 125)")
                                                                       .should("have.css", "color", "rgb(72, 61, 30)")
                    
    cy.window().then((win) => {
    cy.get('button[class*="pf-multi-cta pf-cta-1"]').then(($el) => {
    expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                                    
       })
  })

  cy.contains("a", "linkcta").should("exist")
       cy.get('a[class*="pf-multi-cta pf-cta-2"]').should("have.css", "background-color", "rgb(4, 151, 125)")
                                                  .should("have.css", "color", "rgb(72, 61, 30)")
     cy.window().then((win) => {
     cy.get('a[class*="pf-multi-cta pf-cta-2"]').then(($el) => {
     expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                
             })
        })

    cy.contains("a", "googleCtaLink").should("exist")
       cy.get('a[class*="pf-multi-cta pf-cta-3"]').should("have.css", "background-color", "rgb(4, 151, 125)")
                                                  .should("have.css", "color", "rgb(72, 61, 30)")
      cy.window().then((win) => {
     cy.get('a[class*="pf-multi-cta pf-cta-3"]').then(($el) => {
    expect(win.getComputedStyle($el[0]).width).to.eq('119.945px')
                                                
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
        cy.contains("button", "formcta").should("exist")
            //verify specific alignment selected gets applied to the cells
         cy.get('[class*="pf-multi-cta pf-cta-1"]').should("have.css", "background-color", "rgb(4, 151, 125)")
                                                                           .should("have.css", "color", "rgb(72, 61, 30)")
                        
        cy.window().then((win) => {
        cy.get('button[class*="pf-multi-cta pf-cta-1"]').then(($el) => {
        expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                                        
           })
      })
    
      cy.contains("a", "linkcta").should("exist")
           cy.get('a[class*="pf-multi-cta pf-cta-2"]').should("have.css", "background-color", "rgb(4, 151, 125)")
                                                      .should("have.css", "color", "rgb(72, 61, 30)")
         cy.window().then((win) => {
         cy.get('a[class*="pf-multi-cta pf-cta-2"]').then(($el) => {
         expect(win.getComputedStyle($el[0]).width).to.eq('100px')
                                                    
                 })
            })
    
        cy.contains("a", "googleCtaLink").should("exist")
           cy.get('a[class*="pf-multi-cta pf-cta-3"]').should("have.css", "background-color", "rgb(4, 151, 125)")
                                                      .should("have.css", "color", "rgb(72, 61, 30)")
          cy.window().then((win) => {
         cy.get('a[class*="pf-multi-cta pf-cta-3"]').then(($el) => {
        expect(win.getComputedStyle($el[0]).width).to.eq('119.945px')
                                                    
                         })
              })
    
          })
})