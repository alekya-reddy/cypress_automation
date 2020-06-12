import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance(); 

describe('VEX - Virtual Event', function() {
    it('When both virtual event and new navigation toggles are toggled on, vex navigation should be visible, and it should take you to vex page', function() {
        authoring.common.login();
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'on');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');
        cy.get(authoring.common.vexNavigation).should('exist');
        cy.get(authoring.common.vexNavigation).click(); 
        cy.get(authoring.common.pageTitleLocator).should('contain', authoring.vex.virtualEventHomeTitle);
    })
    it('When virtual event toggled off, vex navigation should not be visible, and entering url directly should not allow you to get to the page', function() {
        authoring.common.login();
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'on');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off');
        cy.get(authoring.common.vexNavigation).should('not.exist');
        cy.visit(authoring.vex.vexUrl)
        cy.get('body').should('contain', 'The Virtual Events module is not enabled for your instance');
    })
    //Not testing when 1 off but other is on because eventually it'll just be the vex toggle 
    it('Afterhook to turn off vex', ()=>{
        authoring.common.login()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.newNavigationToggle, 'off');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off');
    })
})