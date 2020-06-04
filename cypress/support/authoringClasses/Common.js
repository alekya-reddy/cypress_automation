
export class Common {
    constructor(env, org, userName, password, customBaseUrl){
        this.userName = userName;
        this.password = password;
        this.org = org;
        this.env = env;
        this.customBaseUrl = customBaseUrl;
        this.baseUrl = customBaseUrl ? customBaseUrl : `https://${org}.${env}.com`;
        this.loginUrl = `${this.baseUrl}/users/sign_in`; 
        this.userNameInputLocator = '[id="login"]';
        this.passwordInputLocator = '[id="password"]';
        this.submitButtonLocator = 'input[value="Log in"]'; 
        this.pageTitleBar = '[data-qa-hook="title-bar"]';
        this.pageTitleLocator = '[data-qa-hook="title-bar"] > h1'; 
        this.pageBody = '[data-qa-hook="page-body"]';
        this.editIcon = 'i[title="Edit"]';
        this.modal = 'div[data-qa-hook="modal"]';
        this.antModal = 'div[class="ant-modal"]';
        this.vexNavigation = 'li[role="menuitem"] > a[href="/authoring/content-library/virtual-events"]';
        this.contentPickerSearchBar = 'input[name="content-picker-search-bar"]';
        this.contentPickerItem = 'div[data-qa-hook="content-picker-item"]';
        this.saveButton = 'button:contains("Save")';
        this.cancelButton = 'button:contains("Cancel")';
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

    toggle(toggle_locator, on_or_off) {
        cy.get(toggle_locator).then((toggle)=>{
            let color = toggle.css("background-color") 
            if ( (color == 'rgb(0, 169, 203)' && on_or_off == 'off') || (color == 'rgb(221, 221, 221)' && on_or_off == 'on') ){
                toggle.click()
            }
        })
    }

}