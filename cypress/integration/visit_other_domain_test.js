const domain = `${Cypress.env('TEST_ENV')}-wp.com`
const domain_inactive_message = "To activate the promoter, contact your administrator to enable the domain" 

describe('My First Test', function() {
    it("should use commands", ()=>{
        cy.login(c.base_url, c.automationUser, c.automationUserPassword)
    })
})