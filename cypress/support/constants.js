
export const constants = {
    env: Cypress.env('TEST_ENV'),
    envList: {
        qa: "qa",
        staging: "staging",
        prod: "prod"
    },
    domain: {
        lookbookhq: {
            qa: "qa.lookbookhq.com",
            staging: "staging2.lookbookhq.com",
            prod: "lookbookhq.com"
        },
        pathfactory: {
            qa: "pathfactory-qa.com",
            staging: "pathfactory-staging.com",
            prod: "pathfactory.com"
        }
    },
    testENV: Cypress.env('TEST_ENV'),
    lookbookhqDomain: (function(env){
        if(env == 'pathfactory-staging'){
            return "staging2.lookbookhq.com";
        } else if (env == 'pathfactory-qa'){
            return "qa.lookbookhq.com";
        } else if (env == 'prod'){
            return "lookbookhq.com";
        }
    })(Cypress.env('TEST_ENV')),
    pathfactoryDomain: (function(env){
        if(env == 'pathfactory-staging'){
            return "pathfactory-staging.com";
        } else if (env == 'pathfactory-qa'){
            return "pathfactory-qa.com";
        } else if (env == 'prod'){
            return "pathfactory.com";
        }
    })(Cypress.env('TEST_ENV')),
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