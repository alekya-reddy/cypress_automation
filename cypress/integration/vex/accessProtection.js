import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'accessProtection.js',
    slug: 'acessprotection-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const allVisitorsGroup = "All Visitors"
const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"
const emailRequiredMsg = "Email confirmation is required"                     
const emailNotAuthMsg = "Email is not authorized, please try again"
const emailSuccessMsg = "Success! An email has been sent to your inbox"

describe("VEX - Access Protection", ()=>{
    it("Add, remove groups and Validate access protection configuration section in VEX", ()=>{
        // Set up
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event.name)
        authoring.vex.configureEvent(event)

        //When All Visitors is not selected in Allowed Groups list, other groups in the drop down are enabled for selection in the Allowed groups drop down
        cy.contains(authoring.vex.antRow, "Protection Type").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).type('Email' + "\n")
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
        })
        cy.get(authoring.vex.dropDown).children().each(($el,index,$list)=>{
            cy.wrap($el).should("not.have.class",'ant-select-item-option-disabled')
        })
        //When All Visitors is selected in Allowed Groups list, other groups in the drop down are disabled for selection in the Allowed groups drop down
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.get(authoring.vex.dropDown).children().each(($el,index,$list)=>{
            if(index==0){
                cy.wrap($el).should("have.class",'ant-select-item-option-selected')
            }else{
                cy.wrap($el).should("have.class",'ant-select-item-option-disabled')
            }
        })
        cy.contains("span", allVisitorsGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        //When a group is selected in Allowed Groups list, then that group should be shown in the drop down list of Allowed with area selected and not shown in Disallowed groups list
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
        })
        cy.get(authoring.vex.dropDown).children().each(($el,index,$list)=>{
            cy.wrap($el).invoke('text').then((text)=>{
                if(text == gmailAPGroup){
                    cy.wrap($el).should("have.class",'ant-select-item-option-selected')
                }
            })
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.vex.antDropSelect.selector).click()
            // if placeholder exists that means that value wasn't selected
            cy.get(authoring.common.accessProtection.selectPlaceholder).should('exist')
            cy.get(authoring.vex.antDropSelect.selector).click()
        })
        //When a selected group is removed from the Allowed Groups list, then that group should be shown in the drop down list of Allowed and Disallowed groups
        cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
            cy.get(authoring.vex.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
        //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and with area selected in Disallowed groups
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
        })
        cy.get(authoring.vex.DisallowGroups).siblings('div').within(()=>{
            cy.get(authoring.vex.dropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).invoke('text').then((text)=>{
                    if(text == gmailAPGroup){
                        cy.wrap($el).should("have.class",'ant-select-item-option-selected')
                    }
                })
            })
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.vex.antDropSelect.selector).click()
            // if placeholder exists that means that value wasn't selected
            cy.get(authoring.common.accessProtection.selectPlaceholder).should('exist')
        })
        //Select All Visitors in the Allowed Groups list and "gmailAPGroup" is already selected above in Disallowed Groups list
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.contains("button", "Save").click()
    })

    it("Visit event page on consumption side and verify that it asks for email", ()=>{
        cy.visit(event.url)
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        cy.contains(emailRequiredMsg).should("exist")
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("random@gmail.com" + "\n")
        cy.contains(emailNotAuthMsg).should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("jimjam@hotmail.com" + "\n")
        cy.contains(emailSuccessMsg).should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("jimjam@pathfactory.com" + "\n")
        cy.contains(emailSuccessMsg).should('exist')

        // Not going into actual email to check - this is too much of a pain, especially with gmail 
        // Mailinator is more doable, but the wait time for the email to arrive in inbox makes the test very flaky 
        // This aspect of testing should be done manually 
        // If a form is configured for the session, clicking the emailed link should register you for the session with your email 
    })
})