import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: "target-accessProtection.js",
    slug: "target-ap",
    contents: [webContent.title],
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
describe("Target - Access Protection", () => {
    it("Validate access protection configuration section in target track", () => {
        authoring.common.login()
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        authoring.target.configure(target)
        cy.get(authoring.common.accessProtection.accessProtectionLabel).siblings("span").click()
        cy.get(authoring.target.popover).within(()=>{
            cy.get(authoring.common.accessProtection.protectionTypeLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.target.dropdown.option('Email')).click()
            //When All Visitors is not selected in Allowed Groups list, other groups in the drop down are enabled for selection in the Allowed groups drop down
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.have.class",'Select-option is-disabled')
            })
            //When All Visitors is selected in Allowed Groups list, other groups in the drop down are disabled for selection in the Allowed groups drop down
            cy.get(authoring.target.dropdown.option(allVisitorsGroup)).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("have.class",'Select-option is-disabled')
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.contains("span", allVisitorsGroup).parent().parent().find(authoring.common.accessProtection.track_removeVisitorGroup).click()
            //When a group is selected in Allowed Groups list, then that group should no more be shown in the drop down list of Allowed and Disallowed groups
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.target.dropdown.option(gmailAPGroup)).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()

            //When a selected group is removed from the Allowed Groups list, then that group should be shown in the drop down list of Allowed and Disallowed groups
            cy.contains("span", gmailAPGroup).parent().parent().find(authoring.common.accessProtection.track_removeVisitorGroup).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).should("contain", gmailAPGroup)
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).should("contain", gmailAPGroup)
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()

            //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and Disallowed groups
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.target.dropdown.option(gmailAPGroup)).click()
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()

            //Select All Visitors in the Allowed Groups list and "gmailAPGroup" is already selected above in Disallowed Groups list
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.target.dropdown.box).click()
            cy.get(authoring.target.dropdown.option(allVisitorsGroup)).click()
            cy.contains("button", "Update").click()
        })      
    })
    it("Validate access protection behavior on consumption page", () => {
        //Verify if All Visitors is selected for Access protection, should allow any visitor after authentication in the track
        //Verify if any visitor group is selected in Disallow Groups, should not allow specific visitors from authentication specified in the visitor groups.
        cy.visit(target.url)
        cy.contains('.title-container',emailRequiredMsg, {timeout: 10000}).should("exist")
        cy.url().should("not.eq", target.url).should("contain", `${authoring.common.baseUrl}/visitor_authentications`)

        // Gmail email domain should not be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("abc@gmail.com" + "\n")
        cy.contains(emailNotAuthMsg).should("exist")
        cy.contains("a", "Go Back").click()
        //Hotmail should be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("jimjam@hotmail.com" + "\n")
        cy.contains(emailSuccessMsg).should("exist")
    })
})