
export class Common {
    constructor(env = Cypress.env('TEST_ENV'), userName = "qa-automation", password = "Capybara123"){
        this.userName = userName;
        this.password = password;
        this.env = env;
        this.baseUrl = (function(testEnv){
            switch(testEnv) {
                case 'pathfactory-staging':
                    return "https://automation.pathfactory-staging.com";
                case 'pathfactory-qa':
                    return "https://automation.pathfactory-qa.com";
            }
        })(env);
        this.loginUrl = `${this.baseUrl}/users/sign_in`; 
        this.userNameInputLocator = '[id="login"]';
        this.passwordInputLocator = '[id="password"]';
        this.submitButtonLocator = 'input[value="Log in"]'; 
        this.pageTitleLocator = '[data-qa-hook="title-bar"]'; 
        this.editIcon = 'i[title="Edit"]';
    }

    login(user = this.userName, password = this.password) {
        cy.visit(this.baseUrl)
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