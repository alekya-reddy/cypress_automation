import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-microsites", tld: "lookbookhq" })
const consumption = createConsumptionInstance({ org: "automation-microsites", tld: "lookbookhq" })

const appearance = {
    name: "accessProtectionAppearance.js",
}
const micrositeAppearanceSettings = {
    appearance: "accessProtectionAppearance.js",
    thumbnail: {
        category: "Stock Images",
        url: "/stock/sm/bench-forest-trees-path.jpg",
    },
    headerTextFontFamilyLP: "Overpass",
    headerTextBoldFontLP: true,
    headerTextFontSizeLP: "large",
    headerTextFontColorLP: { r: 10, g: 200, b: 155, a: 0.5 },

    bodyTextFamilyLP: "Roboto",
    bodyTextBoldFontLP: false,
    bodyTextFontSizeLP: "medium",
    bodyTextFontColorLP: { r: 111, g: 22, b: 3, a: 0.35 },

    emailAddressFamilyLP: "Tahoma",
    emailAddressBoldFontLP: false,
    emailAddressFontSizeLP: "large",
    emailAddressFontColorLP: { r: 19, g: 197, b: 116, a: 1 },

    submitButtonFontFamilyLP: "Verdana",
    submitButtonFontWeightLP: false,
    submitButtonFontSizeLP: "small",
    submitButtonTextFontColorLP: { r: 255, g: 11, b: 1, a: 1 },
    submitButtonRadiusLP: "10",
    submitButtonColor: { r: 10, g: 200, b: 155, a: 0.5 },
    verify: true
}
const colorConfigToCSS = (colorConfig) => {
    const { r, g, b, a } = colorConfig
    const CSS = a == 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    return CSS;
}
const fontSizeToCSS_LandPage = { small: "13px", medium: "15px", large: "17px" }

const fontWeightToCSS = (bold) => { return bold ? "700" : "400" }

const language = { name: "accessprotection.js", code: "apmicro" }

const micrositeLanguageSettings = {
    language: language.name,
    title: "Hey there!! Email confirmation is mandatory",
    emailSuccess: "Success! An email has been sent to your inbox",
    emailFailed: "Email is not authorized, please try again",
    unAuthorizedEmail: "Stop! You are not authorized to access this page. ",
    emailInstructionMsg: "Hey! Enter your email check your inbox for access instructions",
}

const microsite = {
    name: "accessProtection.js",
    slug: "accessprotection-js",
    language: 'accessprotection.js',
    appearance: 'accessProtectionAppearance.js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const microsite2 = {
    name: "accessProtection2.js",
    slug: "accessprotection2-js",
    language: 'accessprotection.js',
    appearance: 'accessProtectionAppearance.js',
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const allVisitorsGroup = "All Visitors"
const gmailAPGroup = "gmail AP group"
const hotmailAPGroup = "hotmail AP group"
const emailNotAuthMsg = "Email is not authorized, please try again"
const emailSuccessMsg = "Success! An email has been sent to your inbox"

const contents = authoring.common.env.orgs["automation-microsites"].resources
const webContent = contents["Website Common Resource"]

const target = {
    name: "target accessProtection.js",
    slug: "target-ap",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl() {
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title],
    accessProtection: {
        type: "Email",
        groups: gmailAPGroup
    }
}

const recommend = {
    name: "rec accessProtection.js",
    slug: "rec-ap",
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    get micrositeUrl() {
        return `${microsite.url}/${this.slug}/${webContent.slug}`
    },
    contents: [webContent.title]
}

const landingPage = {
    name: "Main Page",
    slug: "main-page",
    get url() {
        return `${microsite.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            type: "track",
            track: target.name
        },
        {
            type: "track",
            track: recommend.name
        }
    ]
}

describe("Microsites - Access Protection", () => {
    //DEV-14558: Update design of access protection Language and Appearance 
    //Note: Not checking the confirmation email validations as we are not automating email access related scenarios
    //verify Access Protection-Appearance & Languae settings applied properly in Microsite authentication page.
    it("Microsite access protection settings should override the access protection settings of the individual track", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.configurations.deleteLanguage(language.name)
        authoring.configurations.addNewLanguage(language)
        authoring.configurations.configureAccessProtectionLanguageOverride(micrositeLanguageSettings)
        authoring.configurations.deleteAppearance(appearance.name)
        authoring.configurations.addNewAppearance(appearance)
        authoring.configurations.configureAccessProtectionAppearance(micrositeAppearanceSettings)
        authoring.target.deleteTrack(target.name)
        authoring.target.addTrack(target)
        authoring.target.configure(target)
        authoring.recommend.deleteTrack(recommend.name)
        authoring.recommend.addTrack(recommend)
        authoring.recommend.configure(recommend)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)
        cy.wait(3000)
        cy.contains(authoring.microsites.antRow, "Protection Type").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).type('Email' + "\n")
        })
        cy.wait(3000)
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).type(allVisitorsGroup + "\n")
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })

        cy.wait(3000)
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.wait(3000)
        cy.contains('button', 'Save').click()
        cy.contains('div', 'The record was saved successfully.', { timeout: 20000 }).should('be.visible')
        authoring.microsites.addTracks({ recommend: recommend.name, target: target.name })
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.configureLandingPage(landingPage)


        const urls1 = [microsite.url, landingPage.url]
        urls1.forEach(url => {
            cy.visit(url)
            cy.get(consumption.common.accessProtectionLogo)
                .should('have.css', 'background-image', 'url("https://img.qa-pathfactory.com/stock/sm/bench-forest-trees-path.jpg")')
            cy.get(consumption.common.accessProtectionSubmitButton)
                .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.submitButtonColor))
                .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.submitButtonTextFontColorLP))
                .should("have.css", "font-family", micrositeAppearanceSettings.submitButtonFontFamilyLP)
                .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.submitButtonFontSizeLP])
            cy.get(consumption.common.trackProtectionEmailInput)
                .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.emailAddressFontColorLP))
                .should("have.css", "font-family", micrositeAppearanceSettings.emailAddressFamilyLP)
                .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.emailAddressFontSizeLP])
            cy.get(consumption.common.accessProtectionBodyText)
                .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.bodyTextFontColorLP))
                .should("have.css", "font-family", micrositeAppearanceSettings.bodyTextFamilyLP)
                .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.bodyTextFontSizeLP])
            cy.get(consumption.common.accessProtectionHeaderText)
                .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.headerTextFontColorLP))
                .should("have.css", "font-family", micrositeAppearanceSettings.headerTextFontFamilyLP)
                .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.headerTextFontSizeLP])
                .should("have.css", "font-weight", fontWeightToCSS(micrositeAppearanceSettings.headerTextBoldFontLP))

            cy.url().should('include', `${authoring.common.baseUrl}/visitor_authentications/confirmations/new?visitor_auth_key=`)
            cy.contains(micrositeLanguageSettings.title).should("exist")
            cy.contains(micrositeLanguageSettings.emailInstructionMsg).should("exist")
            cy.get(consumption.common.trackProtectionEmailInput).clear().type("random@gmail.com" + "\n")
            cy.contains(micrositeLanguageSettings.emailFailed).should('exist')
            cy.contains("a", "Go Back").click()
            cy.get(consumption.common.trackProtectionEmailInput).clear().type("jimjam@hotmail.com" + "\n")
            cy.contains(micrositeLanguageSettings.emailSuccess).should('exist')
            cy.contains("a", "Go Back").click()
            cy.get(consumption.common.trackProtectionEmailInput).clear().type("jimjam@pathfactory.com" + "\n")
            cy.contains(micrositeLanguageSettings.emailSuccess).should('exist')
        })
        
        //NOTE: Not covering Access protection Language and Appearance validations for microsite tracs, as the validations will be done separately for respective tracks in their access protection file
        const urls2 = [target.micrositeUrl, recommend.micrositeUrl]
        urls2.forEach(url => {
            cy.visit(url)
            cy.contains(micrositeLanguageSettings.title).should("exist")
            cy.url().should("not.eq", url).should("contain", `${authoring.common.baseUrl}/visitor_authentications`)
            // Gmail email domain should not be authorized. Hotmail should be authorized
            cy.get(consumption.microsites.trackProtectionEmailInput).type("h8fdj092hy6b@gmail.com" + "\n")
            cy.contains(emailNotAuthMsg).should("exist")
            cy.contains("a", "Go Back").click()
            cy.get(consumption.microsites.trackProtectionEmailInput).type("h8fdj092hy6b@hotmail.com" + "\n")
            cy.contains(emailSuccessMsg).should("exist")
        })
        // Turn off access protection and verify on consumption
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(microsite.name)
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(() => {
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.contains("span", allVisitorsGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
        authoring.microsites.setup({
            name: microsite.name,
            accessProtection: {
                type: "None"
            }
        })
        const urls = [microsite.url, landingPage.url, target.micrositeUrl, recommend.micrositeUrl]
        urls.forEach(url => {
            cy.visit(url)
            cy.url().should("contain", url)
            cy.contains(micrositeLanguageSettings.title).should("not.exist")
        })
    })

    it("Validate access protection configuration section in Microsite builder", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite2.name)
        authoring.microsites.addMicrosite(microsite2)
        authoring.microsites.goToMicrositeConfig(microsite2.name)
        //When All Visitors is not selected in Allowed Groups list, other groups in the drop down are enabled for selection in the Allowed groups drop down
        cy.contains(authoring.microsites.antRow, "Protection Type").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).type('Email' + "\n")
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.get(authoring.microsites.dropDown).children().each(($el, index, $list) => {
            cy.wrap($el).should("not.have.class", 'ant-select-item-option-disabled')
        })
        //When All Visitors is selected in Allowed Groups list, other groups in the drop down are disabled for selection in the Allowed groups drop down
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.get(authoring.microsites.dropDown).children().each(($el, index, $list) => {
            if (index == 0) {
                cy.wrap($el).should("have.class", 'ant-select-item-option-selected')
            } else {
                cy.wrap($el).should("have.class", 'ant-select-item-option-disabled')
            }
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains("span", allVisitorsGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()

        //When a group is selected in Allowed Groups list, then that group should be shown in the drop down list of Allowed with area selected and not shown in Disallowed groups list
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
        })
        cy.get(authoring.microsites.dropDown).children().each(($el, index, $list) => {
            cy.wrap($el).invoke('text').then((text) => {
                if (text == gmailAPGroup) {
                    cy.wrap($el).should("have.class", 'ant-select-item-option-selected')
                }
            })
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.microsites.antDropSelect.selector).click()
            // if placeholder exists that means that value wasn't selected
            cy.get(authoring.common.accessProtection.selectPlaceholder).should('exist')
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        //When a selected group is removed from the Allowed Groups list, then that group should be shown in the drop down list of Allowed and Disallowed groups
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.common.accessProtection.selectedVisitorGroup).should('have.contain', gmailAPGroup)
            cy.contains("span", gmailAPGroup).parent().find(authoring.common.accessProtection.vex_microsite_removeVisitorGroup).click()
        })
        //When a group is selected in Disallowed Groups list, then that group should no more be shown in the drop down list of Allowed and with area selected in Disallowed groups
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
        })
        cy.get(authoring.microsites.DisallowGroups).siblings('div').within(() => {
            cy.get(authoring.microsites.dropDown).children().each(($el, index, $list) => {
                cy.wrap($el).invoke('text').then((text) => {
                    if (text == gmailAPGroup) {
                        cy.wrap($el).should("have.class", 'ant-select-item-option-selected')
                    }
                })
            })
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Disallow Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
        })
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(gmailAPGroup + "\n")
            cy.get(authoring.microsites.antDropSelect.selector).click()
            // if placeholder exists that means that value wasn't selected
            cy.get(authoring.common.accessProtection.selectPlaceholder).should('exist')
        })
        //Select All Visitors in the Allowed Groups list and "gmailAPGroup" is already selected above in Disallowed Groups list
        cy.contains(authoring.common.accessProtection.trackProtectionArea, "Groups").within(() => {
            cy.get(authoring.microsites.antDropSelect.selector).click()
            cy.get(authoring.microsites.antDropSelect.selector).type(allVisitorsGroup + "\n")
        })
        cy.contains("button", "Save").click()
    })
})