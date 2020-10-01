import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexAppearance.js',
    slug: 'vexappearance-js',
    appearance: "vexAppearance.js",
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle',
    contentTitle: "VEX Content Title",
    contentDescription: "VEX Content Description",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: 'Youtube',
    slug: 'youtube',
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents: [
        'Image - Used by Cypress automation for VEX testing',
        'PDF - Used by Cypress automation for VEX testing',
        'Website - Used by Cypress automation for VEX testing'
    ]
}

// Test the appearance set up area. For now, this test is deliberately sparse because this area will likely change a lot soon 
describe('VEX - Virtual Event', function() {
    it('Test appearance configuration UI on authoring side', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        cy.contains('a', 'Preview Event').should('exist').should('have.attr', 'href', event.url)
        cy.contains('a', 'Appearance Setup').click()
        cy.containsExact('[class="ant-card-head"]', 'Event Appearance').should('exist')
        cy.contains('a', 'Preview Event').should('have.attr', 'href', event.url)

        // Set the appearance
        cy.get(authoring.vex.appearance.input).clear({force: true}).type(event.appearance, {force: true})
        cy.get(authoring.vex.antDropdownOption(event.appearance)).click()
        cy.get(`span[title='${event.appearance}']`).should("exist")
        cy.contains('button:visible', "Save").click()

        // Set the header title 
        cy.get(authoring.vex.appearance.headerTitle).click()
        cy.get(authoring.vex.appearance.headerTitleInput).clear().type(event.headerTitle)
        cy.get(authoring.vex.appearance.headerTitleInput).parent().contains('Save').click()
        cy.get(authoring.vex.appearance.headerTitle, {timeout: 5000}).should('contain', event.headerTitle)

        // Set the header subtitle
        cy.get(authoring.vex.appearance.headerSubtitle).click()
        cy.get(authoring.vex.appearance.headerSubtitleInput).clear().type(event.headerSubtitle)
        cy.get(authoring.vex.appearance.headerSubtitleInput).parent().contains('Save').click()
        cy.get(authoring.vex.appearance.headerSubtitle, {timeout: 5000}).should('contain', event.headerSubtitle)

        // Set the content title 
        cy.get(authoring.vex.appearance.contentTitle).click()
        cy.get(authoring.vex.appearance.contentTitleInput).clear().type(event.contentTitle)
        cy.get(authoring.vex.appearance.contentTitleInput).parent().contains("Save").click()
        cy.get(authoring.vex.appearance.contentTitle, {timeout: 5000}).should('contain', event.contentTitle)

        // Set the content description 
        cy.get(authoring.vex.appearance.contentDescription).click()
        cy.get(authoring.vex.appearance.contentDescriptionInput).clear().type(event.contentDescription)
        cy.get(authoring.vex.appearance.contentDescriptionInput).parent().contains("Save").click()
        cy.get(authoring.vex.appearance.contentDescription, {timeout: 5000}).should("contain", event.contentDescription)
    })

    it('Verify on consumption side that appearance settings got applied', function(){
        cy.visit(event.url)

        // Check the text fields
        cy.contains(consumption.vex.eventHeroTitle, event.headerTitle).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, event.headerSubtitle).should('exist')
        cy.contains(consumption.vex.eventContentTitle, event.contentTitle).should('exist')
        cy.contains(consumption.vex.eventContentDescription, event.contentDescription).should('exist')

        // Check the header appearance settings 
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get("img[src='https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg']").should('exist')
        })

        // Check the explore appearance settings (the hero and event container)
        cy.get(consumption.vex.vexHeroContainer).should("have.css", "background-color", "rgb(0, 255, 0)")
            .should("have.css", "background-image", `url("https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg")`)
        cy.get(consumption.vex.vexEventContainer).eq(1).parent().should("have.css", "background-color", "rgb(0, 0, 255)")

        // Go to session and check the flow appearance settings (event session sidebar)
        cy.contains("a", "Youtube").click()
        cy.get(consumption.vex.sessionSidebar, {timeout: 20000}).should("have.css", "background-color", "rgb(255, 255, 0)")
        cy.get(consumption.vex.supplementalContent).children("li").eq(0).invoke("attr", "style").then((style)=>{
            expect(style).to.include("color: rgb(255, 0, 0); font-family: Roboto; font-size: 15px; font-weight: normal;")
        })
    })
})