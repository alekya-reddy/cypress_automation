//import {base_url, automationUser, automationUserPassword} from './constants.js'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (base_url, automationUser, automationUserPassword) => {
    cy.visit(base_url)
    cy.get('[id="login"]').type(automationUser).should('have.value', 'qa-automation')
    cy.get('[id="password"]').type(automationUserPassword)
    cy.get('input[value="Log in"]').click()
    cy.url().should('include', '/authoring/content-library')
})

