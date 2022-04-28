import { CommonCX } from "./CommonCX";

export class VexCX extends CommonCX {
    constructor(env, org, tld, baseUrl) {
        super(env, org, tld, baseUrl);
        this.eventHeroTitle = "h1[class^='pf-event-hero-title']";
        this.eventHeroSubtitle = "div[class^='pf-event-hero-subtitle']";
        this.eventContentTitle = ".pf-event-main-title";
        this.eventContentDescription = ".pf-event-main-description";
        this.zoomRootDiv = '#zmmtg-root';
        this.zoomIframe = "iframe[src^='/api/virtual_event_sessions']";
        this.sessionPageTitle = "div[class^='pf-event-session-title']";
        this.sessionCardTitle = "div[class^='pf-event-session-card-title']";
        this.firstNameInput = "#firstName"; // Should remove in future as this is now in CommonCX.js 
        this.lastNameInput = "#lastName";  // Should remove in future as this is now in CommonCX.js 
        this.emailInput = "#email";  // Should remove in future as this is now in CommonCX.js 
        this.meetingPWInput = "#meetingPassword";
        this.closeContentButton = "button[title='Close']";
        this.sessionGroup = ".pf-event-sessions";
        this.sessionListItem = ".pf-event-session-list-item";
        this.sessionSidebar = ".pf-event-session-sidebar";
        this.vexHeader = ".pf-event-header";
        this.vexHeaderPopupMenu = ".rc-menu-submenu-title";
        this.vexHeroContainer = ".pf-event-hero-container";
        this.vexEventContainer = ".pf-event-container";
        this.vexHeaderMenuNoPopup = ".rc-menu-submenu";
        this.vexHeaderMenuItem = ".pf-menu-item";
        this.supplementalContent = ".pf-event-session-supplemental-content-list";
        this.vexFormTitle = ".pf-event-hero-form-title";
        this.vexFormDescription = ".pf-event-hero-form-description";
        this.supplementalTitle = ".pf-event-session-content > div:nth-child(1)";
        this.filterByTopicValue = "li[class='p-multiselect-item']";
        this.sessionTime = ".css-1uk98e1";
        this.carouselArrow_color = "#qa-arrow-right";
        this.carouselArrow_bgColor = ".slick-next";
        this.sessionCard = ".pf-event-session-card";
        this.FilterByTopic = "#vex_topics";
        this.searchFilter = "#vex_search_button";
        this.searchInputField = "#vex_search_input";
        this.sessionDescriptionStyle = "#vex-session-description div:nth-child(2)";
        this.noResultsMsg = ".pf-event-sessions>div:nth-child(3)"
        this.checkbox = "div[class='p-checkbox-box']"
        this.topicFilter = "#vex_topics"
        this.availabilityFilter = '#vex_sessionTypes'
        this.funnelStageFilter = '#vex_funnelStages'
        this.industryFilter = '#vex_industries'
        this.personaFilter = '#vex_personas'
        this.businessUnitFilter = '#vex_businessUnits'
        this.languageFilter = '#vex_languages'
        this.searchInput = 'input[type="search"]'
        this.searchButton = '#vex_search_button'
        this.cancelFilterbox = 'button[class="p-multiselect-close p-link"]'
        this.filterSearchBox = '.p-multiselect-filter-container'
        this.filterBoxheader = '.p-multiselect-header'
        this.selectAllFilterCheckbox = '.p-checkbox-box'
        this.menuItem = ".rc-menu-item"
        this.cxheader = "div[class*='pf-event-header']"
        this.filterValues = "div.p-connected-overlay-enter-done .p-multiselect-items.p-component li div[class*='sc']"
        this.submitButton = "button[type='submit']"

        this.youtube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            iframe: 'iframe[title="YouTube video player"]',
            videoPlayer: 'video',
            play: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            audioMuteNotification: "div[id='video-tooltip']",
            playButton: "button[title='Play (k)']",
            unmuteButton: "[title='Unmute (m)']",
            settings: '[aria-label="Settings"]',
            menuContent: "div.ytp-menuitem-content",
            muteButton: "button[title='Mute (m)']",
            pauseButton: "button[aria-label='Pause (k)']"
        };
        this.simuliveVideo = {
            vexCustomControl: 'div[class*="vex-session-custom-controls"]',
            pause: '#vex-simulive-play-pause',
            volume: '#vex-simulive-volume',
            liveStatus: '#vex-simulive-live-status',
            videoProgressBar: '#vex-simulive-seek-container',
            fullScreenMode: '#vex-simulive-full-screen'
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
        };
        this.vidyard = {
            iframe: 'iframe[class*="vidyard-iframe"]',
            videoPlayer: 'video',
            splashScreen: '[class^="splash-screen-thumbnail"]',
            play: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'play()') },
            pause: function () { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'currentTime', undefined, state) },
            paused: function (state) { cy.invokeWithinFrame(this.iframe, this.videoPlayer, 'paused', undefined, state) },
            clickSplashScreen: function () { cy.invokeWithinFrame(this.iframe, this.splashScreen, 'click()') }
        };
        this.wistia = {
            // Wistia doesn't need an iframe, which is nice...
            videoPlayer: 'video',
            play: function () { cy.invokeJS(this.videoPlayer, 'play()') },
            pause: function () { cy.invokeJS(this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeJS(this.videoPlayer, 'currentTime', state) },
            paused: function (state) { cy.invokeJS(this.videoPlayer, 'paused', state) },
            unmuteButton: '[title="Unmute"]',
            playButton: '[title="Play Video"]',
            muteButton: '[title="Mute"]',
            pauseButton: '[title="Pause"]',
            video: "[class*='w-video-wrappe']",
            audioMuteNotification: "div[id='video-tooltip']",
        };
        this.brightcove = {
            videoPlayer: 'video',
            play: function () { cy.invokeJS(this.videoPlayer, 'play()') },
            pause: function () { cy.invokeJS(this.videoPlayer, 'pause()') },
            getCurrentTime: function (state) { cy.invokeJS(this.videoPlayer, 'currentTime', state) },
            paused: function (state) { cy.invokeJS(this.videoPlayer, 'paused', state) },
            unmuteButton: '[title="Unmute"]',
            playButton: '[title="Play Video"]',
            muteButton: '[title="Mute"]',
            pauseButton: '[title="Pause"]',
            video: "[class*='video-js']",
            audioMuteNotification: "div[id='video-tooltip']",
        };

        this.zoom = {
            iframe: "iframe[src*='/api/virtual_event_sessions/']",
            container: '#zmmtg-root'
        };
        this.webex = {
            iframe: "iframe[src^='/api/virtual_event_sessions/']",
            video: "video",
            meetingControls: ".meeting-controls",
            meetingInfo: ".meeting-info"
        }
        this.rocketChat = {
            iframe: ".pf-event-session-widgets-frame",
            container: "#rocket-chat",
            messageInput: "textarea[name='msg']",
            moderatorViewButton: "button:contains('Open Moderator View')"
        };
        this.limelight = {
            videoPlayer: 'video',
            selectVideo: "div[class^='pf-event-session-card-title']",
            play1: "button[class='vjs-limelight-big-play']",
            pause: "button[title='Pause']",
            play2: "button[title='Play']",
            unmuteButton: '[title="Unmute"]',
            muteButton: '[title="Mute"]',
            audioMuteNotification: "div[id='video-tooltip']",
        };
        this.parmonic = {
            selectVideo: "div[class^='pf-event-session-card-title']",
            playButton: 'rect[class="shaka-play-button-color"]',
            playAndpauseButton: "div:nth-of-type(1) > .bottom-icon"
        }
        this.widget = {
            iframe: "iframe[id^='vex_widget_iframe']",
            widgetContainer: ".p-tabview-nav"
        };
        this.landingPage = {
            block: ".pf-html-block",
            arrowRight: "#qa-arrow-right",
        };
        this.messages = {
            maxAttendeesReached: "Unfortunately you are unable to join this session as the maximum number of attendees has been reached.",
            blacklistMessage: "You are no longer eligible to access this event. Please contact your event administrator for more information",
            blacklisted: "You are not eligible to access this event. Please contact your event administrator for more information."
        };
    }

    expectZoom() {
        cy.waitForIframeToLoad(this.zoom.iframe, this.zoom.container, 20000)
        cy.getIframeBody(this.zoom.iframe).within(() => {
            cy.get(this.zoom.container).should('exist')
        })
    }

    expectYoutube() {
        let flag = false;
        cy.waitForIframeToLoad(this.youtube.iframe, this.youtube.videoPlayer, 20000)
        cy.getIframeBody(this.youtube.iframe).within(() => {
            cy.get(this.youtube.videoPlayer).should('exist')
            cy.get(this.youtube.videoPlayer).should('exist').click()
            cy.get("div.ytp-chrome-bottom").then(controllers => {
                if (controllers.find(this.youtube.unmuteButton).length > 0) {
                    flag = true;
                }
            })
        }).then(() => {
            if (flag === true) {
                cy.getIframeBody(this.youtube.iframe).within(() => {
                    cy.get("div.ytp-chrome-bottom").then(controllers => {
                        cy.get(this.youtube.videoPlayer).should('exist').trigger('mouseover')
                        cy.get(this.youtube.playButton).should('be.visible', { timeout: 10000 }).click({ force: true })
                    })
                })
                cy.get(this.youtube.audioMuteNotification).should('be.visible')
                cy.getIframeBody(this.youtube.iframe).within(() => {
                    cy.get("div.ytp-chrome-bottom").then(controllers => {
                        cy.get(this.youtube.videoPlayer).should('exist').trigger('mouseover')
                        cy.get(this.youtube.unmuteButton).should('be.visible', { timeout: 10000 }).click({ force: true })
                    })
                })
                cy.get(this.youtube.audioMuteNotification, { timeout: 20000 }).should('not.be.visible')
            }
            else {
                cy.get(this.youtube.audioMuteNotification).should('not.be.visible')
                cy.getIframeBody(this.youtube.iframe).within(() => {
                    cy.get("div.ytp-chrome-bottom").then(controllers => {
                        cy.get(this.youtube.videoPlayer).should('exist').trigger('mouseover')
                        if (controllers.find(this.youtube.unmuteButton).length > 0) {
                        }
                        else
                            cy.get(this.youtube.muteButton).should('be.visible', { timeout: 10000 }).click({ force: true })
                        cy.get(this.youtube.playButton).should('be.visible', { timeout: 10000 }).click({ force: true })
                    })
                })
                cy.get(this.youtube.audioMuteNotification).should('be.visible')
            }
        })

    }

    expectSimulive() {
        cy.get(this.simuliveVideo.vexCustomControl).within(() => {
            cy.get(this.simuliveVideo.pause).should('exist')
            cy.get(this.simuliveVideo.volume).should('exist')
            cy.get(this.simuliveVideo.liveStatus).should('exist')
            cy.get(this.simuliveVideo.videoProgressBar).should('exist')
            cy.get(this.simuliveVideo.fullScreenMode).should('exist')
        })
    }

    expectVimeo() {
        cy.waitForIframeToLoad(this.vimeo.iframe, this.vimeo.videoPlayer, 20000)
        cy.getIframeBody(this.vimeo.iframe).within(() => {
            cy.wait(2000)
            cy.get(this.vimeo.videoPlayer).should('exist')
            cy.get("[class*='vp-shade vp-shade-invisible']").click({ force: true })
            cy.wait(2000)
            cy.get("[class='volume'] div").eq(0).click('bottomLeft')
            cy.get(this.vimeo.playButton).click()
        })
        cy.get(this.youtube.audioMuteNotification).should('be.visible')
        cy.getIframeBody(this.vimeo.iframe).within(() => {
            cy.wait(2000)
            cy.get(this.vimeo.videoPlayer).should('exist')
            cy.get("[class*='vp-shade vp-shade-invisible']").click({ force: true })
            cy.wait(2000)
            cy.get("[class='volume'] div").eq(0).click()
            cy.get(this.vimeo.playButton).click()
        })
        cy.get(this.vimeo.closeAudioNotification).click()
        cy.get(this.vimeo.audioMuteNotification, { timeout: 20000 }).should('not.be.visible')
    }

    expectVidyard() {
        cy.waitForIframeToLoad(this.vidyard.iframe, this.vidyard.videoPlayer, 20000)
        cy.getIframeBody(this.vidyard.iframe).within(() => {
            cy.get(this.vidyard.videoPlayer).should('exist')
        })
    }

    expectRocketChat() {
        cy.waitForIframeToLoad(this.rocketChat.iframe, this.rocketChat.container, 20000)
        cy.getIframeBody(this.rocketChat.iframe).within(() => {
            cy.get(this.rocketChat.container).should('exist')
        })
    }

    expectWebex(link) {
        cy.waitForIframeToLoad(this.webex.iframe, this.webex.meetingControls, 20000)
        cy.getIframeBody(this.webex.iframe).within(() => {
            cy.get(this.webex.video, { timeout: 30000 }).should('exist')
            cy.get(this.webex.meetingControls, { timeout: 10000 }).should('exist')
            link ? cy.contains(this.webex.meetingInfo, link, { timeout: 10000 }).should('exist') : null
        })
    }

    expectWistia() {
        cy.wait(2000)
        cy.get(this.wistia.videoPlayer).should('exist')
        cy.get(this.wistia.video).should('exist').click({ force: true })
        cy.get(this.wistia.video).rightclick({ force: true })
        cy.contains("Copy link and thumbnail").click()
        cy.get(this.wistia.pauseButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.wistia.muteButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.wistia.playButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.wistia.audioMuteNotification).should('be.visible')
        cy.get(this.wistia.unmuteButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.wistia.audioMuteNotification, { timeout: 20000 }).should('not.be.visible')
    }

    expectBrightcove() {
        cy.wait(2000)
        cy.get(this.brightcove.videoPlayer).should('exist')
        cy.get(this.brightcove.video).should('exist').click({ force: true })
        cy.get(this.brightcove.video).rightclick({ force: true })
        cy.get(this.brightcove.pauseButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.brightcove.muteButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.brightcove.playButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.brightcove.audioMuteNotification).should('be.visible')
        cy.get(this.brightcove.unmuteButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.brightcove.audioMuteNotification, { timeout: 20000 }).should('not.be.visible')
    }

    expectLimelight() {
        cy.wait(2000)
        cy.get(this.limelight.videoPlayer).should('exist')
        cy.get(this.limelight.play1).should('exist').click({ force: true })
        cy.get(this.limelight.muteButton, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.limelight.play2, { timeout: 10000 }).should('exist').click({ force: true })
        cy.get(this.limelight.audioMuteNotification).should('be.visible')
        cy.get(this.vimeo.closeAudioNotification).click()
        cy.get(this.vimeo.audioMuteNotification, { timeout: 20000 }).should('not.be.visible')
    }

    chat(config) {
        const message = config.message
        const user = config.user

        cy.waitForIframeToLoad(this.rocketChat.iframe, this.rocketChat.messageInput, 20000)
        cy.getIframeBody(this.rocketChat.iframe).within(() => {
            cy.get(this.rocketChat.container).should('exist')
            cy.get(this.rocketChat.messageInput).type(`${message}\n`)
            cy.contains(message).should('exist')
            cy.contains(user).should("exist")
        })
    }

    verifyLandingPageBlock(config) {
        // This should be the same config object as the one passed into authoring method 'addAdvancedBlock'
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options color, textAlign // color: {r, g, b} is the only format that will be checked - hex not checked 
        const className = config.className // Required to locate html block
        const sessionGroup = config.sessionGroup
        const expectSessions = config.expectSessions
        const expectNoSessions = config.expectNoSessions
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units, recommend using only pixels 
        const card = config.card
        const topicFilter = config.topicFilter
        const availabilityFilter = config.availabilityFilter
        const funnelStageFilter = config.funnelStageFilter
        const industryFilter = config.industryFilter
        const personaFilter = config.personaFilter
        const businessUnitFilter = config.businessUnitFilter
        const languageFilter = config.languageFilter
        const searchConfiguration = config.searchConfiguration
        const layout = config.layout

        if (className && !sessionGroup) {
            let locator = `.${className}`
            cy.get(locator).invoke("attr", "style").then((style) => {
                if (typography && typography.textAlign) {
                    expect(style).to.include(`text-align: ${typography.textAlign}`)
                }
                if (typography && typography.color && !typography.color.hex) {
                    expect(style).to.include(`color: rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
                }
                if (typography && typography.fontSize) {
                    expect(style).to.include(`font-size: ${typography.fontSize}`)
                }
                if (background && background.color && !background.color.hex) {
                    expect(style).to.include(`background-color: rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
                }
                if (background && background.image.url) {
                    expect(style).to.include(background.image.url)
                }
                if (background && background.position) {
                    expect(style).to.include(`background-position: center ${background.position}`)
                }
                if (background && background.size) {
                    expect(style).to.include(`background-size: ${background.size}`)
                }
                if (spacing) {
                    expect(style).to.include(`padding: ${spacing}`)
                }
            })
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

        if (sessionGroup) { // session group blocks have to be checked entirely different way
            let blockLocator = this.sessionGroup
            cy.contains(blockLocator, sessionGroup).should("exist")
            if (heading) {
                cy.contains(blockLocator, sessionGroup).within(() => {
                    if (heading.color && !heading.color.hex) {
                        cy.get("h2").should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                    }
                    if (heading.textAlign) {
                        cy.get("h2").should("have.css", 'text-align', heading.textAlign)
                    }
                })
            }
            if (expectSessions) {
                expectSessions.forEach((session) => {
                    cy.contains(this.sessionCardTitle, session).should('exist')
                })
            }
            if (expectNoSessions) {
                expectNoSessions.forEach((session) => {
                    cy.contains(this.sessionCardTitle, session).should("not.exist")
                })
            }
            if (background && background.color && !background.color.hex) {
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if (background && background.image.url) {
                cy.contains(blockLocator, sessionGroup).invoke("css", "background-image").should("contain", background.image.url)
            }
            if (background && background.position) {
                let positionTranslator = { top: "0%", center: "50%", bottom: "100%" }
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if (background && background.size) {
                cy.contains(blockLocator, sessionGroup).should("have.css", "background-size", background.size)
            }
            if (spacing) {
                cy.contains(blockLocator, sessionGroup).should("have.css", "padding", spacing)
            }
            if (card) {
                const { color, textAlign, fontSize } = card
                if (color) {
                    cy.contains(blockLocator, sessionGroup).within(() => {
                        cy.get(this.sessionCardTitle + "> div:nth-child(1)").should("have.css", "color", `rgb(${color.r}, ${color.g}, ${color.b})`)
                    })
                }
                if (textAlign) {
                    cy.get(this.sessionCardTitle + "> div:nth-child(1)").should("have.css", "text-align", textAlign)
                }
                if (fontSize) {
                    cy.get(this.sessionCardTitle + "> div:nth-child(1)").should("have.css", "font-size", fontSize)
                }
            }
            if (layout) {
                cy.contains(blockLocator, sessionGroup).within(() => {
                    const existOrNot = layout == "Carousel" ? "exist" : "not.exist"
                    cy.get(this.landingPage.arrowRight).should(existOrNot)
                })
            }
            cy.contains(blockLocator, sessionGroup).within(() => {
                if (topicFilter) {
                    this.verifyFilterConfiguration("Topic Filter", this.topicFilter, topicFilter)
                }
                if (availabilityFilter) {
                    this.verifyFilterConfiguration("Availability Type", this.availabilityFilter, availabilityFilter)
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
                if (languageFilter) {
                    this.verifyFilterConfiguration("Language", this.languageFilter, languageFilter)
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
            })
        }


    }

    verifyFilterConfiguration(filterName, filterLocator, filterSettings) {
        const { overrideLabel, textColor, backgroundColor } = filterSettings
        if (overrideLabel) {
            cy.containsExact(filterLocator, overrideLabel).should("exist")
        }
        else {
            cy.containsExact(filterLocator, filterName).should("exist")
        }
        if (textColor) {
            cy.get(filterLocator).should("have.css", "color", `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`)
        }
        if (backgroundColor) {
            cy.get(filterLocator).should("have.css", "background-color", `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`)
        }
    }

    searchSessionGroup(searchTerm) {
        // Must be within session group block before using this function
        cy.get(this.searchInputField).clear().type(searchTerm)
        cy.contains("button", "Search").click()
    }

    SelectFiltersAndVerifyAsQueryStringInURL(filterOptions) {
        const search = filterOptions.searchField
        const filterName = filterOptions.filtername;
        const indexes = filterOptions.index;
        const exists = filterOptions.exist;
        var listValues = []
        let values = "";
        let length = 0
        let arrayValues = [];
        let option
        let splittedValues = []

        cy.get(`#vex_${filterName}`).should('be.visible', { timeout: 10000 }).click()
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
                    if (filterName === "topics" && exists === true) {
                        cy.url().should('include', `topic=${listValues}`)
                    }
                    else if (filterName === "topics" && exists === false) {
                        cy.url().should('not.include', `topic=${listValues}`)
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
                    if (filterName === "sessionTypes" && exists === true) {
                        cy.url().should('include', `availability=${listValues}`)
                    }
                    else if (filterName === "sessionTypes" && exists === false) {
                        cy.url().should('not.include', `availability=${listValues}`)
                    }
                }
            })
        })
    }

    SelectFiltersAndVerifyAlphabeticalOrder(filterOptions) {
        let beforeSort = [];
        let afterSort = [];
        cy.get(`#vex_${filterOptions.filtername}`).should('be.visible', { timeout: 10000 }).click()
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
                                afterSort = beforeSort.sort()
                                expect(beforeSort).to.equal(afterSort);
                            }
                        })
                    })
                }
            })
        }
    }

    SearchTextAndVerifyAsQueryStringInURL(options) {
        const search = options.searchField
        const exists = options.exist
        cy.get(this.searchInput).clear().type(search);
        cy.get(this.searchButton).click()
        if (exists === true) {
            cy.url().should('include', `search=${search}`)
        }
        else {
            cy.url().should('not.include', `search=${search}`)
        }
    }


}