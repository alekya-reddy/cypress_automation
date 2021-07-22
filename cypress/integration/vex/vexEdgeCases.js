import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexEdgeCases.js 1',
    slug: '1-vexedgecases-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const event2 = {
    name: 'vexEdgeCases.js 2',
    slug: '2-vexedgecases-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const boldText = "Bold Text Super Unique"
const codeBlockText = "Code Block Super Unique"

describe("VEX - Edge Cases", ()=>{
    it("Setup first event if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.deleteVirtualEvent(event.name)
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.goToAppearance()
                cy.get(authoring.vex.appearance.headerTitle).click()
                cy.get(authoring.vex.appearance.headerTitleInput).clear()
                cy.get(authoring.vex.appearance.headerTitleInput).parent().contains('Save').click()
            }
        })
    })

    it("Setup second event if not already done", ()=>{
        cy.request({url: event2.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.deleteVirtualEvent(event2.name)
                authoring.vex.addVirtualEvent(event2)
                authoring.vex.configureEvent(event2)
                authoring.vex.goToAppearance()
                cy.get(authoring.vex.appearance.contentDescription).click()
                cy.get(authoring.vex.appearance.richTextBold).click()
                cy.get(authoring.vex.appearance.contentDescriptionInput).type(boldText + "\n")
                cy.get(authoring.vex.appearance.richTextCodeBlock).click()
                cy.get(authoring.vex.appearance.contentDescriptionInput).type(codeBlockText + "\n")
                cy.get(authoring.vex.appearance.contentDescriptionInput).parents("form").contains("Save").click()
            }
        })
    })

    it("An event with default landing page that has all empty text fields in hero and body should not result in server error", () => {
        // This bug was caused by null values being passed to the meta tags on baker-side html.erb file
        cy.visit(event.url) // test would fail if this results in 500 error page
    })

    it("An event with default landing page that has styling in description field should not display the description twice", () => {
        // This bug was caused by html elements being passed into meta tags on the baker-side html.erb file
        // This caused the contents of the description field to be rendered at the top of the body along with all the meta tags
        // In addition to being rendered in its normal position
        cy.visit(event2.url)
        cy.contains(boldText).should("exist")
        cy.contains(codeBlockText).should("exist")
        cy.get("body").invoke("text").then(bodyText => {
            const boldTextRegex = new RegExp(boldText, "g")
            const codeBlockRegex = new RegExp(codeBlockText, "g")
            expect(bodyText.match(boldTextRegex).length).to.eq(1)
            expect(bodyText.match(codeBlockRegex).length).to.eq(1)
        })
    })
})