import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-vex', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-vex', tld: 'lookbookhq'});

const event = {
    name: 'vexAppearance.js',
    slug: 'vexappearance-js',
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
    sessionDescriptionFontFamily:"Tahoma",
    sessionDescriptionFontWeight: false,
    sessionDescriptionFontSize: "large",
    sessionDescriptionFontColor: {r: 19, g: 197, b: 116, a: 1},
    activeFontFamily: "Verdana",
    activeBoldFont: true,
    activeFontSize: "small",
    activeFontColor: {r: 255, g: 11, b: 1, a: 1},
    hideNavigation: false,
    layout: "Carousel",
    landingPageCardRadius: "15",
    landingPageSearchFilterRadius: "10",
    landingPageSearchFilterFontFamily: "Verdana",
    landingPageSearchFilterColor: {r: 16, g: 106, b: 223, a: 0.5},
    landingPageSearchFilterBackgroundColor: {r: 131, g: 63, b: 120, a: 1},
    landingPageSearchFilterFontSize: "small",
    landingPageSearchFieldFontFamily: "Tahoma",
    landingPageSearchFieldColor: {r: 201, g: 53, b: 28, a: 0.5},
    landingPageSearchFieldBackgroundColor: {r: 49, g: 175, b: 34, a: 1},
    landingPageSearchFieldFontSize: "medium",
    landingPageHeadingStyleFontFamily: "Courier",
    landingPageHeadingStyleColor: {r: 103, g: 30, b: 195, a: 1},
    landingPageHeadingStyleFontSize: "large",
    landingPageCarouselArrowsColor: {r: 13, g: 104, b: 49, a: 0.5},
    landingPageCarouselArrowsBackgroundColor: {r: 167, g: 158, b: 67, a: 1},
    landingPageNoResultsMsgFontFamily: "Arial",
    landingPageNoResultsMsgColor: {r: 209, g: 194, b: 114, a: 0.5},
    landingPageNoResultsMsgFontSize: "large",
    verify: true
}

const colorConfigToCSS = (colorConfig) => {
    const { r, g, b, a } = colorConfig
    const CSS = a == 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    return CSS;
}

const fontSizeToCSS = {small: "13px", medium: "15px", large: "27px"}
const fontSizeToCSS_LandPage = {small: "13px", medium: "15px", large: "17px"}
const fontSizeToCSS_LandPg_Heading = {small: "21px", medium: "24px", large: "27px"}

const fontWeightToCSS = (bold) => { return bold ? "700" : "400" }

const navItem = {
    label: "Text",
    type: "Text",
    verify: false
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

const landingPage2 = {
    name: "Landing-Page2",
    slug: "landing-page2",
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

const editCardConfiguration = {
    heading: {
        fontSize: "50px"
    },
    cardConfiguration: {
        blockName: session.name
    }
} 
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
        cy.get(authoring.configurations.appearances.vex.sessionDescriptionPreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.sessionDescriptionFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.sessionDescriptionFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.sessionDescriptionFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.sessionDescriptionFontWeight))
        cy.get(authoring.configurations.appearances.vex.searchFilterStylePreview)
            .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFilterBackgroundColor))
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFilterColor))
            .should("have.css", "font-family", vexAppearanceSettings.landingPageSearchFilterFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageSearchFilterFontSize])
        cy.get(authoring.configurations.appearances.vex.searchFieldInputPreview)
            .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFieldBackgroundColor))
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFieldColor))
            .should("have.css", "font-family", vexAppearanceSettings.landingPageSearchFieldFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageSearchFieldFontSize])
        cy.get(authoring.configurations.appearances.vex.headingStylePreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageHeadingStyleColor))
            .should("have.css", "font-family", vexAppearanceSettings.landingPageHeadingStyleFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPg_Heading[vexAppearanceSettings.landingPageHeadingStyleFontSize])
        cy.get(authoring.configurations.appearances.vex.carouselArrowsPreview)
            .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageCarouselArrowsBackgroundColor))
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageCarouselArrowsColor))
        cy.get(authoring.configurations.appearances.vex.noResultsMsgPreview)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageNoResultsMsgColor))
            .should("have.css", "font-family", vexAppearanceSettings.landingPageNoResultsMsgFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageNoResultsMsgFontSize])
        cy.get(authoring.configurations.appearances.vex.cardRadiusPreview)
            .should("have.css", "border-radius", vexAppearanceSettings.landingPageCardRadius+"px")
        cy.get(authoring.configurations.appearances.vex.searchFieldInputPreview)
            .should("have.css", "border-radius", vexAppearanceSettings.landingPageSearchFilterRadius+"px")

        cy.get(authoring.configurations.appearances.vex.heading).invoke('attr','font-size').as('fontSize')

        cy.get(authoring.vex.virtualEventsTab,{timeout:10000}).click()
        authoring.vex.waitForVexToLoad()
        authoring.vex.goToEventConfig(event.name)
        cy.contains('a', 'Preview Event').should('exist').should('have.attr', 'href', event.url)
        cy.contains('a', 'Appearance Setup').click()
        cy.containsExact('[class="ant-card-head"]', 'Event Appearance').should('exist')
        cy.contains('a', 'Preview Event').should('have.attr', 'href', event.url)

        authoring.vex.configureAppearance(appearance)

        // Delete any navigation items that might have been left from previous run
        authoring.vex.deleteAllNavItems()

        // Verify landing page blocks will now have carousel by default
        authoring.vex.deleteLandingPages(landingPage2.name)
        authoring.vex.addLandingPages(landingPage2.name)
        authoring.vex.configureLandingPage(landingPage2)
        authoring.vex.goToPageEditor(landingPage2.name)

        cy.get('h4',{timeout:10000}).invoke('css','font-size').then(builderFontSize=>{
            cy.get('@fontSize').then(fontSize => {
                expect(fontSize).to.equal(builderFontSize);
           })
        })

        //Verify that the virtual event appearance settings are applied correctly in landing page
        cy.contains(authoring.vex.pages.sessionGroupRow, sessionGroup,{ timeout: 10000 }).within(() => {
            cy.get(authoring.vex.pages.sessionCard)
              .should("have.css", "border-radius", vexAppearanceSettings.landingPageCardRadius+"px")
            cy.get(authoring.vex.pages.Filter_Topic)
              .should("have.css", "border-radius", vexAppearanceSettings.landingPageSearchFilterRadius+"px")
            cy.get(authoring.vex.pages.searchFilter)
              .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFilterBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFilterColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageSearchFilterFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageSearchFilterFontSize])
            cy.get(authoring.vex.pages.searchInputField)
              .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFieldBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFieldColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageSearchFieldFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageSearchFieldFontSize])
            cy.get(`h4:contains("${sessionGroup}")`)
              .should("exist")
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageHeadingStyleColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageHeadingStyleFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPg_Heading[vexAppearanceSettings.landingPageHeadingStyleFontSize])
            cy.get(authoring.vex.pages.carouselArrow)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageCarouselArrowsBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageCarouselArrowsColor))
        })

        //Go to consumption side and verify VEX appearance settings got applied
        cy.visit(event.url)
        // Check the header appearance settings 
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get("img[src*='/stock/sm/animal-dog-pet-cute.jpg']").should('exist')
            cy.contains('a', event.name).should("have.css", "font-family", "Tahoma")
        })

        cy.get('h2',{timeout:10000}).invoke('css','font-size').then(builderFontSize=>{
            cy.get('@fontSize').then(fontSize => {
                expect(fontSize).to.equal(builderFontSize);
           })
        })
    
        cy.contains(consumption.vex.sessionGroup, sessionGroup,{ timeout: 10000 }).within(() => {
            cy.get(consumption.vex.sessionCard)
              .should("have.css", "border-radius", vexAppearanceSettings.landingPageCardRadius+"px")
            cy.get(consumption.vex.topicFilter)
              .should("have.css", "border-radius", vexAppearanceSettings.landingPageSearchFilterRadius+"px")
            cy.get(consumption.vex.searchFilter)
              .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFilterBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFilterColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageSearchFilterFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageSearchFilterFontSize])
            cy.get(consumption.vex.searchInputField)
              .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFieldBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageSearchFieldColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageSearchFieldFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageSearchFieldFontSize])
            cy.get(`h2:contains("${sessionGroup}")`)
              .should("exist")
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageHeadingStyleColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageHeadingStyleFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPg_Heading[vexAppearanceSettings.landingPageHeadingStyleFontSize])
            cy.get(consumption.vex.carouselArrow_bgColor)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.landingPageCarouselArrowsBackgroundColor))
            cy.get(consumption.vex.carouselArrow_color)
              .should("exist")
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageCarouselArrowsColor))
            cy.get(consumption.vex.searchInputField).type("abcd" +"\n",{force: true})
        })
        cy.get(consumption.vex.noResultsMsg)
              .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.landingPageNoResultsMsgColor))
              .should("have.css", "font-family", vexAppearanceSettings.landingPageNoResultsMsgFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.landingPageNoResultsMsgFontSize])
        cy.get(consumption.vex.searchInputField).clear()
        // Go to session and check the vex appearance settings (event session sidebar, and body)
        cy.contains("a", "Youtube",{ timeout: 10000 }).click()
        consumption.vex.fillStandardForm({email: "getOutOfMyWay@gmail.com"}) // Settings (other than the blue button) not applied to form on session page... not sure if this is intended?
        cy.get(consumption.vex.jukeBoxApp + ">div", {timeout: 20000}).should("have.css", "background-color", colorConfigToCSS(vexAppearanceSettings.backgroundColor))
        cy.get(consumption.vex.sessionDescriptionStyle)
            .should("have.css", "color", colorConfigToCSS(vexAppearanceSettings.sessionDescriptionFontColor))
            .should("have.css", "font-family", vexAppearanceSettings.sessionDescriptionFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[vexAppearanceSettings.sessionDescriptionFontSize])
            .should("have.css", "font-weight", fontWeightToCSS(vexAppearanceSettings.sessionDescriptionFontWeight))
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
        cy.go("back")
        authoring.vex.addNavItem(navItem)
        cy.wait(1500)

        // Go back to consumption and verify the appearance settings of the navigation header 
        cy.visit(event.url)
        cy.get(consumption.vex.vexHeader).should("have.css", "background-color", "rgb(255, 0, 0)").within(()=>{
            cy.get("img[src*='/stock/sm/animal-dog-pet-cute.jpg']").should('exist')
            cy.get(consumption.vex.vexHeaderMenuItem).should("have.css", "font-family", "Tahoma")
            cy.contains('div', navItem.label).should("exist")
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

        // Switch appearance settings to grid by default
        authoring.configurations.visit.appearances()
        authoring.configurations.configureVEXAppearance({
            appearance: "vexAppearance.js",
            layout: "Grid"
        })
        // Verify landing page blocks will have grid by default
        authoring.vex.visit()
        authoring.vex.goToEventConfig(event.name)
        authoring.vex.deleteLandingPages(landingPage2.name)
        authoring.vex.addLandingPages(landingPage2.name)
        authoring.vex.configureLandingPage(landingPage2)
        authoring.vex.goToPageEditor(landingPage2.name)

        cy.contains(authoring.vex.pages.sessionGroupRow, sessionGroup, {timeout: 10000}).within(() => {
            cy.get(authoring.vex.pages.carouselArrow).should("not.exist")
        })

         //Override the heading font size at block level
         authoring.vex.editExistingCard(editCardConfiguration)

         cy.get('h4').invoke('css','font-size').then(builderFontSize=>{
                 expect(builderFontSize).to.equal(editCardConfiguration.heading.fontSize);
         })
 
         cy.contains('Save', { timeout: 20000 }).should('be.visible').click()
         cy.contains('p', 'Page saved', { timeout: 20000 }).should('be.visible')

        //Go to consumption side and verify carousal arrow is not present
        cy.visit(event.url)
        cy.contains(consumption.vex.sessionGroup, sessionGroup,{ timeout: 10000 }).within(() => {
            cy.get(consumption.vex.carouselArrow_bgColor).should("not.exist")
            cy.get(consumption.vex.carouselArrow_color).should("not.exist")
        })

        // Verify consumption page has overriden heading font size value
        cy.get('h2').invoke('css','font-size').then(builderFontSize=>{
            expect(builderFontSize).to.equal(editCardConfiguration.heading.fontSize);
        })
    })

})