
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
            superUserPassword: "Capybara12345",
            adminUser: 'user-automation',
            adminUserPassword: 'Capybara123',
            authorUser: 'qa-author',
            authorUserPassword: 'Capybara123',
            reporterUser: 'qa-reporter',
            reporterUserPassword: 'Capybara123',
            multiUser: 'qa-multiuser',
            multiUserPassword: 'Cypress123',
            oceOauthClientId: 'd9e1c003a74d47a0bc59a95432e123c4',
            oceOauthClientSecret: '4e7e7bfb-13af-467b-a13f-a802ed74ef7b',
            oceInstanceUrl: 'https://pathfactory-oce0002.cec.ocp.oraclecloud.com',
            oceidcsUrl: 'https://idcs-a9e0f119e3d04eefad8287b584b10354.identity.oraclecloud.com',
            oceServiceInstanceBaseUrl: 'https://ED6F58DFD652483CB93CC5E856918914.cec.ocp.oraclecloud.com',
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
                    staging: 'https://automation-vex.pathfactory-development.com/pdf_viewer/starship-users-guide',
                    qa: 'https://automation-vex.qa-pathfactory.com/pdf_viewer/starship-users-guide',
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
            authorUser: 'cy-author',
		    authorUserPassword: 'Cypress1234',
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
        },
        'automation-wt': {
            name: 'automation-wt',
            subdomain: 'automation-wt',
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
        }
    }
}