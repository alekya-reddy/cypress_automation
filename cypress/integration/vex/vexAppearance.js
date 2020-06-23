import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexAppearance.js',
    slug: 'vexappearance-js',
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle',
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
        cy.contains('a', 'Appearance Setup').click()
        cy.containsExact('[class="ant-card-head"]', 'Event Appearance').should('exist')
        cy.get(authoring.vex.appearancePreviewHeaderTitle).click()
        cy.get(authoring.vex.appearancePreviewHeaderTitleInput).clear().type(event.headerTitle)
        cy.get(authoring.vex.appearancePreviewHeaderTitleInput).parent().contains('Save').click()
        cy.get(authoring.vex.appearancePreviewHeaderTitle, {timeout: 5000}).should('contain', event.headerTitle)
        cy.get(authoring.vex.appearancePreviewHeaderSubtitle).click()
        cy.get(authoring.vex.appearancePreviewHeaderSubtitleInput).clear().type(event.headerSubtitle)
        cy.get(authoring.vex.appearancePreviewHeaderSubtitleInput).parent().contains('Save').click()
        cy.get(authoring.vex.appearancePreviewHeaderSubtitle, {timeout: 5000}).should('contain', event.headerSubtitle)
    })

    it('Verify on consumption side that appearance settings got applied', function(){
        cy.visit(event.url)
        cy.contains(consumption.vex.eventHeroTitle, event.headerTitle).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, event.headerSubtitle).should('exist')
    })
})