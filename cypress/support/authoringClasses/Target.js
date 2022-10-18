import { Common } from "./Common";

export class Target extends Common {
    constructor(env, org, tld, userName, password, baseUrl) {
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/target`;
        this.pageTitle = "Target Tracks";
        this.targetAnalyticsTitle = "Target Analytics Overview";
        this.targetAnalytics = "a[id='TrackAnalyticsLink']";
        this.analyticsActivities = 'div[data-qa-hook="visitor-activities-card"]';
        this.deleteTrackIcon = "i[class*='delete Icon']";
        this.shareUrl = 'i[title="Share URL"]';
        this.thumbnailSelect = 'i[title="Select a thumbnail"]';
        this.cloneTrack = 'i[title="Clone Track"]';
        this.addFolder = "button:contains('Add Folder')"
        this.editFolder = 'i[title="Edit Folder"]';
        this.deleteFolder = 'i[title="Delete Folder"]';
        this.editTrackInsideTrack = 'i[title="Edit Track"]'
        this.editTrack = 'i[class*="edit-for"]';
        this.pageContents = "div[draggable='true'] strong"
        this.addContentTo = 'input[name="addContentTo"]'
        this.contentClick = "div[draggable='true']:nth-child(2)",
            this.previewClick = "div[data-qa-hook='page-preview']>div>div:nth-child(2)>div>div>div:nth-child(2)>a:nth-child(2)",
            this.previewLink = 'div[data-qa-hook="page-preview"]>div>div:nth-child(2)>div>div>div';
        this.deleteContent = "span>i[title='remove']",
            this.removeModal = 'div[data-qa-hook="modal"]',
            this.removeButton = 'button[type="button"]',
            this.visitorButton = "li:nth-of-type(8) > div[role='button']",
            this.visitorActivities = "ul[id='Visitors$Menu']>li:nth-child(1)>a",
            this.session = "div[data-qa-hook='select-tags select-tags-undefined']>span",
            this.analyticsButton = "div[data-qa-hook='title-bar'] a",
            this.visitorRows = '[role="menuitem"]:nth-of-type(6) div',
            this.analyticsRows = "div[class*='SimpleTable__body']",
            this.cloneTrack = "[title='Clone Track']"
        this.targetAsset = "div[data-qa-hook='table-cell-identity']>span>div>span",
            this.canonicalUrlOverride = "#canonicalUrlOverride",
            this.relatedVideos = 'div[data-qa-hook="showRelatedVideos"]',
            this.recentUpdateTab = 'div[id="recently-updated-tab"]',
            this.createTrackModal = {
                nameInput: "input[name='name']"
            };
        this.pageControl = "div[data-qa-hook='title-bar']>h1",
            this.pageSidebar = {
                container: "div[data-qa-hook='page-sidebar']",
                customUrlLabel: "label:contains('Custom URL')",
                appearanceLabel: "label:contains('Appearance')",
                languageLabel: "label:contains('Language')",
                externalCodeLabel: "label:contains('External Code')",
                accessProtectionLabel: "label:contains('Access Protection')",
                accessProtectionGroup: "#trackProtectionGroups",
                flowToggle: '[data-qa-hook="flow"]',
                signpostsToggle: '[data-qa-hook="signpost"]',
                bottombarToggle: '[data-qa-hook="bottomBar"]',
                endPromoterToggle: '[data-qa-hook="end"]',
                exitToggle: '[data-qa-hook="exit"]',
                inactivityToggle: '[data-qa-hook="inactivity"]',
                formsStrategyToggle: '[data-qa-hook="formsStrategy"]',
                cookieConsentToggle: '[data-qa-hook="gdprCookieConsent"]',
                cookieMessageToggle: '[data-qa-hook="cookieConsent"]',
                headerToggle: '[data-qa-hook="header"]',
                exitNoOverride: "[data-qa-hook='Exit no overrides']",
                exitOverride: "[data-qa-hook='Exit overrides']",
                linksAndshareLabel: "label:contains('Links & Sharing')"
            };
        this.pagePreview = {
            pagePreview: '[data-qa-hook="page-preview"]',
            contentTitleOverrideLabel: "label:contains('Content Title Override')",
            contentDescriptionOverrideLabel: "label:contains('Content Description Override')",
            itemDescription: "div[data-qa-hook='item-description']",
            videoStartTime: "label:contains('Video Start Time')",
            autoPlayLabel: "div:contains('AutoPlay')",
            captions: "[data-qa-hook='showCaption']"
        };

        this.popoverElements = {
            customUrlInput: "#customUrl",
            endPromoterLinkInput: "#link"
        };
        this.formsStrategy = {
            trackRule: "div[data-qa-hook='experience-rules']",
            trackRuleCard: "div[data-qa-hook='engagement-rule-card']",
            unknownToggle: "[data-qa-hook='unknown']",
            knownToggle: '[data-qa-hook="known"]',
            dismissableToggle: '[data-qa-hook="isDismissable"]',
            formLabel: "label[for='formId']",
            timeOnTrackInput: "input[name='showAfterTime']"
        };
        this.endPromoter = {
            ctaLabel: 'label[for="callToActionId"]',
            delayLabel: "label[for='delay']",
            delayInput: "input[name='delay']",
            delayDecrement: "span[class*='NumberInput__decrementButton']",
        };
        this.exitOverride = {
            delayLabel: "label[for='delay']",
            delayInput: "input[name='delay']",
            delayDecrement: "span[class*='NumberInput__decrementButton']",
            manNumberlabel: "label[for='maxItems']",
            maxNumberInput: "input[name='maxItems']",
        }
        this.editTarget = {
            nameInput: "#name",
            dropdownSelect: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(1)',
            dropdownSelectField: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(2) > input'
        };

        this.cookieConsentToggle = "[data-qa-hook='gdprCookieConsent']"
    }

    visit() {
        cy.visit(this.pageUrl);
    }

    addTrack(options) {
        const name = options.name

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Create Target Track").click()
        cy.contains(this.modal, "Create Target Track").within(() => {
            cy.get(this.createTrackModal.nameInput).clear().type(name)
            cy.contains("button", "Create Target Track").click()
        })
        cy.contains(this.modal, "Create Target Track").should("not.exist")
        cy.containsExact("h1", name, { timeout: 10000 }).should("exist")
    }

    goToTrack(name) {
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.experienceCellName, name, { timeout: 2000 }).should("exist").within(() => { cy.get("a").click() })
        cy.contains(this.pageTitleLocator, name, { timeout: 20000 }).should("exist")
    }

    editTrackTarget(options) {
        const name = options.name
        const parentFolder = options.parentFolder
        const labels = options.labels
        cy.get(this.editTrackInsideTrack).click()
        cy.contains(this.modal, "Edit Track").within(() => {
            if (name) {
                cy.get(this.editTarget.nameInput).clear().type(name)
            }
            if (parentFolder) {
                cy.get(this.editTarget.dropdownSelect).eq(0).click()
                cy.get(this.editTarget.dropdownSelectField).eq(0).type(parentFolder + "\n",{force:true})
            }
            if (labels) {
                cy.get(this.editTarget.dropdownSelect).eq(1).click()
                cy.get(this.editTarget.dropdownSelectField).eq(1).type(labels + "\n")
            }
            cy.contains("button", "Save").click()

        })

    }

    deleteTrack(name, verify) {
        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.pageSearch, { timeout: 20000 }).clear().type(name)
        cy.ifElementWithExactTextExists(this.table.experienceCellName, name, 4000, () => {
            cy.containsExact(this.table.experienceCellName, name).should("exist").within(() => {
                cy.get("a").click()
            })
            cy.contains(this.pageTitleLocator, name, { timeout: 20000 }).should("exist")
            cy.get(this.deleteTrackIcon, { timeout: 20000 }).click()
            cy.contains(this.modal, "Do you want to delete this Track?").contains("button", "Yes").click()
        })

        if (verify !== false) {
            cy.contains(this.pageTitleLocator, this.pageTitle, { timeout: 20000 }).should("exist")
            cy.get(this.pageSearch).clear().type(name)
            cy.containsExact(this.table.experienceCellName, name).should("not.exist")
            cy.get(this.clearSearchIcon).click()
        }
    }

    addLinksAndShare(link) {
        cy.get(this.pageSidebar.linksAndshareLabel).siblings("span").click()
        cy.get(this.popover).within(() => {
            cy.get(this.dropdown.box).click()
            cy.get(".Select-multi-value-wrapper > .Select-value").type(link + "\n")
            cy.contains("button", "Update").click()
        })
    }

    configure(options) {
        const name = options.name
        const slug = options.slug
        const appearance = options.appearance
        const language = options.language
        const accessProtection = options.accessProtection
        const externalCode = options.externalCode
        const content = options
        /** All toggles should have value of 'on' or 'off' **/
        const flow = options.flow
        const signposts = options.signposts
        const bottombar = options.bottombar
        const endPromoter = options.endPromoter
        const exit = options.exit
        const inactivity = options.inactivity
        const formsStrategy = options.formsStrategy
        const cookieConsent = options.cookieConsent
        const cookieMessage = options.cookieMessage
        const header = options.header
        /***************************************************/
        /** The following will require certain toggles to be 'on' **/
        const flowCTA = options.flowCTA
        const endPromoterOptions = options.endPromoterOptions
        const exitOptions = options.exitOptions
        const formsStrategyOptions = options.formsStrategyOptions
        /***********************************************************/
        const verify = options.verify

        /******************** Search Engine Directive*/
        const searchEngineDirective = options.searchEngineDirective
        const captions = options.captions
        const captionsLanguage = options.captionsLanguage

        /**************Clone of track */
        const cloneName = options.cloneName

        cy.get(this.pageTitleLocator).invoke('text').then((text) => {
            if (text !== name) {
                this.goToTrack(name)
            }
        })

        if (slug) {
            this.setCustomUrl(slug, verify)
        }

        if (appearance) {
            this.setAppearance(appearance, verify)
        }

        if (language) {
            this.setTrackLanguage(language, verify)
        }

        if (externalCode) {
            this.addExternalCode(externalCode)
        }

        if (accessProtection) {
            this.addAccessProtection(accessProtection, verify)
        }

        if (content) {
            if (content.contents) {
                this.addContent(content.contents, verify)
            }
        }

        if (flow) {
            this.toggle(this.pageSidebar.flowToggle, flow)
        }

        if (signposts) {
            this.toggle(this.pageSidebar.signpostsToggle, signposts)
        }

        if (bottombar) {
            this.toggle(this.pageSidebar.bottombarToggle, bottombar)
        }

        if (endPromoter) {
            this.toggle(this.pageSidebar.endPromoterToggle, endPromoter)
        }

        if (exit) {
            this.toggle(this.pageSidebar.exitToggle, exit)
        }

        if (inactivity) {
            this.toggle(this.pageSidebar.inactivityToggle, inactivity)
        }

        if (formsStrategy) {
            this.toggle(this.pageSidebar.formsStrategyToggle, formsStrategy)
        }

        if (cookieConsent) {
            this.toggle(this.pageSidebar.cookieConsentToggle, cookieConsent)
        }

        if (cookieMessage) {
            this.toggle(this.pageSidebar.cookieMessageToggle, cookieMessage)
        }

        if (header) {
            this.toggle(this.pageSidebar.headerToggle, header)
        }

        if (flowCTA) {
            this.configureFlowCTA(flowCTA, verify)
        }

        if (endPromoterOptions) {
            this.configureEndPromoter(endPromoterOptions, verify)
        }

        if (exitOptions) {
            this.configureExit(exitOptions, verify)
        }

        if (formsStrategyOptions) {
            const { trackRule } = formsStrategyOptions

            cy.contains("button", "View Form Strategy").click()
            cy.contains(this.modal, "Forms Strategy").should("exist")

            if (trackRule) {
                this.configureFormTrackRule(trackRule, verify)
            }

            cy.get(this.closeModal).click()
        }

        if (searchEngineDirective) {
            this.selectSearchEngineDirective(searchEngineDirective)
        }

        if (captions) {
            const index = options.index
            const singleContent = options.contents[index]
            cy.contains('strong', singleContent, { timeout: 20000 }).click()
            cy.get(this.pagePreview.captions).invoke('css', 'background-color').then(val => {
                if (val.includes('rgb(221, 221, 221)')) { //if radio button off
                    this.setCaptions(captionsLanguage, captions, verify)
                }
            })
        }

        if (cloneName) {
            cy.get(this.cloneTrack, { timeout: 10000 }).click()
            cy.contains('h3', "Clone this Track", { timeout: 10000 }).should('be.visible')
            cy.get(this.editTarget.nameInput).clear().type(cloneName)
            cy.contains('button', 'Clone this Track').click()
            cy.contains('form h3', "Clone this Track", { timeout: 10000 }).should('not.exist')
        }
    }

    addExternalCode(list, verify) {
        const codes = [list].flat()

        cy.get(this.pageSidebar.externalCodeLabel).siblings("span").click()
        cy.get(this.popover).within(() => {
            codes.forEach(code => {
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(code)).click()
            })
            cy.contains("button", "Update").click()
        })

        if (verify !== false) {
            cy.get(this.popover).should("not.exist")
            codes.forEach(code => {
                cy.get(this.pageSidebar.externalCodeLabel).siblings("span").should("contain", code)
            })
        }
    }

    removeExternalCode(list, verify) {
        const codes = [list].flat()
        cy.get(this.pageSidebar.externalCodeLabel).siblings("span").click()
        cy.get(this.popover).within(() => {
            codes.forEach(code => {
                cy.ifElementWithExactTextExists("span", code, 1000, () => {
                    cy.containsExact("span", code).parent().siblings("span").click()
                })
            })
            cy.contains("button", "Update").click()
        })

        if (verify !== false) {
            cy.get(this.popover).should("not.exist")
            codes.forEach(code => {
                cy.get(this.pageSidebar.externalCodeLabel).siblings("span").should("not.contain", code)
            })
        }
    }

    setAppearance(appearance, verify) {
        cy.get(this.pageSidebar.appearanceLabel).siblings("span").click()
        cy.get(this.popover).within(() => {
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(appearance)).click()
            cy.contains("button", "Update").click()
        })

        if (verify !== false) {
            cy.get(this.popover).should("not.exist")
            cy.get(this.pageSidebar.appearanceLabel).siblings("span").should("contain", appearance)

        }
    }

    addAccessProtection(accessProtection, verify) {
        const type = accessProtection.type
        const groups = [accessProtection.groups].flat()

        cy.get(this.pageSidebar.accessProtectionLabel).siblings("span").click()
        cy.get(this.popover).within(() => {
            cy.get(this.accessProtection.protectionTypeLabel).siblings(this.dropdown.box).click()
            cy.get(this.dropdown.option(type)).click()
            groups.forEach(group => {
                if (group !== "None") {
                    cy.get(this.accessProtection.APGroupLabel).siblings(this.dropdown.box).click()
                    cy.get(this.dropdown.option(group)).click()
                }
            })

            cy.contains("button", "Update").click()
        })

        if (verify !== false) {
            cy.get(this.popover).should("not.exist")
            groups.forEach(group => {
                if (group !== "None") {
                    cy.contains(this.pageSidebar.accessProtectionGroup, group).should("exist")
                }
            })
        }
    }

    setCustomUrl(slug, verify) {
        cy.get(this.pageSidebar.customUrlLabel).siblings("span").click()
        cy.get(this.popover).get(this.popoverElements.customUrlInput).clear().type(slug + "\n")
        cy.ifElementWithExactTextExists("button", "Change", 1000, () => {
            cy.contains("button", "Change").click()
        })

        if (verify !== false) {
            cy.get(this.pageSidebar.customUrlLabel).siblings("span").should("contain", slug)
        }
    }
    addContentTarget(content) {
        cy.contains("button", "Add Content to Track").click()
        cy.get(this.contentPickerSearchBar).clear().type(content)
        cy.contains(this.contentPickerItem, content).click()
        cy.get(this.modal).contains("button", "Add Content to Track").click()
    }

    addContent(contents, verify, position = "Bottom") {
        cy.contains("button", "Add Content to Track").click()
        contents.forEach((content) => {
            cy.get(this.modal).within(() => {
                cy.get(this.contentPickerSearchBar).clear().type(content)
                cy.contains(this.contentPickerItem, content).click()
            })
        })

        if (position !== "Bottom") {
            cy.contains('label', 'Top of track').parent('div').find(this.addContentTo).click()
        }
        else if (position === "Top") {
            cy.contains('label', 'Bottom of track').parent('div').find(this.addContentTo).click()
        }

        cy.get(this.modal).contains("button", "Add Content to Track").click()

        if (verify !== false) {
            cy.get(this.modal).should('not.exist')
            contents.forEach((content) => {
                cy.containsExact("strong", content).should("exist")
            })
        }
    }

    configureFlowCTA(config) {
        const ctaNumber = config.ctaNumber
        const flowCTA = config.flowCTA
        const location = config.location
        const buttonColor = config.buttonColor
        const fontColor = config.fontColor
        const addcta = config.addcta

        cy.get(this.pageSidebar.flowToggle).parents().eq(1).within(() => {
            cy.contains("label", ctaNumber).siblings("span").click({ force: true })
        })

        cy.get(this.popover).within(() => {
            if (Cypress.$(this.clearValueIcon).length > 0) {
                cy.get(this.clearValueIcon).click()
            }
            cy.get(this.dropdown.box).eq(0).click()
            cy.get(this.dropdown.input).eq(0).type(flowCTA + "\n", { force: true })
            cy.get(this.dropdown.box).eq(1).click()
            cy.get(this.dropdown.input).eq(1).type(location + "\n", { force: true })
            cy.get('#buttonColor').type(buttonColor)
            cy.wait(100)
            cy.get('#fontColor').type(fontColor)
            cy.wait(200)
            cy.contains('button', 'Update').click()
        })

        if (addcta) {
            cy.wait(3000)
            cy.contains('div', "+ Add CTA").click({ force: true })
        }
    }


    configureEndPromoter(endPromoterOptions, verify) {
        const { link, ctaLabel, cta, delay } = endPromoterOptions

        if (link) {
            cy.get(this.pageSidebar.endPromoterToggle).parents().eq(1).within(() => {
                cy.contains("label", "Link").siblings("span").click()
            })
            cy.get(this.popover).within(() => {
                cy.get(this.popoverElements.endPromoterLinkInput).clear().type(link)
            })
            cy.contains("button", "Update").click()
            cy.get(this.pageSidebar.endPromoterToggle).parents().eq(1).within(() => {
                cy.contains("label", "Link").siblings("span").should("contain", link)
            })
        }

        if (ctaLabel) {
            cy.contains("label", "CTA Label").siblings("span").click()
            cy.get('#cta').clear().type(ctaLabel)
            cy.contains("button", "Update").click()
        }

        if (cta) {
            cy.wait(100)
            cy.contains('label', "Type").siblings("span").click()
            cy.wait(100)
            cy.get('input[name="type"]').eq(1).click()
            cy.wait(100)
            cy.contains('button', "Update").click({ force: true })
            cy.get('#emptyTextInput').parent('span').click()
            cy.wait(100)
            cy.get(this.endPromoter.ctaLabel).parent().within(() => {
                cy.get("input").type(cta + "\n", { force: true })
            })
            cy.contains('button', "Update").click()
        }

        if (delay) {
            cy.wait(100)
            cy.contains("label", "Delay").siblings("span").click()
            // This is only necessary because there's an annoying bug where if you clear out the delay, it resets to 5
            // This makes it impossible to set it to zero without using the decrement button
            cy.angryClick({
                clickElement: this.endPromoter.delayDecrement,
                checkElement: "input[value='0']",
                repeat: 60,
                interval: 0
            })
            cy.get(this.endPromoter.delayInput).type(delay)
            cy.contains("button", "Update").click()

        }
    }

    configureExit(exitOptions, verify) {
        const { promoterHeadline } = exitOptions
        const { message } = exitOptions
        const { item } = exitOptions
        const { form } = exitOptions
        const { delay } = exitOptions
        const { maxNumber } = exitOptions

        cy.get(this.pageSidebar.exitToggle).parents().eq(1).within(() => {
            if (Cypress.$(this.pageSidebar.exitNoOverride).length > 0) {
                cy.get(this.pageSidebar.exitNoOverride).click()
            } else if (Cypress.$(this.pageSidebar.exitOverride).length > 0) {
                cy.get(this.pageSidebar.exitOverride).click()
            }
        })

        cy.wait(1000)
        cy.contains(this.modal, "Exit customization for this track").should("exist").within(() => {
            cy.contains('span', "Promoter Headline").should("exist")
            cy.contains('span', "Message").should("exist")
            if (promoterHeadline) {
                cy.get('#title').type(promoterHeadline)
            }
            if (message) {
                cy.wait(1000)
                cy.get('#message').clear().type(message)
            }

            if (item) {
                cy.get('label[for="featuredItemId"]').parent().within(() => {
                    if (Cypress.$(this.clearValueIcon).length > 0) {
                        cy.get(this.clearValueIcon).click()
                    }
                    cy.get("input").type(item + "\n", { force: true })
                })

            }


            if (form) {
                cy.log("in")
                cy.wait(100)
                cy.contains('label', "Form").click({ force: true })
                cy.wait(100)
                cy.get(this.formsStrategy.formLabel).parent().within(() => {
                    cy.get("input").type(form + "\n", { force: true })
                })
            }
            if (delay) {
                cy.get(this.exitOverride.delayLabel).parent().within(() => {
                    // This is only necessary because there's an annoying bug where if you clear out the delay, it resets to 5
                    // This makes it impossible to set it to zero without using the decrement button
                    cy.angryClick({
                        clickElement: this.exitOverride.delayDecrement,
                        checkElement: "input[value='0']",
                        repeat: 60,
                        interval: 0
                    })
                })
                cy.get(this.exitOverride.delayInput).type(delay)
            }

            if (maxNumber) {
                cy.get(this.exitOverride.manNumberlabel).parent().within(() => {
                    // This is only necessary because there's an annoying bug where if you clear out the delay, it resets to 5
                    // This makes it impossible to set it to zero without using the decrement button
                    cy.angryClick({
                        clickElement: this.exitOverride.delayDecrement,
                        checkElement: "input[value='0']",
                        repeat: 60,
                        interval: 1
                    })
                })
                cy.get(this.exitOverride.maxNumberInput).type(maxNumber)
            }

            cy.contains("button", "Save Exit Customization").click()
        })

        if (verify !== false) {
            cy.contains(this.modal, "Exit customization for this Track").should("not.exist")
            cy.get(this.pageSidebar.exitToggle).parents().eq(1).within(() => {
                if (delay) {
                    cy.contains(`${delay} seconds`).should("exist")
                }
            })
        }
    }

    configureFormTrackRule(trackRule, verify) {
        const { form, timeOnTrack, showToUnknown, showToKnown, dismissable } = trackRule

        cy.get(this.formsStrategy.trackRule).within(() => {
            if (Cypress.$(this.formsStrategy.trackRuleCard).length > 0) {
                cy.get(this.formsStrategy.trackRuleCard).click()
            } else {
                cy.contains("button", "Add Rule").click()
            }
        })

        if (form) {
            cy.get(this.formsStrategy.formLabel).parent().within(() => {
                if (Cypress.$(this.clearValueIcon).length > 0) {
                    cy.get(this.clearValueIcon).click()
                }
                cy.get("input").type(form + "\n", { force: true })
            })
        }

        if (timeOnTrack) {
            cy.contains("label", "Total time on Track").click()
            cy.get(this.formsStrategy.timeOnTrackInput).clear().type(timeOnTrack)
        }

        if (showToUnknown) {
            this.toggle(this.formsStrategy.unknownToggle, showToUnknown)
        }

        if (showToKnown) {
            this.toggle(this.formsStrategy.knownToggle, showToKnown)
        }

        if (dismissable) {
            this.toggle(this.formsStrategy.dismissableToggle, dismissable)
        }

        cy.contains(this.modal, "Track Rule").within(() => {
            cy.contains("button", "Save").click()
        })

        if (verify !== false) {
            cy.contains(this.modal, "Add Track Rule").should("not.exist")
        }
    }


    removeContentTitleOverride() {
        cy.get(this.pagePreview.contentTitleOverrideLabel).siblings("span").click()
        cy.get(this.popover).within(() => {
            cy.get("#titleOverride").clear()
            cy.contains("button", "Update").click()
        })
    }

    verifyAddContentTo(position) {
        const message = "Note: the default for this setting can be changed in the track edit window"
        cy.contains("button", "Add Content to Track").click()

        if (position === "bottom") {
            cy.contains('label', 'Bottom of track', { timeout: 10000 }).parent('div').find(this.addContentTo).should('have.attr', 'checked')
        }
        else if (position === "top") {
            cy.contains('label', 'Top of track', { timeout: 10000 }).parent('div').find(this.addContentTo).should('have.attr', 'checked')
        }

        cy.contains('div', message, { timeout: 5000 }).should('exist');
        cy.contains("button", "Cancel").click()
    }

    updateAddContentTo(position) {
        cy.get("i[title='Edit Track']").click()

        if (position === "bottom") {
            cy.contains('label', 'Bottom of track', { timeout: 10000 }).parent('div').find(this.addContentTo).click()
        }
        else if (position === "top") {
            cy.contains('label', 'Top of track', { timeout: 10000 }).parent('div').find(this.addContentTo).click()
        }

        cy.contains("button", "Save").click()
    }

    videoStartTime(time) {

        cy.get(this.pagePreview.videoStartTime).siblings("span").click()
        cy.get(this.popover).within(() => {

            cy.get("div>input[name='videoStartTime']").clear().type(time)
            cy.contains("button", "Update").click()
        })
    }

    selectSearchEngineDirective(option) {
        cy.contains('label', "Search Engine Directive", { timeout: 10000 }).siblings('span').click()
        cy.get(this.popover).within(() => {
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(option)).click()
            cy.contains("button", "Update").click()
        })
    }

    setCanonicalOverrideUrl(contentName, overrideUrl) {
        cy.contains('strong', contentName, { timeout: 10000 }).click()
        cy.contains('label', "Canonical Url Override", { timeout: 10000 }).siblings('span').click()
        cy.get(this.popover).within(() => {
            cy.get(this.canonicalUrlOverride).click()
            cy.get(this.canonicalUrlOverride).type(overrideUrl)
            cy.contains("button", "Update").click()
        })
    }

    setCaptions(captionsLanguage, captions, verify) {
        if (captions === 'on' || captions === 'ON') {
            this.toggle(this.pagePreview.captions, captions)
            //default should be english
            cy.get(this.pagePreview.pagePreview).within(() => {
                cy.contains('label', 'Language').siblings("span").should("contain", "English")
                cy.contains('label', 'Language').siblings("span").click()
            })
            cy.get(this.popover).within(() => {
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(captionsLanguage)).click()
                cy.contains("button", "Update").click()
            })
        }
        if (verify !== false) {
            cy.get(this.popover).should("not.exist")
            cy.get(this.pagePreview.pagePreview).within(() => {
                cy.contains('label', 'Language').siblings("span").should("contain", captionsLanguage)
            })
        }
    }

    validateCtaAnalyticsData(name, visitor, email) {
        cy.wait(2000)
        this.visit()
        this.goToTrack(name)

        cy.wait(3000)
        cy.get("a[href*='analytics-overview']", { timeout: 10000 }).should("exist").click()
        cy.contains('[role="menuitem"] div.ant-menu-submenu-title', "Events", { timeout: 10000 }).should("exist").click()
        cy.contains('a', 'CTAs').click()
        if (!email)
            cy.contains('[data-qa-hook="table-cell-visitor"]', visitor).should('exist')
        else {
            cy.contains('[data-qa-hook="table-cell-visitor"]', visitor).should('not.exist')
            cy.contains('[data-qa-hook="table-cell-visitor"]', email).should('exist')
        }
    }

    validateAnalyticsData(visitor, email) {
        cy.wait(2000)
        this.visit()
        cy.get(this.targetAnalytics).should("exist").click()
        cy.contains('div', "Last 30 Days").should("exist")
        cy.contains('[role="menuitem"] div.ant-menu-submenu-title', "Visitors").should("exist").click()
        cy.contains('a', 'Visitor Journeys per Session').click()
        for (let i = 0; i < 2; i++) {
            cy.get('[data-qa-hook="table-cell-identity"]').eq(0).invoke('text').then(value => {
                if (value.includes(email) || value.includes(visitor)) {
                    if (!email)
                        cy.contains('[data-qa-hook="table-cell-identity"]', visitor).should('exist')
                    else {
                        cy.contains('[data-qa-hook="table-cell-identity"]', visitor).should('not.exist')
                        cy.contains('[data-qa-hook="table-cell-identity"]', email).should('exist')
                    }
                }
                else {
                    cy.wait(5000)
                    cy.reload()
                }
            })
            if (i === 1) {
                if (!email)
                    cy.contains('[data-qa-hook="table-cell-identity"]', visitor).should('exist')
                else {
                    cy.contains('[data-qa-hook="table-cell-identity"]', visitor).should('not.exist')
                    cy.contains('[data-qa-hook="table-cell-identity"]', email).should('exist')
                }
            }
        }
    }

    validateCtaAnalyticsDataForStrictMode(name, visitor, email) {
        cy.wait(5000)
        this.visit()
        this.goToTrack(name)

        cy.wait(3000)
        cy.get("a[href*='analytics-overview']", { timeout: 10000 }).should("exist").click()
        cy.contains('[role="menuitem"] div.ant-menu-submenu-title', "Events", { timeout: 10000 }).should("exist").click()
        cy.contains('a', 'Form Captures').click()
        for (let i = 0; i < 2; i++) {
            cy.get('[data-qa-hook="table-cell-email"]').eq(0).invoke('text').then(value => {
                if (value.includes(email) || value.includes(visitor)) {
                    if (!email)
                        cy.contains('[data-qa-hook="table-cell-email"]', visitor).should('exist')
                    else {
                        cy.contains('[data-qa-hook="table-cell-email"]', visitor).should('not.exist')
                        cy.contains('[data-qa-hook="table-cell-email"]', email).should('exist')
                    }
                }
                else {
                    cy.wait(5000)
                    cy.reload()
                }
            })
            if (i === 1) {
                if (!email)
                    cy.contains('[data-qa-hook="table-cell-email"]', visitor).should('exist')
                else {
                    cy.contains('[data-qa-hook="table-cell-email"]', visitor).should('not.exist')
                    cy.contains('[data-qa-hook="table-cell-email"]', email).should('exist')
                }
            }
        }
    }

}


