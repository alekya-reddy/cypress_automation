import { Common } from "./Common";

export class Vex extends Common {
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.vexUrl = `${this.baseUrl}/authoring/content-library/virtual-events`;
        this.virtualEventHomeTitle = 'Virtual Events';
        this.addEventButton = "button:contains('Add Virtual Event')";
        this.eventCardLocator = '[class*="card-list-item"]';
        this.eventCardTitle = '[class*="ant-card-head-title"]';
        this.specificEventCardLocator = function(event){ return `[class*="card-list-item"]:contains('${event}')` };
        this.moreActionsButton = "button:contains('More Actions')";
        this.configureButton = "button:contains('Configure')";
        this.removeButton = "li:contains('Remove') > span";
        this.eventNameInput = 'input[name="name"]';
        this.addEventModalFooter = '[class="ant-modal-footer"]';
        this.antModalBody = '[class="ant-modal-body"]';
        this.eventSlugInput = 'input[name="customUrl"]';
        this.eventDescription = 'textarea[name="description"]';
        this.sessionNameInput = 'input[name="name"]';
        this.onDemandRadio = 'input[value="on_demand"]';
        this.liveRadio = 'input[value="live"]';
        this.addSessionButton = "button:contains('Add Session')";
        this.sessionCardTitle = '[class="ant-card-head-title"]';
        this.antCardBody = '[class="ant-card-body"]';
        this.antModalContent = '[class="ant-modal-content"]';
        this.antCardHeadWrapper = '[class="ant-card-head-wrapper"]';
        this.antDescriptionsContent = '[class="ant-descriptions-item-content"]';
    }

    visit(){
        cy.visit(this.vexUrl);
    }

    addVirtualEvent(eventName){
        this.goToPage(this.virtualEventHomeTitle, this.vexUrl)
        cy.get(this.pageTitleBar).within(()=>{
            cy.get(this.addEventButton).click()
        })
        cy.get(this.eventNameInput).clear().type(eventName)
        cy.get(this.addEventModalFooter).contains('button', 'Add Virtual Event').click()
        cy.ifElementHasText(this.antModalBody, 'has already been taken', 1500, () => {
            cy.contains('button', 'Cancel').click()
        })
        cy.get(this.antModalBody).should('not.be.visible')
        cy.containsExact(this.eventCardTitle, eventName).should('exist')
    }

    deleteVirtualEvent(eventName){
        this.goToPage(this.virtualEventHomeTitle, this.vexUrl) 
        cy.ifElementWithExactTextExists(this.eventCardTitle, eventName, 2000, () => {
            cy.containsExact(this.eventCardTitle, eventName).parent().parent().parent().within(() => {
                cy.get(this.moreActionsButton).click()
            })
            cy.get(this.removeButton).click()
            cy.get(this.antModalContent).within(()=>{
                cy.contains('Yes').click()
            })
        })
        cy.containsExact(this.eventCardTitle, eventName).should('not.exist')
    }

    configureEvent(config){
        const event = config.event;
        const newEventName = config.newEventName;
        const slug = config.slug;
        const description = config.description; 

        cy.get(this.specificEventCardLocator(event)).contains('button', 'Configure').click()
        cy.get(this.pageTitleLocator).should('contain', event)
        newEventName ? cy.get(this.eventNameInput).clear().type(newEventName) : null; 
        slug ? cy.get(this.eventSlugInput).clear().type(slug) : null;
        description ? cy.get(this.eventDescription).clear().type(description) : null;

        cy.contains('button', 'Save').click();
        cy.get(this.pageBody).should('contain', 'The record was saved successfully');
    }

    goToEventConfig(event){
        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== event){
                this.goToPage(this.virtualEventHomeTitle, this.vexUrl)
                cy.containsExact(this.eventCardTitle, event).parent().parent().parent().within(() => {
                    cy.get(this.configureButton).click()
                })
                cy.get(this.pageTitleLocator).invoke('text').should('have.value', event)
            }
        })
    }

    addSession(sessionName, type = 'On Demand'){
        cy.contains(this.antCardHeadWrapper, "Sessions").within(()=>{
            cy.get(this.addSessionButton).click();
        })
        cy.get(this.antModalContent).within((modal)=>{
            cy.get(this.sessionNameInput).type(sessionName)
        })
        if (type == 'On Demand') {
            cy.get(this.onDemandRadio).click();
        } else if (type == 'Live') {
            cy.get(this.liveRadio).click(); 
        }
        cy.get(this.antModalContent).within(()=>{ // must use arrow function notation or will lose 'this' context 
            cy.get(this.addSessionButton).click();
        })
        cy.get(this.antCardBody).contains(this.sessionCardTitle, sessionName).should('exist');
    }

    removeSession(sessionName){
        cy.ifElementWithExactTextExists(this.sessionCardTitle, sessionName, 1500, () => {
            cy.containsExact(this.sessionCardTitle, sessionName).parent().parent().parent().within(()=>{
                cy.get(this.moreActionsButton).click(); 
            })
            cy.get(this.removeButton).click()
            cy.get(this.antModalContent).within(()=>{
                cy.contains('Yes').click()
            })
        })
        cy.containsExact(this.sessionCardTitle, sessionName).should('not.exist')
    }
}