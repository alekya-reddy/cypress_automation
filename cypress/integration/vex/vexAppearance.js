import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexAppearance.js',
    slug: 'vexappearance-js',
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle',
    contentTitle: "VEX Content Title",
    contentDescription: "VEX Content Description",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
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
        cy.contains(consumption.vex.eventHeroTitle, event.headerTitle).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, event.headerSubtitle).should('exist')
        cy.contains(consumption.vex.eventContentTitle, event.contentTitle).should('exist')
        cy.contains(consumption.vex.eventContentDescription, event.contentDescription).should('exist')
    })
})