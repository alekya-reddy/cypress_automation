import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexAppearance.js',
    slug: 'vexappearance-js',
    form: 'Standard Form Short', // The form button color is set to blue rgb(0,0,255)
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const appearance = {
    appearance: "vexAppearance.js",
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle',
    contentTitle: "VEX Content Title",
    contentDescription: "VEX Content Description",
}

const navItem = {
    label: "Text",
    type: "Text"
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
    it('Configure appearance on authoring side then verify on consumption', function() {
        authoring.common.login();
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        cy.contains('a', 'Preview Event').should('exist').should('have.attr', 'href', event.url)
        cy.contains('a', 'Appearance Setup').click()
        cy.containsExact('[class="ant-card-head"]', 'Event Appearance').should('exist')
        cy.contains('a', 'Preview Event').should('have.attr', 'href', event.url)

        authoring.vex.configureAppearance(appearance)

        // Delete any navigation items that might have been left from previous run
        authoring.vex.deleteAllNavItems()
        cy.wait(1500)

        // Go to consumption side and verify settings got applied 
        cy.visit(event.url)

        // Check the text fields
        cy.contains(consumption.vex.eventHeroTitle, appearance.headerTitle, {timeout: 20000}).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, appearance.headerSubtitle).should('exist')
        cy.contains(consumption.vex.eventContentTitle, appearance.contentTitle).should('exist')
        cy.contains(consumption.vex.eventContentDescription, appearance.contentDescription).should('exist')

        // Check the header appearance settings 
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get("img[src='https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg']").should('exist')
            cy.contains('a', event.name).should("have.css", "font-family", "Tahoma")
        })

        // Check the explore appearance settings (the hero and event container)
        cy.get(consumption.vex.vexHeroContainer).should("have.css", "background-color", "rgb(0, 255, 0)")
            .should("have.css", "background-image", `url("https://img.cdn.lookbookhq.com/stock/sm/animal-dog-pet-cute.jpg")`)
        cy.get(consumption.vex.vexEventContainer).eq(1).parent().should("have.css", "background-color", "rgb(0, 0, 255)")

        // Check the form submit button color (controlled on the form configuration itself)
        cy.contains("button", "Submit").should("have.css", "background-color", "rgb(0, 0, 255)")

        // Check the general appearance settings (controls the form appearance)
        cy.get(consumption.vex.vexFormTitle).should("have.css", "color", "rgb(255, 0, 255)").should("have.css", "font-family", "Overpass")
        cy.get(consumption.vex.vexFormDescription).should("have.css", "color", "rgb(0, 255, 255)").should("have.css", "font-family", "Overpass")

        // Go to session and check the flow appearance settings (event session sidebar)
        cy.contains("a", "Youtube").click()
        consumption.vex.fillStandardForm({email: "getOutOfMyWay@gmail.com"}) // Settings (other than the blue button) not applied to form on session page... not sure if this is intended?
        cy.get(consumption.vex.sessionSidebar, {timeout: 20000}).should("have.css", "background-color", "rgb(255, 255, 0)")
        cy.get(consumption.vex.supplementalContent).children("li").eq(0).invoke("attr", "style").then((style)=>{
            expect(style).to.include("color: rgb(255, 0, 0); font-family: Roboto; font-size: 15px; font-weight: normal;")
        })

        // Return to authoring and add a navigation item - this will replace the event/session header with a navigation header
        cy.go("back")
        cy.go("back")
        authoring.vex.addNavItem(navItem)
        cy.wait(1500)

        // Go back to consumption and verify the appearance settings of the navigation header 
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get(consumption.vex.vexHeaderMenuItem).should("have.css", "font-family", "Tahoma")
        })
    })
})