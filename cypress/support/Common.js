
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
        this.pageTitleLocator = '[data-qa-hook="title-bar"]'; 
        this.editIcon = 'i[title="Edit"]';
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
            if(body.find('a:contains(Sign in with email and password)').length > 0){
                return 'Sign in with email and password'
            } else {
                return false
            }
        }).then((linkText)=>{
            cy.contains(linkText).click()
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

    elementHasText(locator, textToMatch, waitTime, conditionObject){
        conditionObject.matchFound = 'no';
        for(let i = 0; i <= waitTime; i += 500){
            cy.log("loop i = " + i)
            cy.get('body').then(()=>{
                if(conditionObject.matchFound == 'no'){
                    cy.get(locator).invoke('text').then((text)=>{
                        if(text.includes(textToMatch)){
                            conditionObject.matchFound = true;
                            cy.log(`Match found: ${conditionObject.matchFound}`)
                        } else {
                            cy.wait(500)
                        }
                    })
                }
            })
        }
    }

    doIfElementHasText(locator, textToMatch, waitTime, callback){
        // My God - this was such a hard engineering problem to solve because Cypress developers went out of their way to make conditional testing a major pain
        // Well, I've bested them...
        // Use this function to do conditional testing where you want to wait for a condition to be true before moving on WITHOUT having to use a hard wait 
        // Eg. You click a button, if X happens do A, else do B... You want to wait maximum of 10 seconds for X to happen. If X happens sooner than the 10 seconds, 
        // go ahead and do A without waiting the full 10 secs. Such a simple concept, and Cypress developers refuse to give this to us because they hate conditional testing.
        // locator = the locator for the element that might contain the text
        // textToMatch = the text that might appear on the element
        // waitTime = the maximum wait time in milliseconds 
        // callback = the function that is called if text is found on the element  
        let matchFound = false;
        for(let i = 0; i <= waitTime; i += 500){
            cy.get('body', {log: false}).then(()=>{
                if(!matchFound){
                    cy.get(locator, {log: false}).invoke('text').then((text)=>{
                        if(text.includes(textToMatch)){
                            matchFound = true;
                            callback();
                        } else {
                            cy.wait(500, {log: false})
                        }
                    })
                }
            })
        }
    }

}