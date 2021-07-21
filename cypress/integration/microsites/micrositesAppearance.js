import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: 'automation-microsites', tld: 'lookbookhq'}); 
const consumption = createConsumptionInstance({org: 'automation-microsites', tld: 'lookbookhq'})
const contentType = "Blog Post"
const topicTags = "Topic Shared Resource"

const micrositeApp = {
    name: 'micrositesAppearance.js',
    slug: 'micrositesappearance-js',
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    appearance: "micrositesAppearance.js",
    contentType: true,
    topicTags: true
}

const newAppearanceSetting = {
    name:"micrositesAppearance.js", 
    primaryColor: {r: 106, g: 171, b: 233, a: 1},
    titleAppearanceFont: "Overpass",
    titleAppearancecolor: {r: 255, g: 255, b: 255, a: 1},
    bodyTextFont: "Overpass",
    bobyTextcolor: {r: 180, g: 74, b: 13, a: 1}
}

const micrositeAppearanceSettings = {
    appearance: "micrositesAppearance.js",
    hideNavigation: true,
    contentTypeTopicLabelsFontFamily: "Overpass",
    contentTypeTopicLabelsFontStyle: true,
    contentTypeTopicLabelsTextDecoration: true,
    contentTypeTopicLabelsColor: {r: 16, g: 106, b: 223, a: 0.5},
    contentTypeTopicLabelsBackgroundColor: {r: 131, g: 63, b: 120, a: 1},
    layout: "Carousel",
    landingPageCardRadius: "15",
    landingPageSearchFilterRadius: "10",
    landingPageSearchFilterFontFamily: "Verdana",
    landingPageSearchFilterColor: {r: 16, g: 106, b: 223, a: 0.5},
    landingPageSearchFilterBackgroundColor: {r: 131, g: 63, b: 120, a: 0.6},
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

const searchAndFilterOptions =
    [
        {
            label: "Search",
            toggle: true
        },
        {
            label: "Topic",
            toggle: true
        }
    ]

const colorConfigToCSS = (colorConfig) => {
    const { r, g, b, a } = colorConfig
    const CSS = a == 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`
    return CSS;
}

const fontSizeToCSS_LandPage = {small: "13px", medium: "15px", large: "17px"}
const fontSizeToCSS_LandPg_Heading = {small: "21px", medium: "24px", large: "27px"}
const fontWeightToCSS = (bold) => { return bold ? "700" : "400" }
const fontStyleToCSS = (italic) => { return italic ? "italic" : "normal" }
const fonttextDecorationToCSS = (underline) => { return underline ? "underline" : "none" }
const target = {
    name: "Target Multiple Assets",
    slug: "target-multiple-assets",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"],
    firtContentSlug: "openai"
}

const recommend = {
    name: "Recommend Common Resource",
    slug: "recommend-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"],
    firtContentSlug: "openai"
}

const landingPage = {
    name: "landing Page Home Page",
    slug: "landing-page-home-pa",
    get url(){
        return `${micrositeApp.url}/${this.slug}`
    },
    visibility: 'Public',
    blocks: [
        {
            id: "Target Block",
            type: "track",
            track: target.name,
            expectContents: target.contents,
        },
        {
            id: "HTML block",
            type: "HTML",
            content: `<h1>Landing Page Appearence</h1>`,
            checkContent: {
                text: ["Landing Page Appearence"],
                locators: ["h1"]
            }
        }
    ]
}

const gridCarouselLandingPage = {
    name: "Grid Carousel LP",
    slug: "grid-carousel-lp",
    visibility: 'Public',
    get url(){
        return `${micrositeApp.url}/${this.slug}`
    },
    blocks: [
        {
            type: "track",
            track: target.name,
        },
    ]
} 

const navigation = {
    landingPage: {
        label: "landingPage",
        type: "Landing Page",
        source: landingPage.name,
        reference: landingPage
    },
    target: {
        label: "targetTrack",
        type: "Track",
        source: target.name,
        reference: target
    },
    recommend: {
        label: "recTrack",
        type: "Track",
        source: recommend.name,
        reference: recommend
    }
}    

describe("Microsites - Appeararnace", () => {
    it("Set up microsites with tracks, landing page, navigation and microsite appearance if doesn't exist", ()=>{
        cy.request({url: micrositeApp.url, failOnStatusCode: false}).then((response)=>{
            if(response.status == 404){
                authoring.common.login()
                authoring.configurations.addNewAppearance(newAppearanceSetting)
                authoring.microsites.addMicrosite(micrositeApp.name)
                authoring.microsites.setup(micrositeApp)
                authoring.microsites.addTracks({target: target.name, recommend: recommend.name})
                authoring.microsites.addSearchAndFilterOptions(searchAndFilterOptions);
                authoring.microsites.saveSearchAndFiltersSettings();
                authoring.microsites.addLandingPages(landingPage.name)
                authoring.microsites.configureLandingPage(landingPage)
                Object.values(navigation).forEach((navItem) => {
                   authoring.microsites.addNavItem(navItem)   
                })
            }
        })
    }) 

    it("Configure Appearance settings in microsites and verify authoring,landing page and consumption relfects those settings", ()=>{
        cy.viewport(1500, 1000)
        authoring.common.login()
        // Configure microsite landing page appearnces and Turn off and hide navigation header in the Appearences > Microsite settings
        authoring.configurations.configureMicrositesAppearance(micrositeAppearanceSettings)
        // verify Microsite appearance preview in setting to reflect updated settings
        cy.get(authoring.configurations.appearances.microsites.searchFilterStylePreview)
            .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFilterBackgroundColor))
            .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFilterColor))
            .should("have.css", "font-family", micrositeAppearanceSettings.landingPageSearchFilterFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageSearchFilterFontSize])
        cy.get(authoring.configurations.appearances.microsites.searchFieldInputPreview)
            .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFieldBackgroundColor))
            .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFieldColor))
            .should("have.css", "font-family", micrositeAppearanceSettings.landingPageSearchFieldFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageSearchFieldFontSize])
        cy.get(authoring.configurations.appearances.microsites.headingStylePreview)
            .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageHeadingStyleColor))
            .should("have.css", "font-family", micrositeAppearanceSettings.landingPageHeadingStyleFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPg_Heading[micrositeAppearanceSettings.landingPageHeadingStyleFontSize])
        cy.get(authoring.configurations.appearances.microsites.carouselArrowsPreview)
            .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageCarouselArrowsBackgroundColor))
            .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageCarouselArrowsColor))
        cy.get(authoring.configurations.appearances.microsites.noResultsMsgPreview)
            .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageNoResultsMsgColor))
            .should("have.css", "font-family", micrositeAppearanceSettings.landingPageNoResultsMsgFontFamily)
            .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageNoResultsMsgFontSize])
        cy.get(authoring.configurations.appearances.microsites.cardRadiusPreview)
            .should("have.css", "border-radius", micrositeAppearanceSettings.landingPageCardRadius+"px")
        cy.get(authoring.configurations.appearances.microsites.searchFieldInputPreview)
            .should("have.css", "border-radius", micrositeAppearanceSettings.landingPageSearchFilterRadius+"px")

        //Verify that the microsite appearance settings are applied correctly in the landing page
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(micrositeApp.name)
        authoring.microsites.removeLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.addLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.configureLandingPage(gridCarouselLandingPage)
        authoring.microsites.goToPageEditor(gridCarouselLandingPage.name)
        cy.wait(1000) // need hard wait for landing page configurations to load from back-end. It's a blank page initially, so there is no UI indication when this is done.
        cy.contains(authoring.microsites.landingPages.trackRow, target.name,{ timeout: 10000 }).within(() => {
            cy.get(authoring.microsites.landingPages.micrositeCard)
              .should("have.css", "border-radius", micrositeAppearanceSettings.landingPageCardRadius+"px")
            cy.get(authoring.microsites.landingPages.Filter_Topic)
              .should("have.css", "border-radius", micrositeAppearanceSettings.landingPageSearchFilterRadius+"px")
            cy.get(authoring.microsites.landingPages.searchFilter)
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFilterBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFilterColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageSearchFilterFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageSearchFilterFontSize])
            cy.get(authoring.microsites.landingPages.searchInputField)
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFieldBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFieldColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageSearchFieldFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageSearchFieldFontSize])
            cy.get(`h4:contains("${target.name}")`)
              .should("exist")
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageHeadingStyleColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageHeadingStyleFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPg_Heading[micrositeAppearanceSettings.landingPageHeadingStyleFontSize])
            cy.get(authoring.microsites.landingPages.carouselArrow)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageCarouselArrowsBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageCarouselArrowsColor))
            cy.contains(contentType)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.contentTypeTopicLabelsFontFamily)
              .should("have.css", "font-weight", fontWeightToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsFontWeight))
              .should("have.css", "font-style", fontStyleToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsFontStyle))
              .should("have.css", "text-decoration", fonttextDecorationToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsTextDecoration)+" solid "+colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsColor))
            cy.contains(topicTags)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsBackgroundColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.contentTypeTopicLabelsFontFamily)
        })
        //Verify that the microsite appearance settings are applied correctly on consumption
        cy.visit(gridCarouselLandingPage.url)
        cy.contains("h4", target.name).parent().within(() => {
            cy.get(consumption.microsites.gridCard)
              .should("have.css", "border-radius", micrositeAppearanceSettings.landingPageCardRadius+"px")
            cy.get(consumption.microsites.FilterByTopic)
              .should("have.css", "border-radius", micrositeAppearanceSettings.landingPageSearchFilterRadius+"px")
            cy.get(consumption.microsites.searchFilter)
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFilterBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFilterColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageSearchFilterFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageSearchFilterFontSize])
            cy.get(consumption.microsites.searchInputField)
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFieldBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageSearchFieldColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageSearchFieldFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageSearchFieldFontSize])
            cy.get(`h4:contains("${target.name}")`)
              .should("exist")
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageHeadingStyleColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageHeadingStyleFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPg_Heading[micrositeAppearanceSettings.landingPageHeadingStyleFontSize])
            cy.get(consumption.microsites.carouselArrow_bgColor)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.landingPageCarouselArrowsBackgroundColor))
            cy.get(consumption.microsites.carouselArrow_color)
              .should("exist")
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageCarouselArrowsColor))
            cy.contains(contentType)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsBackgroundColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.contentTypeTopicLabelsFontFamily)
              .should("have.css", "font-weight", fontWeightToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsFontWeight))
              .should("have.css", "font-style", fontStyleToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsFontStyle))
              .should("have.css", "text-decoration", fonttextDecorationToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsTextDecoration)+" solid "+colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsColor))
            cy.contains(topicTags)
              .should("exist")
              .should("have.css", "background-color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsColor))
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.contentTypeTopicLabelsBackgroundColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.contentTypeTopicLabelsFontFamily)
            cy.get(consumption.microsites.searchInputField).type("abcd" +"\n",{force: true})
        })
        cy.get(consumption.microsites.noResultsMsg)
              .should("have.css", "color", colorConfigToCSS(micrositeAppearanceSettings.landingPageNoResultsMsgColor))
              .should("have.css", "font-family", micrositeAppearanceSettings.landingPageNoResultsMsgFontFamily)
              .should("have.css", "font-size", fontSizeToCSS_LandPage[micrositeAppearanceSettings.landingPageNoResultsMsgFontSize])
        cy.get(consumption.microsites.searchInputField).clear()

        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
        cy.visit(`${micrositeApp.url}/${navigation.target.reference.slug}/${navigation.target.reference.firtContentSlug}`)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
        cy.visit(`${micrositeApp.url}/${navigation.recommend.reference.slug}/${navigation.recommend.reference.firtContentSlug}`)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("not.exist")
          
        // Apply Layout as Grid and Turn on to show navigation header in the Appearances > Microsite settings
        authoring.configurations.visit.appearances()
        authoring.configurations.configureMicrositesAppearance({
            appearance: "micrositesAppearance.js",
            hideNavigation: false,
            layout: "Grid"
        }) 

        // Verify that landing page will have grid layout for blocks as applied above
        authoring.microsites.visit()
        authoring.microsites.goToMicrositeConfig(micrositeApp.name)
        authoring.microsites.removeLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.addLandingPages(gridCarouselLandingPage.name)
        authoring.microsites.configureLandingPage(gridCarouselLandingPage)
        authoring.microsites.goToPageEditor(gridCarouselLandingPage.name)
        cy.wait(1000) // need hard wait for landing page configurations to load from back-end. It's a blank page initially, so there is no UI indication when this is done.
        cy.contains(authoring.microsites.landingPages.trackRow, target.name).within(() => {
            cy.get(authoring.microsites.landingPages.carouselArrow).should("not.exist")
        })

        // verify on consumption that navigation header appears on top as applied above
        cy.visit(gridCarouselLandingPage.url)
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label, {timeout: 10000}).click()
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
        cy.contains(consumption.microsites.navigation.menuItem, navigation.recommend.label, {timeout: 10000}).click()
        cy.get(consumption.microsites.navigation.header, {timeout: 10000}).should("exist")
       
        //  Verify Header, Tracks and landing page appearence are inherited from microsite appearances
        cy.visit(gridCarouselLandingPage.url)
        
        // Check the header appearance settings 
        cy.get(consumption.microsites.navigation.header).should("have.css", "background-color", colorConfigToCSS(newAppearanceSetting.primaryColor)).within(()=>{  
            cy.contains('a', navigation.landingPage.label).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor))
            cy.contains('a', navigation.target.label).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor))
            cy.contains('a', navigation.recommend.label).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor))
        }) 
         
        //go to target track and verify appearance setting 
        cy.contains(consumption.microsites.navigation.menuItem, navigation.target.label).click()
        cy.get(consumption.target.flowActiveItem).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.primaryColor))        
        cy.get(consumption.target.flowHeaderShare).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.primaryColor))

        //go to Reccomend track and verify appearance setting
        cy.contains(consumption.microsites.navigation.menuItem, navigation.recommend.label).click()
        cy.get(consumption.recommend.sidebarTitle).should("have.css", "font-family", newAppearanceSetting.titleAppearanceFont).should("have.css", "color", colorConfigToCSS(newAppearanceSetting.titleAppearancecolor)) 
        cy.get(consumption.recommend.sidebarBackground).should("have.css", "background-color", colorConfigToCSS(newAppearanceSetting.primaryColor))             
    })    

})       

      