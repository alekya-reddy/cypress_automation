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
    // You do not need to use this function if element with text appears immediately - use this function only if it takes time for this element to exist, if at all
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

Cypress.Commands.add("ifElementExists", (locator, waitTime, callBack) => {
    // locator = the locator of the element that you are checking for
    // waitTime = the maximum wait time in milliseconds 
    // callback = the function that is called if element exists (note: use arrow function for callback or else the 'this' context might be lost) 

    let matchFound = false;
    for(let i = 0; i <= waitTime; i += 500){
        cy.get('body', {log: false}).then((body)=>{
            if(!matchFound && body.find(locator).length > 0){
                matchFound = true;
                callBack();
            } else if (!matchFound) {
                cy.wait(500, {log: false})
            }
        })
    }
})

Cypress.Commands.add("containsExact", (locator, exact_text_to_match)=>{
    let text_regex = new RegExp(`^${exact_text_to_match}$`);
    cy.contains(locator, text_regex);
})

Cypress.Commands.add("ifElementWithExactTextExists", (locator, exact_text_to_match, waitTime, callBack)=>{
    let matchFound = false;
    for(let i = 0; i < waitTime; i += 500){
        cy.get('body', {log: false}).then((body)=>{
            let matches = Cypress.$(locator).filter(function(){
                return Cypress.$(this).text() == exact_text_to_match;
            })
            if(!matchFound && matches.length > 0){
                matchFound = true 
                callBack();
            } else if (!matchFound){
                cy.wait(500, {log: false})
            }
        })
    }
})

Cypress.Commands.add("getIframeBody", (iframeLocator)=>{
    // Highly advised that you use cy.waitFOrIframeToLoad before calling this function, unless you're certain iframe is fully loaded already 
    // If iframe is not fully loaded by the time this gets called, it will get a 'snapshot' of the half-loaded body, which will not update as more elements load 
    cy.get(iframeLocator).should('exist')
    cy.document().then((doc) => {
        let iframe = doc.querySelector(iframeLocator)                             // querySelector is vanilla javascript function to find elements 
        let body = iframe.contentWindow.document.querySelector('body')            // use javascript to find body within the iframe 
        let jElement = Cypress.$(body)                                            // convert js html element to jquery 
        cy.wrap(jElement)                                                         // wrap jquery element with cypress commands, allowing you to chain off this element using cypress
    })
})

Cypress.Commands.add("waitForIframeToLoad", (iframeLocator, elementIndicatorLocator, maxWait) => {
    // elementIndicatorLocator is the element whose presence in the iframe would indirectly indicate that the iframe has fully loaded its contents
    // maxWait is the maximum wait time. If element exists before that time, then there will be no more waiting 

    cy.get(iframeLocator).should('exist') 
    let indicatorLoaded = false
    for(let i = 500; i<maxWait ; i += 500){
        cy.document({log: false}).then((doc)=>{
            let iframe = doc.querySelector(iframeLocator) 
            let element = iframe.contentWindow.document.querySelector(elementIndicatorLocator)
            if( !indicatorLoaded && element){
                indicatorLoaded = true
            } else if ( !indicatorLoaded ) {
                cy.wait(500, {log: false})
            }
        })
    }
})
  
