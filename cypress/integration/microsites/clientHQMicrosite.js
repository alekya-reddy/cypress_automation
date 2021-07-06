import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance(); 

describe('Microsites - Client HQs', function() {
    it('When Microsites is toggled on, microsite builder navigation should be visible, and it should take you to microsites page', function() {
        if(authoring.common.env.TEST_ENV !== 'prod'){ // No superuser access on prod 
            authoring.common.login();
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'on');
            authoring.microsites.visit()
            cy.get(authoring.common.pageTitleLocator).should('contain', authoring.microsites.pageTitle);
            //When Microsites is toggled on, you should see Microsites appearance settings tab
            authoring.configurations.visit.appearances(); 
            cy.get(authoring.configurations.appearances.secondaryNav, {timeout: 10000}).within(() => {
                cy.contains('div','Campaign Tools').click() 
            })
            cy.get('a[href$="microsite-builder"]').should('exist');
        }
    })
    it('When Microsites is toggled off, you should see pemission denied message when microsite builder is navigated', function() {
        if(authoring.common.env.TEST_ENV !== 'prod'){
            authoring.common.login();
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'off');
            authoring.microsites.visit()
            cy.contains('The Microsites module is not enabled for your instance.').should('exist');
            //When Microsites is toggled off, you should not see Microsites appearance settings tab
            authoring.configurations.visit.appearances(); 
            cy.get(authoring.configurations.appearances.secondaryNav).within(() => {
                cy.get('a[href$="microsite-builder"]').should('not.exist');
            })
            authoring.clientHQ.visit()
            authoring.clientHQ.clientHQToggle(authoring.clientHQ.micrositesToggle, 'on');
        }
    })
})
