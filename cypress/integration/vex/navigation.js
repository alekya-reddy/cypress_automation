import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'navigation.js',
    slug: 'navigation-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}



describe("VEX - Navigation Builder", ()=>{
    it("Set up if not already done", ()=>{
        cy.visit(event.url)
    })
})