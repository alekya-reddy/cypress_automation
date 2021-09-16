import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'});
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexSessionDescription.js',
    slug: 'vexsessiondescription-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const session = {
    name: 'Youtube',
    slug: 'youtube',
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    description: "On Demand Session"
}

const sessionGroup = "All Sessions"

const landingPage = {
    name: "Landing-Page",
    slug: "landing-page",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    setHome: true,
    blocks: [
        {
            type: "Session Group",
            sessionGroup: sessionGroup,
            verify: false
        },
    ]
}

const editCardConfiguration1 = {
    cardConfiguration: {
        enableDescription:false,
        blockName:sessionGroup
    }
}
const editCardConfiguration2 = {
    cardConfiguration: {
        enableDescription:true,
        blockName:sessionGroup
    }
}
describe('VEX - Session Description behavior on authoring and consumption', function(){
    it("Set up for the test if not already done", ()=>{
        cy.request({url: event.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.vex.visit()
                authoring.vex.addVirtualEvent(event)
                authoring.vex.configureEvent(event)
                authoring.vex.addSession(session.name)
                authoring.vex.configureSession(session)
                cy.containsExact("a", event.name).click()
            }
        })
    })
    it('Verify the session Description is shown in authoring and consumption page',function(){
        //Verifying the Description for session cards on authoring and consumption pages when 'Show Description on Session Cards' checkbox on event config is SELECTED
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.setSessionDescription(true)
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.wait(2000)
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.configureLandingPage(landingPage)
        authoring.vex.goToPageEditor(landingPage.name)
        //Verifying the Description for session cards on authoring page when 'Show Description on Session Cards' checkbox on event config is selected
        cy.get(authoring.vex.pages.sessionGroupRow).within(()=>{
            cy.contains('div',session.description).should('exist')
        })
        //Verifying by Overriding the session Description for a session at block level->set to false on authoring
        authoring.vex.editExistingCard(editCardConfiguration1)
        cy.get(authoring.vex.pages.sessionGroupRow).within(()=>{
            cy.contains('div',session.description).should('not.exist')
        })
        cy.contains("button", "Save").click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')
        cy.go("back")
        //Verifying by Overriding the session Description for a session block at block level->set to false on consumption
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, sessionGroup,{ timeout: 10000 }).parent().within(() => {
            cy.contains('div',session.description).should('not.exist')
        })
        cy.go("back")
        authoring.vex.goToPageEditor(landingPage.name)
        //Verifying by Overriding the session Description for a session at block level->set to true on authoring
        authoring.vex.editExistingCard(editCardConfiguration2)
        cy.get(authoring.vex.pages.sessionGroupRow).within(()=>{
            cy.contains('div',session.description).should('exist')
        })
        cy.contains("button", "Save").click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')
        cy.go("back")
        //Verifying by Overriding the session Description for a session block at block level->set to true on consumption
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, sessionGroup,{ timeout: 10000 }).parent().within(() => {
            cy.contains('div',session.description).should('exist')
        })
        cy.go("back")
        cy.go("back")

        //Verifying the Description for session cards on authoring and consumption pages when 'Show Description on Session Cards' checkbox on event config is UNSELECTED
        authoring.vex.setSessionDescription(false)
        cy.get(authoring.vex.saveButton).click()
        cy.contains(authoring.vex.messages.recordSaved).should('exist')
        cy.wait(2000)
        authoring.vex.deleteLandingPages(landingPage.name)
        authoring.vex.addLandingPages(landingPage.name)
        authoring.vex.configureLandingPage(landingPage)
        authoring.vex.goToPageEditor(landingPage.name)
        //Verifying the Description for session cards on authoring page when 'Show Description on Session Cards' checkbox on event config is unselected
        cy.get(authoring.vex.pages.sessionGroupRow).within(()=>{
            cy.contains('div',session.description).should('not.exist')
        })
        //Verifying the session Description for a session card on consumption page when 'Show Description on Session Cards' checkbox on event config is unselected
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, sessionGroup,{ timeout: 10000 }).parent().within(() => {
            cy.contains('div',session.description).should('not.exist')
        })
        cy.go("back")
        //Verifying by Overriding the session Description for a session at block level->set to true on authoring
        authoring.vex.editExistingCard(editCardConfiguration2)
        cy.get(authoring.vex.pages.sessionGroupRow).within(()=>{
            cy.contains('div',session.description).should('exist')
        })
        cy.contains("button", "Save").click()
        cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')
        cy.go("back")
        //Verifying by Overriding the session Description for a session block at block level->set to true on consumption
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, sessionGroup,{ timeout: 10000 }).parent().within(() => {
            cy.contains('div',session.description).should('exist')
        })
    })
})