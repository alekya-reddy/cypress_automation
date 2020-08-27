import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'sessionGroups.js',
    slug: 'sessiongroups-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const sessions = [
    {
        name: "Live pending",
        slug: "pending",
        get url(){
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
        }
    },
    {
        name: "Live current",
        slug: "current",
        get url(){
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
        }
    },
    {
        name: "Live ended with on-demand",
        slug: "ended-fallback",
        get url(){
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
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
    {
        name: "Live ended without on-demand",
        slug: "ended",
        get url(){
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
        }
    },
    {
        name: "On-demand",
        slug: "on-demand",
        get url(){
            return `${event.url}/${this.slug}`
        },
        visibility: 'Public',
        type: 'On Demand',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    },
]

const groupA = {
    name: "Group A",
    sessions: sessions.map((session)=>{ return session.name }),
    notExpected: ["Live ended without on-demand"]
}
const groupB = {
    name: "Group B",
    sessions: sessions[0].name
}
const groupC = {
    name: "Group C",
    sessions: []
}

// Session groups allow you to group sessions under the headings you want, instead of the default "Agenda" and "On demand" groups 
describe('VEX - Sessions Groups', function() {
    it('Test the CRUD (Create, Update, Destroy) operations for session groups', function() {
        authoring.common.login()
        authoring.vex.visit()

        let check = {eventAlreadyExists: false}
        cy.ifElementWithExactTextExists(authoring.vex.eventCardTitle, event.name, 3000, ()=>{ 
            check.eventAlreadyExists = true  
            authoring.vex.goToEventConfig(event.name)
        })

        // In case the event/sessions get deleted on purpose or by mistake, this block of code will automatically add everything back
        cy.get("body").then(()=>{
            if(check.eventAlreadyExists == false){
                cy.ifNoElementWithExactTextExists(authoring.vex.eventCardTitle, event.name, 1000, ()=>{
                    authoring.vex.addVirtualEvent(event.name)
                    authoring.vex.configureEvent(event)
                    sessions.forEach((session)=>{
                        authoring.vex.addSession(session.name)
                        authoring.vex.configureSession(session)
                        cy.containsExact("a", event.name).click()
                    })
                }) 
            }
        })
          
        // Delete previously added session groups because 1) Rule out bugs where previously added stuff works but not new stuff, 2) Want to test adding and deleting 
        authoring.vex.deleteSessionGroup(groupA.name)
        authoring.vex.deleteSessionGroup(groupB.name)
        authoring.vex.deleteSessionGroup(groupC.name)

        // Go to consumption and verify that, without any session groups, the default groups are "Agenda" and "On demand"
        cy.visit(event.url)
        cy.contains("h4", "Agenda").should('exist')
        cy.contains("h4", "On Demand Sessions").should('exist')

        // Add the groups back 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.addSessionGroup(groupA.name)
        authoring.vex.addSessionGroup(groupB.name)
        authoring.vex.addSessionGroup(groupC.name)

        // Edit group name, and change it back 
        authoring.vex.renameSessionGroup({name: groupA.name, newName: "renamed"})
        authoring.vex.renameSessionGroup({name: "renamed", newName: groupA.name})

        // Add sessions to the groups 
        authoring.vex.addToGroup(groupA)
        authoring.vex.addToGroup(groupB)

        // Remove sessions from a group (then add it back)
        authoring.vex.removeFromGroup(groupB)
        authoring.vex.addToGroup(groupB)

        // Go to consumption and verify that the sessions are grouped correctly 
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, groupA.name).should('exist').within(()=>{
            let noOfSessions = groupA.sessions.length - groupA.notExpected.length
            cy.get(consumption.vex.sessionCardTitle).should("have.length", noOfSessions)
            groupA.sessions.forEach((session)=>{
                if (groupA.notExpected.includes(session)){
                    cy.contains(consumption.vex.sessionCardTitle, session).should("not.exist")
                } else {
                    cy.contains(consumption.vex.sessionCardTitle, session).should("exist")
                }
            })
        })

        cy.contains(consumption.vex.sessionGroup, groupB.name).should('exist').within(()=>{
            cy.get(consumption.vex.sessionCardTitle).should("have.length", 1)
            cy.contains(consumption.vex.sessionCardTitle, groupB.sessions).should('exist')
        })

        cy.contains(consumption.vex.sessionGroup, groupC.name).should('not.exist')
    })

    it("Test all the cancel buttons within the session group page, and test the input field error validations", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        cy.ifElementWithExactTextExists(authoring.vex.sessionCardTitle, "Delete me", 3000, ()=>{ 
            authoring.vex.removeSession("Delete me")
        })
        authoring.vex.addSession("Delete me")
        authoring.vex.goToSessionGroup() 

        // "Add Group" input field validation - and test its cancel button
        cy.contains("button", "Add Group").click()
        cy.contains(authoring.vex.antModal, "Add Group").should("exist").within(()=>{
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
        cy.contains(authoring.vex.antModal, "Edit Session Group").should("exist").within(()=>{
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
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("not.be.visible")

        // Remove session from group cancel 
        cy.contains(authoring.vex.sessionRow, groupA.sessions[0]).contains("button", "Remove").click()
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("exist").contains("button", "Cancel").click()
        cy.contains(authoring.vex.antModal, "Are you sure want to remove this record?").should("not.be.visible")

        // Add a session to a group, verify that the session is no longer in the options if you try to add another session (there was bug where it was still available as option, leading to internal server error)
        cy.contains("button", "Add Sessions to Group").click()
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").contains("span", "Select Sessions").click()
        cy.get(authoring.vex.antDropdownOption("Delete me")).should('exist').click()
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").contains("button", "Submit").click({force: true})
        cy.contains(authoring.vex.antModal, "Add Sessions to Group").contains("span", "Select Sessions").click()
        cy.get(authoring.vex.antDropdownOption("Delete me")).should('not.exist')
        // then delete that session and revisit group (there was a bug where this caused internal server error)
        cy.contains("a", "Event Setup").click()
        authoring.vex.removeSession("Delete me")
        cy.contains("a", "Session Groups").click()
        cy.contains(authoring.vex.groupRow, groupA.name).contains("button", "Manage Sessions").click()
        cy.contains("span", "Delete me").should('not.exist')
    })

})