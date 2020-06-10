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
        this.removeDropdownButton = "li:contains('Remove') > span";
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
        this.sessionNameInput = 'input[name="name"]';
        this.sessionSlugInput = 'input[name="slug"]';
        this.sessionDescriptionInput = 'textarea[name="description"]';
        this.privateRadio = "input[value='private']";
        this.publicRadio = "input[value='public']";
        this.selectVideoButton = "button:contains('Select On Demand Video')";
        this.onDemandTitleLocator = '[class="ant-card-meta-title"]';
        this.addContentButton = "button:contains('Add Content')";
        this.supplementalContentCardTitle = '[class="ant-card-head-title"]';
        this.removeButton = "button:contains('Remove')";
        this.appearancePreviewHeaderTitle = "div[data-qa-hook='header-title-show']";
        this.appearancePreviewHeaderTitleInput = "input[name='headerTitle']";
        this.appearancePreviewHeaderSubtitle = "div[data-qa-hook='header-subtitle-show']";
        this.appearancePreviewHeaderSubtitleInput = "input[name='headerSubtitle']";
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
            cy.get(this.removeDropdownButton).click()
            cy.get(this.antModalContent).within(()=>{
                cy.contains('Yes').click()
            })
        })
        cy.containsExact(this.eventCardTitle, eventName).should('not.exist')
    }

    configureEvent(config){
        const event = config.event || config.name;
        const newEventName = config.newEventName;
        const slug = config.slug;
        const description = config.description; 

        this.goToEventConfig(event);
        cy.get(this.pageTitleLocator).should('contain', event)
        newEventName ? cy.get(this.eventNameInput).clear().type(newEventName) : null; 
        slug ? cy.get(this.eventSlugInput).clear().type(slug) : null;
        description ? cy.get(this.eventDescription).clear().type(description) : null;

        cy.contains('button', 'Save').click();
        cy.get(this.pageBody).should('contain', 'The record was saved successfully');
    }

    goToEventConfig(event){
        cy.containsExact(this.eventCardTitle, event).parent().parent().parent().within(() => {
            cy.get(this.configureButton).click()
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
            cy.get(this.removeDropdownButton).click()
            cy.get(this.antModalContent).within(()=>{
                cy.contains('Yes').click()
            })
        })
        cy.containsExact(this.sessionCardTitle, sessionName).should('not.exist')
    }

    goToSessionConfig(sessionName){
        cy.containsExact(this.sessionCardTitle, sessionName).parent().parent().parent().within(()=>{
            cy.get(this.configureButton).click(); 
        })
        cy.get(this.pageTitleLocator).should('contain', sessionName);
    }

    pickOnDemandVideo(content){
        cy.get(this.selectVideoButton).click();
        cy.get(this.modal).within(()=>{
            cy.get(this.contentPickerSearchBar).clear().type(content);
            cy.contains(this.contentPickerItem, content).click();
            cy.get(this.selectVideoButton).click();
        })
        cy.get(this.modal).should('not.exist');
    }

    configureSession(config){
        const name = config.name;
        const newName = config.newName;
        const visibility = config.visibility;
        const slug = config.slug;
        const description = config.description; 
        const type = config.type;
        const video = config.video;

        this.goToSessionConfig(name);

        newName ? cy.get(this.sessionNameInput).clear().type(newName) : null;

        if(visibility == 'Private'){
            cy.get(this.privateRadio).click();
        } else if (visibility == 'Public'){
            cy.get(this.publicRadio).click();
        } 

        slug ? cy.get(this.sessionSlugInput).clear().type(slug) : null;

        description ? cy.get(this.sessionDescriptionInput).clear().type(description) : null;

         if(type == 'On Demand'){
             cy.get(this.onDemandRadio).click()
         }

         this.pickOnDemandVideo(video);

         cy.get(this.saveButton).click()
         cy.get('body').should('contain', "The record was saved successfully")
    }

    addSupplementalContent(contents){
        cy.get(this.addContentButton).click();
        cy.get(this.modal).within(()=>{
            contents.forEach((content)=>{
                cy.get(this.contentPickerSearchBar).clear().type(content);
                cy.contains(this.contentPickerItem, content).click();
            })
            cy.get(this.addContentButton).click();
        })
        cy.get(this.modal).should('not.exist');
    }

    removeSupplementalContent(content){
        cy.containsExact(this.supplementalContentCardTitle, content).parent().parent().parent().within(()=>{
            cy.get(this.removeButton).click();
        })
        cy.get(this.antModalContent).within(()=>{
            cy.contains('Yes').click()
        })
        cy.containsExact(this.supplementalContentCardTitle, content).should('not.exist');
    }
}