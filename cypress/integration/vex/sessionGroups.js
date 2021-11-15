import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({ org: 'automation-vex', tld: 'lookbookhq' });
const consumption = createConsumptionInstance({ org: 'automation-vex', tld: 'lookbookhq' });

const event = {
    name: 'sessionGroups.js',
    slug: 'sessiongroups-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const event2 = {
    name: 'sessionGroups2.js',
    slug: 'sessiongroups2-js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = [
    {
        name: "Live pending",
        slug: "pending",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2040 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        index: "0"
    },
    {
        name: "Live current",
        slug: "current",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2020 8:00pm',
            end: 'Jun 24, 2041 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        index: "1"
    },
    {
        name: "Live ended with on-demand",
        slug: "ended-fallback",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        video: 'Youtube - Used in Cypress automation for VEX testing',
        index: "2"
    },
    {
        name: "Live ended without on-demand",
        slug: "ended",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'Live',
        live: {
            start: 'Jun 24, 2010 8:00pm',
            end: 'Jun 24, 2011 8:00pm',
            timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
            type: 'Webex',
            webexLink: "https://meetingsamer31.webex.com/meet/pr1263154023"
        },
        index: "3"
    },
    {
        name: "On-demand",
        slug: "on-demand",
        get url() {
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing',
        index: "4"
    },

]

const onDemandSessions = [
    {
        name: "Live ended with on-demand",
        index: "0"
    },
    {
        name: "On-demand",
        index: "1"
    }
]

const liveSessions = [
    {
        name: "Live pending",
        index: "0"
    },
    {
        name: "Live current",
        index: "1"
    },
]

const groupDSessions = [
    {
        name: "Live current",
        index: "0"
    },
    {
        name: "On-demand",
        index: "1"
    }
]

const groupA = {
    name: "Group A",
    sessions: sessions.map((session) => { return session.name }),
    notExpected: [] // It used to be that a live session that's ended without on-demand fallback would no longer be accessible, but this is no longer the case 
}
const groupB = {
    name: "Group B",
    sessions: sessions[0].name
}
const groupC = {
    name: "Group C",
    sessions: []
}

const groupD = {
    name: "Group D",
    sessions: ["On-demand", "Live current"]
}

const landingPage = {
    name: "Test Landing Page with Session groups",
    slug: "test-landing-page",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "Session Group",
            sessionGroup: "All Sessions"
        },
        {
            type: "Session Group",
            sessionGroup: "All On Demand Sessions"
        },
        {
            type: "Session Group",
            sessionGroup: "All Upcoming Sessions"
        },
        {
            type: "Session Group",
            sessionGroup: "Group D"
        }
    ]
}

const ClonedlandingPage = {
    name: "Test cloned Page with Session groups",
    slug: "test-cloned-page",
    get url() {
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    title:"Test cloned Page"
}

// Session groups allow you to group sessions under the headings you want, instead of the default "Agenda" and "On demand" groups 
describe('VEX - Sessions Groups', function () {
    it("Set up if not already done", () => {
        cy.request({ url: event.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                sessions.forEach((session) => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event.name)
                })
            }
        })
    })

    it('Test the CRUD (Create, Update, Destroy) operations for session groups', function () {
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)

        // Delete previously added session groups because 1) Rule out bugs where previously added stuff works but not new stuff, 2) Want to test adding and deleting 
        authoring.vex.deleteSessionGroup(groupA.name)
        authoring.vex.deleteSessionGroup(groupB.name)
        authoring.vex.deleteSessionGroup(groupC.name)

        // Go to consumption and verify that, without any session groups, the default groups are "Agenda" and "On demand"
        cy.visit(event.url)
        cy.contains("h2", "Agenda", { timeout: 50000 }).should('exist')
        cy.contains("h2", "On Demand Sessions").should('exist')

        // Add the groups back 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.addSessionGroup(groupA.name)
        authoring.vex.addSessionGroup(groupB.name)
        authoring.vex.addSessionGroup(groupC.name)

        // Edit group name, and change it back 
        authoring.vex.renameSessionGroup({ name: groupA.name, newName: "renamed" })
        authoring.vex.renameSessionGroup({ name: "renamed", newName: groupA.name })

        // Add sessions to the groups 
        authoring.vex.addToGroup(groupA)
        authoring.vex.addToGroup(groupB)

        // Remove sessions from a group (then add it back)
        authoring.vex.removeFromGroup(groupB)
        authoring.vex.addToGroup(groupB)

        // Confirm the initial order of sessions in group A
        cy.contains(authoring.vex.groupRow, groupA.name).within(() => {
            cy.contains("button", "Manage Sessions").click()
        })
        for (let i = 0; i < groupA.sessions.length; i++) {
            cy.get(authoring.vex.draggableMenu).eq(i).siblings("span").should("contain", groupA.sessions[i])
        }

        // Reorder content within group A
        cy.containsExact("span", sessions[4].name, { timeout: 10000 }).siblings(authoring.vex.draggableMenu).then((subject) => {
            cy.containsExact("span", sessions[0].name, { timeout: 10000 }).siblings(authoring.vex.draggableMenu).then((target) => {
                cy.get(subject).drag({ to: target, place: 'over' }) // this drags the on-demand session to the first slot 
            })
        })

        // Confirm the new order within group A (will confirm order on consumption side later)
        let expectedOrder = [...groupA.sessions]
        let poppedItem = expectedOrder.pop() // pops off the on-demand session
        expectedOrder.unshift(poppedItem) // adds it back to beginning 
        for (let i = 0; i < expectedOrder.length; i++) {
            cy.get(authoring.vex.draggableMenu).eq(i).siblings("span").should("contain", expectedOrder[i])
        }

        // Go to consumption and verify that the sessions are grouped correctly 
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, groupA.name, { timeout: 50000 }).should('exist').within(() => {
            let noOfSessions = groupA.sessions.length - groupA.notExpected.length
            cy.get(consumption.vex.sessionCardTitle).should("have.length", noOfSessions)
            groupA.sessions.forEach((session) => {
                if (groupA.notExpected.includes(session)) {
                    cy.contains(consumption.vex.sessionCardTitle, session).should("not.exist")
                } else {
                    cy.contains(consumption.vex.sessionCardTitle, session).should("exist")
                }
            })

            // Confirm the order of the sessions within Group A
            for (let i = 0; i < expectedOrder.length; i++) {
                cy.get(consumption.vex.sessionCardTitle).eq(i).should("contain", expectedOrder[i])
            }
        })

        cy.contains(consumption.vex.sessionGroup, groupB.name).should('exist').within(() => {
            cy.get(consumption.vex.sessionCardTitle).should("have.length", 1)
            cy.contains(consumption.vex.sessionCardTitle, groupB.sessions).should('exist')
        })

        cy.contains(consumption.vex.sessionGroup, groupC.name).should('not.exist')
    })

    it("Test all the cancel buttons within the session group page, and test the input field error validations", () => {
        cy.clearCookies() // 1 in 3 runs, Cypress doesn't clear cookies between it functions, so make sure it gets done here
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.removeSession("Delete me")
        authoring.vex.addSession("Delete me")
        authoring.vex.goToSessionGroup()

        // "Add Group" input field validation - and test its cancel button
        cy.contains("button", "Add Group").click()
        cy.contains(authoring.vex.antModal, "Add Group").should("exist").within(() => {
            cy.get(authoring.vex.groupNameInput).clear()
            cy.contains("button", "Submit").click()
            cy.contains("can't be blank").should("exist")
            cy.get(authoring.vex.groupNameInput).clear().type(groupA.name)
            cy.contains("button", "Submit").click()
            cy.contains("has already been taken").should('exist')
            cy.contains("button", "Cancel").click()
        })
        cy.contains(authoring.vex.antModal, "Add Group").should("not.be.visible")

        // Add sessions to group cancel 
        cy.contains(authoring.vex.groupRow, groupA.name).contains("button", "Manage Sessions").click()
        cy.contains("button", "Add Sessions to Group").click()
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").should("exist").contains("button", "Cancel").click()
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").should("not.be.visible")

        // "Edit group name" input field validation, and test its cancel button
        cy.contains(authoring.vex.groupRow, groupA.name).contains("button", "Rename").click()
        cy.contains(authoring.vex.antModal, "Edit Session Group").should("exist").within(() => {
            cy.get(authoring.vex.groupNameInput).clear()
            cy.contains("button", "Submit").click()
            cy.contains("can't be blank").should("exist")
            cy.get(authoring.vex.groupNameInput).clear().type(groupB.name)
            cy.contains("button", "Submit").click()
            cy.contains("has already been taken").should('exist')
            cy.contains("button", "Cancel").click()
        })
        cy.contains(authoring.vex.antModal, "Edit Session Group").should("not.be.visible")

        // Remove group cancel 
        cy.contains(authoring.vex.groupRow, groupA.name).contains("button", "Remove").click()
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("exist").contains("button", "Cancel").click()
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("not.exist")

        // Remove session from group cancel 
        cy.contains(authoring.vex.sessionRow, groupA.sessions[0]).contains("button", "Remove").click()
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("exist").contains("button", "Cancel").click()
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("not.exist")

        // Add a session to a group, verify that the session is no longer in the options if you try to add another session (there was bug where it was still available as option, leading to internal server error)
        cy.contains("button", "Add Sessions to Group").click()
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").contains("span", "Select Sessions").click()
        cy.get(authoring.vex.antDropSelect.options("Delete me")).should('exist').click()
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").contains("button", "Submit").click({ force: true })
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").contains("span", "Select Sessions").click()
        cy.get(authoring.vex.antDropSelect.options("Delete me")).should('not.exist')
        // then delete that session and revisit group (there was a bug where this caused internal server error)
        cy.contains("a", "Event Setup").click()
        authoring.vex.removeSession("Delete me")
        cy.contains("a", "Session Groups").click()
        cy.contains(authoring.vex.groupRow, groupA.name).contains("button", "Manage Sessions").click()
        cy.contains("span", "Delete me").should('not.exist')
    })

    it("Validate All sessions,All On Demand Sessions, All Upcoming Sessions, Session groups showing as options for the session group dropdown", () => {
        const allSessionNames = [],allClonedSessions=[], ondemandSessionsNames = [],clonedOndemandSessionsNames=[], liveSessionsNames = [],clonedLiveSessionsNames=[], sessionGroupNames = [],clonedSessionGroupNames = []
        cy.request({ url: event2.url, failOnStatusCode: false }).then((response) => {
            if (response.status == 404) {
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event2)
                authoring.vex.configureEvent(event2)
                sessions.forEach((session) => {
                    authoring.vex.addSession(session.name)
                    authoring.vex.configureSession(session)
                    authoring.vex.backToEvent(event2.name)
                })
                authoring.vex.addSessionGroup(groupD.name)
                authoring.vex.addToGroup(groupD)
            }
        })

        //Selecting All sessions option and verify in authoring page and in consumption page 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.deleteLandingPages(ClonedlandingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.setToHomePage(landingPage.name)
        authoring.vex.goToPageEditor(landingPage.name)
        authoring.vex.addAdvancedBlock(landingPage.blocks[0])
        sessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })
        cy.contains('button', 'Save').click();
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                allSessionNames.push(text)
            }).then(() => {
                if (index == sessions.length - 1) {
                    sessions.forEach((session) => {
                        expect(allSessionNames).to.include(session.name)
                    })
                }
            })
        })

        //Clone landing page and verify All sessions are cloned in authoring page and in consumption page 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.cloneLandingPage({
            method: "add page button",
            template: landingPage.name, // We are cloning the landing page of the original event 
            name: ClonedlandingPage.name
        })
        authoring.vex.editLandingPage(ClonedlandingPage)
        authoring.vex.setToHomePage(ClonedlandingPage.name)
        authoring.vex.goToPageEditor(ClonedlandingPage.name)

        cy.wait(3000)
        sessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })

        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                allClonedSessions.push(text)
            }).then(() => {
                if (index == sessions.length - 1) {
                    sessions.forEach((session) => {
                        expect(allClonedSessions).to.include(session.name)
                    })
                }
            })
        })

        //Selecting All On Demand Sessions and verify in authoring page and in consumption page 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.deleteLandingPages(ClonedlandingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.editLandingPage(landingPage)
        authoring.vex.setToHomePage(landingPage.name)
        authoring.vex.goToPageEditor(landingPage.name)
        authoring.vex.addAdvancedBlock(landingPage.blocks[1])
        onDemandSessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })
        cy.contains('button', 'Save').click();
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')


        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                ondemandSessionsNames.push(text)
            }).then(() => {
                if (index == onDemandSessions.length - 1) {
                    onDemandSessions.forEach((session) => {
                        expect(ondemandSessionsNames).to.include(session.name)
                    })
                }
            })
        })

        //Clone landing page and verify ondemand sessions are cloned in in authoring page and in consumption page 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.cloneLandingPage({
            method: "add page button",
            template: landingPage.name, // We are cloning the landing page of the original event 
            name: ClonedlandingPage.name
        })
        authoring.vex.editLandingPage(ClonedlandingPage)
        authoring.vex.setToHomePage(ClonedlandingPage.name)
        authoring.vex.goToPageEditor(ClonedlandingPage.name)

        cy.wait(3000)
        onDemandSessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })

        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                clonedOndemandSessionsNames.push(text)
            }).then(() => {
                if (index == onDemandSessions.length - 1) {
                    onDemandSessions.forEach((session) => {
                        expect(clonedOndemandSessionsNames).to.include(session.name)
                    })
                }
            })
        })

        //Selecting All Upcoming Sessions and verify in authoring page and in consumption page 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.deleteLandingPages(ClonedlandingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.editLandingPage(landingPage)
        authoring.vex.setToHomePage(landingPage.name)
        authoring.vex.goToPageEditor(landingPage.name)
        authoring.vex.addAdvancedBlock(landingPage.blocks[2])
        liveSessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })
        cy.contains('button', 'Save').click();
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')


        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                liveSessionsNames.push(text)
            }).then(() => {
                if (index == liveSessions.length - 1) {
                    liveSessions.forEach((session) => {
                        expect(liveSessionsNames).to.include(session.name)
                    })
                }
            })
        })

         //Clone landing page and verify All upcoming sessions are cloned in authoring page and in consumption page 
         authoring.common.login()
         authoring.vex.visit()
         authoring.vex.goToEventConfig(event2.name)
         authoring.vex.goToLandingPage()
         authoring.vex.cloneLandingPage({
             method: "add page button",
             template: landingPage.name, // We are cloning the landing page of the original event 
             name: ClonedlandingPage.name
         })
         authoring.vex.editLandingPage(ClonedlandingPage)
         authoring.vex.setToHomePage(ClonedlandingPage.name)
         authoring.vex.goToPageEditor(ClonedlandingPage.name)
 
         cy.wait(3000)
         liveSessions.forEach((session) => {
             authoring.vex.verifySessions(session)
         })
 
         cy.visit(event2.url)
 
         cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
             cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                clonedLiveSessionsNames.push(text)
             }).then(() => {
                 if (index == liveSessions.length - 1) {
                    liveSessions.forEach((session) => {
                         expect(clonedLiveSessionsNames).to.include(session.name)
                     })
                 }
             })
         })

        //Selecting Session group and verify in authoring page and in consumption page 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.deleteLandingPages(ClonedlandingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.editLandingPage(landingPage)
        authoring.vex.setToHomePage(landingPage.name)
        authoring.vex.goToPageEditor(landingPage.name)
        authoring.vex.addAdvancedBlock(landingPage.blocks[3])
        groupDSessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })
        cy.contains('button', 'Save').click();
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                sessionGroupNames.push(text)
            }).then(() => {
                if (index == groupDSessions.length - 1) {
                    groupDSessions.forEach((session) => {
                        expect(sessionGroupNames).to.include(session.name)
                    })
                }
            })
        })

        //Clone landing page and verify Session group sessions are cloned in authoring page and in consumption page 
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event2.name)
        authoring.vex.goToLandingPage()
        authoring.vex.cloneLandingPage({
            method: "add page button",
            template: landingPage.name, // We are cloning the landing page of the original event 
            name: ClonedlandingPage.name
        })
        authoring.vex.editLandingPage(ClonedlandingPage)
        authoring.vex.setToHomePage(ClonedlandingPage.name)
        authoring.vex.goToPageEditor(ClonedlandingPage.name)

        cy.wait(3000)
        groupDSessions.forEach((session) => {
            authoring.vex.verifySessions(session)
        })

        cy.visit(event2.url)

        cy.get(consumption.vex.sessionCardTitle).each((sessionName, index) => {
            cy.get(sessionName).find('div').eq(0).invoke('text').then(text => {
                clonedSessionGroupNames.push(text)
            }).then(() => {
                if (index == groupDSessions.length - 1) {
                    groupDSessions.forEach((session) => {
                        expect(clonedSessionGroupNames).to.include(session.name)
                    })
                }
            })
        })
    })

})