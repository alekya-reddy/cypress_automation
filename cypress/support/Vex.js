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
        this.goToPage(this.vexPageTitle, this.vexUrl)
        cy.contains('button', 'Add Virtual Event').click()
        cy.get(this.eventNameInput).type(eventName)
        cy.get(this.addEventModalFooter).contains('button', 'Add Virtual Event').click()
        cy.ifElementHasText(this.antModalBody, 'has already been taken', 10000, () => {
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