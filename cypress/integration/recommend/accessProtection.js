import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const recommend = {
    name: "recommend-accessProtection.js",
    slug: "recommend-ap",
    contents: [webContent.title],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}/commonresource`
    }
}
const allVisitorsGroup = "All Visitors"
const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"
const emailRequiredMsg = "Email confirmation is required"                     
const emailNotAuthMsg = "Email is not authorized, please try again"
const emailSuccessMsg = "Success! An email has been sent to your inbox"
describe("Recommend - Access Protection", () => {
    it("Validate access protection configuration section in recommend track", () => {
        authoring.common.login()
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)
        cy.get(authoring.recommend.pageSidebar.accessProtectionLabel).siblings("span").click()
        cy.get(authoring.recommend.popover).within(()=>{
            cy.get(authoring.recommend.popoverElements.protectionTypeLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option('Email')).click()
            //When All Visitors is not selected in Allowed Groups list, other groups in the drop down are enabled for selection in the Allowed groups drop down
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.have.class",'Select-option is-disabled')
            })
            //When All Visitors is selected in Allowed Groups list, other groups in the drop down are disabled for selection in the Allowed groups drop down
            cy.get(authoring.recommend.dropdown.option(allVisitorsGroup)).click()
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("have.class",'Select-option is-disabled')
            })
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()
            cy.contains("span", allVisitorsGroup).parent().parent().find(authoring.recommend.popoverElements.removeVisitorGroup).click()
            //When a group is selected in Allowed Groups list, then that group should no more be shown in the drop down list of Allowed and Disallowed groups
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option(gmailAPGroup)).click()
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()
            cy.get(authoring.recommend.popoverElements.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()

            //When a selected group is removed from the Allowed Groups list, then that group should be shown in the drop down list of Allowed and Disallowed groups
            cy.contains("span", gmailAPGroup).parent().parent().find(authoring.recommend.popoverElements.removeVisitorGroup).click()
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).should("contain", gmailAPGroup)
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()
            cy.get(authoring.recommend.popoverElements.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).should("contain", gmailAPGroup)
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()

            //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and Disallowed groups
            cy.get(authoring.recommend.popoverElements.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option(gmailAPGroup)).click()
            cy.get(authoring.recommend.popoverElements.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.popoverElements.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.recommend.popoverElements.GroupdropDown).parent().parent().parent().parent().find(authoring.recommend.popoverElements.dropDownExpandCollapse).click()

            //Select All Visitors in the Allowed Groups list and "gmailAPGroup" is already selected above in Disallowed Groups list
            cy.get(authoring.recommend.popoverElements.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option(allVisitorsGroup)).click()
            cy.contains("button", "Update").click()
        })      
    })
    it("Validate access protection behavior on consumption page", () => {
        //Verify if All Visitors is selected for Access protection, should allow any visitor after authentication in the track
        //Verify if any visitor group is selected in Disallow Groups, should not allow specific visitors from authentication specified in the visitor groups.
        cy.visit(recommend.url)
        cy.contains('.title-container',emailRequiredMsg, {timeout: 10000}).should("exist")
        cy.url().should("not.eq", recommend.url).should("contain", `${authoring.common.baseUrl}/visitor_authentications`)

        // Gmail email domain should not be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("abc@gmail.com" + "\n")
        cy.contains(emailNotAuthMsg).should("exist")
        cy.contains("a", "Go Back").click()
        //Hotmail should be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("jimjam@hotmail.com" + "\n")
        cy.contains(emailSuccessMsg).should("exist")
    })
})