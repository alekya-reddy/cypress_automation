import { login_pathfactory, client_hq_toggle_on, client_hq_toggle_off, configure_webdomain } from './helper_functions.js';
//import {base_url, automationUser, automationUserPassword} from './constants.js'
const c = require('../support/constants.js');

const domain = `${Cypress.env('TEST_ENV')}-wp.com`
const domain_inactive_message = "To activate the promoter, contact your administrator to enable the domain" 

describe('My First Test', function() {
    /*it("is a before all hook" ,()=>{
        login_pathfactory()
        client_hq_toggle_on('[data-qa-hook="enableWebsiteJourney"]')
    })
    it('If domain inactive, should have an indicator in website tools that says the domain is inactive', function() {
        login_pathfactory()
        configure_webdomain({domain: domain, enableTracking: false, cookieConsentRequired: true})
        cy.visit(`${base_url}/authoring/content-library/website-tools`)
        cy.contains(domain).click({force: true}) // I don't understand why it's necessary to force click this, apparently element has width and height of zero... only in Cypress. .pah 
        cy.get('body').should('contain', domain_inactive_message)
    })
    it('If domain active, there should not be an indicator', function() {
        login_pathfactory()
        configure_webdomain({domain: domain, enableTracking: true, cookieConsentRequired: true})
        cy.visit(`${base_url}/authoring/content-library/website-tools`)
        cy.contains(domain).click({force: true}) // I don't understand why it's necessary to force click this, apparently element has width and height of zero... only in Cypress. .pah 
        cy.get('body').should('not.contain', domain_inactive_message)
    })
    it('should visit a different domain', () => {
        cy.visit('https://en.wikipedia.org/wiki/Bohemianism')
    })*/
   /*it('should visit target track and simulate hover over sign post', ()=> {
        cy.visit('https://default.staging2.lookbookhq.com/c/tuxguitar-1?x=mcUghB')
        cy.get('[id="qa-flow-next-wrapper"]').trigger('mouseover', {force: true})
    })*/
    /*it("is an after all hook", ()=>{
        login_pathfactory()
        client_hq_toggle_off('[data-qa-hook="enableWebsiteJourney"]')
    })*/
    it("should use commands", ()=>{
        cy.login(c.base_url, c.automationUser, c.automationUserPassword)
    })
})