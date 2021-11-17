import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const target1 = {
    name: 'ContentTagsTest',
    slug: 'contenttagstest',
    contentslug: 'target1',
    externalCode: 'Content tags test',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${this.contentslug}`
    }
}

const target2 = {
    name: 'ContentTagsTest',
    slug: 'contenttagstest',
    contentslug: 'target2',
    externalCode: 'Content tags test',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/${this.contentslug}`  
    }
}

const content = {
    publicTitle: "Content Tags Test",
    description: "Content Tags Test",
    contentType: "Blog Post",
    topics: ["Animals"],
    language: "English",
    businessUnits: ["Automation"],
    personas:  ["Automation"],
    industries:  ["Automation"],
}

describe("Content Tags Test", function() {
    it("Add Limelight-Video to Content Library", () => {
        cy.request({url: target1.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
               authoring.common.login()
               authoring.target.addTrack(target1)
               authoring.target.configure(target1)
            }
       })

        authoring.common.login()
        authoring.target.visit()
        authoring.target.goToTrack(target1.name)
        cy.contains('strong', "Bay cat Wikipedia").click()
        cy.contains('button', "Open in Cont. Library").should("exist").click({force:true})
         cy.reload()
        authoring.contentLibrary.sideBarEdit(content)
        cy.visit(target1.url)
        cy.get('body').then(()=>{
        cy.get('div[class="business_unit"]').contains("[Automation]").should("exist")
        cy.get('div[class="content_type"]').contains("Blog Post").should("exist")
        cy.get('div[class="topics"]').contains("Animals").should("exist")
        cy.get('div[class="personas"]').contains("[Automation]").should("exist")
        cy.get('div[class="industries"]').contains("[Automation]").should("exist")
        cy.get('div[class="industries_delim"]').contains("Automation").should("exist")
        cy.get('div[class="personas_delim"]').contains("Automation").should("exist")
        cy.get('div[class="topics_delim"]').contains("Animals").should("exist")
        cy.get('div[class="business_unit_delim"]').contains("Automation").should("exist")
        cy.get('div[class="language"]').contains("English").should("exist")
        cy.get('div[class="description"]').contains("Content Tags Test").should("exist")
        
    })

        cy.visit(target2.url)
        cy.get('body').then(()=>{
            cy.get('div[class="business_unit"]').contains("[]").should("exist")
            cy.get('div[class="content_type"]').contains("xyz").should("not.exist")
            cy.get('div[class="topics"]').contains("[]").should("exist")
            cy.get('div[class="personas"]').contains("[]").should("exist")
            cy.get('div[class="industries"]').contains("[]").should("exist")
            cy.get('div[class="industries_delim"]').contains("[]").should("exist")
            cy.get('div[class="personas_delim"]').contains("[]").should("exist")
            cy.get('div[class="topics_delim"]').contains("[]").should("exist")
            cy.get('div[class="business_unit_delim"]').contains("[]").should("exist")
            cy.get('div[class="language"]').contains("English").should("exist")
            cy.get('div[class="description"]').contains("description").should("exist")

        })    
        
    })
})