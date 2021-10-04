import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'
import { constants } from '../../support/constants.js';

const authoring = createAuthoringInstance() // When nothing is specified, this defaults to our original 'automation' org
const consumption = createConsumptionInstance()

const recommend = {
    name: 'Automation'
}

const target = {
    name: ' Automation'
}

const dummy = {
    url: " https://dummy.qa-pathfactory.com/users/sign_in"
}

describe("Reverse Proxy For Campaign Tools", function() {
    it("Configure Reverse-Proxy in Authoring", () => {

        authoring.common.login()
        cy.get(authoring.common.nameSetting).click()
        cy.get(1000)
        cy.get(authoring.common.clientHq).should("exist").click()
        cy.get(authoring.common.orgSearch).click().type("Dummy" + "\n")
        cy.get(authoring.common.orgSelect).contains("Dummy").should("exist").click()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.authoringToggle, 'on');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.consumptionToggle, 'on');
        cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
        cy.get(authoring.common.orgModal).should("exist")
        cy.get(authoring.common.orgButton).click()
        cy.contains('a', "Content Library Insights").should("exist")
        cy.contains('button', "Add Content").should("exist")
        cy.get("#configurations").should("exist").should("exist")

        authoring.target.visit()
        cy.get("#AddTrackLink").should("exist")
        cy.contains('a', target.name).click()
        cy.contains('button',"Add Content").should("exist")
        cy.contains('div', "Track Settings").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.contains('div', "2017 Scrum Guide Us").click()
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target')
        cy.get(authoring.target.previewClick).click({force: true})
        cy.contains('span', "The Scrum Guide").should("exist")

    })
    it("Configure Reverse-Proxy in Authoring", () => {
        authoring.common.login()
        cy.get(authoring.common.nameSetting).click()
        cy.get(1000)
        cy.get(authoring.common.clientHq).should("exist").click()
        cy.get(authoring.common.orgSearch).click().type("Dummy" + "\n")
        cy.get(authoring.common.orgSelect).contains("Dummy").should("exist").click()
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.authoringToggle, 'on');
        authoring.clientHQ.clientHQToggle(authoring.clientHQ.consumptionToggle, 'off');
        cy.get(authoring.common.visitOrganization).contains("Visit Organization").should("exist").click()
        cy.get(authoring.common.orgModal).should("exist")
        cy.get(authoring.common.orgButton).click()

        //validate that user can access authoring side
        cy.contains('a', "Content Library Insights").should("exist")
        cy.contains('button', "Add Content").should("exist")
        cy.get(authoring.common.nameSetting).click()
        cy.get("#configurations").should("exist").should("exist")
        cy.get("#user-management").should("exist")
        cy.get("#organization").should("exist")
        cy.get(authoring.common.clientHq).should("not.exist")

        authoring.target.visit()
        cy.get("#AddTrackLink").should("exist")
        cy.contains('a', target.name).click()
        cy.contains('button',"Add Content").should("exist")
        cy.contains('div', "Track Settings").should("exist")
        cy.contains('div', "Analytics").should("exist")
        cy.contains('div', "2017 Scrum Guide Us").click()

        //validate that user can't access consumption
        cy.get(authoring.target.previewClick).invoke('removeAttr', 'target')
        cy.get(authoring.target.previewClick).click({force: true})
        cy.contains('span', "The Scrum Guide").should("not.exist")
        cy.contains("Sorry, we were unable to find a resource matching that URL.").should("exist")

    })
       
    it("Configure Reverse-Proxy in Authoring", () => {
        authoring.common.login()
        cy.get(authoring.common.nameSetting).click()
        cy.get(1000)
        cy.get(authoring.common.clientHq).should("exist").click()
        cy.get(authoring.common.orgSearch).click().type("Dummy" + "\n")
        cy.get(authoring.common.orgSelect).contains("Dummy").should("exist").click()
        cy.wait(2000)
        authoring.clientHQ.clientHQToggleDeactive(authoring.clientHQ.authoringToggle, 'off');

    })

    it("Configure Reverse-Proxy in Authoring", () => {
        cy.request({url: dummy.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){ 
                cy.log("can't access")
            }
        })
    })

    it("Configure Reverse-Proxy in Authoring", () => {
        authoring.common.login()
        cy.get(authoring.common.nameSetting).click()
        cy.get(authoring.common.clientHq).should("exist").click()
        cy.get(1000)
        cy.contains('div', "Active: yes").should("exist").click()
        cy.contains('span', "no").should("exist").click()
         cy.get(authoring.common.orgSearch).click().type("Dummy" + "\n")
         cy.get(authoring.common.orgSelect).contains("Dummy").should("exist").click()
        cy.wait(2000)
        //authoring.clientHQ.clientHQToggleDeactive(authoring.clientHQ.authoringToggle, 'on');
        //authoring.clientHQ.clientHQToggle(authoring.clientHQ.authoringToggle, 'on');
   
    })
        
})