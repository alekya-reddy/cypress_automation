
export const constants = {
    testENV: Cypress.env('TEST_ENV'),
    automationSubdomain: 'automation',
    automationUser: "qa-automation",
    automationUserPassword: "Capybara123",
    lookbookhqDomain: (function(env){
        if(env == 'pathfactory-staging'){
            return "staging2.lookbookhq.com";
        } else if (env == 'pathfactory-qa'){
            return "qa.lookbookhq.com";
        }
    })(Cypress.env('TEST_ENV')),
    pathfactoryDomain: `${Cypress.env('TEST_ENV')}.com`,
    adminUser: 'user-automation',
    adminUserPassword: "Capybara123",
    authorUser: 'qa-author',
    authorUserPassword: "Capybara123",
    reporterUser: 'qa-reporter',
    reporterUserPassword: "Capybara123"
}