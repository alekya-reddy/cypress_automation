
export const constants = {
    testENV: Cypress.env('TEST_ENV'),
    lookbookhqDomain: (function(env){
        if(env == 'pathfactory-staging'){
            return "staging2.lookbookhq.com";
        } else if (env == 'pathfactory-qa'){
            return "qa.lookbookhq.com";
        }
    })(Cypress.env('TEST_ENV')),
    pathfactoryDomain: `${Cypress.env('TEST_ENV')}.com`,
    orgs: {
        'automation': {
            name: 'automation',
            subdomain: 'automation',
            superUser: 'qa-automation',
            superUserPassword: "Capybara123",
            adminUser: 'user-automation',
            adminUserPassword: 'Capybara123',
            authorUser: 'qa-author',
            authorUserPassword: 'Capybara123',
            reporterUser: 'qa-reporter',
            reporterUserPassword: 'Capybara123',
            get defaultUser() {
                return this.superUser;
            },
            get defaultUserPassword(){
                return this.superUserPassword;
            }
        },
        'automation-vex': {
            name: 'automation-vex',
            subdomain: 'automation-vex',
            adminUser: 'cy-admin',
            adminUserPassword: 'Cypress1234',
            authorUser: 'cy-author',
            authorUserPassword: 'Cypress1234',
            reporterUser: 'cy-reporter',
            reporterUserPassword: 'Cypress1234',
            get defaultUser() {
                return this.adminUser;
            },
            get defaultUserPassword(){
                return this.adminUserPassword;
            }
        }
    }
}