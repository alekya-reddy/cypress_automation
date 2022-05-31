import { CommonCX } from "./CommonCX";

export class ExploreCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.headerTitle = "#qa-header-title"
        this.exploreTitle= 'div[class="lx-content-title__container"]';
        this.hero = {
            heroTitle: ".lx-header-title__text",
            heroSubtitle: ".lx-header-subtitle__text",
            heroBackground: "#qa-explore-header-background",
            heroCTA: "#qa-cta-button-hero",
            brandImage: '#hero-brand-image',
            partnerImage: '#hero-partner-image',
            personalizedImage: '#hero-personalized-image',
            fixedHeroImage: '#qa-explore-header-background > div > img',
            fillHeroImage: '#qa-explore-header-background > div[class="lx-header__full_image"]',
            assetTitle: "[id*='qa-explore-asset-title-grid']"
        }

        this.body = {
            bodyTitle: ".lx-content-title__text",
            bodyDescription: ".lx-content-description__text",
            card: ".pf-explore-grid-container",
            topicFilterContainer: "#explore-topic-filter-container",
            topicSearchContainer: "#explore-topic-search-container",
            searchButton: 'div[class*="pf-explore-search-button"]',
            bodyCTA: '#qa-cta-button-body'
        }
        this.footer = {
            footerCTA: '#qa-cta-button-footer'
        }
        this.headerTitle = '#qa-header-title'

        this.youtube = {
            // Within are a bunch of useful youtube apis that I got from playing with the 'video' element in the dev console 
            iframe: 'iframe[title="YouTube video player"]',
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
    } 
            
    featuredContentGrid(i,j) {
        return `#qa-explore-asset-type-featured-grid-${i}-${j}` 
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

        cy.get(`#qa-explore-${filterName}-filter`).should('be.visible', { timeout: 10000 }).click()
        cy.wait(1000)
        indexes.forEach(index => {
            cy.get(`div span[role=listitem]:nth-of-type(${index})`+":visible", { timeout: 10000 }).invoke('text').then(text => {
                cy.get(`div span[role=listitem]:nth-of-type(${index})`+":visible", { timeout: 10000 }).invoke('text').as(`optionValue${index}`)
                cy.wait(1000)
                cy.get(`div span[role=listitem]:nth-of-type(${index})`+":visible", { timeout: 10000 }).click()
                cy.wait(1000)
            })
        })

        indexes.forEach(index => {
            cy.get(`@optionValue${index}`).then(optionValue => {
                var format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;

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
}