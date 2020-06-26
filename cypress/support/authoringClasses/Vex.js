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
        this.eventFormPicker = '#rc_select_1';
        this.eventFormTitle = "input[name='captureConfig.pageTitle']";
        this.eventFormMessage = "textarea[name='captureConfig.pageDescription']";
        this.noRegistrationNeededOption = 'None (Registration Not Required)';
        this.antDropdownContainer = "div[class*='ant-select-dropdown']";
        this.antDropdownOption = function(option){ return `div[label="${option}"]`; };
        this.selectOption = function(option){ return `div[class="ant-select-item-option-content"]:contains("${option}")` };
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
        this.startTimeInput = "input[name='startTime']";
        this.endTimeInput = "input[name='endTime']";
        this.timeZonePicker = 'div[class="ant-row ant-form-item"]:contains("Time Zone")';
        this.liveTypePicker = 'div[class="ant-row ant-form-item"]:contains("Live Content Type")'; 
        this.zoomNumInput = "input[name='liveContentConfig.zoomMeetingNumber']";
        this.noPasswordRadio = "input[value='no_password']";
        this.applyPasswordRadio = "input[value='apply_password']";
        this.zoomPWInput = "input[name='liveContentConfig.zoomMeetingPassword']";
        this.onDemandTitleLocator = '[class="ant-card-meta-title"]';
        this.addContentButton = "button:contains('Add Content')";
        this.supplementalContentCardTitle = '[class="ant-card-head-title"]';
        this.removeButton = "button:contains('Remove')";
        this.appearancePreviewHeaderTitle = "div[data-qa-hook='header-title-show']";
        this.appearancePreviewHeaderTitleInput = "input[name='headerTitle']";
        this.appearancePreviewHeaderSubtitle = "div[data-qa-hook^='header-subtitle']";
        this.appearancePreviewHeaderSubtitleInput = "input[name='headerSubtitle']";
        this.resetButton = "button:contains('Reset')";
        this.selectImageButton = "button:contains('Change Image')";
        this.thumbnailSelector = "#thumbnail-selector";
        this.dateTimePickerContainer = "div[class='ant-picker-panel']";
    }

    visit(){
        cy.visit(this.vexUrl);
    }

    addVirtualEvent(eventName, callBackIfDuplicate = false, checkSuccess = true){
        this.goToPage(this.virtualEventHomeTitle, this.vexUrl)
        cy.get(this.pageTitleBar).within(()=>{
            cy.get(this.addEventButton).click()
        })
        cy.get(this.eventNameInput).clear().type(eventName)
        cy.get(this.addEventModalFooter).contains('button', 'Add Virtual Event').click()
        cy.ifElementHasText(this.antModalBody, 'has already been taken', 1500, () => {
            if(callBackIfDuplicate){
                callBackIfDuplicate();
                return;
            } else {
                cy.contains('button', 'Cancel').click()
            }
        })
        cy.get(this.antModalBody).should('not.be.visible')
        if (checkSuccess){
            cy.containsExact(this.eventCardTitle, eventName).should('exist')
        }
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
        const event = config.name; 
        const newEventName = config.newName;
        const slug = config.slug;
        const description = config.description; 
        const form = config.form;

        this.goToEventConfig(event);
        cy.get(this.pageTitleLocator).should('contain', event)
        newEventName ? cy.get(this.eventNameInput).clear().type(newEventName) : null; 
        slug ? cy.get(this.eventSlugInput).clear().type(slug) : null;
        description ? cy.get(this.eventDescription).clear().type(description) : null;
        form ? this.configureForm(form) : null;

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
        const contents = config.contents;
        const thumbnail = config.thumbnail;
        const live = config.live;

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
         } else if (type == 'Live'){
             cy.get(this.liveRadio).click()
         }

         if(video){
            this.pickOnDemandVideo(video);
         }

         if(thumbnail){
             this.selectThumbnail(thumbnail);
         }

         if(live){
             this.configureLive(live);
         }

         if(contents){
             this.addSupplementalContent(contents);
         }

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

    configureForm(form){
        const name = form.name; 
        const title = form.title;
        const message = form.message;

        cy.get(this.eventFormPicker).parent().parent().click()
        cy.get(this.antDropdownContainer).within(()=>{
            cy.get(this.antDropdownOption(name)).click()
        })
        title == '' ? cy.get(this.eventFormTitle).clear() : cy.get(this.eventFormTitle).clear().type(title)
        message == '' ? cy.get(this.eventFormMessage).clear() : cy.get(this.eventFormMessage).clear().type(message)
        cy.get(this.saveButton).click()
        cy.get('body').should('contain', 'The record was saved successfully')
    }

    selectThumbnail(config){
        const category = config.category // Values can be "Stock Images", "Thumbnail Images" or "Uncategorized"
        const url = config.url

        cy.get(this.selectImageButton).click()
        cy.get(this.thumbnailSelector).should('exist').within(()=>{
            cy.contains('li', category).click()
            cy.get(`img[src="${url}"]`).click()
            cy.get(this.saveButton).click()
        })
        cy.get(`img[src="${url}"]`).should('exist')
    }

    configureLive(config){
        // start and end must have format: MMM DD, YYYY HH:MMxm
        // omit any leading zeroes 
        // eg) Jun 5, 2020 4:00pm  eg) Mar 10, 2000 12:15am
        // As of June 24, 2020, the day will be off by 1 and hours off by 4 unless you manually click the time - likely a bug or the UI wasn't meant for typing 
        const start = config.start
        const end = config.end
        const timeZone = config.timeZone // Go to the app and get the exact text for this value  
        const type = config.type // Values can be 'Zoom' or 'Content Library' 
        const zoomNum = config.zoomNum 
        const zoomPW = config.zoomPW // "No Password" will turn off password requirement; all other values will set that value as the password 
        const video = config.video

        cy.get(this.startTimeInput).click().clear().type(start + '\n')
        cy.get(this.endTimeInput).click().clear().type(end + '\n')
        cy.get(this.timeZonePicker).click()
        cy.get(this.antDropdownContainer).within(()=>{
            cy.get(this.antDropdownOption(timeZone)).click()
        })
        cy.get(this.liveTypePicker).click()
        cy.get(this.antDropdownContainer).within(()=>{
            cy.get(this.selectOption(type)).click()
        })
        if(zoomNum){
            cy.get(this.zoomNumInput).clear().type(zoomNum)
        }
        if(zoomPW == 'No Password'){
            cy.get(this.noPasswordRadio).click()
        } else if(zoomPW) {
            cy.get(this.applyPasswordRadio),click()
            cy.get(this.zoomPWInput).clear().type(zoomPW)
        }
        if(video){
            if(type == 'Content Library'){
                cy.get('button:contains("Select Live Video")').click();
                // When type is content library, this causes 2 video picker modals to open, 1 stacked on top of each other such that you only see 1
                // This was causing ambiguous match error. No impact on page function, but a bug regardless. 
                cy.get(this.modal).eq(1).within(()=>{
                    cy.get(this.contentPickerSearchBar).clear().type(video);
                    cy.contains(this.contentPickerItem, video).click();
                    cy.get(this.selectVideoButton).click();
                })
                cy.get(this.modal).should('not.exist');
            } else {
                this.pickOnDemandVideo(video)
            }
        }
    }
}