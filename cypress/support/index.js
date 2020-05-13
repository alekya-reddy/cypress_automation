// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax
// Alternatively you can use CommonJS syntax:
// require('./commands')
import './commands'

beforeEach(() => {
    cy.log("Before every test in every spec file, prevent Cypress from failing our tests due to uncaught:exception error, which happens a lot in our application.")
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })
})


