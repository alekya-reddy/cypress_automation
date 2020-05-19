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

Cypress.Commands.add("ifElementHasText", (locator, textToMatch, waitTime, callBack) => {
    // Use this function to do conditional testing where you want to wait for an element with text to exist before doing something, otherwise move on 
    // Eg. You click a button. As soon as X is true, do A, otherwise wait for maximum of 10 seconds for X to be true before moving on
    // Such a simple concept, yet Cypress developers refuse to give this to us because they hate conditional testing.
    // locator = the locator for the element that might contain the text
    // textToMatch = the text that might appear on the element
    // waitTime = the maximum wait time in milliseconds 
    // callback = the function that is called if text is found on the element  

    let matchFound = false;
    for(let i = 0; i <= waitTime; i += 500){
        cy.get('body', {log: false}).then((body)=>{
            if(!matchFound && body.find(locator).length > 0){
                cy.get(locator, {log: false}).invoke({log: false}, 'text').then((text)=>{
                    if(text.includes(textToMatch)){
                        matchFound = true;
                        callBack();
                    } else {
                        cy.wait(500, {log: false})
                    }
                })
            }
        })
    }
})


