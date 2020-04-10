export const base_url = (function(testEnv){
    switch(testEnv) {
        case 'pathfactory-staging':
            return "https://automation.pathfactory-staging.com";
        case 'pathfactory-qa':
            return "https://automation.pathfactory-qa.com";
    }
})(Cypress.env('TEST_ENV'));

export const automationUser = "qa-automation";

export const automationUserPassword = "Capybara123";