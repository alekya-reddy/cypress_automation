export class Common {
    constructor(env, org, tld, userName, password, baseUrl){
        this.userName = userName;
        this.password = password;
        this.org = org;
        this.tld = tld;
        this.env = env;
        this.baseUrl = baseUrl; 
        this.loginUrl = `${this.baseUrl}/users/sign_in`; 
        this.userNameInputLocator = '[id="login"]';
        this.passwordInputLocator = '[id="password"]';
        this.submitButtonLocator = '#input-button'; 
        this.pageTitleBar = '[data-qa-hook="title-bar"]';
        this.pageTitleLocator = '[data-qa-hook="title-bar"] > h1'; 
        this.pageBody = '[data-qa-hook="page-body"]';
        this.pageControls = 'div[data-qa-hook="page-controls"]';
        this.pageSearch = "input[name='page-search']";
        this.editIcon = 'i[title="Edit"]';
        this.editPencil = 'i[class*="fa-pencil"]';
        this.popover = "div[data-qa-hook='popover']";
        this.modal = 'div[data-qa-hook="modal"]';
        this.confirmationModal = '#confirmation-modal';
        this.closeModal = "i[title='Close modal']";
        this.antModal = ".ant-modal-content"; 
        this.antModalRoot = ".ant-modal-root";
        this.antModalMask = ".ant-modal-mask"; // The element that contains information about wheter or not the modal is hidden
        this.vexNavigation = '#virtual-events';
        this.contentPickerSearchBar = 'input[name="content-picker-search-bar"]';
        this.contentPickerItem = 'div[data-qa-hook="content-picker-item"]';
        this.saveButton = 'button:contains("Save")';
        this.cancelButton = 'button:contains("Cancel")';
        this.deleteIcon = 'i[title="delete"]';
        this.anotherDeleteIcon = 'i[title="Delete"]';
        this.modal = 'div[data-qa-hook="modal"]';
        this.clearSearchIcon = 'i[title="Clear search"]';
        this.clearValueIcon = ".Select-clear";
        this.antNotification = "div[class^='ant-notification-notice']";
        this.antSelectItem = "span[class='ant-select-selection-item']";
        this.thumbnailSelector = "#thumbnail-selector";
        this.scrollableTable = 'div[class*="table-body-container"]';
        this.pageSidebar = "div[data-qa-hook='page-sidebar']";
        this.table = {
            // Table cell div data-qa-hooks are reused so often that we should just place them all into common
            cellName: "div[data-qa-hook='table-cell-name'] > span",
            experienceCellName: "div[data-qa-hook='table-cell-name']",
            cellCode: "div[data-qa-hook='table-cell-code']",
            urlCell: "div[data-qa-hook='table-cell-url']",
            internalTitleCell: "div[data-qa-hook='table-cell-internal-title']",
            addedByCell: 'div[data-qa-hook="table-cell-created-by"] > span',
            folderCell: "div[data-qa-hook='table-cell-folder-name']"
        };
        this.antTable = {
            cell: "tbody td.ant-table-cell",
            row: "tr[class*='ant-table-row']"
        };
        this.antCard = {
            container: ".ant-card",
            title: "td[class*='ant-table-cell']"
        };
        this.antDropSelect = {
            selector: ".ant-select-selector:visible",
            optionsContainer: "div[class*='ant-select-dropdown']",
            options: function(option){ return `div[label="${option}"]`; }
        };
        this.dropdown = {
            box: "div[data-qa-hook='select-list']", // The element to click to open the dropdown menu
            input: ".Select-input > input", // The text input of dropdown boxes
            selectedValue: ".Select-value", // The parent container of the label of the selected value
            option: function(option){ return `div[aria-label="${option}"]` }, // The options in the dropdown menu
            clearValue: 'span[title="Clear value"] > span'
        };
        this.rcColorPicker = {
            container: ".rc-color-picker",
            inputs: ".rc-color-picker-panel-params-input",
        };
        this.lpColorPicker = {
            bar: ".swatch-inner",
            popover: ".sketch-picker",
        };
        this.previewSideBar = "div[data-qa-hook='page-preview']";
        this.messages = {
            recordSaved: "The record was saved successfully",
            saveFailed: "There was a problem saving this record",
            duplicateEntry: "is already taken",
            duplicateEntry2: "has already been taken",
            duplicateEntry3: "already exists",
            blankInput: "can't be blank",
            invalidEmail: "invalid email",
            invalidEmail2: "does not appear to be a valid e-mail address"
        };
        this.antCheckboxContainer = ".ant-dropdown-menu-item";
        this.antCheckboxWrapper = ".ant-checkbox-wrapper";
        this.antCheckbox = ".ant-checkbox";
        this.antDropdown = ".ant-dropdown";
        this.antPopover = ".ant-popover";
        this.antRow = ".ant-row";
        this.antTabs=".ant-tabs-nav-list .ant-tabs-tab-btn";
        this.checkboxContainer = 'div[data-qa-hook="checkbox"]';
        this.accessProtection = {
            protectionTypeLabel: "label[for='protectionType']",
            accessProtectionLabel: "label:contains('Access Protection')",
            APGroupLabel: "label[for='visitorGroupIds']",
            GroupdropDown: "div[class='Select-menu']",
            APDisGroupLabel: "label[for='visitorGroupBlacklistIds']",
            dropDownExpandCollapse: 'span[class="Select-arrow-zone"]',
            track_removeVisitorGroup: 'span[class="Select-value-icon"]',
            trackProtectionArea: '.visitorGroupMultiSelect',
            selectedVisitorGroup: 'span[class="ant-select-selection-item-content"]',
            vex_microsite_removeVisitorGroup: 'span[class="ant-select-selection-item-remove"]',
            selectPlaceholder: 'span[class="ant-select-selection-placeholder"]'
        }
        this.folder = {
            folderSelector: function(folderName) {
                return `#folder-${folderName.replace(/\s+/g, '-').toLowerCase()}`
            },
            expandAllIcon: 'i[title="Expand all"]',
            collapseAllIcon: 'i[title="Collapse all"]',
            folderCount: function(folderName){ 
                return `#folder-${folderName.replace(/\s+/g, '-').toLowerCase()} >  div:nth-child(2) > div:nth-child(1)`
            },
            addFolderButton: '#create-new-button',
            folderNameInput: '#folderName',
            folderToggle: function(folderName){ 
                return `#folder-toggle-${folderName.replace(/\s+/g, '-').toLowerCase()} > i`
            }
        }
        this.pagePreview = {
            contentTitleOverrideLabel: "label:contains('Content Title Override')",
            contentDescriptionOverrideLabel: "label:contains('Content Description Override')",
            itemDescription: "div[data-qa-hook='item-description']"
        };
    }
    visitHomeUrl(){
        cy.visit(this.baseUrl)
    }

    goToPage(pageTitle, pageUrl){
        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== pageTitle){
                cy.visit(pageUrl);
            }
        })
    }

    login(user = this.userName, password = this.password) {
        cy.viewport(1450, 1024)
        cy.visit(this.baseUrl + "/users/sign_in")

        const clearCookiesAndReload = () => {
            // Sometimes, a new it function takes us directly to authoring even though cookies should be cleared
            // This could be a Cypress bug. This function handles this bug until they fix it. 
            // Once they fix the bug, this function can be removed
            cy.url().then( url => {
                if (!url.includes("/users/sign_in")){
                    cy.clearCookies()
                    cy.reload()
                    cy.visit(this.baseUrl + "/users/sign_in")
                    clearCookiesAndReload()
                }
            })
        }
        clearCookiesAndReload()

        cy.get('body').then((body)=>{
            const linkText = 'Sign in with email and password';
            if(body.find(`a:contains(${linkText})`).length > 0){
                cy.contains(linkText).click()
            }
        })

        cy.get(this.userNameInputLocator).type(user).should('have.value', user)
        cy.get(this.passwordInputLocator).type(password)
        cy.get(this.submitButtonLocator).click()
        cy.url().should('include', '/authoring')
    }

    logout(){
        cy.visit(this.baseUrl + "/logout")
    }

    toggle(toggleLocator, on_off){
        // We have at least 3 different kinds of toggles in our app
        cy.get(toggleLocator, {timeout: 20000}).invoke("text").then((toggleText)=>{
            if( ["ON", "OFF"].includes(toggleText.toUpperCase()) && toggleText.toUpperCase() !== on_off.toUpperCase()){
                cy.get(toggleLocator).click()
            } else if (toggleText.toUpperCase() == "ONOFF"){
                cy.get(toggleLocator).then((toggle)=>{
                    let color = toggle.css("background-color") 
                    if ( (color == 'rgb(0, 169, 203)' && on_off.toUpperCase() == 'OFF') || (color == 'rgb(221, 221, 221)' && on_off.toUpperCase() == 'ON') ){
                        toggle.click()
                    }
                })
            } else {
                cy.get(toggleLocator).invoke("attr", "aria-checked").then((ariaChecked)=>{
                    if( (on_off.toUpperCase() == "ON" && ariaChecked == 'false') || (on_off.toUpperCase() == "OFF" && ariaChecked == 'true') ){
                        cy.get(toggleLocator).click()
                    }
                })
            }
        })
    }

    pickThumbnail(config){
        const category = config.category
        const url = config.url
        const name = config.name 

        cy.get(this.thumbnailSelector).within(()=>{
            cy.angryClick({
                clickElement: `li:contains('${category}')`,
                checkElement: `li[class*='ThumbnailSelector__active']:contains('${category}')`
            })
            if(url){
                cy.get(`img[src*="${url}"]`, {timeout: 6000}).click() 
            } else if (name) {
                cy.contains('div', name).parent().get("img").click()
            }
            cy.contains("button", "Save").click()
        })
        if(url){
            cy.get(`img[src*="${url}"]`).should('exist')
        }
    }

    waitForAntModal(config){
        // This function waits until those annoying modals disappear
        // Cannot simply wait for them to not exist because modal remains present on the DOM, just hidden
        // You can use should("not.be.visible") as alternative but there is no way to control how long the wait should be  
        const title = config.title
        const wait = config.wait || 10
        let count = isNaN(config.count) ? 0 : config.count

        cy.contains(this.antModal, title, {log: false}).parents(this.antModalRoot).within(()=>{
            cy.get(this.antModalMask, {log: false}).invoke("attr", 'class').then(modalClass => {
                if(!modalClass.includes("ant-modal-mask-hidden") && count < wait){
                    cy.wait(1000, {log: false})
                    config.count = count + 1
                    this.waitForAntModal(config)
                }
            })
        })
    }

    clickAntCheckbox(config){
        const label = config.label 
        const check = config.check 
        const wrapper = config.wrapper || this.antCheckboxContainer

        cy.contains(wrapper, label).within(()=>{
            cy.get(this.antCheckbox).invoke("attr", "class").then((checkboxClass)=>{
                if( (check == true && !checkboxClass.includes("ant-checkbox-checked")) || (check == false && checkboxClass.includes("ant-checkbox-checked")) ){
                    cy.get(this.antCheckbox).click()
                }
            })
        })
    }

    clickCheckbox(config){
        const label = config.label 
        const check = config.check 
     
        cy.contains(this.checkboxContainer, label, {timeout: 10000}).invoke("attr", "class").then(checkboxClass => {
           if(check && checkboxClass.includes("checkbox-container--unchecked") || !check && checkboxClass.includes("checkbox-container--checked")) {
                cy.get(this.checkboxContainer).contains(label, {timeout: 30000} ).click()
            }       
        })

        const classSubString = check ? "checkbox-container--checked" : "checkbox-container--unchecked"
        cy.contains(`div[class*="${classSubString}"]`, label, {timeout: 10000}).should("exist")
    }

    pickColor(options){
        // This color picker component can be found in appearance settings
        const { button, r, g, b, a } = options

        cy.get(button).click()
        cy.get(this.rcColorPicker.inputs).within(() => {
            if(r){
                // {selectall} tells Cypress to select entire text in input 
                // necessary because clearing the text here will reset input to '0', causing your input to start with '0'
                cy.get("input").eq(1).type(`{selectall}${r}`)
            }

            if(g){
                cy.get("input").eq(2).type(`{selectall}${g}`)
            }

            if(b){
                cy.get("input").eq(3).type(`{selectall}${b}`)
            }

            if(a){
                cy.get("input").eq(4).type(`{selectall}${a*100}`)
            }
        })
        cy.get(button).click()
    }

    pickColor2(options){
        // This color picker component can be found in landing page editors (VEX and Microsites)
        const { hex, r, g, b, position = 0 } = options

        cy.get(this.lpColorPicker.bar).eq(position).click() // Clicking this bar opens the color picker
        cy.get(this.lpColorPicker.popover).within(()=>{
            if(hex){
                cy.get("input").eq(0).clear().type(hex)
            }
            if(r){
                cy.get("input").eq(1).clear().type(r)
            }
            if(g){
                cy.get("input").eq(2).clear().type(g)
            }
            if(b){
                cy.get("input").eq(3).clear().type(b)
            }
        })
        cy.get(this.lpColorPicker.bar).eq(position).click() // clicking this bar again closes the color picker
    }

    clickIcon(name){
        cy.get(`i[title="${name}"]`).eq(0).click({force: true})
    }

    removeAllTracksFromFolder(folders) {
        cy.get(this.folder.expandAllIcon).click({force:true})
        folders.forEach(folder => {
            const folderSelector = this.folder.folderSelector(folder)
            cy.ifElementExists(folderSelector, 1500, () => {
                cy.get(folderSelector).click()
                let folderCount = null
                const folderCountSelector = this.folder.folderCount(folder)
                cy.get(folderCountSelector).invoke('text').then((count) => {
                    folderCount = count
                })
                cy.do(() => {
                    for (var j = 0; j < parseInt(folderCount); j++){
                        cy.get(this.table.addedByCell).eq(0).click()
                        if (cy.contains(this.pageTitleBar, 'Explore Pages')) {
                            this.clickIcon('Edit Explore Page')
                            cy.contains(this.dropdown.box, folder).within(() => {
                                cy.get(this.dropdown.clearValue).click()
                            })
                            cy.contains("button", "Save Explore Page").click()
                        } else {
                            this.clickIcon('Edit Track')
                            cy.get(this.dropdown.clearValue).click()
                            cy.contains("button", "Save").click()
                        }
                    }
                })
            })
        })
    }

    deleteFolder(folders) {
        cy.get(this.folder.expandAllIcon).click({force:true})
        folders.forEach(folder => {
            const folderSelector = this.folder.folderSelector(folder)
            cy.ifElementExists(folderSelector, 1500, () => {
                cy.get(folderSelector).click().within(() => {
                    this.clickIcon('Delete Folder')
                })
                cy.get(this.modal).within(() => {
                    cy.contains("button", "Yes").click()
                })
            })
            cy.get(folderSelector).should("not.exist")
        })
    }

    setTrackLanguage(language, verify){
        cy.get(this.pageSidebar.languageLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(language)).click()
            cy.contains("button", "Update").click()
        })
        cy.get(this.confirmationModal).within(() => {
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.get(this.pageSidebar.languageLabel).siblings("span").should("contain", language)

        }
    } 

    addContentTitleOverride(title, verify){
        cy.get(this.pagePreview.contentTitleOverrideLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get("#titleOverride").clear().type(title)
            cy.contains("button", "Update").click()
        })
        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.get(this.pagePreview.contentTitleOverrideLabel).siblings("span").should("contain", title)
        }
    }

    addContentDescriptionOverride(Description, verify){
        cy.get(this.pagePreview.contentDescriptionOverrideLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get("#descriptionOverride").clear().type(Description)
            cy.contains("button", "Update").click()
        })
        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.get(this.pagePreview.contentDescriptionOverrideLabel).siblings("span").should("contain", Description)
        }
    }
}