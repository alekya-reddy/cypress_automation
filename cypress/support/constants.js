
export const constants = {
    TEST_ENV: Cypress.env('TEST_ENV'),
    envList: {
        qa: "qa",
        staging: "staging",
        prod: "prod"
    },
    domain: {
        lookbookhq: {
            qa: "qa-pathfactory.com",
            staging: "pathfactory-development.com",
            prod: "lookbookhq.com"
        },
        pathfactory: {
            qa: "qa-pathfactory.com",
            staging: "pathfactory-development.com",
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
                    staging: 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
                    qa: 'https://cdn.pathfactory-qa.com/assets/122/contents/17527/7e237afe-3aac-4d8b-bbeb-1a297fcd6fba.png',
                    prod: 'https://cdn.pathfactory.com/assets/10668/contents/181009/31cacbc2-e385-4a58-881e-8fb175dbfa5b.png'
                },
                'PDF - Used by Cypress automation for VEX testing': {
                    staging: 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
                    qa: 'https://cdn.pathfactory-qa.com/assets/122/contents/17526/6521cdc6-5677-493b-8040-3b0c3178a74e.pdf',
                    prod: 'https://cdn.pathfactory.com/assets/10668/contents/181010/26a87f6a-9067-4247-b2ef-30764379b980.pdf'
                },
                'Website - Used by Cypress automation for VEX testing': {
                    staging: 'https://en.wikipedia.org/wiki/SpaceX',
                    qa: 'https://en.wikipedia.org/wiki/SpaceX',
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
            },
            resources: {
                "Website Common Resource": {
                    title: "Website Common Resource",
                    source: "https://en.wikipedia.org/wiki/OpenAI",
                    slug: "openai"
                },
                "Youtube Shared Resource": {
                    title: "Youtube Shared Resource",
                    source: "https://www.youtube.com/watch?v=ap-BkkrRg-o",
                    slug: "youtube"
                }
            }
        },
        'automation-target': {
            name: 'automation-target',
            subdomain: 'automation-target',
            adminUser: 'cy-admin',
            adminUserPassword: 'Cypress1234',
            get defaultUser() {
                return this.adminUser;
            },
            get defaultUserPassword(){
                return this.adminUserPassword;
            },
            resources: {
                "Website Common Resource": {
                    title: "Website Common Resource",
                    source: "https://en.wikipedia.org/wiki/OpenAI",
                    slug: "commonresource"
                },
                "Youtube Shared Resource": {
                    title: "Youtube Shared Resource",
                    source: "https://www.youtube.com/watch?v=ap-BkkrRg-o",
                    slug: "youtube"
                }
            }
        },
        'automation-recommend': {
            name: 'automation-recommend',
            subdomain: 'automation-recommend',
            adminUser: 'cy-admin',
            adminUserPassword: 'Cypress1234',
            get defaultUser() {
                return this.adminUser;
            },
            get defaultUserPassword(){
                return this.adminUserPassword;
            },
            resources: {
                "Website Common Resource": {
                    title: "Website Common Resource",
                    source: "https://en.wikipedia.org/wiki/OpenAI",
                    slug: "commonresource"
                },
                "Youtube Shared Resource": {
                    title: "Youtube Shared Resource",
                    source: "https://www.youtube.com/watch?v=ap-BkkrRg-o",
                    slug: "sharedresource"
                }
            }
        },
        'automation-explore': {
            name: 'automation-explore',
            subdomain: 'automation-explore',
            adminUser: 'cy-admin',
            adminUserPassword: 'Cypress1234',
            get defaultUser() {
                return this.adminUser;
            },
            get defaultUserPassword(){
                return this.adminUserPassword;
            },
            resources: {
                "Website Common Resource": {
                    title: "Website Common Resource",
                    source: "https://en.wikipedia.org/wiki/OpenAI",
                    slug: "commonresource"
                },
                "Youtube Shared Resource": {
                    title: "Youtube Shared Resource",
                    source: "https://www.youtube.com/watch?v=ap-BkkrRg-o",
                    slug: "sharedresource"
                }
            }
        }
    }
}