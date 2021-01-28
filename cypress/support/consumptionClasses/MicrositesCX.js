import { CommonCX } from "./CommonCX";

export class MicrositesCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.grid = ".pf-microsite-grid";
        this.gridCard = ".pf-microsite-card";
        this.cardTitle = ".pf-microsite-card-title";
        this.topicFilterLocator = "#dropdowntopics"
        this.contentTypeFilterLocator = '#dropdowncontentTypeName'
        this.funnelStageFilterLocator = '#dropdownfunnelStages'
        this.industryFilterLocator = '#dropdownindustries'
        this.personaFilterLocator = '#dropdownpersonas'
        this.businessUnitFilterLocator = '#dropdownbusinessUnits'
        this.filterByValue = '#qa-microsite-topic-filter-topic > span'
        this.micrositeCardTitle = "div[class^='pf-microsite-card-title']"
        this.navigation = {
            header: ".pf-microsite-header",
            menuItem: ".rc-menu-item",
            menuWithSubmenu: ".rc-menu-submenu-title",
            cookieSettings: "#pf-microsite-cookie-consent-button"
        };
    }

    clickContent(options){
        const { track, content } = options

        cy.contains("h4", track).siblings(this.grid).within(() => {
            cy.contains(this.gridCard, content).click()
        })
    }
    verifyFilterConfiguration(filterName, filterLocator, filterSettings){
        const { overrideLabel, textColor, backgroundColor} = filterSettings
        if(overrideLabel){
            cy.containsExact(filterLocator + " > span:nth-child(1)", overrideLabel).should("exist")
        }
        else{
            cy.containsExact(filterLocator + " > span:nth-child(1)", filterName).should("exist")
        }
        if(textColor){
            cy.get(filterLocator).should("have.css", "color", `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`)
        }
        if(backgroundColor){
            cy.get(filterLocator).should("have.css", "background-color", `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`)
        }
    }

    verifyLandingPageBlock(config){
        // This should be the same config object as the one passed into authoring method 'addAdvancedBlock'
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options color, textAlign // color: {r, g, b} is the only format that will be checked - hex not checked 
        const className = config.className // Required to locate html block
        const track = config.track
        const titleOverride = config.titleOverride
        const expectContents = config.expectContents
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units, recommend using only pixels 
        const topicFilter = config.topicFilter
        const contentTypeFilter = config.contentTypeFilter
        const funnelStageFilter = config.funnelStageFilter
        const industryFilter = config.industryFilter
        const personaFilter = config.personaFilter
        const businessUnitFilter = config.businessUnitFilter
        const card = config.card
        const searchConfiguration = config.searchConfiguration

        if(className && !track){
            let locator = `.${className}`

            if(typography && typography.textAlign){
                cy.get(locator).should("have.css", "text-align", typography.textAlign)
            }
            if(typography && typography.color && !typography.color.hex){
                cy.get(locator).should("have.css", "color", `rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
            }
            if(typography && typography.fontSize){
                cy.get(locator).should("have.css", "font-size", typography.fontSize)
            }
            if(background && background.color && !background.color.hex){
                cy.get(locator).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.get(locator).invoke("css", "background-image").should("contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.get(locator).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.get(locator).should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.get(locator).should("have.css", "padding", spacing)
            }
            if(checkContent && checkContent.text){
                checkContent.text.forEach((text)=>{
                    cy.contains(locator, text).should("exist")
                })
            }
            if(checkContent && checkContent.locators){
                checkContent.locators.forEach((checkLocator)=>{
                    cy.get(locator).within(()=>{
                        cy.get(checkLocator).should("exist")
                    })
                })
            }
        }
        
        if(track){ 
            const trackName = titleOverride ? titleOverride : track
            cy.containsExact("h4", trackName, {timeout: 10000}).should("exist")

            if(heading){
                if(heading.color && !heading.color.hex){
                    cy.containsExact("h4", trackName).should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                }
                if(heading.textAlign){
                    cy.containsExact("h4", trackName).should("have.css", 'text-align', heading.textAlign)
                }
            }
            if(expectContents){
                expectContents.forEach((content)=>{
                    cy.containsExact("h4", trackName).siblings(this.grid).within(() => {
                        cy.contains(this.gridCard, content).should('exist')
                    })
                })
            }
            if(background && background.color && !background.color.hex){
                cy.containsExact("h4", trackName).parent().should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.containsExact("h4", trackName).parent().invoke("css", "background-image").should("contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.containsExact("h4", trackName).parent().should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.containsExact("h4", trackName).parent().should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.containsExact("h4", trackName).parent().should("have.css", "padding", spacing)
            }
            if(card){
                const { color, textAlign, fontSize} = card
                if(color){
                    cy.containsExact("h4", trackName).parent().within(() => {
                        cy.get(this.cardTitle + "> div:nth-child(1)").should("have.css", "color", `rgb(${color.r}, ${color.g}, ${color.b})`)
                    })
                }
                if(textAlign){
                    cy.get(this.cardTitle + "> div:nth-child(1)").should("have.css", "text-align", textAlign)
                }
                if(fontSize){
                    cy.get(this.cardTitle + "> div:nth-child(1)").should("have.css", "font-size", fontSize)
                }
            }

        }
        if(topicFilter) {
            this.verifyFilterConfiguration("Topic Filter", this.topicFilterLocator, topicFilter)
        }
        if(contentTypeFilter) {
            this.verifyFilterConfiguration("Content Type", this.contentTypeFilterLocator, contentTypeFilter)
        }
        if(funnelStageFilter) {
            this.verifyFilterConfiguration("Funnel Stage", this.funnelStageFilterLocator, funnelStageFilter)
        }
        if(industryFilter) {
            this.verifyFilterConfiguration("Industry", this.industryFilterLocator, industryFilter)
        }
        if(personaFilter) {
            this.verifyFilterConfiguration("Persona", this.personaFilterLocator, personaFilter)
        }
        if(businessUnitFilter) {
            this.verifyFilterConfiguration("Business Unit", this.businessUnitFilterLocator, businessUnitFilter)
        }
        if(searchConfiguration) {
            const { textColor, backgroundColor } = searchConfiguration
            // Text color doesn't work yet
            // if(textColor){
            //     cy.contains("button", "Search").should("have.css", "color", `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`)
            // }
            if(backgroundColor){
                cy.contains("button", "Search").should("have.css", "background-color", `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`)
            }
        }
    }
    searchMicrositeCard(searchTerm){
        // Must be within session group block before using this function
        cy.get("input").clear().type(searchTerm)
        cy.contains("button", "Search").click()
    }
}