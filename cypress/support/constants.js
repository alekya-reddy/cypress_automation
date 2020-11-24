
export const constants = {
    TEST_ENV: Cypress.env('TEST_ENV'),
    envList: {
        qa: "qa",
        qa2: 'qa2',
        staging: "staging",
        prod: "prod"
    },
    domain: {
        lookbookhq: {
            qa: "qa.lookbookhq.com",
            qa2: "qa-pathfactory.com",
            staging: "staging2.lookbookhq.com",
            prod: "lookbookhq.com"
        },
        pathfactory: {
            qa: "pathfactory-qa.com",
            qa2: "qa-pathfactory.com",
            staging: "pathfactory-staging.com",
            prod: "pathfactory.com"
        }
    },
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
        },
        'automation-microsites': {
            name: 'automation-microsites',
            subdomain: 'automation-microsites',
            adminUser: 'cy-admin',
            adminUserPassword: 'Cypress1234',
            get defaultUser() {
                return this.adminUser;
            },
            get defaultUserPassword(){
                return this.adminUserPassword;
            }
        }
    }
}