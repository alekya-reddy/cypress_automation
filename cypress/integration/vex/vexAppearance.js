import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance(); 

const event = {
    name: 'vexAppearance.js',
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle'
}

// Test the appearance set up area. For now, this test is deliberately sparse because this area will likely change a lot soon 
describe('VEX - Virtual Event', function() {
    it('Test appearance configuration', function() {
        authoring.common.login();
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'on');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');

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
    it('This is an afterhook to toggle off vex', ()=>{
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'off')
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off')
    })
})