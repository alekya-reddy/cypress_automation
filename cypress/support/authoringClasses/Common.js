
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
        this.pageSearch = "input[name='page-search']";
        this.editIcon = 'i[title="Edit"]';
        this.editPencil = 'i[class*="fa-pencil"]';
        this.popover = "div[data-qa-hook='popover']";
        this.modal = 'div[data-qa-hook="modal"]';
        this.closeModal = "i[title='Close modal']";
        this.antModal = ".ant-modal"; 
        this.antModalRoot = ".ant-modal-root";
        this.antModalMask = ".ant-modal-mask"; // The element that contains information about wheter or not the modal is hidden
        this.vexNavigation = '#virtual-events';
        this.contentPickerSearchBar = 'input[name="content-picker-search-bar"]';
        this.contentPickerItem = 'div[data-qa-hook="content-picker-item"]';
        this.saveButton = 'button:contains("Save")';
        this.cancelButton = 'button:contains("Cancel")';
        this.deleteIcon = 'i[title="delete"]';
        this.modal = 'div[data-qa-hook="modal"]';
        this.clearSearchIcon = 'i[title="Clear search"]';
        this.antNotification = "div[class^='ant-notification-notice']";
        this.antSelectItem = "span[class='ant-select-selection-item']";
        this.thumbnailSelector = "#thumbnail-selector";
        this.scrollableTable = 'div[class*="table-body-container"]';
        this.table = {
            // Table cell div data-qa-hooks are reused so often that we should just place them all into common
            cellName: "div[data-qa-hook='table-cell-name']",
            cellCode: "div[data-qa-hook='table-cell-code']",
            urlCell: "div[data-qa-hook='table-cell-url']",
            internalTitleCell: "div[data-qa-hook='table-cell-internal-title']"
        };
        this.antTable = {
            cell: ".ant-table-cell",
            row: ".ant-table-row"
        };
        this.antCard = {
            container: ".ant-card",
            title: ".ant-card-head-title"
        };
        this.antDropSelect = {
            selector: ".ant-select-selector",
            options: function(option){ return `div[label="${option}"]`; }
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
        this.dropDownOption = function(option){ return `div[aria-label="${option}"]` };
        this.selectList = "div[data-qa-hook='select-list']";
        this.selectValue = ".Select-value";
        this.antCheckboxContainer = ".ant-dropdown-menu-item";
        this.antCheckbox = ".ant-checkbox";
        this.antDropdown = ".ant-dropdown";
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
        cy.visit(this.baseUrl)
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

    toggle(toggleLocator, on_off){
        cy.get(toggleLocator, {timeout: 20000}).invoke("text").then((toggleText)=>{
            cy.log(toggleText.toUpperCase() == "ONOFF")
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
            cy.contains("li", category).click()
            if(url){
                cy.get(`img[src*="${url}"]`).click() 
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

        cy.contains(this.antCheckboxContainer, label).within(()=>{
            cy.get(this.antCheckbox).invoke("attr", "class").then((checkboxClass)=>{
                if( (check == true && !checkboxClass.includes("ant-checkbox-checked")) || (check == false && checkboxClass.includes("ant-checkbox-checked")) ){
                    cy.get(this.antCheckbox).click()
                }
            })
        })
    }

}