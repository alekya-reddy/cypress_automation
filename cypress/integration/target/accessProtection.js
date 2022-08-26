import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-target", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-target', tld: 'lookbookhq'})

const appearance = {
    name: "accessProtectionAppearance.js",
}
const targetAppearanceSettings = {
    appearance: "accessProtectionAppearance.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/bench-forest-trees-path.jpg",
    } ,
    headerTextFontFamilyLP: "Overpass",
    headerTextBoldFontLP: true,
    headerTextFontSizeLP: "large",
    headerTextFontColorLP: {r: 10, g: 200, b: 155, a: 0.5},

    bodyTextFamilyLP: "Roboto",
    bodyTextBoldFontLP: false,
    bodyTextFontSizeLP: "medium",
    bodyTextFontColorLP: {r: 111, g: 22, b: 3, a: 0.35},

    emailAddressFamilyLP: "Tahoma",
    emailAddressBoldFontLP: false,
    emailAddressFontSizeLP: "large",
    emailAddressFontColorLP: {r: 19, g: 197, b: 116, a: 1},

    submitButtonFontFamilyLP: "Verdana",
    submitButtonFontWeightLP: false,
    submitButtonFontSizeLP: "small",
    submitButtonTextFontColorLP: {r: 255, g: 11, b: 1, a: 1},
    submitButtonRadiusLP: "10",
    submitButtonColor: {r: 10, g: 200, b: 155, a: 0.5},
    verify: true   
}
const colorConfigToCSS = (colorConfig) => {
    const { r, g, b, a } = colorConfig
    const CSS = a == 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    return CSS;
}
const fontSizeToCSS_LandPage = {small: "13px", medium: "15px", large: "17px"}

const fontWeightToCSS = (bold) => { return bold ? "700" : "400" }

const language = {name: "accessprotection.js", code: "aptar"}

const targetLanguageSettings = {
  language: language.name,
  title: "Hey there!! Email confirmation is mandatory",
  emailSuccess: "Success! An email has been sent to your inbox",
  emailFailed: "Email is not authorized, please try again",
  unAuthorizedEmail: "Stop! You are not authorized to access this page. ",
  emailInstructionMsg: "Hey! Enter your email check your inbox for access instructions",
}

const contents = authoring.common.env.orgs["automation-target"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: "target-accessProtection.js",
    slug: "target-ap",
    language: language.name,
    appearance: "accessProtectionAppearance.js",
    contents: [webContent.title],
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const allVisitorsGroup = "All Visitors"
const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"
describe("Target - Access Protection", () => {
    it("Validate access protection configuration section in target track", () => {
        authoring.common.login()
        authoring.configurations.deleteLanguage(language.name)
        authoring.configurations.addNewLanguage(language)
        authoring.configurations.configureAccessProtectionLanguageOverride(targetLanguageSettings)
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)
        authoring.configurations.configureAccessProtectionAppearance(targetAppearanceSettings)
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
    it.only("Validate access protection behavior on consumption page", () => {
        //DEV-14558: Update design of access protection Language and Appearance 
        //Note: Not checking the confirmation email validations as we are not automating email access related scenarios
        //Verify if All Visitors is selected for Access protection, should allow any visitor after authentication in the track
        //Verify if any visitor group is selected in Disallow Groups, should not allow specific visitors from authentication specified in the visitor groups.
        cy.visit(target.url)
        //verify Access Protection-Appearance & Languae settings applied properly in Target Track authentication page.
        cy.get(consumption.common.accessProtectionLogo)
            .should('have.css', 'background-image',`url("https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg")`)
        cy.get(consumption.common.accessProtectionSubmitButton)
            .should("have.css", "background-color", colorConfigToCSS(targetAppearanceSettings.submitButtonColor))
            .should("have.css", "color", colorConfigToCSS(targetAppearanceSettings.submitButtonTextFontColorLP))
            .should("have.css", "font-family", targetAppearanceSettings.submitButtonFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[targetAppearanceSettings.submitButtonFontSizeLP])
        cy.get(consumption.common.trackProtectionEmailInput)
            .should("have.css", "color", colorConfigToCSS(targetAppearanceSettings.emailAddressFontColorLP))
            .should("have.css", "font-family", targetAppearanceSettings.emailAddressFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[targetAppearanceSettings.emailAddressFontSizeLP])
        cy.get(consumption.common.accessProtectionBodyText)
            .should("have.css", "color", colorConfigToCSS(targetAppearanceSettings.bodyTextFontColorLP))
            .should("have.css", "font-family", targetAppearanceSettings.bodyTextFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[targetAppearanceSettings.bodyTextFontSizeLP])
        cy.get(consumption.common.accessProtectionHeaderText)
            .should("have.css", "color", colorConfigToCSS(targetAppearanceSettings.headerTextFontColorLP))
            .should("have.css", "font-family", targetAppearanceSettings.headerTextFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[targetAppearanceSettings.headerTextFontSizeLP])
            .should("have.css", "font-weight", fontWeightToCSS(targetAppearanceSettings.headerTextBoldFontLP))    
        cy.url().should("not.eq", target.url).should("contain", `${authoring.common.baseUrl}/visitor_authentications`)
        cy.contains(targetLanguageSettings.title).should("exist")
        cy.contains(targetLanguageSettings.emailInstructionMsg).should("exist")
        // Gmail email domain should not be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("abc@gmail.com" + "\n")
        cy.contains(targetLanguageSettings.emailFailed).should("exist")
        cy.contains("a", "Go Back").click()
        //Hotmail should be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("jimjam@hotmail.com" + "\n")
        cy.contains(targetLanguageSettings.emailSuccess).should("exist")
    })
})