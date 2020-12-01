
export const constants = {
    TEST_ENV: Cypress.env('TEST_ENV'),
    envList: {
        qa: "qa",
        qa2: 'qa2',
        staging: "staging",
        staging2: "staging2",
        prod: "prod"
    },
    domain: {
        lookbookhq: {
            qa: "qa.lookbookhq.com",
            qa2: "qa-pathfactory.com",
            staging: "staging2.lookbookhq.com",
            staging2: "pathfactory-development.com",
            prod: "lookbookhq.com"
        },
        pathfactory: {
            qa: "pathfactory-qa.com",
            qa2: "qa-pathfactory.com",
            staging: "pathfactory-staging.com",
            staging2: "pathfactory-development.com",
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
            },
            resources: {
                "Image - Used by Cypress automation for VEX testing": {
                    staging: 'https://cdn.pathfactory-staging.com/assets/74/contents/12954/d8058125-c1a5-41d3-9f66-cf8176fe2040.png',
                    staging2: 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
                    qa: 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
                    qa2: 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
                    prod: 'https://cdn.pathfactory.com/assets/10668/contents/181009/31cacbc2-e385-4a58-881e-8fb175dbfa5b.png'
                },
                'PDF - Used by Cypress automation for VEX testing': {
                    staging: 'https://cdn.pathfactory-staging.com/assets/74/contents/12955/ae090cdf-c888-41f1-9c5c-5f20fee9acce.pdf',
                    staging2: 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
                    qa: 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
                    qa2: 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
                    prod: 'https://cdn.pathfactory.com/assets/10668/contents/181010/26a87f6a-9067-4247-b2ef-30764379b980.pdf'
                },
                'Website - Used by Cypress automation for VEX testing': {
                    staging: 'https://en.wikipedia.org/wiki/SpaceX',
                    staging2: 'https://en.wikipedia.org/wiki/SpaceX',
                    qa: 'https://en.wikipedia.org/wiki/SpaceX',
                    qa2: 'https://en.wikipedia.org/wiki/SpaceX',
                    prod: 'https://en.wikipedia.org/wiki/SpaceX'
                }
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