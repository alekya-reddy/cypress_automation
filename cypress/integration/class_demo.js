import { createAuthoringInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance(); // Create authoring page object instance like this. If want to login as different user than the default 'qa-automation', 
// or use different org than default 'automation', or use different domain than default 'pathfactory-qa', pass in arguments to the function: 
// const defaultAuthoring = createAuthoringInstance({env: 'pathfactory-staging', org: 'default', username: 'Bobman', password: 'Password123', customBaseUrl: 'https://default.staging2.lookbookhq.com'}); 

const domain = `${Cypress.env('TEST_ENV')}-wp.com`
const domain_inactive_message = "To activate the promoter, contact your administrator to enable the domain" 

describe('My First Test', function() {
    beforeEach(function(){
        authoring.common.login();
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, 'on')
    })
    it('If domain inactive, should have an indicator in website tools that says the domain is inactive', function() {
        authoring.webdomainSettings.configureWebdomain({domain: domain, enableTracking: false, cookieConsentRequired: true})
        authoring.websiteTools.visit()
        authoring.websiteTools.selectWebdomain(domain)
        cy.get(authoring.websiteTools.webdomainInactiveMessage).should('contain', domain_inactive_message) 
    })
    it('If domain active, there should not be an indicator', function() {
        authoring.webdomainSettings.configureWebdomain({domain: domain, enableTracking: true, cookieConsentRequired: true})
        authoring.websiteTools.visit()
        authoring.websiteTools.selectWebdomain(domain) 
        cy.get(authoring.websiteTools.webdomainInactiveMessage).should('not.contain', domain_inactive_message)
    })
    after(()=>{
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.websiteToolsToggle, 'off')
    })
})