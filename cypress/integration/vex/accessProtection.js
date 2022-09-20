import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const appearance = {
    name: "accessProtectionAppearance.js",
}
const vexAppearanceSettings = {
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

const language = {name: "accessprotection.js", code: "apvex"}

const vexLanguageSettings = {
  language: language.name,
  title: "Hey there!! Email confirmation is mandatory",
  emailSuccess: "Success! An email has been sent to your inbox",
  emailFailed: "Email is not authorized, please try again",
  unAuthorizedEmail: "Stop! You are not authorized to access this page. ",
  emailInstructionMsg: "Hey! Enter your email check your inbox for access instructions",
}
const event = {
    name: 'accessProtection.js',
    slug: 'acessprotection-js',
    language: 'accessprotection.js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const allVisitorsGroup = "All Visitors"
const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"
const validCiscoGroup ="Cisco valid visitor group"
const invalidCiscoGroup ="Cisco invalid visitor group"
const ciscoEmail = "redd.pill@yahoo.com"
const ciscoPassowrd = "Cisco123"
const vexsessions = [
    {
    name: "OnDemand-session",
    slug: "ondemand",
    cloneName: "Clone of public-session",
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'On Demand',
    video: 'Youtube - Used in Cypress automation for VEX testing',
    contents:['Website - Used by Cypress automation for VEX testing'] 
    },
    {
    name: 'Live-Session',
    slug: '1',
    get url(){
        return `${event.url}/${this.slug}`
    },
    visibility: 'Public',
    type: 'Live',
    live: {
        start: 'Jun 24, 2020 8:00pm',
        end: 'Jun 24, 2041 8:00pm',
        timeZone: '(GMT-05:00) Eastern Time (US & Canada)',
        type: 'Content Library',
        video: 'Youtube - Used in Cypress automation for VEX testing'
    }
    }
    ]
    describe("VEX - Access Protection", ()=>{
    it("Add, remove groups and Validate access protection configuration section in VEX", ()=>{
        //Language, Appearance,Event and Session Set up 
        authoring.common.login()
        authoring.configurations.deleteLanguage(language.name)
        authoring.configurations.addNewLanguage(language)
        authoring.configurations.configureAccessProtectionLanguageOverride(vexLanguageSettings)
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)
        authoring.configurations.configureAccessProtectionAppearance(vexAppearanceSettings)
        authoring.vex.visit()
        authoring.vex.deleteVirtualEvent(event.name)
        authoring.vex.addVirtualEvent(event)
        authoring.vex.configureEvent(event)
        authoring.vex.configureAppearance(vexAppearanceSettings)
        vexsessions.forEach((session)=>{
            authoring.vex.addSession(session.name)
            authoring.vex.configureSession(session)
            authoring.vex.backToEvent(event.name)
        })
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
            cy.get(authoring.vex.antDropSelect.selector).click({force:true})
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
        cy.wait(1000)
    })
    //DEV-14558: Update design of access protection Language and Appearance 
    //Note: Not checking the confirmation email validations as we are not automating email access related scenarios
    it("Visit event page on consumption side and verify that it asks for email", ()=>{
        cy.visit(event.url)
        //verify Access Protection-Appearance & Languae settings applied properly in VEX event authentication page.
        cy.get(consumption.common.accessProtectionLogo,{timeout:20000})
            .should('have.css', 'background-image','url("https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg")')
        cy.get(consumption.common.accessProtectionSubmitButton)
            .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.submitButtonColor))
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.submitButtonTextFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.submitButtonFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.submitButtonFontSizeLP])
        cy.get(consumption.common.trackProtectionEmailInput)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.emailAddressFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.emailAddressFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.emailAddressFontSizeLP])
        cy.get(consumption.common.accessProtectionBodyText)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.bodyTextFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.bodyTextFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.bodyTextFontSizeLP])
        cy.get(consumption.common.accessProtectionHeaderText)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.headerTextFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.headerTextFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.headerTextFontSizeLP])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.headerTextBoldFontLP))       
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        cy.contains(vexLanguageSettings.title).should("exist")
        cy.contains(vexLanguageSettings.emailInstructionMsg).should("exist")
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("random@gmail.com" + "\n")
        cy.contains(vexLanguageSettings.emailFailed).should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("jimjam@hotmail.com" + "\n")
        cy.contains(vexLanguageSettings.emailSuccess).should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("jimjam@pathfactory.com" + "\n")
        cy.contains(vexLanguageSettings.emailSuccess).should('exist')

        // Not going into actual email to check - this is too much of a pain, especially with gmail 
        // Mailinator is more doable, but the wait time for the email to arrive in inbox makes the test very flaky 
        // This aspect of testing should be done manually 
        // If a form is configured for the session, clicking the emailed link should register you for the session with your email 
    })
    //DEV-14533:Automation Task for 'CISCO Partner Oauth Access Protection (session level)'
    //NOTE: "Cisco" toggle from clientHQ must be enabled to validate Cisco level access protection and Cisco has SSO , due to this reason tests has to run in fresh browser always

    it("Authoring Validations for Vex-Session level access protection", ()=>{
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionList()
        //Sessions should have all protection type available in the dropdown [Taking Ondemand Session]
        authoring.vex.goToSessionConfig(vexsessions[0].name)
        cy.contains(authoring.vex.antRow, "Protection Type").within(()=>{
            cy.get(authoring.vex.antSelector).click()
        })
        cy.get(`div[label='${"None"}']`).should('exist')
        cy.get(`div[label='${"Email"}']`).should('exist')
        cy.get(`div[label='${"Cisco"}']`).should('exist')
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
            cy.get(authoring.vex.antDropSelect.selector).click({force:true})
            cy.get(authoring.vex.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
            cy.get(authoring.vex.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click({force:true})
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
        //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and with area selected in Disallowed groups
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.contains("button", "Save").click()
        //When protection type is 'cisco' is enabled for a session [Taking a Live Session]
        authoring.vex.backToEvent(event.name)
        authoring.vex.goToSessionConfig(vexsessions[1].name)
        cy.contains(authoring.vex.antRow, "Protection Type").within(()=>{
            cy.get(authoring.vex.antSelector).click()
            cy.get(authoring.vex.antDropSelect.selector).type('Cisco' + "\n")
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(validCiscoGroup + "\n")
        })
        cy.contains("button", "Save").click()
    })
    it("Consumption Validations for Vex-Session level access protection with protection type combinations", ()=>{
        //1.Preview only VEX sessions for which protection type "Email" is enabled 
        //verify Access Protection-Appearance & Languae settings applied properly in VEX session authentication page.
        cy.visit(vexsessions[0].url)
        cy.get(consumption.common.accessProtectionLogo,{timeout:20000})
            .should('have.css', 'background-image','url("https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg")')
        cy.get(consumption.common.accessProtectionSubmitButton)
            .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.submitButtonColor))
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.submitButtonTextFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.submitButtonFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.submitButtonFontSizeLP])
        cy.get(consumption.common.trackProtectionEmailInput)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.emailAddressFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.emailAddressFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.emailAddressFontSizeLP])
        cy.get(consumption.common.accessProtectionBodyText)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.bodyTextFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.bodyTextFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.bodyTextFontSizeLP])
        cy.get(consumption.common.accessProtectionHeaderText)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.headerTextFontColorLP))
            .should("have.css", "font-family", vexAppearanceSettings.headerTextFontFamilyLP)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.headerTextFontSizeLP])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.headerTextBoldFontLP))       
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        cy.contains(vexLanguageSettings.title).should("exist")
        cy.contains(vexLanguageSettings.emailInstructionMsg).should("exist")
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("random@gmail.com" + "\n")
        cy.contains(vexLanguageSettings.emailFailed).should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("test@hotmail.com" + "\n")
        cy.contains(vexLanguageSettings.emailSuccess).should('exist')
        cy.contains("a", "Go Back").click()
        cy.get(consumption.common.trackProtectionEmailInput).clear().type("vex@pathfactory.com" + "\n")
        cy.contains(vexLanguageSettings.emailSuccess).should('exist')
        //2.Preview VEX , when Event has protection type="Email" and session has protection type="Email"//
        //Note:::::Vex Event and session[vexsessions[0]]has has already protection type="Email" enabled with visitor group, Hence skipping the configurations
        cy.visit(event.url)
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        cy.visit(vexsessions[0].url)
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        //3.Preview VEX , when Event has protection type="Email" and session has protection type="Cisco"//
        //Note:::::Event Configurations: Vex Event has already protection type="Email" and vexsessions[1] has already protection type="Cisco" enabled with visitor group, Hence skipping the configurations
        authoring.common.login()
        cy.visit(event.url)
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        cy.window().then(win => win.location.href = vexsessions[1].url);
        cy.get('h1').contains('Log in to your account').should("exist")
        //4.Preview VEX , when Event has protection type="Cisco" and session has protection type="Email"//
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        cy.contains("span", allVisitorsGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        cy.wait(1000)
        cy.contains(authoring.vex.antRow, "Protection Type").within(()=>{
            cy.get(authoring.vex.antSelector).click()
            cy.get(authoring.vex.antDropSelect.selector).type('Cisco' + "\n")
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(validCiscoGroup + "\n")
        })
        cy.contains("button", "Save").click()
        cy.wait(1000)
        //Session Configurations:vexsessions[0] has already protection type="Email" enabled with visitor group, Hence skipping the configurations
        cy.window().then(win => win.location.href = event.url);
        cy.get('h1').contains('Log in to your account').should("exist")
        cy.visit(vexsessions[0].url)
        cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
        //5.Preview VEX , when Event has protection type="Cisco" and session has protection type="Cisco"//
        //Note::::Vex Event and sessions has has already protection type="Cisco" enabled with visitor group, Hence skipping the configurations
        authoring.common.login()
        cy.window().then(win => win.location.href = event.url);
        cy.get(consumption.common.ciscoEmailInput).type(ciscoEmail)
        cy.get(consumption.common.ciscoNextButton).click()
        cy.wait(15000)
        cy.get(consumption.common.ciscoPasswordInput,{timeout:30000}).type(ciscoPassowrd)
        cy.get(consumption.common.ciscoLogIn).click()
        cy.contains("Browse Sessions").should("exist")
        cy.window().then(win => win.location.href = vexsessions[1].url); //Visit Session consumption
        cy.get(consumption.vex.youtube.iframe,{ timeout: 10000 }).should("be.exist")
        //6.Preview VEX session for which protection type "Cisco" is enabled with Invalid visitor group details 
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.goToSessionConfig(vexsessions[1].name)
        cy.contains("span", validCiscoGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        cy.wait(1000)
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(()=>{
            cy.get(authoring.vex.antDropSelect.selector).click()
            cy.get(authoring.vex.antDropSelect.selector).type(invalidCiscoGroup + "\n") // This visitor has invalid domain details for cisco SSO user
        })
        cy.contains("button", "Save").click()
        cy.wait(1000)
        cy.window().then(win => win.location.href = vexsessions[1].url)
        cy.contains(vexLanguageSettings.unAuthorizedEmail).should('exist')
    })
})