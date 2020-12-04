import { Common } from "./Common";

export class Vex extends Common {
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.vexEventPageTitle = "Virtual Events";
        this.vexUrl = `${this.baseUrl}/authoring/content-library/virtual-events`;
        this.virtualEventHomeTitle = 'Virtual Events';
        this.recordSavedMessage = 'The record was saved successfully';
        this.shareIcon = 'i[title="Share URL"]';
        this.addEventButton = "button:contains('Add Virtual Event')";
        this.eventCardLocator = '[class*="card-list-item"]';
        this.eventCardTitle = '[class*="ant-card-head-title"]';
        this.specificEventCardLocator = function(event){ return `[class*="card-list-item"]:contains('${event}')` };
        this.moreActionsButton = "button:contains('More Actions')";
        this.configureButton = "button:contains('Configure')";
        this.removeDropdownButton = "li:contains('Remove') > span";
        this.eventNameInput = 'input[name="name"]';
        this.externalIDInput = "input[name='externalId']";
        this.cookieConsentCheckbox = "input[name='gdprCookieConsentEnabled']";
        this.addEventModalFooter = '[class="ant-modal-footer"]';
        this.antModalBody = '[class="ant-modal-body"]';
        this.eventSlugInput = 'input[name="customUrl"]';
        this.eventFormPicker = '#rc_select_1';
        this.noRegistrationNeededOption = 'None (Registration Not Required)';
        this.antDropdownContainer = "div[class*='ant-select-dropdown']";
        this.antDropDownScroller = '.rc-virtual-list-holder-inner';
        this.antDropdownOption = function(option){ return `div[label="${option}"]`; };
        this.selectOption = function(option){ return `div[class="ant-select-item-option-content"]:contains("${option}")` };
        this.onDemandRadio = 'input[value="on_demand"]';
        this.liveRadio = 'input[value="live"]';
        this.searchSessionIcon = 'svg[data-icon="search"]';
        this.searchSessionInput = "#search-session-name";
        this.addSessionButton = "button:contains('Add Session')";
        this.sessionTableTitle = "div[class='ant-card-head-title']:contains('Sessions')";
        this.sessionName = function(sessionName){ 
            let escapedName = sessionName.replace(/(\W)/g, '\\$1') 
            return `td[title="${escapedName}"]`
        };
        this.sessionShareCell = ".share-cell";
        this.sessionUrlCell = ".url-cell";
        this.sessionSortCell = ".ant-table-column-sorters";
        this.caretUp = "span[aria-label='caret-up']";
        this.caretDown = "span[aria-label='caret-down']";
        this.antCardBody = '[class="ant-card-body"]';
        this.antModalContent = '[class="ant-modal-content"]';
        this.antCardHeadWrapper = '[class="ant-card-head-wrapper"]';
        this.antDescriptionsContent = '[class="ant-descriptions-item-content"]';
        this.sessionNameInput = 'input[name="name"]';
        this.sessionSlugInput = 'input[name="slug"]';
        this.sessionDescription = {
            container: ".quill",
            toolbar: ".ql-toolbar",
            editor: ".ql-editor"
        };
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
        this.webexLinkInput = "input[name='liveContentConfig.webexMeetingDestination']";
        this.onDemandTitleLocator = 'div[class="ant-space-item"]';
        this.addContentButton = "button:contains('Add Content')";
        this.supplementalContentCardTitle = 'span[class^="ant-typography"]';
        this.topicsTag = ".ant-select-selection-item";
        this.removeTopicTagButton = ".ant-select-selection-item-remove";
        this.removeButton = "button:contains('Remove')";
        this.appearance = {
            headerTitle: "div[data-qa-hook^='header-title']",
            headerTitleInput: "input[name='headerTitle']",
            headerSubtitle: "div[data-qa-hook^='header-subtitle']",
            headerSubtitleInput: "input[name='headerSubtitle']",
            contentTitle: "div[data-qa-hook^='content-title']",
            contentTitleInput: "input[name='contentTitle']",
            contentDescription: "div[data-qa-hook^='content-description']",
            contentDescriptionInput: ".ql-editor",
            input: "input[class='ant-select-selection-search-input']",
            heroHeightInput: "input[name='landingExperience.landingExperienceConfig.headerHeight']"
        };
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
        this.groupNameInput = "input[name='name']";
        this.groupRow = ".ant-list-item";
        this.sessionRow = ".ant-list-item";
        this.removeGroupButton = "span:contains('Remove')";
        this.renameGroupButton = "button:contains('Rename')";
        this.trackProtectionArea = '.visitorGroupMultiSelect';
        this.antRow = ".ant-row"; 
        this.antSelector = ".ant-select-selector";
        this.engagementThresholdInput = "input[name='engagementThreshold']";
        this.engagementScoreInput = "input[name='engagementWeight']";
        this.maxAttendeesInput = "input[name='maximumAttendees']";
        this.antCell = ".ant-table-cell";
        this.chat = {
            toggle: "button[data-qa-hook^='chat-widget-enable']",
            readOnly: "button[data-qa-hook^='chat-widget-readonly']",
            addModeratorButton: "button:contains('Add Moderator')",
            emailInput: "input[name='email']",
            emailRow: ".ant-list-item",
            notAvailableText: "Live chat & session moderator settings are only available for live sessions."
        };
        this.draggableMenu = ".anticon-menu";
        this.pages = {
            nameInput: "input[name='name']",
            slugInput: "input[name='slug']",
            addBlockButton: "button[class*='AddBlockButton']",
            addHTMLButton: "button:contains('HTML')",
            addSessionGroupButton: "button:contains('Session Group')",
            tableRow: ".ant-table-row",
            editorMenu: "div[class^='BlockMenu']",
            menuBlock: "div[class^='BlockAction']",
            colorPickerBar: ".swatch-inner",
            colorPicker: ".sketch-picker",
            classNameInput: "input[name*='className']",
            blockContainer: "div[data-react-beautiful-dnd-draggable='0']",
            sessionGroupRow: ".pf-event-sessions"
        };
        this.navigation = {
            addButton: "button:contains('Add Navigation Item')",
            labelInput: "input[name='title']",
            linkInput: "input[name='link']",
            newTabCheckBox: "input[name='newTab']",
            navRow: ".rst__row",
            navTitle: ".rst__rowTitle",
            navSubtitle: ".rst__rowSubtitle",
            navHandle: ".rst__moveHandle",
            navContent: ".rst__rowContents",
            navRemoveBox: ".rst__rowToolbar"
        };
        this.blacklist = {
            emailInput: "input[name='email']",
            emailRow: ".ant-list-item"
        };
        this.cloneButton = "i[class*='Icon__fa-clone']";  
        this.cloneOptions = {
            eventSetup: "input[value='Event setup']",
            sessions: "input[value='Sessions']",
            sessionGroups: "input[value='Session groups']",
            appearance: "input[value='Appearance settings']",
            landingPages: "input[value='Landing pages']",
            navigation: "input[value='Navigation']"
        };
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
            cy.containsExact(this.eventCardTitle, eventName, {timeout: 10000}).should('exist')
        }
    }

    deleteVirtualEvent(eventName){
        this.goToPage(this.virtualEventHomeTitle, this.vexUrl) 
        cy.ifElementWithExactTextExists(this.eventCardTitle, eventName, 5000, () => {
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

    goToEventConfig(event){
        cy.containsExact(this.eventCardTitle, event, {timeout: 20000}).parent().parent().parent().within(() => {
            cy.get(this.configureButton).click()
        })
    }

    configureEvent(config){
        const event = config.name
        const newEventName = config.newName
        const slug = config.slug
        const form = config.form
        const start = config.start
        const end = config.end
        const timeZone = config.timeZone
        const trackProtection = config.trackProtection 
        const externalID = config.externalID 
        const cookieConsent = config.cookieConsent 
        const language = config.language

        this.goToEventConfig(event);
        cy.get(this.pageTitleLocator).should('contain', event)

        newEventName ? cy.get(this.eventNameInput).clear().type(newEventName) : null; 

        slug ? cy.get(this.eventSlugInput).clear().type(slug) : null;

        if(externalID){
            cy.get(this.externalIDInput).clear().type(externalID)
        }

        if(form){
            let formConfig = Object.assign({}, form)
            formConfig.save = false
            this.configureForm(formConfig)
        }

        if(start){
            cy.get(this.startTimeInput).click().clear().type(start + '\n')
        }

        if(end){
            cy.get(this.endTimeInput).click().clear().type(end + '\n')
        }

        if(timeZone){
            cy.get(this.timeZonePicker).click().within(()=>{
                cy.get("input").clear().type(timeZone)
            })
            cy.get(this.antDropdownOption(timeZone)).click({force: true})
        }

        if(language){
            this.setLanguage(language)
        }

        if (trackProtection){
            this.addTrackProtection(trackProtection)
        }

        if(cookieConsent == false || cookieConsent == true){
            this.setCookieConsent(cookieConsent)
        }

        cy.contains('button', 'Save').click();
        cy.get(this.pageBody).should('contain', this.recordSavedMessage);
    }

    setCookieConsent(cookieConsent){
        cy.get(this.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            if( (cookieConsent == false && attr.includes("ant-checkbox-checked")) || (cookieConsent == true && !attr.includes("ant-checkbox-checked")) ){
                cy.get(this.cookieConsentCheckbox).click()
            }
        }) 
        
        cy.get(this.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
            if(cookieConsent == false){
                expect(attr.includes("ant-checkbox-checked")).to.be.false 
            } else {
                expect(attr.includes("ant-checkbox-checked")).to.be.true
            }
        })
    }

    setLanguage(language){
        cy.contains(this.antRow, "Language").within(()=>{
            cy.get(this.antSelector).click()
        })
        cy.get(this.antDropdownOption(language)).click()
        cy.get(`span[title='${language}']`).should('exist')
    }

    configureForm(form){
        const name = form.name
        const save = form.save == false ? false : true 

        cy.contains(this.antRow, "Attendee Registration Form").within(()=>{
            cy.get(this.antSelector).click()
        })
        cy.get(this.antDropdownContainer).within(()=>{
            cy.get(this.antDropdownOption(name)).click()
        })
        if(save){
            cy.get(this.saveButton).click()
            cy.get('body').should('contain', this.recordSavedMessage)
        }
    }

    addTrackProtection(list){
        let groups = [list].flat() 

        cy.contains(this.trackProtectionArea, "Access Protection").within(()=>{
            cy.get("span[class='ant-select-selection-search']").click()
        })
        groups.forEach((group)=>{
            cy.get(this.antDropdownOption(group)).click()
        })
        cy.get('body').click() // need to click away to close the dropdown menu
        groups.forEach((group)=>{
            cy.contains('.ant-select-selection-item', group).should('exist')
        })
    }

    removeTrackProtection(list){
        let groups = [list].flat()

        cy.contains(this.trackProtectionArea, "Access Protection").within(()=>{
            groups.forEach((group)=>{
                cy.contains('.ant-select-selection-item', group).within(()=>{
                    cy.get(".ant-select-selection-item-remove").click()
                })
                cy.contains('.ant-select-selection-item', group).should("not.exist")
            })
        })
    }
    
    goToSessionList(){
        cy.containsExact("a", "Sessions", {timeout: 20000}).click()
    }

    addSession(sessionName, type = 'On Demand'){
        this.goToSessionList()
        cy.contains(this.antCardHeadWrapper, "Sessions", {timeout: 10000}).within(()=>{
            cy.get(this.addSessionButton).click();
        })
        cy.get(this.antModalContent).within(()=>{
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
        cy.get(this.antModalContent).should("not.be.visible")
        cy.get(this.sessionName(sessionName), {timeout: 10000}).should('exist');
    }

    removeSession(sessionName){
        this.goToSessionList()
        cy.waitFor({element: this.sessionTableTitle, to: "exist", wait: 10000})
        cy.ifElementExists(this.sessionName(sessionName), 1500, () => {
            cy.get(this.sessionName(sessionName)).parent().within(()=>{
                cy.contains("a", "Delete").click(); 
            })
            cy.get(".ant-popover-buttons").within(()=>{
                cy.contains('button', "Delete").click()
            })
        })
        cy.get(this.sessionName(sessionName)).should('not.exist')
    }

    searchSession(search){
        cy.get(this.searchSessionIcon).eq(1).click()
        cy.get(this.searchSessionInput).clear().type(search + "\n")
    }

    clearSessionSearch(){
        cy.get(this.searchSessionIcon).eq(1).click()
        cy.get(this.searchSessionInput).clear().type("\n")
    }

    goToSessionConfig(sessionName){
        this.goToSessionList()
        cy.get(this.sessionName(sessionName), {timeout: 20000}).parent().within(()=>{
            cy.contains("a", "Configure").click()
        })
        cy.get(this.pageTitleLocator).should('contain', sessionName, {timeout: 20000});
    }

    filterSessionType(options){
        const onDemand = options.onDemand // Required. Must be true or false
        const live = options.live // Required. Must be true or false

        cy.contains("th", "Type").within(()=>{
            cy.get(".ant-table-filter-trigger-container").click()
        })
        this.clickAntCheckbox({label: "On Demand", check: onDemand})
        this.clickAntCheckbox({label: "Live", check: live})
        cy.contains(this.antDropdown, "On Demand").within(()=>{
            cy.contains("button", "OK").click()
        })
    }

    filterSessionVisibility(options){
        const _public = options.public
        const _private = options.private

        cy.contains("th", "Visibility").within(()=>{
            cy.get(".ant-table-filter-trigger-container").click()
        })
        this.clickAntCheckbox({label: "public", check: _public})
        this.clickAntCheckbox({label: "private", check: _private})
        cy.contains(this.antDropdown, "public").within(()=>{
            cy.contains("button", "OK").click()
        })
    }

    toggleSortByDate(order){
        cy.contains(this.sessionSortCell, "Start Time").within(()=>{
            cy.get(this.caretUp).invoke("attr", "class").then((caretUpClass)=>{
                cy.get(this.caretDown).invoke("attr", "class").then((caretDownClass)=>{
                    if(order == 'ascend' && !caretUpClass.includes("active")){
                        cy.get(".ant-table-column-sorter-inner").click()
                        this.toggleSortByDate(order)
                    } else if(order == 'descend' && !caretDownClass.includes("active")){
                        cy.get(".ant-table-column-sorter-inner").click()
                        this.toggleSortByDate(order)
                    } else if (order == "none" && (caretDownClass.includes("active") || caretUpClass.includes("active"))){
                        cy.get(".ant-table-column-sorter-inner").click()
                        this.toggleSortByDate(order)
                    }
                })
            })
        })
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

    removeTopics(list){
        const topics = [list].flat()

        topics.forEach((topic) => {
            cy.containsExact(this.topicsTag, topic).should("exist").within(() => {
                cy.get(this.removeTopicTagButton).click()
            })
            cy.containsExact(this.topicsTag, topic).should("not.exist")
        })
    }

    configureSession(config){
        const name = config.name
        const newName = config.newName
        const visibility = config.visibility
        const slug = config.slug
        const description = config.description
        const topics = config.topics ? [config.topics].flat() : false 
        const type = config.type
        const video = config.video
        const contents = config.contents
        const thumbnail = config.thumbnail
        const live = config.live
        const rocketChat = config.rocketChat
        const engagementThreshold = config.engagementThreshold
        const engagementScore = config.engagementScore
        const maxAttendees = config.maxAttendees 
        const stayOnPage = config.stayOnPage // Set to true if you want to stay on current session configuration and the name of the session has changed

        if(!stayOnPage){
            cy.ifNoElementWithExactTextExists(this.pageTitleBar, name, 1000, ()=>{
                this.goToSessionConfig(name);
            })
        }
        
        if(newName){
            cy.get(this.sessionNameInput).clear().type(newName)
        }

        if(visibility == 'Private'){
            cy.get(this.privateRadio).filter('.ant-radio-input').click();
        } else if (visibility == 'Public'){
            cy.get(this.publicRadio).click();
        } 

        if(slug){
            cy.get(this.sessionSlugInput).clear().type(slug)
        }

        if(description){
            cy.get(this.sessionDescription.editor).clear().type(description)
        }

        if(topics){
            cy.contains(this.antRow, "Topics").within(() => {
                cy.get(this.antDropSelect.selector).click()
                topics.forEach((topic) => {
                    cy.get("input").type(topic + "\n")
                })
                cy.get(this.antDropSelect.selector).click()
            })
        }

        if(type == 'On Demand'){
            cy.get(this.onDemandRadio).click()
        } else if (type == 'Live'){
            cy.get(this.liveRadio).click()
        }

        if(engagementThreshold){
            cy.get(this.engagementThresholdInput).clear().type(engagementThreshold)
        }

        if(engagementScore){
            cy.get(this.engagementScoreInput).clear().type(engagementScore)
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

        if(maxAttendees && type !== "On Demand"){
        cy.get(this.maxAttendeesInput).clear().type(maxAttendees)
        }

        if(contents){
            this.addSupplementalContent(contents);
        }

        cy.get(this.saveButton).click()
        cy.contains(this.recordSavedMessage, {timeout: 20000}).should("exist")

        // Configure widgets after saving or else will reset all the changes you made 
        if(rocketChat){
            this.configureRocketChat(rocketChat)
        }
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
        cy.containsExact(this.supplementalContentCardTitle, content).parent().parent().within(()=>{
            cy.get(this.removeButton).click();
        })
        cy.get(this.antModalContent).within(()=>{
            cy.contains('Yes').click()
        })
        cy.containsExact(this.supplementalContentCardTitle, content).should('not.exist');
    }

    selectThumbnail(config){
        const category = config.category // Values can be "Stock Images", "Thumbnail Images" or "Uncategorized"
        const url = config.url
        const selectImageText = config.selectImageText ? config.selectImageText : "Change Image"

        cy.get(`button:contains('${selectImageText}')`).click()
        cy.get(this.thumbnailSelector).should('exist').within(()=>{
            cy.contains('li', category).click()
            cy.get(`img[src*="${url}"]`).click()
            cy.get(this.saveButton).click()
        })
        cy.get(`img[src*="${url}"]`).should('exist')
    }

    resetThumbnail(){
        cy.contains("button", "Clear").click()
        cy.get("body").should("contain", "No image selected")
        cy.get(this.saveButton).click()
        cy.get("body").should("contain", this.recordSavedMessage)
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
        const webexLink = config.webexLink
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
            cy.ifNoElementWithExactTextExists("span", timeZone, 500, ()=>{
                cy.get(this.timeZonePicker).click().within(()=>{
                    cy.get("input").clear().type(timeZone)
                })
                cy.get(this.antDropdownOption(timeZone)).click({force: true})
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
        if(webexLink){
            cy.get(this.webexLinkInput).clear().type(webexLink)
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

    goToChat(){
        cy.url().then((url)=>{
            if(!url.includes("/widget")){
                cy.containsExact("a", "Chat").click()
            }
        })
    }

    configureRocketChat(config){
        const on_off = config.on_off
        const moderators = config.moderators

        this.goToChat()
        
        if(on_off){
            const enableChatToggle = "button[data-qa-hook^='chat-widget-']" // Use this for the chat toggle before it has been toggled on, it later switches data-qa-hook to chat-widget-neable, this will be fixed by devs later
            cy.get(enableChatToggle).then((toggle)=>{
                if(toggle.length == 1){
                    this.toggle(enableChatToggle, on_off)
                } else if (toggle.length == 2){
                    // Can't use enableChatToggle because in this case, read-only toggle data-qa-hook also starts with chat-widget, leading to ambiguous match
                    // Once it has been toggled already, toggle's data-qa-hook permanently changes to this.chat.toggle's value 
                    this.toggle(this.chat.toggle, on_off)
                }
            })
        }

        if(moderators){
            this.addModerators(moderators)
        }

        this.backToSession()
    }

    addModerators(list){
        const moderators = [list].flat()

        moderators.forEach((moderator)=>{
            cy.get(this.chat.addModeratorButton, {timeout: 5000}).click()
            cy.contains(this.antModal, "Add Moderator").within(()=>{
                cy.get(this.chat.emailInput).clear().type(moderator)
                cy.contains("button", "Submit").click()
            })
            cy.contains(this.antModalBody, "Add Moderator").should("not.be.visible")
            cy.containsExact("span", moderator.toLowerCase(), {timeout: 20000}).should("exist")
        })
    }

    deleteModerators(list){
        const moderators = [list].flat()

        moderators.forEach((moderator)=>{
            cy.containsExact("span", moderator, {timeout: 10000}).parents(this.chat.emailRow).within(()=>{
                cy.contains("button", "Remove").click()
            })
            cy.contains("button", "Yes").click()
            cy.containsExact("span", moderator.toLowerCase(), {timeout: 20000}).should("not.exist")
        })
    }

    editModerator(config){
        const moderator = config.moderator
        const newEmail = config.newEmail

        cy.containsExact("span", moderator, {timeout: 10000}).parents(this.chat.emailRow).within(()=>{
            cy.contains("button", "Edit").click()
        })
        cy.contains(this.antModal, "Edit Moderator").within(()=>{
            cy.get(this.chat.emailInput).clear().type(newEmail)
            cy.contains("button", "Submit").click()
        })
        cy.containsExact("span", newEmail, {timeout: 20000}).should("exist")
    }

    goToSessionGroup(){
        cy.url().then((url)=>{
            // If not already in the session groups page, go there
            if(!url.includes("/session-groups")){
                cy.containsExact("a", "Session Groups", {timeout: 20000}).click()
            }
        })
    }

    addSessionGroup(name){
        this.goToSessionGroup()
        cy.contains("button", "Add Group").click()
        cy.contains(this.antModal, "Add Group").within(()=>{
            cy.get(this.groupNameInput).clear().type(name)
            cy.contains("button", "Submit").click()
        })
        cy.containsExact("span", name).should("exist")
    }

    renameSessionGroup(config){
        const name = config.name
        const newName = config.newName 

        this.goToSessionGroup()
        cy.contains(this.groupRow, name).within(()=>{
            cy.get(this.renameGroupButton).click()
        }) 
        cy.contains(this.antModal, "Edit Session Group").within(()=>{
            cy.get(this.groupNameInput).clear().type(newName) 
            cy.contains("button", "Submit").click()
        })  
        cy.containsExact("span", newName, {timeout: 20000}).should("exist")     
    }

    addToGroup(config){
        let group = config.name
        let sessions = [config.sessions].flat() // You can enter either 1 session or an array of sessions 

        // Select the correct group
        cy.contains(this.groupRow, group, {timeout: 10000}).within(()=>{
            cy.contains("button", "Manage Sessions").click()
        })

        // Add sessions to the group
        cy.contains("button", "Add Sessions to Group").click()
        cy.contains(this.antModal, "Add Sessions to Group").contains("span", "Select Sessions").click() // this opens the dropdown list 
        sessions.forEach((session)=>{
            cy.get(this.antDropdownOption(session)).click()
        })    
        cy.contains(this.antModal, "Add Sessions to Group").contains("button", "Submit").click({force: true}) // have to force click because dropdown is in the way
        
        // Verify they got added 
        sessions.forEach((session)=>{
            cy.containsExact("span", session).should("exist")
        })
    }

    removeFromGroup(config){
        let group = config.name
        let sessions = [config.sessions].flat() // You can enter either 1 session or an array of sessions 

        // Select the correct group
        cy.contains(this.groupRow, group).within(()=>{
            cy.contains("button", "Manage Sessions").click()
        })

        // Remove sessions from the group
        sessions.forEach((session)=>{
            cy.contains(this.sessionRow, session).contains("button", "Remove").click()
            cy.get(this.antModalBody).contains("button", "Yes").click()
        })
       
        // Verify they got removed
        sessions.forEach((session)=>{
            cy.containsExact("span", session).should("not.exist")
        })
    }

    deleteSessionGroup(name){
        this.goToSessionGroup()
        cy.ifElementWithExactTextExists("span", name, 1000, ()=>{
            cy.contains(this.groupRow, name).within(()=>{
                cy.get(this.removeGroupButton).click()
            })
            cy.get(this.antModalBody).within(()=>{
                cy.contains("button", "Yes").click()
            })
        })
        cy.waitFor({element: `span:contains('${name}')`, to: "not.exist", wait: 10000})
        cy.containsExact("span", name).should("not.exist")
    }

    backToEvent(event){
        // If you are on session configuration page and want to go back to the event configuration page
        cy.containsExact("a", event).click()
        cy.contains(this.pageTitleLocator, event, {timeout: 20000}).should('exist')
    }

    goToEventSetup(){
        // If you are on Event configuration and are currently viewing one of its tabs (such as agenda or appearance), and you want to go back to the main set up tab
        cy.containsExact("a", "Event Setup", {timeout: 20000}).click()
    }

    backToSession(){
        cy.contains("a", "Session Details").click()
    }

    goToNavigation(){
        cy.url().then((url)=>{
            if(!url.includes("/navigation")){
                cy.containsExact("a", "Navigation", {timeout: 10000}).click()
            }
        })
    }

    addNavItem(config){
        const label = config.label
        const type = config.type
        const source = config.source
        const newTab = config.newTab
        const verify = config.verify

        this.goToNavigation()
        cy.get(this.navigation.addButton).click()
        cy.contains(this.antModal, "Add Navigation Item").should('exist')
        cy.get(this.navigation.labelInput).clear().type(label)
        cy.get(this.antSelector).eq(0).click()
        cy.get(this.antDropdownOption(type)).click()
        if(source && type !== "Link"){
            cy.get(this.antSelector).eq(1).click()
            cy.get(this.antDropdownOption(source)).click()
        } else if (source && type == "Link"){
            cy.get(this.navigation.linkInput).clear().type(source)
        }
        if(newTab){
            cy.get(this.navigation.newTabCheckBox).click()
        }
        cy.contains('button', "Submit").click()

        if(verify){
            cy.contains(this.antModal, "Add Navigation Item").should("not.be.visible")
            cy.containsExact(this.navigation.navTitle, label).should('exist').parent().within(()=>{
                if(source && !newTab){
                    cy.containsExact(this.navigation.navSubtitle, `${type}: ${source}`).should('exist')
                } else if(source && newTab){
                    cy.containsExact(this.navigation.navSubtitle, `${type}: ${source} (new tab)`).should('exist')
                }else if (type == "Text"){
                    cy.containsExact(this.navigation.navSubtitle, type).should('exist')
                }
            })
        }
    }

    deleteNavItems(list, verify){
        const navItems = [list].flat()

        this.goToNavigation()
        navItems.forEach((navItem)=>{
            cy.ifElementWithExactTextExists(this.navigation.navTitle, navItem, 1000, ()=>{
                cy.containsExact(this.navigation.navTitle, navItem).parents(this.navigation.navRow).within(()=>{
                    cy.contains("button", "Remove").click()
                })
            })
            if(verify){
                cy.waitFor({element: `${this.navigation.navTitle}:contains('${navItem}')`, to: "not.exist", wait: 10000})
                cy.containsExact(this.navigation.navTitle, navItem).should('not.exist')    
            }
        })
    }

    deleteAllNavItems(){
        this.goToNavigation()
        cy.ifElementExists(this.navigation.navRow, 2000, ()=>{
            cy.get(this.navigation.navRow).then((rows)=>{
                for(let i = rows.length - 1; i >= 0; i--){
                    // Need to remove bottomost one first, and work your way up
                    // If start at top, could delete a node that takes out several at once, but for loop keeps going
                    cy.get(this.navigation.navRow).eq(i).within(()=>{
                        cy.contains('button', 'Remove').click()
                    })
                }
            })
        })
    }

    attachSubNav(config){
        // Tip: This function drags the subject by the draggable menu, and drops onto the target's "remove" button 
        // To simply reorder nav items at the top level, you don't need this function. Just drag subject's menu over the target's menu 
        // To make subject a sublink of target, use this function. Subject must be above the target for this to work
        // To make subject a third-level submenu of target, which itself is a submenu of a first level nav-item, first drag subject to target
        // This make make subject a second-level submenu alongside target, then drag subject to itself 
        // This effectively drags the subject back, and then it will link up to the target as a third-level submenu 
        const subject = config.subject // name of the nav item to be moved
        const target = config.target // name of the nav item that subject will connect to 

        cy.containsExact(this.navigation.navTitle, subject).parents(this.navigation.navRow).children(this.navigation.navHandle).trigger("dragstart")
        cy.containsExact(this.navigation.navTitle, target).parents(this.navigation.navRow).children(this.navigation.navContent).children(this.navigation.navRemoveBox).trigger("drop").trigger("dragend")
    }

    goToBlacklist(){
        cy.url().then((url)=>{
            if(!url.includes("/event-blacklist")){
                cy.containsExact("a", "Event Blacklist", {timeout: 10000}).click()
            }
        })
    }

    addToBlacklist(list, verify){
        const emails = [list].flat()

        this.goToBlacklist()
        emails.forEach((email)=>{
            cy.contains("button", "Add Email", {timeout: 10000}).click()
            cy.contains(this.antModal, "Add Email").within(()=>{
                cy.get(this.blacklist.emailInput).clear().type(email)
                cy.contains("button", "Submit").click()
            })
            if(verify){
                cy.contains(this.antModal, "Add Email").should('not.be.visible', {timeout: 10000})
                cy.containsExact('span', email.toLowerCase(), {timeout: 10000}).should('exist')
            }
        })
    }

    removeFromBlacklist(list){
        const emails = [list].flat()

        this.goToBlacklist()
        emails.forEach((email)=>{
            cy.containsExact("span", email.toLowerCase(), {timeout: 10000}).parent().within(()=>{
                cy.contains("button", "Remove").click()
            })
            cy.contains("button", "Yes").click()
            cy.get(this.antModal).should("not.be.visible")
            cy.containsExact("span", email).should("not.exist")
            cy.containsExact("span", email.toLowerCase()).should("not.exist")
        })
    }

    clearBlacklist(){
        this.goToBlacklist()
        cy.ifElementExists(this.blacklist.emailRow, 2000, ()=>{
            cy.get(this.blacklist.emailRow).then((rows)=>{
                for(let i = rows.length - 1; i >= 0; i--){
                    cy.get(this.blacklist.emailRow).eq(i).within(()=>{
                        cy.contains('button', 'Remove').click()
                    })
                    cy.contains("button", "Yes").click()
                }
            })
        })
    }

    editBlacklistEmail(config){
        const email = config.email 
        const newEmail = config.newEmail 
        const verify = config.verify

        this.goToBlacklist()
        cy.containsExact("span", email.toLowerCase(), {timeout: 10000}).parent().within(()=>{
            cy.contains("button", "Edit").click()
        })
        cy.contains(this.antModal + ":visible", "Edit Email").within(()=>{  // Each email opens up its own modal!!!! Cypress does automatically only pick the visible ones!!!
            cy.get(this.blacklist.emailInput).clear().type(newEmail)
            cy.contains("button", "Submit").click()
        })
        if(verify){
            cy.containsExact("span", email.toLowerCase()).should('not.exist')
            cy.containsExact("span", newEmail.toLowerCase()).should("exist")
        }
    }

    goToLandingPage(){
        cy.url().then((url)=>{
            if(!url.includes("/pages")){
                cy.containsExact("a", "Landing Pages", {timeout: 20000}).click()
            }
        })
    }

    addLandingPages(list, verify){
        const pages = [list].flat()

        this.goToLandingPage()
        pages.forEach((page)=>{
            cy.contains("button", "Add Page").click()
            cy.contains(this.antModal, "Add Page").within(()=>{
                cy.get(this.pages.nameInput).clear().type(page)
                cy.contains("button", "Add Page").click()
            })
            if(verify !== false){
                cy.contains(this.antModal, "Add Page").should("not.be.visible")
                cy.containsExact(this.antCell, page).should('exist')
            }
        })
    }

    deleteLandingPages(list, verify){
        const pages = [list].flat()

        this.goToLandingPage()
        cy.contains("button", "Add Page", {timeout: 20000}).should("exist") // waits as long as needed for landing page setup to load
        pages.forEach((page)=>{
            cy.ifElementWithExactTextExists(this.antCell, page, 1000, ()=>{
                cy.containsExact(this.antCell, page).siblings("td:contains('Remove')").within(()=>{
                    cy.contains('button', 'Remove').click()
                })
                cy.contains("button", "Yes").click()
            })
            if(verify !== false){
                cy.waitFor({element: `${this.antCell}:contains('${page}')`, to: "not.exist", wait: 20000})
                cy.containsExact(this.antCell, page).should("not.exist")
            }
        })
    }

    clearLandingPages(){
        this.goToLandingPage()
        cy.ifElementExists(this.pages.tableRow, 2000, ()=>{
            cy.get(this.pages.tableRow).then((rows)=>{
                for(let i = rows.length - 1; i >= 0; i--){
                    cy.get(this.pages.tableRow).eq(i).within(()=>{
                        cy.contains('button', 'Remove').click()
                    })
                    cy.contains("button", "Yes").click()
                }
            })
        })
    }

    editLandingPage(config){
        const name = config.name
        const newName = config.newName
        const visibility = config.visibility ? config.visibility.toLowerCase() : false
        const slug = config.slug
        const verify = config.verify // must specify false to skip verification 

        this.goToLandingPage()
        cy.containsExact(this.antCell, name).siblings("td:contains('Edit')").within(()=>{
            cy.contains("button", "Edit").click()
        })
        cy.contains(this.antModal + ":visible", "Edit Landing Page").within(()=>{
            if(newName){
                cy.get(this.pages.nameInput).clear().type(newName)
            }
            switch(visibility){
                case "private":
                    cy.get(this.privateRadio).click()
                    break;
                case "public":
                    cy.get(this.publicRadio).click()
                    break;
            }
            if(slug){
                cy.get(this.pages.slugInput).clear().type(slug)
            }
            cy.contains("button", "Submit").click()
        })
        if(verify !== false){
            let checkName = newName ? newName : name 
            cy.contains(this.antModal, "Edit Landing Page").should('not.be.visible')
            if(newName){ 
                cy.containsExact(this.antCell, checkName).should('exist') 
            }
            if(visibility == 'public'){
                cy.containsExact(this.antCell, checkName).siblings("td:contains('Set as Home Page')").should('exist')
            }
            if(visibility == 'private'){
                cy.containsExact(this.antCell, checkName).siblings("td:contains('Set as Home Page')").should('not.exist')
            }
            if(slug){
                cy.containsExact(this.antCell, checkName).siblings(`td:contains('${slug}')`).should('exist')
            }
        }
    }

    setToHomePage(page){
        cy.containsExact(this.antCell, page).siblings("td:contains('Set as Home Page')").within(()=>{
            cy.contains("button", "Set as Home Page").click()
        })
    }

    unsetHomePage(page){
        cy.containsExact(this.antCell, page, {timeout: 20000}).siblings("td:contains('Unset')").within(()=>{
            cy.contains("button", "Unset").click()
        })
    }

    goToPageEditor(page){
        cy.containsExact(this.antCell, page).siblings(`td:contains('Modify Page')`).within(()=>{
            cy.contains("a", "Modify Page").invoke("attr", "href").then((href)=>{
                cy.visit(`${this.baseUrl}${href}`)
            })
        })
    }

    addBasicBlock(){
        // Use to add the most basic block if it doesn't matter what the landing page contains - just that it exists
        // Assumes it's a fresh landing page with no existing blocks 
        cy.get(this.pages.addBlockButton).click({force: true}) // Cypress was complaining that this button wasn't attached to the DOM, so force click 
        cy.get(this.pages.addHTMLButton).click({force: true})
        cy.get(this.saveButton).click()
    }

    addAdvancedBlock(config){
        const type = config.type.toLowerCase()
        const content = config.content 
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options 
        const className = config.className 
        const sessionGroup = config.sessionGroup
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units
        const verify = config.verify // Do not verify if using HEX color for any color pickers

        cy.get(this.pages.addBlockButton).eq(0).click({force: true}) // Always pick first one and add to top 

        if(type == "html"){
            cy.get(this.pages.addHTMLButton + ":visible").eq(0).click({force: true})
        } else if (type == "session group"){
            cy.get(this.pages.addSessionGroupButton + ":visible").eq(0).click({force: true})
        }

        // The menu of the most recently added one will be visible 
        cy.get(this.pages.editorMenu).within(()=>{
            cy.get(this.pages.menuBlock).eq(3).click() // This opens up the block editor modal 
        })

        if(content){
            cy.containsExact("div", "HTML Content").click() // Slides open the html content area
            cy.get("textarea").clear().type(content)
            cy.containsExact("span", "HTML Content").click() // Slides shut the html content area
        }

        if(sessionGroup){
            cy.get("select[id*='virtualEventGroupId']").select(sessionGroup)
        }

        if(background){
            const color = background.color // object with keys hex, r, g, b
            const image = background.image // image must be an object that can be passed into pickThumbnail method (Common classs)
            const position = background.position // center, top, bottom -> these seem to only matter if size is 'cover'
            const size = background.size // cover or contain

            cy.containsExact("div", "Background").click()
            if(color){
                cy.get(this.pages.colorPickerBar).click() // Clicking this bar opens the color picker
                cy.get(this.pages.colorPicker).within(()=>{
                    if(color.hex){
                        cy.get("input").eq(0).clear().type(color.hex) // This is the HEX color input
                    }
                    if(color.r){
                        cy.get("input").eq(1).clear().type(color.r)
                    }
                    if(color.g){
                        cy.get("input").eq(2).clear().type(color.g)
                    }
                    if(color.b){
                        cy.get("input").eq(3).clear().type(color.b)
                    }
                })
                cy.get(this.pages.colorPickerBar).click() // clicking this bar again closes the color picker 
            }
            if(image){
                cy.contains("button", "Add Image").click()
                this.pickThumbnail(image)
            }
            if(position){
                cy.get("select[id*='backgroundPosition']").select(position)
            }
            if(size){
                cy.get("select[id*='backgroundSize']").select(size)
            }
            cy.containsExact("span", "Background").click()
        }

        if(heading){
            let color = heading.color // In HEX code or rgb (rgb preferred)
            let textAlign = heading.textAlign // center, left, right

            cy.containsExact("div", "Heading").click()
            if(color){
                cy.get(this.pages.colorPickerBar).click() // Clicking this bar opens the color picker
                cy.get(this.pages.colorPicker).within(()=>{
                    if(color.hex){
                        cy.get("input").eq(0).clear().type(color.hex) // This is the HEX color input
                    }
                    if(color.r){
                        cy.get("input").eq(1).clear().type(color.r)
                    }
                    if(color.g){
                        cy.get("input").eq(2).clear().type(color.g)
                    }
                    if(color.b){
                        cy.get("input").eq(3).clear().type(color.b)
                    }
                })
                cy.get(this.pages.colorPickerBar).click() // clicking this bar again closes the color picker
            }
            if(textAlign){
                cy.get("select[id*='heading.textAlign']").select(textAlign)
            }
            cy.containsExact("span", "Heading").click()
        }

        if(typography){
            let color = typography.color // In HEX code or rgb (rgb preferred)
            let textAlign = typography.textAlign // center, left, right

            cy.containsExact("div", "Typography").click()
            if(color){
                cy.get(this.pages.colorPickerBar).click() // Clicking this bar opens the color picker
                cy.get(this.pages.colorPicker).within(()=>{
                    if(color.hex){
                        cy.get("input").eq(0).clear().type(color.hex) // This is the HEX color input
                    }
                    if(color.r){
                        cy.get("input").eq(1).clear().type(color.r)
                    }
                    if(color.g){
                        cy.get("input").eq(2).clear().type(color.g)
                    }
                    if(color.b){
                        cy.get("input").eq(3).clear().type(color.b)
                    }
                })
                cy.get(this.pages.colorPickerBar).click() // clicking this bar again closes the color picker
            }
            if(textAlign){
                cy.get("select[id*='typography.textAlign']").select(textAlign)
            }
            cy.containsExact("span", "Typography").click()
        }

        if(spacing){
            cy.containsExact("div", "Spacing").click()
            cy.get("input:visible").clear().type(spacing)
            cy.containsExact("span", "Spacing").click()
        }

        if(className){
            cy.get(this.pages.classNameInput).clear().type(className)
        }

        cy.contains("button", "Confirm").click()

        if(verify !== false){
            this.verifyBlock(config)
        }
    }

    verifyBlock(config){
        const type = config.type.toLowerCase()
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options 
        const className = config.className 
        const sessionGroup = config.sessionGroup
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units

        if(type == "html" && className){ // className is required to be able to find the correct block
            let locator = `div[class='${className}']`
            cy.get(locator).invoke("attr", "style").then((style)=>{
                if(typography && typography.textAlign){
                    expect(style).to.include(`text-align: ${typography.textAlign}`)
                }
                if(typography && typography.color && !typography.color.hex){
                    expect(style).to.include(`color: rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
                }
                if(background && background.color && !background.color.hex){
                    expect(style).to.include(`background-color: rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
                }
                if(background && background.image.url){
                    expect(style).to.include(background.image.url)
                }
                if(background && background.position){
                    expect(style).to.include(`background-position: center ${background.position}`)
                }
                if(background && background.size){
                    expect(style).to.include(`background-size: ${background.size}`)
                }
                if(spacing){
                    expect(style).to.include(`padding: ${spacing}`)
                }
            })
            if(checkContent && checkContent.text){
                checkContent.text.forEach((text)=>{
                    cy.contains(locator, text).should("exist")
                })
            }
            if(checkContent && checkContent.locators){
                checkContent.locators.forEach((checkLocator)=>{
                    cy.get(locator).within(()=>{
                        cy.get(checkLocator).should("exist")
                    })
                })
            }
        }

        if(type == "session group" && sessionGroup){ // If you add a session group block with no session group, cannot find the correct block
            let blockLocator = this.pages.sessionGroupRow
            cy.contains(blockLocator, sessionGroup).should("exist")
            if(heading){
                cy.contains(blockLocator, sessionGroup).within(()=>{
                    if(heading.color && !heading.color.hex){
                        cy.get("h4").should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                    }
                    if(heading.textAlign){
                        cy.get("h4").should("have.css", 'text-align', heading.textAlign)
                    }
                })
            }
            if(background && background.color && !background.color.hex){
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.contains(blockLocator, sessionGroup).invoke("css", "background-image").should("have.contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.contains(blockLocator, sessionGroup).should("have.css", "padding", spacing)
            }
        }
    }

    removeBlock(locator){
        // Must first navigate to the landing page editor 
        // locator should be something specific to the block 
        // The blocks are shifty, getting attached, detached, then reattached to dom
        // There is case where Cypress finds the block, but when it tries to interact with it, block has been detached and reattached
        // Cypress not smart enough to requery for the same block, and instead tries to click the previously found block that has been detached 
        // Hence, need to wait for DOM to settle before interacting with it
        cy.get(locator).should("exist")
        cy.waitFor({element: locator, to: "not.exist", wait: 1000})
        cy.get(locator).should('exist')
        cy.get(locator).parents(this.pages.blockContainer).click() // this selects the block and makes the menu appear
        cy.get(locator).parents(this.pages.blockContainer).within(()=>{
            cy.get(this.pages.menuBlock).eq(4).click() // This opens up the block editor modal 
        })
        cy.get(locator).should("not.exist")
    }

    moveBlock(locator, up_down){
        // locator must be something specific within the block
        // up_down can be up or down
        // assumes you already on landing page editor
        let direction = {up: 0, down: 1}

        cy.get(locator).parents(this.pages.blockContainer).click()
        cy.get(locator).parents(this.pages.blockContainer).within(()=>{
            cy.get(this.pages.menuBlock).eq(direction[up_down]).click() // This opens up the block editor modal 
        })
    }

    configureLandingPage(config){
        const name = config.name
        const setHome = config.setHome 
        const unsetHome = config.unsetHome
        const blocks = config.blocks

        this.editLandingPage(config)

        if(setHome){
            this.setToHomePage(name)
        }

        if(unsetHome){
            this.unsetHomePage(name)
        }

        if(blocks){
            this.goToPageEditor(name)
            blocks.forEach((block)=>{
                this.addAdvancedBlock(block)
                cy.get(this.pages.blockContainer).eq(0).click() // This makes the add block button reappear
            })
            cy.contains("button", "Save").click()
            cy.go("back")
        }
    }

    goToAppearance(){
        cy.url().then((url)=>{
            if(!url.includes("/appearance")){
                cy.containsExact("a", "Appearance Setup", {timeout: 20000}).click()
            }
        })
    }

    configureAppearance(config){
        const appearance = config.appearance
        const heroImage = config.heroImage
        const heroHeight = config.heroHeight
        const headerTitle = config.headerTitle
        const headerSubtitle = config.headerSubtitle
        const contentTitle = config.contentTitle
        const contentDescription= config.contentDescription

        this.goToAppearance()

        if(appearance){
            cy.get(this.appearance.input).clear({force: true}).type(appearance, {force: true})
            cy.get(this.antDropdownOption(appearance)).click()
            cy.get(`span[title='${appearance}']`).should("exist")
            cy.contains('button:visible', "Save").click()
            cy.contains(this.messages.recordSaved, {timeout: 20000}).should("exist")
        }

        if(heroImage){
            this.selectThumbnail(heroImage)
            cy.contains('button:visible', "Save").click()
            cy.contains(this.messages.recordSaved, {timeout: 20000}).should("exist")
        }

        if(heroHeight){
            cy.get(this.appearance.heroHeightInput).clear().type(heroHeight)
            cy.contains('button:visible', "Save").click()
            cy.contains(this.messages.recordSaved, {timeout: 20000}).should("exist")
        }

        if(headerTitle){
            cy.get(this.appearance.headerTitle).click()
            cy.get(this.appearance.headerTitleInput).clear().type(headerTitle)
            cy.get(this.appearance.headerTitleInput).parent().contains('Save').click()
            cy.get(this.appearance.headerTitle, {timeout: 5000}).should('contain', headerTitle)
        }
        
        if(headerSubtitle){
            cy.get(this.appearance.headerSubtitle).click()
            cy.get(this.appearance.headerSubtitleInput).clear().type(headerSubtitle)
            cy.get(this.appearance.headerSubtitleInput).parent().contains('Save').click()
            cy.get(this.appearance.headerSubtitle, {timeout: 5000}).should('contain', headerSubtitle)
        }

        if(contentTitle){
            cy.get(this.appearance.contentTitle).click()
            cy.get(this.appearance.contentTitleInput).clear().type(contentTitle)
            cy.get(this.appearance.contentTitleInput).parent().contains("Save").click()
            cy.get(this.appearance.contentTitle, {timeout: 5000}).should('contain', contentTitle)
        }

        if(contentDescription){
            cy.get(this.appearance.contentDescription).click()
            cy.get(this.appearance.contentDescriptionInput).clear().type(contentDescription)
            cy.get(this.appearance.contentDescriptionInput).parents("form").contains("Save").click()
            cy.get(this.appearance.contentDescription, {timeout: 5000}).should("contain", contentDescription)
        }
    }

    selectCloneOptions(config){
        // To specify which event 'tabs' you want to clone, pass them in as a key and set to true. 
        // The key must be the same as their corresponding locator keys in the this.cloneOptions object.
        Object.keys(config).forEach(option => {
            if(this.cloneOptions[option] && config[option]){
                cy.get(this.cloneOptions[option]).click()
                cy.get(this.cloneOptions[option]).parent().should("have.class", "ant-checkbox-checked")
            }
        })
    }

    cloneEvent(config){
        // If you specify the event to clone (template), then it is assumed you are already on the page listing all the events, and will clone from there by adding a new event 
        // If you don't specify what to clone, then it is assumed you are already on the event configuration page of the event you want to clone, and will clone from within here
        // Both ways of cloning will bring you to the newly created event configuration page
        const template = config.template
        const name = config.name
        const verify = config.verify

        if(template){
            cy.get(this.pageTitleBar).within(()=>{
                cy.get(this.addEventButton).click()
            })
            cy.contains(this.antModal, "Add Virtual Event").within(()=>{
                cy.get(this.eventNameInput).clear().type(name)
                cy.get(this.antSelector).click()
            })
            cy.mouseWheel({
                scroller: this.antDropDownScroller,
                find: this.antDropdownOption(template)
            })
            cy.get(this.antDropdownOption(template)).click()
            cy.contains(this.antModal, "Add Virtual Event").within(()=>{
                this.selectCloneOptions(config)
                cy.contains("button", "Add Virtual Event").click()
            })
            if(verify !== false){
                cy.contains(this.antModalBody, "Add Virtual Event").should('not.be.visible')
                cy.containsExact(this.eventCardTitle, name, {timeout: 10000}).should('exist')
                this.goToEventConfig(name)
            }
        } else {
            cy.get(this.cloneButton).click()
            cy.contains(this.antModal, "Clone this Virtual Event").within(()=>{
                cy.get(this.eventNameInput).clear().type(name)
            })
            this.selectCloneOptions(config)
            cy.contains("button", "Clone this Virtual Event").click()
            if(verify !== false){
                cy.contains(this.antModal, "Clone this Virtual Event").should("not.be.visible")
                cy.containsExact(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
            }
        }
    }

    cloneSession(config){
        const template = config.template
        const name = config.name
        const verify = config.verify

        if(template){
            this.goToSessionList()
            cy.contains("button", "Add Session").click()
            cy.contains(this.antModal, "Add Session").within(()=>{
                cy.get(this.sessionNameInput).clear().type(name)
                cy.get(this.antSelector).click()
            })
            cy.mouseWheel({
                scroller: this.antDropDownScroller,
                find: this.antDropdownOption(template)
            })
            cy.get(this.antDropdownOption(template)).click()
            cy.contains(this.antModal, "Add Session").within(()=>{
                cy.get(this.onDemandRadio).should("not.exist") // The on demand and live radio buttons disappear once a template is chosen
                cy.contains("button", "Add Session").click()
            })
            if(verify !== false){
                cy.contains(this.antModal, "Add Session").should("not.be.visible")
                cy.get(this.sessionName(name), {timeout: 10000}).should('exist')
                this.goToSessionConfig(name)
            }
        } else {
            cy.angryClick({
                clickElement: this.cloneButton,
                checkElement: `${this.antModal}:contains('Clone this Session')`
            })
            cy.contains(this.antModal, "Clone this Session", {timeout: 20000}).should("exist").within(()=>{
                cy.get(this.sessionNameInput).should("exist").clear().type(name)
                cy.contains("button", "Clone this Session").click()
            })
            if(verify !== false){
                cy.contains(this.antModal, "Clone this Session").should("not.be.visible")
                cy.containsExact(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
            }
        }
    }

    cloneLandingPage(config){
        const method = config.method
        const template = config.template
        const name = config.name
        const verify = config.verify

        if(method == "add page button"){
            cy.contains("button", "Add Page").click()
            cy.contains(this.antModal, "Add Page").within(()=>{
                cy.get(this.pages.nameInput).clear().type(name)
                cy.get(this.antSelector).click()
            })
            cy.mouseWheel({
                scroller: this.antDropDownScroller,
                find: this.antDropdownOption(template)
            })
            cy.get(this.antDropdownOption(template)).click()
            cy.contains(this.antModal, "Add Page").within(()=>{
                cy.contains('button', "Add Page").click()
            })
            if(verify !== false){
                this.waitForAntModal({title: "Add Page"})
            }
        } else if (method == "clone button"){
            cy.containsExact(this.antCell, template).parent().within(()=>{
                cy.contains("button", "Clone").click()
            })
            cy.contains(this.antModal, "Clone this Page").within(()=>{
                cy.get(this.pages.nameInput).clear().type(name)
                cy.contains("button", "Clone this Page").click()
            })
            if(verify !== false){
                this.waitForAntModal({title: "Clone this Page"})
            }
        }

        if(verify !== false){
            cy.containsExact(this.antCell, name, {timeout: 20000}).should("exist")
        }
    }

}