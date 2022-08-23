import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance(); 

describe('VEX - Virtual Event', function() {
    it('When virtual event is toggled on, vex navigation should be visible, and it should take you to vex page', function() {
        if(authoring.common.env.TEST_ENV !== 'prod'){ // No superuser access on prod
            authoring.common.login();
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');
            cy.get(authoring.common.contentActivation).click()
            cy.get(authoring.vex.virtualEventsTab).should('exist').should('not.have.attr', 'style', 'opacity: 0.5;').click();
            cy.get(authoring.common.pageTitleLocator).should('contain', authoring.vex.virtualEventHomeTitle);
            //When virtual event toggled off, you should see vex appearance settings tab
            cy.wait(3000)
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off');
            cy.wait(3000)
            authoring.configurations.visit.appearances(); 
            cy.get(authoring.configurations.appearances.secondaryNav, {timeout: 10000}).within(() => {
                cy.get('a[href$="virtual-event"]').should('not.exist');
            })
        }
    })
    it('When virtual event toggled off, you should see a marketing text for VEX', function() {
        if(authoring.common.env.TEST_ENV !== 'prod'){
            authoring.common.login();
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'off');
            cy.get(authoring.common.contentActivation).click()
            cy.get(authoring.vex.virtualEventsTab).should('exist').click();
            cy.contains('PathFactory’s VEX offers an easy to use solution that allows you to package videos').should('exist');
            cy.get("a[href*='https://lp.pathfactory.com/drive-more-value-with-pathfactory.html?product_request=VEX']").should('exist');
            //When virtual event toggled off, you should not see vex appearance settings tab
            authoring.configurations.visit.appearances(); 
            cy.get(authoring.configurations.appearances.secondaryNav).within(() => {
                cy.get('a[href$="virtual-event"]').should('not.exist');
            })
            authoring.clientHQ.visit()
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.virtualEventToggle, 'on');
        }
    })
})
