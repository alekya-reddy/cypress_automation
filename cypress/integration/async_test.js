import { createAuthoringInstance } from '../support/pageObject.js';

const authoring = createAuthoringInstance(); 

describe('My First Test', function() {
    it('test to see order of cy commands', function() {
        cy.log("Log 1")
        cy.log("log 2")
        let conditionObject = {matchFound: false};
        for(let i = 3; i <= 5 ; i++) {
            cy.wait(1000);
            cy.log(`log ${i}`);
            if(i == 4){
                conditionObject.matchFound = true;
            }
        }
        if (conditionObject.matchFound){
            cy.log('between 5 and 6')
        }
        /*let count = 3;
        setInterval(()=>{cy.log(`log ${count}`); count++}, 100)*/
        cy.log('log 6')
        cy.log('log 7')
    })
})