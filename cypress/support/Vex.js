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
        this.eventSlugInput = 'input[name="CustomURL"]';
        this.eventDescription = 'textarea[name="description"]';
        this.sessionNameInput = 'input[name="name"]';
        this.onDemandRadio = 'input[value="on_demand"]';
        this.liveRadio = 'input[value="live"]';
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

    addSession(sessionName, type){
        cy.contains('button', 'Add Session').click();
        cy.get(this.antModalBody).within((modal)=>{
            cy.get(this.sessionNameInput).type(sessionName)
        })
        if (type == 'On Demand') {
            cy.get(this.onDemandRadio).click();
        } else if (type == 'Live') {
            cy.get(this.liveRadio).click(); 
        }
        cy.get(this.antModal).contains('button', 'Add Session').click();
    }

    configureEvent(config){
        const event = config.event;
        const newEventName = config.newEventName;
        const slug = config.slug;
        const description = config.description; 
        const manageSessions = config.manageSessions; // Whatever call back you pass in here must return to the event config page 

        cy.contains(this.eventCardLocator, event).contains('button', 'Configure').click()
        cy.get(this.pageTitleLocator).should('contain', event)
        newEventName ? cy.get(this.eventNameInput).type(newEventName) : null; 
        slug ? cy.get(this.eventSlugInput).type(slug) : null;
        description ? cy.get(this.eventDescription).type(description) : null;

        manageSessions ? manageSessions() : null;

        //cy.contains('button', 'Submit').click();
    }
}