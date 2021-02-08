import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexAppearance.js',
    slug: 'vexappearance-js',
    form: 'Standard Form Short', // The form button color is set to blue rgb(0,0,255)
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const appearance = {
    appearance: "vexAppearance.js",
    headerTitle: 'Vex Appearance Title',
    headerSubtitle: 'Vex Appearance Subtitle',
    contentTitle: "VEX Content Title",
    contentDescription: "VEX Content Description",
}

const vexAppearanceSettings = {
    appearance: "vexAppearance.js",
    headerTitleFontFamily: "Overpass",
    headerTitleBoldFont: true,
    backgroundColor: {r: 10, g: 200, b: 155, a: 0.5},
    headerBackgroundColor: {r: 145, g: 214, b: 224, a: 1},
    headerTitleFontSize: "large",
    headerTitleFontColor: {r: 200, g: 50, b: 9, a: 0.25},
    bodyFontFamily: "Roboto",
    bodyBoldFont: false,
    bodyFontSize: "medium",
    bodyFontColor: {r: 111, g: 22, b: 3, a: 0.35},
    activeFontFamily: "Verdana",
    activeBoldFont: true,
    activeFontSize: "small",
    activeFontColor: {r: 255, g: 11, b: 1, a: 1},
    hideNavigation: false
}

const colorConfigToCSS = (colorConfig) => {
    const { r, g, b, a } = colorConfig
    const CSS = a == 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    return CSS;
}

const fontSizeToCSS = {small: "13px", medium: "15px", large: "27px"}

const fontWeightToCSS = (bold) => { return bold ? "700" : "400" }

const navItem = {
    label: "Text",
    type: "Text"
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
    contents: [
        'Image - Used by Cypress automation for VEX testing',
        'PDF - Used by Cypress automation for VEX testing',
        'Website - Used by Cypress automation for VEX testing'
    ]
}

const sessionGroup = "Group A"

const landingPage = "page"

// Test the appearance set up area. For now, this test is deliberately sparse because this area will likely change a lot soon 
describe('VEX - Virtual Event', function() {
    it('Configure appearance on authoring side then verify on consumption', function() {
        cy.viewport(1500, 1000)
        authoring.common.login()
        authoring.configurations.configureVEXAppearance(vexAppearanceSettings)
        // verify VEX appearance preview in setting to reflect updated settings
        cy.get(authoring.configurations.appearances.vex.backgroundcolorPreview).should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.backgroundColor))
        cy.get(authoring.configurations.appearances.vex.headerBackgroundColorPreview).should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.headerBackgroundColor))
        cy.get(authoring.configurations.appearances.vex.headerTitleFontPreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.headerTitleFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.headerTitleFontFamily)  
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.headerTitleFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.headerTitleBoldFont))
        cy.get(authoring.configurations.appearances.vex.bodySessionTitleFontPreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.bodyFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.bodyFontFamily)
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.bodyFontSize])
        cy.get(authoring.configurations.appearances.vex.bodySuppplementalContentFontPreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.bodyFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.bodyFontFamily)
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.bodyFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.bodyBoldFont))
        cy.get(authoring.configurations.appearances.vex.activeTitleFontPreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.activeFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.activeFontFamily)
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.activeFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.activeBoldFont))
        authoring.vex.visit() 
        authoring.vex.goToEventConfig(event.name)
        cy.contains('a', 'Preview Event').should('exist').should('have.attr', 'href', event.url)
        cy.contains('a', 'Appearance Setup').click()
        cy.containsExact('[class="ant-card-head"]', 'Event Appearance').should('exist')
        cy.contains('a', 'Preview Event').should('have.attr', 'href', event.url)

        authoring.vex.configureAppearance(appearance)

        // Delete any navigation items that might have been left from previous run
        authoring.vex.deleteAllNavItems()
        authoring.vex.goToLandingPage()
        authoring.vex.unsetHomePage(landingPage)
        cy.wait(1500)

        // Go to consumption side and verify settings got applied 
        cy.visit(event.url)

        // Check the text fields
        cy.contains(consumption.vex.eventHeroTitle, appearance.headerTitle, {timeout: 20000}).should('exist')
        cy.contains(consumption.vex.eventHeroSubtitle, appearance.headerSubtitle).should('exist')
        cy.contains(consumption.vex.eventContentTitle, appearance.contentTitle).should('exist')
        cy.contains(consumption.vex.eventContentDescription, appearance.contentDescription).should('exist')

        // Check the header appearance settings 
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get("img[src*='/stock/sm/animal-dog-pet-cute.jpg']").should('exist')
            cy.contains('a', event.name).should("have.css", "font-family", "Tahoma")
        })

        // Check the explore appearance settings (controls the hero and event container)
        cy.get(consumption.vex.vexHeroContainer).should("have.css", "background-color", "rgb(0, 255, 0)")
            .invoke("css", "background-image").should("have.contain", "/stock/sm/animal-dog-pet-cute.jpg")
        cy.get(consumption.vex.vexEventContainer).eq(1).parent().should("have.css", "background-color", "rgb(0, 0, 255)")

        // Check the form submit button color (controlled on the form configuration itself)
        cy.contains("button", "Submit").should("have.css", "background-color", "rgb(0, 0, 255)")

        // Check the general appearance settings (controls the form appearance)
        cy.get(consumption.vex.vexFormTitle).should("have.css", "color", "rgb(255, 0, 255)").should("have.css", "font-family", "Overpass")
        cy.get(consumption.vex.vexFormDescription).should("have.css", "color", "rgb(0, 255, 255)").should("have.css", "font-family", "Overpass")

        // Go to session and check the vex appearance settings (event session sidebar, and body)
        cy.contains("a", "Youtube").click()
        consumption.vex.fillStandardForm({email: "getOutOfMyWay@gmail.com"}) // Settings (other than the blue button) not applied to form on session page... not sure if this is intended?
        cy.get(consumption.vex.jukeBoxApp + ">div", {timeout: 20000}).should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.backgroundColor))
        cy.get(consumption.vex.supplementalContent).children("li").eq(0)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.bodyFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.bodyFontFamily)
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.bodyFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.bodyBoldFont))
            .click()
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.activeFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.activeFontFamily)
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.activeFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.activeBoldFont))    
        cy.get(consumption.vex.supplementalTitle)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.headerTitleFontColor))
            .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.headerBackgroundColor))
            .should("have.css", "font-family", vexAppearanceSettings.headerTitleFontFamily)
            .should("have.css", "font-size", fontSizeToCSS[vexAppearanceSettings.headerTitleFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.headerTitleBoldFont))
        // Return to authoring and add a navigation item - this will replace the event/session header with a navigation header
        cy.go("back")
        cy.go("back")
        cy.go("back")
        authoring.vex.addNavItem(navItem)
        authoring.vex.goToLandingPage()
        authoring.vex.setToHomePage(landingPage)
        cy.wait(1500)

        // Go back to consumption and verify the appearance settings of the navigation header 
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get(consumption.vex.vexHeaderMenuItem).should("have.css", "font-family", "Tahoma")
        })

        // Verify the session group search input appearance (controlled in explore appearance settings)
        cy.contains(consumption.vex.sessionGroup, sessionGroup).within(() => {
            cy.get("input").should("have.css", "color", "rgb(0, 0, 100)").should("have.css", "background-color", "rgb(0, 100, 0)")
            cy.contains("button", "Search").should("have.css", "color", "rgb(0, 100, 0)").should("have.css", "background-color", "rgb(100, 0, 0)")
        })

        // Turn off navigation header in the vex appearance settings
        authoring.configurations.visit.appearances()
        authoring.configurations.configureVEXAppearance({
            appearance: "vexAppearance.js",
            hideNavigation: true
        })

        // Verify on consumption that navigation header no longer exists
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader).should("not.exist")
        cy.visit(session.url)
        cy.get(consumption.vex.vexHeader).should("not.exist")
    })
})