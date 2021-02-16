import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'})
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'})

const event = {
    name: 'sessionGroupSearch.js',
    slug: 'sessiongroupsearch-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = {
    sessionWithTopic: {
        name: "With Topic",
        slug: "with-topic",
        get url(){
            return `${event.url}/${this.slug}`
        },
        topics: "General Use",
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    sessionWithDescription: {
        name: "With Description",
        slug: "with-description",
        get url(){
            return `${event.url}/${this.slug}`
        },
        description: "Battlestar Galactica",
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    sessionbyName: {
        name: "Search by name",
        slug: "by-name",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    loneSession: {
        name: "Alone in a group",
        slug: "alone-group",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    }
}

const sessionGroups = {
    groupA: {
        name: "Group A",
        sessions: [sessions.sessionWithTopic.name, sessions.sessionWithDescription.name, sessions.sessionbyName.name]
    },
    groupB: {
        name: "Group B",
        sessions: sessions.loneSession.name
    },
    groupC: {
        name: "Group C",
        sessions: sessions.loneSession.name
    }
}

const landingPage = {
    name: "Landing Page",
    slug: "landing-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroups.groupA.name,
            enableSearch: true,
            enableTopicFilter: true
        },
        {
            type: "Session Group",
            sessionGroup: sessionGroups.groupB.name,
            enableSearch: true,
            enableTopicFilter: false
        },
        {
            type: "Session Group",
            sessionGroup: sessionGroups.groupC.name,
            enableSearch: false,
            enableTopicFilter: true
        }
    ]
}

describe("VEX - Session group search", () => {
    it("Set up if not already done", () => {
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event.name)
                authoring.vex.configureEvent(event)
                Object.values(sessions).forEach((session) => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
                Object.values(sessionGroups).forEach((group) => {
                    authoring.vex.addSessionGroup(group.name)
                    authoring.vex.addToGroup(group)
                })
                authoring.vex.addLandingPages(landingPage.name)
                authoring.vex.configureLandingPage(landingPage)
            }
        })
    })

    it("Session group search should search sessions by name, topics and description", () => {
        cy.visit(event.url)
        landingPage.blocks.forEach((block) => {
            consumption.vex.verifyLandingPageBlock(block)
        })

        // In Group A block, search by name, topic, then description 
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupA.name).within(() => {
            consumption.vex.searchSessionGroup(sessions.sessionbyName.name)
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionbyName.name).should("exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithDescription.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithTopic.name).should("not.exist")

            // Search by pressing Enter keyboard
            cy.get("input").clear().type(sessions.sessionWithTopic.topics + "\n")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionbyName.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithDescription.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithTopic.name).should("exist")

            consumption.vex.searchSessionGroup(sessions.sessionWithDescription.description)
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionbyName.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithDescription.name).should("exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithTopic.name).should("not.exist")
        })

        // Verify that search in one block does not affect search in a different block 
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupB.name).within(() => {
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("exist")
            consumption.vex.searchSessionGroup(sessions.loneSession.name)
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("exist")
            consumption.vex.searchSessionGroup("I don't exist anywhere")
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("not.exist")
        })
    })
    it("Session group filter by topic should search sessions by topics", () => {
        cy.visit(event.url)
        // In Group A block, search by topic filter
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupA.name).within(() => {
            cy.contains("Filter By Topic").click()
            cy.get(consumption.vex.filterByTopicValue).contains(sessions.sessionWithTopic.topics).then(option => {
                // Confirm have correct option
                cy.wrap(option).contains(sessions.sessionWithTopic.topics)
                option[0].click()
                // After click, dropdown should hold the text of the selected option
                cy.contains("Topic: " + sessions.sessionWithTopic.topics).should("exist")
            })
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionbyName.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithDescription.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithTopic.name).should("exist")  
        })
        // Verify that filtering in one block does not affect content in a different blocks
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupB.name).within(() => {
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("exist")
        })
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupC.name).within(() => {
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("exist")
        })
    })

    it("Session group filter by topic and search should should work together", () => {
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupA.name).within(() => {
            cy.contains("Filter By Topic").click()
            cy.get(consumption.vex.filterByTopicValue).contains(sessions.sessionWithTopic.topics).then(option => {
                option[0].click()
            })
            consumption.vex.searchSessionGroup(sessions.sessionWithTopic.topics)
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionbyName.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithDescription.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithTopic.name).should("exist")
            // Verify that session group is empty when using topic filter and searching for name that doesn't exist
            consumption.vex.searchSessionGroup("I don't exist anywhere")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionbyName.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithDescription.name).should("not.exist")
            cy.contains(consumption.vex.sessionCardTitle, sessions.sessionWithTopic.name).should("not.exist")
        })
        // Verify that filtering in one block does not affect content in a different blocks
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupB.name).within(() => {
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("exist")
        })
        cy.contains(consumption.vex.sessionGroup, sessionGroups.groupC.name).within(() => {
            cy.contains(consumption.vex.sessionCardTitle, sessions.loneSession.name).should("exist")
        })
    })
})