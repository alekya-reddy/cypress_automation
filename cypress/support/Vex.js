import { Common } from "./Common";

export class Vex extends Common {
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.vexUrl = `${this.baseUrl}/authoring/content-library/virtual-events`;
        this.vexPageTitle = 'Virtual Events';
        this.eventCardLocator = '[class*="card-list-item"]';
        this.eventCardTitle = '[class*="card-head-title"]';
        this.eventNameInput = 'input[name="name"]';
        this.addEventModalFooter = '[class="ant-modal-footer"]';
        this.antModalBody = '[class="ant-modal-body"]';
    }

    visit(){
        cy.visit(this.vexUrl);
    }

    addVirtualEvent(eventName){
        cy.log('going to vex')
        this.goToPage(this.vexPageTitle, this.vexUrl)
        cy.log('clicking add virtual event')
        cy.contains('button', 'Add Virtual Event').click()
        cy.log('typing event name into modal')
        cy.get(this.eventNameInput).type(eventName)
        cy.log('clicking button to add virtual event')
        cy.get(this.addEventModalFooter).contains('button', 'Add Virtual Event').click()
        /*cy.wait(2000) // I'd like to avoid arbitrary wait times, but because Cypress doesn't provide ability to wait for a check on an element to return true before returning false, hard waits become necessary
        cy.get(this.antModalBody).invoke('text').then((text)=>{
            if(text.includes('has already been taken')) {
                cy.contains('button', 'Cancel').click()
            }
        })*/

        /*let conditionObject = {};
        this.elementHasText(this.antModalBody, 'has already been taken', 2000, conditionObject)
        cy.get('body').then(()=>{
            if(conditionObject.matchFound == true){
                cy.log(`Match found, so click the button`)
                cy.contains('button', 'Cancel').click()
            } else if (conditionObject.matchFound == 'no') {
                cy.log(conditionObject.matchFound)
                cy.log(`no match found, so don't click the button`)
            }
        })*/

        this.doIfElementHasText(this.antModalBody, 'has already been taken', 2000, ()=>{
            cy.contains('button', 'Cancel').click()
        })
        
        cy.get(this.antModalBody).should('not.be.visible')
        cy.contains(this.eventCardLocator, eventName, {timeout: 10000}).should('exist')
        
    }

    checkEventExists(eventName){
        this.goToPage(this.vexPageTitle, this.vexUrl)
        cy.contains(this.eventCardLocator, eventName, {timeout: 10000}).should('exist')
    }

}