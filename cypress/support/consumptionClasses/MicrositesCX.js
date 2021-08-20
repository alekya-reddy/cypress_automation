import { CommonCX } from "./CommonCX";

export class MicrositesCX extends CommonCX {
    constructor(env, org, tld, baseUrl) {
        super(env, org, tld, baseUrl);
        this.grid = ".pf-microsite-grid";
        this.gridCard = ".pf-microsite-card";
        this.cardTitle = ".pf-microsite-card-title";
        this.topicFilter = "#microsite_topics"
        this.contentTypeFilter = '#microsite_contentTypeName'
        this.funnelStageFilter = '#microsite_funnelStages'
        this.industryFilter = '#microsite_industries'
        this.personaFilter = '#microsite_personas'
        this.businessUnitFilter = '#microsite_businessUnits'
        this.filterByValue = "li[class='p-multiselect-item'] > span > span > div"
        this.languageFilter = "#microsite_languages"
        this.filterByValueExisting = "li[class='p-multiselect-item p-highlight'] > span > span > div"                              
        this.clearFilterValue = "#qa-microsite-topic-filter-clear-selected"
        this.searchInput = 'input[type="search"]'
        this.searchWithinFilterDropdown="input[class='p-inputtext p-component p-multiselect-filter']"
        this.searchAndFiltersDDOptionText="div[class='sc-jToBAC edUesx']"
        this.arrowRight = "#qa-arrow-right"
        this.arrowLeft = "#qa-arrow-left";
        this.FilterByTopic = "#microsite_topics";
        this.searchFilter = "#microsite_search_button";
        this.searchInputField = "#microsite_search_input";
        this.carouselArrow_color = "#qa-arrow-right";
        this.carouselArrow_bgColor = ".slick-next";
        this.noResultsMsg = "#pf-microsite>div>div>div:nth-child(3)";
        this.navigation = {
            header: ".pf-microsite-header",
            menuItem: ".rc-menu-item",
            menuWithSubmenu: ".rc-menu-submenu-title",
            cookieSettings: "#pf-microsite-cookie-consent-button"
        };
        this.blocks = "[data-react-beautiful-dnd-draggable='0']"
        this.addBlockButtons = "button[class*='AddBlockButton']"
        this.searchButton='#microsite_search_button'
        this.searchInput='#microsite_search_input'
        this.removeFilters="div[class='chip'] > span"
        this.filterLabel="div[class='chip']"
    }

    clickContent(options) {
        const { track, content } = options

        cy.contains("h4", track).siblings(this.grid).within(() => {
            cy.contains(this.gridCard, content).click()
        })
    }

    verifyFilterConfiguration(filterName, filterLocator, filterSettings) {
        const { overrideLabel, textColor, backgroundColor } = filterSettings
        if (overrideLabel) {
            cy.containsExact(filterLocator + " > span:nth-child(1)", overrideLabel).should("exist")
        }
        else {
            cy.containsExact(filterLocator + " > span:nth-child(1)", filterName).should("exist")
        }
        if (textColor) {
            cy.get(filterLocator).should("have.css", "color", `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`)
        }
        if (backgroundColor) {
            cy.get(filterLocator).should("have.css", "background-color", `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`)
        }
    }

    verifyLandingPageBlock(config) {
        // This should be the same config object as the one passed into authoring method 'addAdvancedBlock'
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options color, textAlign // color: {r, g, b} is the only format that will be checked - hex not checked 
        const className = config.className // Required to locate html block
        const type = config.type
        const track = config.track
        const name = config.name
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
        const contents = config.contents
        const layout = config.layout

        if (className && !track) {
            let locator = `.${className}`

            if (typography && typography.textAlign) {
                cy.get(locator).should("have.css", "text-align", typography.textAlign)
            }
            if (typography && typography.color && !typography.color.hex) {
                cy.get(locator).should("have.css", "color", `rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
            }
            if (typography && typography.fontSize) {
                cy.get(locator).should("have.css", "font-size", typography.fontSize)
            }
            if (background && background.color && !background.color.hex) {
                cy.get(locator).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if (background && background.image.url) {
                cy.get(locator).invoke("css", "background-image").should("contain", background.image.url)
            }
            if (background && background.position) {
                let positionTranslator = { top: "0%", center: "50%", bottom: "100%" }
                cy.get(locator).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if (background && background.size) {
                cy.get(locator).should("have.css", "background-size", background.size)
            }
            if (spacing) {
                cy.get(locator).should("have.css", "padding", spacing)
            }
            if (checkContent && checkContent.text) {
                checkContent.text.forEach((text) => {
                    cy.contains(locator, text).should("exist")
                })
            }
            if (checkContent && checkContent.locators) {
                checkContent.locators.forEach((checkLocator) => {
                    cy.get(locator).within(() => {
                        cy.get(checkLocator).should("exist")
                    })
                })
            }
        }

        if (type == "track" || type == "featured") {
            const trackName = titleOverride || track || name
            cy.wait(5000)
            cy.contains("h4", trackName, { timeout: 10000 }).should("exist")

            if (heading) {
                if (heading.color && !heading.color.hex) {
                    cy.containsExact("h4", trackName).should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                }
                if (heading.textAlign) {
                    cy.containsExact("h4", trackName).should("have.css", 'text-align', heading.textAlign)
                }
            }
            if (expectContents) {
                expectContents.forEach((content) => {
                    cy.containsExact("h4", trackName).parent().within(() => {
                        cy.contains(this.gridCard, content).should('exist')
                    })
                })
            }
            if (background && background.color && !background.color.hex) {
                cy.containsExact("h4", trackName).parent().should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if (background && background.image.url) {
                cy.containsExact("h4", trackName).parent().invoke("css", "background-image").should("contain", background.image.url)
            }
            if (background && background.position) {
                let positionTranslator = { top: "0%", center: "50%", bottom: "100%" }
                cy.containsExact("h4", trackName).parent().should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if (background && background.size) {
                cy.containsExact("h4", trackName).parent().should("have.css", "background-size", background.size)
            }
            if (spacing) {
                cy.containsExact("h4", trackName).parent().should("have.css", "padding", spacing)
            }
            if (card) {
                const { color, textAlign, fontSize } = card
                if (color) {
                    cy.containsExact("h4", trackName).parent().within(() => {
                        cy.get(this.cardTitle + "> div:nth-child(1)").should("have.css", "color", `rgb(${color.r}, ${color.g}, ${color.b})`)
                    })
                }
                if (textAlign) {
                    cy.get(this.cardTitle + "> div:nth-child(1)").should("have.css", "text-align", textAlign)
                }
                if (fontSize) {
                    cy.get(this.cardTitle + "> div:nth-child(1)").should("have.css", "font-size", fontSize)
                }
            }
            cy.containsExact("h4", trackName).parent().within(() => {
                if (topicFilter) {
                    this.verifyFilterConfiguration("Topic Filter", this.topicFilter, topicFilter)
                }
                if (contentTypeFilter) {
                    this.verifyFilterConfiguration("Content Type", this.contentTypeFilter, contentTypeFilter)
                }
                if (funnelStageFilter) {
                    this.verifyFilterConfiguration("Funnel Stage", this.funnelStageFilter, funnelStageFilter)
                }
                if (industryFilter) {
                    this.verifyFilterConfiguration("Industry", this.industryFilter, industryFilter)
                }
                if (personaFilter) {
                    this.verifyFilterConfiguration("Persona", this.personaFilter, personaFilter)
                }
                if (businessUnitFilter) {
                    this.verifyFilterConfiguration("Business Unit", this.businessUnitFilter, businessUnitFilter)
                }
                if (searchConfiguration) {
                    const { searchButtonTitle, buttonTextColor, inputTextColor, buttonBackgroundAndBorderColor } = searchConfiguration
                    const searchButtonText = searchButtonTitle || "Search"

                    cy.contains("button", searchButtonText).should("exist")

                    if (buttonTextColor) {
                        cy.contains("button", searchButtonText).should("have.css", "color", `rgb(${buttonTextColor.r}, ${buttonTextColor.g}, ${buttonTextColor.b})`)
                    }

                    if (buttonBackgroundAndBorderColor) {
                        cy.contains("button", searchButtonText).should("have.css", "background-color", `rgb(${buttonBackgroundAndBorderColor.r}, ${buttonBackgroundAndBorderColor.g}, ${buttonBackgroundAndBorderColor.b})`)
                        cy.get(this.searchInput).should("have.css", "border-color", `rgb(${buttonBackgroundAndBorderColor.r}, ${buttonBackgroundAndBorderColor.g}, ${buttonBackgroundAndBorderColor.b})`)
                    }

                    if (inputTextColor) {
                        cy.get(this.searchInput).should("have.css", "color", `rgb(${inputTextColor.r}, ${inputTextColor.g}, ${inputTextColor.b})`)
                    }
                }

                if (contents) {
                    contents.forEach(content => {
                        cy.contains(this.cardTitle, content.name).should("exist")
                    })
                }

                if (layout) {
                    const existOrNot = layout == "Carousel" ? "exist" : "not.exist"
                    cy.get(this.arrowRight).should(existOrNot)
                }
            })
        }
    }
    searchMicrositeCard(searchTerm) {
        // Must be within session group block before using this function
        cy.get(this.searchInput).clear().type(searchTerm)
        cy.get(this.searchFilter).click()
    }

    addingBlock(block) {
        cy.get(this.blocks, { timeout: 10000 }).first().click()
        cy.get(this.addBlockButtons, { timeout: 10000 }).first().click()
        cy.contains("button", block, { timeout: 10000 }).should('be.visible').click()
    }

    verifySearchAndFiltersAvailibility(options) {
        options.forEach(option => {
            if (option.toggle) {
                if (option.label != "Search") {
                    cy.contains("option", "Filter by " + option.label, { timeout: 10000 }).should('be.visible')
                }
                if (option.label == "Search") {
                    cy.get("input[placeholder='Search']", { timeout: 10000 }).should('be.visible')
                    cy.contains("button", "Search", { timeout: 10000 }).should('be.visible')
                }
            }
        })
    }
}