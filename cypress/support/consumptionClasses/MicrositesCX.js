import { CommonCX } from "./CommonCX";

export class MicrositesCX extends CommonCX {
    constructor(env, org, tld, baseUrl) {
        super(env, org, tld, baseUrl);
        this.grid = ".pf-microsite-grid";
        this.gridLayout = 'div[class*="pf-microsite-grid"]';
        this.gridCard = ".pf-microsite-card";
        this.cardTitle = ".pf-microsite-card-title";
        this.topicFilter = "#microsite_topics_0"
        this.contentTypeFilter = '#microsite_contentTypeName_0'
        this.funnelStageFilter = '#microsite_funnelStages_0'
        this.industryFilter = '#microsite_industries_0'
        this.personaFilter = '#microsite_personas_0'
        this.languageFilter = '#microsite_languages_0'
        this.businessUnitFilter = '#microsite_businessUnits_0'
        this.filterByValue = "li[class='p-multiselect-item'] > span > span > div"
        this.filterByValueExisting = "li[class='p-multiselect-item p-highlight'] > span > span > div"
        this.clearFilterValue = "#qa-microsite-topic-filter-clear-selected"
        this.searchInput = '#microsite_search_input_0'
        this.searchWithinFilterDropdown = "input[class='p-inputtext p-component p-multiselect-filter']"
        this.searchAndFiltersDDOptionText = "li.p-multiselect-item"
        this.arrowRight = "#qa-arrow-right-3"
        this.arrowLeft = "#qa-arrow-left";
        this.searchFilter = "#microsite_search_button_0";
        this.searchInputField = "#microsite_search_input_0";
        this.carouselArrow_color = "#qa-arrow-right-0";
        this.carouselArrow_bgColor = ".slick-next";
        this.noResultsMsg = "#pf-microsite>div>div>div:nth-child(3)";
        this.navigation = {
            header: ".pf-microsite-header",
            menuItem: ".rc-menu-item",
            menuWithSubmenu: ".rc-menu-submenu-title",
            cookieSettings: "#pf-microsite-cookie-consent-button",
            navHeaderLink: "div[class='rc-menu-submenu-title'] > a",
            navHeaderText: "div[class='rc-menu-submenu-title'] > div"
        };
        this.blocks = "[data-react-beautiful-dnd-draggable='0']"
        this.addBlockButtons = "button[class*='AddBlockButton']"
        this.searchButton = '#microsite_search_button_0'
        this.removeFilters = "div[class='chip'] > span"
        this.filterLabel = "div[class='chip']"
        this.filterValues = "div.p-connected-overlay-enter-done .p-multiselect-items.p-component li div[class*='sc']"
        this.youtube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            iframe: 'iframe[id*="lookbook-video-player"]',
            videoPlayer: 'video',
            play: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            audioMuteNotification:"div[id='video-tooltip']",
            playButton:"button[aria-label='Play (k)']",
            unmuteButton:"button[aria-label='Unmute (m)']",
            muteButton:"button[aria-label='Mute (m)']",
            pauseButton:"button[aria-label='Pause (k)']",
            settings:'[aria-label="Settings"]',
            menuContent:"div.ytp-menuitem-content"
        };

        this.vimeo = {
            // Playing around on the dev console on regular browser, I'm blocked from accessing iframe due to cross-frame issue. I'm amazed I can bypass that through Cypess
            iframe: 'iframe[src*="vimeo"]',
            videoPlayer: 'video',
            play: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            playButton: "[aria-label='Play']",
            volumeButtons: "[class='volume'] div",
            closeAudioNotification: "#video-tooltip-close-icon",
            audioMuteNotification: "div[id='video-tooltip']",
            captions:"[aria-label='Choose captions']",
            message:"[id='video-captions']"
        };
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
            cy.containsExact(filterLocator + " > div:nth-child(3) > div", overrideLabel).should("exist")
        }
        else {
            cy.containsExact(filterLocator + " > div:nth-child(3) > div", filterName).should("exist")
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
        cy.get(this.searchInputField).clear().type(searchTerm)
        cy.get(this.searchFilter).click()
    }

    addingBlock(block) {
        cy.get(this.blocks, { timeout: 10000 }).first().click({force:true})
        cy.get(this.addBlockButtons, { timeout: 10000 }).first().click({force:true})
        cy.contains("button", block, { timeout: 10000 }).should('be.visible').click({force:true})
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

    SelectFiltersAndVerifyAsQueryStringInURL(filterOptions) {
        const filterName = filterOptions.filtername;
        const indexes = filterOptions.index;
        const exists = filterOptions.exist;
        var listValues = []
        let values = "";
        let length = 0
        let arrayValues = [];
        let option
        let splittedValues = []

        cy.get(`#microsite_${filterName}_0`).should('be.visible', { timeout: 10000 }).click()
        cy.wait(1000)
        indexes.forEach(index => {
            cy.get(`.p-multiselect-panel .p-multiselect-items li:nth-child(${index}) span div`, { timeout: 10000 }).invoke('text').then(text => {
                cy.get(`.p-multiselect-panel .p-multiselect-items li:nth-child(${index}) span div`, { timeout: 10000 }).invoke('text').as(`optionValue${index}`)
                cy.wait(1000)
                cy.get(`.p-multiselect-panel .p-multiselect-items li:nth-child(${index}) span div`, { timeout: 10000 }).click()
                cy.wait(1000)
            })
        })

        indexes.forEach(index => {
            cy.get(`@optionValue${index}`).then(optionValue => {
                var format = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]+/;

                if (format.test(optionValue)) {
                    optionValue = optionValue.replace(/[^\w\s]/gi, '')
                }
                option = optionValue.toLowerCase();
                arrayValues = option.split(" ");
                length = arrayValues.length;
                if (length > 1) {
                    let i = 0;
                    arrayValues.forEach(value => {
                        if (i !== 0) {
                            splittedValues = values.split('')
                            if (splittedValues[splittedValues.length - 1].includes("-")) {
                                values = values + value
                            }
                            else {
                                values = values + "-" + value
                            }
                            i++;
                        }
                        else {
                            values = value;
                            i++;
                        }
                    })
                }
                else {
                    values = option;
                }
                listValues.push(values)
            }).then(() => {
                if (indexes.length === listValues.length) {
                    cy.log(listValues)
                    if (filterName === "topics" && exists === true) {
                        cy.url().should('include', `topic=${listValues}`)
                    }
                    else if (filterName === "topics" && exists === false) {
                        cy.url().should('not.include', `topic=${listValues}`)
                    }
                    if (filterName === "contentTypeName" && exists === true) {
                        cy.url().should('include', `contentType=${values}`)
                    }
                    else if (filterName === "contentTypeName" && exists === false) {
                        cy.url().should('not.include', `contentType=${listValues}`)
                    }
                    if (filterName === "funnelStages" && exists === true) {
                        cy.url().should('include', `funnelStage=${listValues}`)
                    }
                    else if (filterName === "funnelStages" && exists === false) {
                        cy.url().should('not.include', `funnelStage=${listValues}`)
                    }
                    if (filterName === "industries" && exists === true) {
                        cy.url().should('include', `industry=${listValues}`)
                    }
                    else if (filterName === "industries" && exists === false) {
                        cy.url().should('not.include', `industry=${listValues}`)
                    }
                    if (filterName === "personas" && exists === true) {
                        cy.url().should('include', `persona=${listValues}`)
                    }
                    else if (filterName === "personas" && exists === false) {
                        cy.url().should('not.include', `persona=${listValues}`)
                    }
                    if (filterName === "businessUnits" && exists === true) {
                        cy.url().should('include', `businessUnit=${listValues}`)
                    }
                    else if (filterName === "businessUnits" && exists === false) {
                        cy.url().should('not.include', `businessUnit=${listValues}`)
                    }
                    if (filterName === "languages" && exists === true) {
                        cy.url().should('include', `language=${listValues}`)
                    }
                    else if (filterName === "languages" && exists === false) {
                        cy.url().should('not.include', `language=${listValues}`)
                    }
                }
            })
        })
    }

    SelectFiltersAndVerifyAlphabeticalOrder(filterOptions) {
        let beforeSort = [];
        let afterSort = [];
        cy.get(`#microsite_${filterOptions.filtername}`).should('be.visible', { timeout: 10000 }).click()
        if (filterOptions.label != "Search") {
            cy.get(this.filterValues).then(listing => {
                const listingCount = Cypress.$(listing).length;
                if (listingCount > 0) {
                    cy.get(this.filterValues).each((listing, index) => {
                        beforeSort.length = 0
                        afterSort.length = 0
                        cy.get(listing).invoke('text').then(listValues => {
                            beforeSort[index] = listValues;
                        }).then(() => {
                            if (listingCount === index + 1) {
                                cy.log(beforeSort)
                                afterSort = beforeSort.sort()
                                cy.log(afterSort)
                                expect(beforeSort).to.equal(afterSort);
                            }
                        })
                    })
                }
            })
        }
    }

}