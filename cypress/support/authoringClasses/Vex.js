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
        this.selectLiveContentButton = "button:contains('Select Live Content Video')";
        this.startTimeInput = "input[name='startTime']";
        this.endTimeInput = "input[name='endTime']";
        this.timeZonePicker = 'div[class="ant-row ant-form-item"]:contains("Time Zone")';
        this.liveTypePicker = 'div[class="ant-row ant-form-item"]:contains("Live Content Type")'; 
        this.zoomNumInput = "input[name='liveContentConfig.zoomMeetingNumber']";
        this.noPasswordRadio = "input[value='no_password']";
        this.applyPasswordRadio = "input[value='apply_password']";
        this.requirePasswordRadio = "input[value='require_password']";
        this.zoomPWInput = "input[name='meetingPassword']";
        this.onDemandTitleLocator = 'div[class="ant-space-item"]';
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
        this.monthPickerButton = "button[class='ant-picker-month-btn']";
        this.yearPickerButton = "button[class='ant-picker-year-btn']";
        this.decadePickerButton = "button[class='ant-picker-decade-btn']";
        this.pickerCell = "div[class='ant-picker-cell-inner']";
        this.nextDecadeButton = "button[class='ant-picker-header-super-next-btn']";
        this.prevDecadeButton = "button[class='ant-picker-header-super-prev-btn']";
        this.timePickercell = "div[class='ant-picker-time-panel-cell-inner']";
        this.antPickerContainer = "div[class='ant-picker-panel-container']";
        this.antPickerDropdown = "div[class^='ant-picker-dropdown']";
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

    pickLiveContentVideo(content){
        cy.get(this.selectLiveContentButton).click();
        cy.get(this.modal).within(()=>{
            cy.get(this.contentPickerSearchBar).clear().type(content);
            cy.contains(this.contentPickerItem, content).click();
            cy.get(this.selectLiveContentButton).click();
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

        cy.get(this.eventFormPicker).parent().parent().click()
        cy.get(this.antDropdownContainer).within(()=>{
            cy.get(this.antDropdownOption(name)).click()
        })
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
        // start and end can be entered as a string, which would be typed into input field, 
        // or these could be a config object that will be passed into the pickDate function which would click the date-time on the date-picker UI component 
        // if string, start and end must have format: MMM DD, YYYY HH:MMxm
        // omit any leading zeroes 
        // eg) Jun 5, 2020 4:00pm  eg) Mar 10, 2000 12:15am
        // As of June 24, 2020, the day and time will be off by a bit if date-time is typed into the input field (likely a bug)
        // If you require exact date/time, pass in the config object
        const start = config.start
        const end = config.end
        const timeZone = config.timeZone // Go to the app and get the exact text for this value  
        const type = config.type // Values can be 'Zoom' or 'Content Library' 
        const zoomNum = config.zoomNum 
        const zoomAuth = config.zoomAuth // Values can be "No Password", "Require Password From Attendee", "Apply Password Automatically For Attendee"
        const zoomPW = config.zoomPW 
        const video = config.video

        if(typeof start == 'string'){
            cy.get(this.startTimeInput).click().clear().type(start + '\n')
        } else if (start) {
            start.pickerNum = 0
            this.pickDate(start)
        }
        if(typeof end == 'string'){
            cy.get(this.endTimeInput).click().clear().type(end + '\n')
        } else if (end) {
            end.pickerNum = 1
            this.pickDate(end)
        }
        if (timeZone){
            cy.get(this.timeZonePicker).click()
            cy.get(this.antDropdownContainer).within(()=>{
                cy.get(this.antDropdownOption(timeZone)).click()
            })
        }
        if(type){
            cy.get(this.liveTypePicker).click()
            cy.get(this.antDropdownContainer).within(()=>{
                cy.get(this.selectOption(type)).click()
            })
        }
        if(zoomNum){
            cy.get(this.zoomNumInput).clear().type(zoomNum)
        }
        if(zoomAuth == 'No Password'){
            cy.get(this.noPasswordRadio).click()
        } else if (zoomAuth == "Require Password From Attendee"){
            cy.get(this.requirePasswordRadio).click()
        } else if (zoomAuth == "Apply Password Automatically For Attendee"){
            cy.get(this.applyPasswordRadio).click()
        }
        if(zoomPW) {
            cy.get(this.zoomPWInput).clear().type(zoomPW)
        }
        if(video){
            this.pickLiveContentVideo(video)
        }
    }

    pickDate(config){
        const picker = config.picker // The locator of the date picker 
        const pickerNum = config.pickerNum || 0 // Integer - there could be more than 1 date picker on the DOM. This specifies which one. 
        const month = config.month // Values can be: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
        const year = config.year // Must be string, format xxxx
        const day = config.day // Must be string, format xx (do NOT include leading zeroes)
        const hour = config.hour // Must be string, fornat xx (include leading zeroes)
        const minute = config.minute // String, values can be: 00, 15, 30, 45
        const xm = config.xm // String, values can be: AM, PM (all caps)

        const monthAsNumber = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
        }

        const findDecade = (year) => {
            let decadeStart = year.slice(0, -1) + '0'
            let decadeEnd = year.slice(0, -1) + '9'
            let decadeToFind = `${decadeStart}-${decadeEnd}`

            for(let i = 0; i <= 10 ; i++){
                cy.ifNoElementWithExactTextExists(this.decadePickerButton, decadeToFind, 1000, ()=>{
                    cy.get(this.decadePickerButton).invoke('text').then((text)=>{
                        let buttonYearStart = parseInt(text.slice(0, 4))
                        if(buttonYearStart < parseInt(decadeStart)){
                            cy.get(this.nextDecadeButton).click()
                        } else {
                            cy.get(this.prevDecadeButton).click()
                        }
                    })
                }, this.antPickerContainer)
            }
        }

        cy.get(picker).click()
        cy.get(this.antPickerDropdown).eq(pickerNum).within(()=>{
            cy.get(this.yearPickerButton).click() 
            findDecade(year)
            cy.contains(this.pickerCell, year).click()
            cy.ifElementExists(this.monthPickerButton, 1000, ()=>{
                // If you don't scroll through decades, month picker button will still be visible 
                // If you do scroll through decades before picking a year, month picker button will disappear, so skip this step and go directly to picking a month
                cy.get(this.monthPickerButton).click()
            }, this.antPickerContainer)
            cy.contains(this.pickerCell, month).click() 
            cy.get(`td[title="${year}-${monthAsNumber[month]}-${day.length == 2 ? day : "0" + day}"]`).click()
            cy.contains(this.timePickercell, hour).click()
            cy.contains(this.timePickercell, minute).click()
            cy.contains(this.timePickercell, xm).click()
            cy.contains('button', 'Ok').click()
        })
    }
}