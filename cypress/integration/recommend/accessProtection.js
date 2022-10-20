import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-recommend", tld: "lookbookhq"})
const consumption = createConsumptionInstance({org: 'automation-recommend', tld: 'lookbookhq'})

const contents = authoring.common.env.orgs["automation-recommend"].resources
const webContent = contents["Website Common Resource"]

const appearance = {
    name: "accessProtectionAppearance.js",
}
const recomAppearanceSettings = {
    appearance: "accessProtectionAppearance.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/bench-forest-trees-path.jpg",
    },
    logo: {
        category: "Uploaded Logos",
        url: "https://cdn.qa-pathfactory.com/assets/131/logos/37102/3d8a5f18-9e64-4a77-b612-88035cea7c49.jpeg",
    },
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

const recomLanguageSettings = {
  language: language.name,
  title: "Hey there!! Email confirmation is mandatory",
  emailSuccess: "Success! An email has been sent to your inbox",
  emailFailed: "Email is not authorized, please try again",
  unAuthorizedEmail: "Stop! You are not authorized to access this page. ",
  emailInstructionMsg: "Hey! Enter your email check your inbox for access instructions",
}

const recommend = {
    name: "recommend-accessProtection.js",
    slug: "recommend-ap",
    language: language.name,
    appearance: "accessProtectionAppearance.js",
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
        authoring.configurations.deleteLanguage(language.name)
        authoring.configurations.addNewLanguage(language)
        authoring.configurations.configureAccessProtectionLanguageOverride(recomLanguageSettings)
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)
        authoring.configurations.configureAccessProtectionAppearance(recomAppearanceSettings)
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)
        cy.get(authoring.common.accessProtection.accessProtectionLabel).siblings("span").click()
        cy.get(authoring.recommend.popover).within(()=>{
            cy.get(authoring.common.accessProtection.protectionTypeLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option('Email')).click()
            //When All Visitors is not selected in Allowed Groups list, other groups in the drop down are enabled for selection in the Allowed groups drop down
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.have.class",'Select-option is-disabled')
            })
            //When All Visitors is selected in Allowed Groups list, other groups in the drop down are disabled for selection in the Allowed groups drop down
            cy.get(authoring.recommend.dropdown.option(allVisitorsGroup)).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("have.class",'Select-option is-disabled')
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.contains("span", allVisitorsGroup).parent().parent().find(authoring.common.accessProtection.track_removeVisitorGroup).click()
            //When a group is selected in Allowed Groups list, then that group should no more be shown in the drop down list of Allowed and Disallowed groups
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option(gmailAPGroup)).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()

            //When a selected group is removed from the Allowed Groups list, then that group should be shown in the drop down list of Allowed and Disallowed groups
            cy.contains("span", gmailAPGroup).parent().parent().find(authoring.common.accessProtection.track_removeVisitorGroup).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).should("contain", gmailAPGroup)
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).should("contain", gmailAPGroup)
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()

            //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and Disallowed groups
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option(gmailAPGroup)).click()
            cy.get(authoring.common.accessProtection.APDisGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.common.accessProtection.GroupdropDown).children().each(($el,index,$list)=>{
                cy.wrap($el).should("not.contain", gmailAPGroup)
            })
            cy.get(authoring.common.accessProtection.GroupdropDown).parent().parent().parent().parent().find(authoring.common.accessProtection.dropDownExpandCollapse).click()

            //Select All Visitors in the Allowed Groups list and "gmailAPGroup" is already selected above in Disallowed Groups list
            cy.get(authoring.common.accessProtection.APGroupLabel).siblings(authoring.recommend.dropdown.box).click()
            cy.get(authoring.recommend.dropdown.option(allVisitorsGroup)).click()
            cy.contains("button", "Update").click()
        })      
    })
    //DEV-14558: Update design of access protection Language and Appearance 
    //Note: Not checking the confirmation email validations as we are not automating email access related scenarios
    it("Validate access protection behavior on consumption page", () => {
        cy.visit(recommend.url)
        //verify Access Protection-Appearance & Languae settings applied properly in Recom Track authentication page.
        cy.get(consumption.common.accessProtectionLogo)
            .should('have.css', 'background-image','url("https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg")')
        cy.get(consumption.common.accessProtectionSubmitButton)
            .should("have.css", "background-color", colorConfigToCSS(recomAppearanceSettings.submitButtonColor))
            .should("have.css", "color", colorConfigToCSS(recomAppearanceSettings.submitButtonTextFontColorLP))
            .should("have.css", "font-family", recomAppearanceSettings.submitButtonFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[recomAppearanceSettings.submitButtonFontSizeLP])
        cy.get(consumption.common.trackProtectionEmailInput)
            .should("have.css", "color", colorConfigToCSS(recomAppearanceSettings.emailAddressFontColorLP))
            .should("have.css", "font-family", recomAppearanceSettings.emailAddressFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[recomAppearanceSettings.emailAddressFontSizeLP])
        cy.get(consumption.common.accessProtectionBodyText)
            .should("have.css", "color", colorConfigToCSS(recomAppearanceSettings.bodyTextFontColorLP))
            .should("have.css", "font-family", recomAppearanceSettings.bodyTextFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[recomAppearanceSettings.bodyTextFontSizeLP])
        cy.get(consumption.common.accessProtectionHeaderText)
            .should("have.css", "color", colorConfigToCSS(recomAppearanceSettings.headerTextFontColorLP))
            .should("have.css", "font-family", recomAppearanceSettings.headerTextFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[recomAppearanceSettings.headerTextFontSizeLP])
            .should("have.css", "font-weight", fontWeightToCSS(recomAppearanceSettings.headerTextBoldFontLP))    
        cy.url().should("not.eq", recommend.url).should("contain", `${authoring.common.baseUrl}/visitor_authentications`)
        //Verify if All Visitors is selected for Access protection, should allow any visitor after authentication in the track
        //Verify if any visitor group is selected in Disallow Groups, should not allow specific visitors from authentication specified in the visitor groups.
        //Gmail email domain should not be authorized
        cy.contains(recomLanguageSettings.title).should("exist")
        cy.contains(recomLanguageSettings.emailInstructionMsg).should("exist")
        cy.get(consumption.microsites.trackProtectionEmailInput).type("abc@gmail.com" + "\n")
        cy.contains(recomLanguageSettings.emailFailed).should("exist")
        cy.contains("a", "Go Back").click()
        //Hotmail should be authorized
        cy.get(consumption.microsites.trackProtectionEmailInput).type("jimjam@hotmail.com" + "\n")
        cy.contains(recomLanguageSettings.emailSuccess).should("exist")
    })
})