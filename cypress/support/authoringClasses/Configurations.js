import { Common } from "./Common";

export class Configurations extends Common {
    constructor(env, org, tld, userName, password, baseUrl) {
        super(env, org, tld, userName, password, baseUrl);
        this.configRoute = `${this.baseUrl}/authoring/content-library/config`;
        this.pageUrls = {
            webhooks: `${this.configRoute}/webhooks`,
            widgets: `${this.configRoute}/widgets`,
            externalCode: `${this.configRoute}/external-code`,
            appearances: `${this.configRoute}/appearance`,
            guide: `${this.configRoute}/appearance/guide`,
            languages: `${this.configRoute}/language`,
            forms: `${this.configRoute}/forms`,
            images: `${this.configRoute}/images/content`,
            accessProtection: `${this.configRoute}/access-protection/email-and-domain`,
            redirectTab: `${this.configRoute}/access-protection/email-and-domain`,
            contentTags: `${this.configRoute}/tags/topics`,
            linksAndSharings: `${this.configRoute}/sharing`,
            ctas: `${this.configRoute}/ctas`,
            visitorActivities: `${this.configRoute}/visitor-activities`,
            segments: `${this.configRoute}/segments`,
            routes: `${this.configRoute}/routes`,
            trackLabels: `${this.configRoute}/labels`
        };
        this.pageSearch = "input[name='page-search']"
        this.clearSearch = ".Search__closeIcon_cTCFsfpKe88w2HW42fAu4";
        this.updatedDate = "div[data-qa-hook='page-preview']>div>div>div:nth-child(3)>div";
        this.pageTitles = {
            webhooks: "Webhooks Configuration",
            widgets: "Widgets Configuration",
            externalCode: "External Code Configuration",
            appearances: "Appearances Configuration",
            languages: "Languages Configuration",
            forms: "Form Configuration",
            images: "Image Library and Branding",
            accessProtection: "Access Protection",
            contentTags: "Content Tags Configuration",
            linksAndSharings: "Links & Sharing Configuration",
            ctas: "CTA Configuration",
            visitorActivities: "Visitor Activities Configuration",
            segments: "Segments",
            routes: "Routes",
            trackLabels: "Labels Configuration"
        };
        this.visit = {
            webhooks: () => { cy.visit(this.pageUrls.webhooks) },
            widgets: () => { cy.visit(this.pageUrls.widgets) },
            externalCode: () => { cy.visit(this.pageUrls.externalCode) },
            appearances: () => { cy.visit(this.pageUrls.appearances) },
            languages: () => { cy.visit(this.pageUrls.languages) },
            forms: () => { cy.visit(this.pageUrls.forms) },
            ctas: () => { cy.visit(this.pageUrls.ctas) }
        };
        this.addWebhookModal = {
            name: "#name",
            url: "#url",
        };
        this.addAccessProtectionGroupModal = {
            name: "#add-group-name-input",
            decription: "#add-group-description-input"
        }
        this.webhookPreview = {
            enableToggle: "div[data-qa-hook='enabled']",
            name: "div[data-qa-hook='preview-section-webhook-name']",
            delete: "i[title='Delete Webhook']",
            eventFields: "div[data-qa-hook='preview-section-event-fields']"
        };
        this.widgets = {
            nameInput: "#name",
            codeEditor: "#code > textarea",
            previewName: "div[data-qa-hook='preview-section-widget-name']",
            deleteIcon: "i[title='Delete Widget']"
        };
        this.externalCode = {
            nameInput: "#name",
            codeEditor: "#code > textarea",
            previewName: "div[data-qa-hook='preview-section-external-code-name']",
            deleteIcon: "i[title='Delete External Code']",
            globalToggle: "#qa-enable-external-code-globally > div:nth-child(2)",
            globalToggleEnabled: "#qa-enable-external-code-globally",
            thirdPartyCookieToggle: "#qa-enable-third-party-cookie"
        };
        // The following are empty, but gives you an idea of how I want locators organized in this class 
        this.appearances = {
            sidebar: "div[data-qa-hook='page-sidebar']",
            searchforAppearance: "div[data-qa-hook='page-sidebar']>div",
            secondaryNav: "div[data-qa-hook='page-secondary-navigation']",
            fontSizeSmall: "#fontSizeSmall",
            fontSizeMedium: "#fontSizeMedium",
            fontSizeLarge: "#fontSizeLarge",
            appearanceName: "#name",
            primaryColor: "#primaryColor",
            titleFont: "#titleOnPrimaryColor",
            bodyTextFont: "#bodyOnWhite",
            bodyTextColor: "#bodyOnWhite > span[id='color']",
            imagePicker: "i[title='Select a thumbnail']",
            recommendationTabsColor: 'span[id="recommendationTabColor"]>div>span',
            buttonBackgroundColorForGuide: 'span[id="headlineBackgroundColor"]>div>span',
            ForYouTabForGuide: 'div[title="For You"]',
            TrendingTabForGuide: 'div[title="Trending"]',
            header: {
                dynamicLogo: "div[data-qa-hook='dynamicLogo']",
            },
            vex: {
                backgroundColor: "#backgroundColor",
                headerBackgroundColor: "#headerBackgroundColor",
                headerTitleSettings: "#headerTitleAppearance",
                headerFontWeight: "#headerTextFontWeight",
                headerFontColor: "#headerTextColor",
                bodySettings: "#bodyAppearance",
                bodyFontWeight: "#bodyTextFontWeight",
                bodyFontColor: "#bodyTextColor",
                activeSettings: "#activeItemAppearance",
                activeFontWeight: "#activeItemFontWeight",
                activeFontColor: "#activeItemColor",
                sessionDescriptionSettings: "#sessionDescriptionAppearance",
                sessionDescriptionFontWeight: "#sessionDescriptionFontWeight",
                sessionDescriptionFontSize: "#sessionDescriptionFontWeight",
                sessionDescriptionFontColor: "#sessionDescriptionColor",
                hideNavigation: "div[data-qa-hook='checkbox']",
                backgroundcolorPreview: "div[data-qa-hook='page-body'] > div > div > form > div:nth-of-type(2) > div >div >div:nth-of-type(2)#vexPreview",
                headerBackgroundColorPreview: "div[class='ant-col ant-col-14'] > div:nth-child(1)",
                headerTitleFontPreview: "div[class='ant-col ant-col-14'] > div:nth-child(1) > div",
                bodySessionTitleFontPreview: "div[class='ant-col ant-col-14'] > div:nth-child(3)",
                bodySuppplementalContentFontPreview: "div[class='ant-col ant-col-10'] > div:nth-child(3)",
                activeTitleFontPreview: "div[class='ant-col ant-col-10'] > div:nth-child(4)",
                sessionDescriptionPreview: "#sessionDescription",
                cardRadius: "input[name='cardCornerRadius']",
                searchFilterRadius: "input[name='searchFiltersCornerRadius']",
                searchFilterSettings: "#searchFiltersStyleFontFamily",
                searchFilterFontFamily: "input[name='searchFiltersStyleFontFamily']",
                searchFilterColor: "#searchFiltersStyleColor > div > div > div",
                searchFilterBackgroundColor: "#searchFiltersStyleBackgroundColor > div > div > div",
                searchFiltersStyleFontSizeSmall: "#searchFiltersStyleFontSizeSmall",
                searchFiltersStyleFontSizeMedium: "#searchFiltersStyleFontSizeMedium",
                searchFiltersStyleFontSizeLarge: "#searchFiltersStyleFontSizeLarge",
                searchFieldSettings: "#searchFieldInputFontFamily",
                searchFieldFontFamily: "input[name='searchFieldInputFontFamily']",
                searchFieldColor: "#searchFieldInputColor > div > div > div",
                searchFieldBackgroundColor: "#searchFieldInputBackgroundColor > div > div > div",
                searchFieldStyleFontSizeSmall: "#searchFieldInputFontSizeSmall",
                searchFieldsStyleFontSizeMedium: "#searchFieldInputFontSizeMedium",
                searchFieldStyleFontSizeLarge: "#searchFieldInputFontSizeLarge",
                headingStyleSettings: "#defaultHeadingFontFamily",
                headingStyleFontFamily: "input[name='defaultHeadingFontFamily']",
                headingStyleColor: "#defaultHeadingColor",
                defaultHeadingFontSizeSmall: "#defaultHeadingFontSizeSmall",
                defaultHeadingFontSizeMedium: "#defaultHeadingFontSizeMedium",
                defaultHeadingFontSizeLarge: "#defaultHeadingFontSizeLarge",
                carouselArrowsColor: "#carouselArrowsStyleColor > div > div > div",
                carouselArrowsBackgroundColor: "#carouselArrowsStyleBackgroundColor > div > div > div",
                noResultMsgSettings: "#noResultsMessageFontFamily",
                noResultsMsgFontFamily: "input[name='noResultsMessageFontFamily']",
                noResultsMsgColor: "#noResultsMessageColor",
                noResultsMessageFontSizeSmall: "#noResultsMessageFontSizeSmall",
                noResultsMessageFontSizeMedium: "#noResultsMessageFontSizeMedium",
                noResultsMessageFontSizeLarge: "#noResultsMessageFontSizeLarge",
                searchFilterStylePreview: "#search-field-preview > div",
                searchFieldInputPreview: "#search-field-preview > input",
                headingStylePreview: "#landing-page-grid-preview > div",
                carouselArrowsPreview: "#landing-page-grid-preview > div:nth-child(3) > span > i",
                noResultsMsgPreview: "#landing-page-grid-preview > div:nth-child(4)",
                cardRadiusPreview: "#landing-page-grid-preview > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1)",
                heading: "#body-title-show"
            },
            microsites: {
                hideNavigation: "div[data-qa-hook='checkbox']",
                contentTypeTopicLabelsSettings: "#contentTypeLabelsStyleFontFamily",
                contentTypeTopicLabelsFontFamily: "input[name='contentTypeLabelsStyleFontFamily']",
                contentTypeTopicLabelsFontWeight: "#contentTypeLabelsStyleFontWeight",
                contentTypeTopicLabelsFontStyle: "#contentTypeLabelsStyleFontStyle",
                contentTypeTopicLabelsTextDecoration: "#contentTypeLabelsStyleTextDecoration",
                contentTypeTopicLabelsFontStyle: "#contentTypeLabelsStyleFontStyle",
                contentTypeTopicLabelsFontTextDecoration: "#contentTypeLabelsStyleTextDecoration",
                contentTypeTopicLabelsColor: "#contentTypeLabelsStyleColor > div > div > div",
                contentTypeTopicLabelsBackgroundColor: "#contentTypeLabelsStyleBackgroundColor > div > div > div",
                cardRadius: "input[name='cardCornerRadius']",
                searchFilterRadius: "input[name='searchFiltersCornerRadius']",
                searchFilterSettings: "#searchFiltersStyleFontFamily",
                searchFilterFontFamily: "input[name='searchFiltersStyleFontFamily']",
                searchFilterColor: "#searchFiltersStyleColor > div > div > div",
                searchFilterBackgroundColor: "#searchFiltersStyleBackgroundColor > div > div > div",
                searchFiltersStyleFontSizeSmall: "#searchFiltersStyleFontSizeSmall",
                searchFiltersStyleFontSizeMedium: "#searchFiltersStyleFontSizeMedium",
                searchFiltersStyleFontSizeLarge: "#searchFiltersStyleFontSizeLarge",
                searchFieldSettings: "#searchFieldInputFontFamily",
                searchFieldFontFamily: "input[name='searchFieldInputFontFamily']",
                searchFieldColor: "#searchFieldInputColor > div > div > div",
                searchFieldBackgroundColor: "#searchFieldInputBackgroundColor > div > div > div",
                searchFieldStyleFontSizeSmall: "#searchFieldInputFontSizeSmall",
                searchFieldsStyleFontSizeMedium: "#searchFieldInputFontSizeMedium",
                searchFieldStyleFontSizeLarge: "#searchFieldInputFontSizeLarge",
                headingStyleSettings: "#defaultHeadingFontFamily",
                headingStyleFontFamily: "input[name='defaultHeadingFontFamily']",
                headingStyleColor: "#defaultHeadingColor",
                defaultHeadingFontSizeSmall: "#defaultHeadingFontSizeSmall",
                defaultHeadingFontSizeMedium: "#defaultHeadingFontSizeMedium",
                defaultHeadingFontSizeLarge: "#defaultHeadingFontSizeLarge",
                carouselArrowsColor: "#carouselArrowsStyleColor > div > div > div",
                carouselArrowsBackgroundColor: "#carouselArrowsStyleBackgroundColor > div > div > div",
                noResultMsgSettings: "#noResultsMessageFontFamily",
                noResultsMsgFontFamily: "input[name='noResultsMessageFontFamily']",
                noResultsMsgColor: "#noResultsMessageColor",
                noResultsMessageFontSizeSmall: "#noResultsMessageFontSizeSmall",
                noResultsMessageFontSizeMedium: "#noResultsMessageFontSizeMedium",
                noResultsMessageFontSizeLarge: "#noResultsMessageFontSizeLarge",
                searchFilterStylePreview: "#search-field-preview > div",
                searchFieldInputPreview: "#search-field-preview > input",
                headingStylePreview: "#landing-page-grid-preview > div",
                carouselArrowsPreview: "#landing-page-grid-preview > div:nth-child(3) > span > i",
                noResultsMsgPreview: "#landing-page-grid-preview > div:nth-child(4)",
                cardRadiusPreview: "#landing-page-grid-preview > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(1)",
                heading: "#body-title-show"
            },
            explore: {
                heroTitleStyle: "label[for='heroTitleFont']",
                heroTitleFontFamily: "#heroTitleFontFamily",
                heroTitleFontWeight: "#heroTitleFontWeight",
                heroTitleColor: "#heroTitleColor",
                heroSubtitleStyle: "label[for='heroSubtitleFont']",
                heroSubtitleFontFamily: "#heroSubtitleFontFamily",
                heroSubtitleFontWeight: "#heroSubtitleFontWeight",
                heroSubtitleFontColor: "#heroSubtitleColor",
                heroBackgroundColorPicker: "#heroBackgroundColor > div > span"
            },
            accessProtection: {
                //LP=Landing Page
                submitButtonRadiusLP: "input[name='submitButtonCornerRadius']",
                submitButtonColorLP: "#submitButtonAuthoringColor",
                headerTextSettingsLP: "#headerTextAppearance",
                headerTextFontWeightLP: "#headerTextFontWeight",
                headerTextFontColorLP: "#headerTextColor",
                bodySettingsLP: "#authoringBodyTextAppearance",
                bodyFontWeightLP: "#authoringBodyTextFontWeight",
                bodyFontColorLP: "#authoringBodyTextColor",
                emailAddressSettingsLP: "#authoringAddressAppearance",
                emailAddressFontWeightLP: "#authoringAddressTextFontWeight",
                emailAddressFontColorLP: "#authoringAddressTextColor",
                submitButtonTextSettingsLP: "#submitButtonAppearance",
                submitButtonTextWeightLP: "#buttonTextFontWeight",
                submitButtonTextColorLP: "#buttonTextColor",
            }
        };
        this.languages = {
            sidebar: "div[data-qa-hook='page-sidebar']",
            searchforLanguage: "div[data-qa-hook='page-sidebar']>div",
            secondaryNav: "div[data-qa-hook='page-secondary-navigation']",
            code: "#code",
            explore: {
                featuredLabelInput: "#featuredLabel",
                searchInput: "#searchButtonTitle",
                searchPlaceholderInput: "#searchInputFieldPlaceholder",
                contentTypeInput: "#filterByContentTypeTitle",
                funnelStageInput: "#filterByFunnelStageTitle",
                businessUnitInput: "#filterByBusinessUnitTitle",
                personaInput: "#filterByPersonaTitle",
                industryTitleInput: "#filterByIndustryTitle",
            },
            micrositeBuilder: {
                searchButtonTitle: "#searchButtonTitle",
                searchInputFieldPlaceholder: "#searchInputFieldPlaceholder",
                filterByContentTypeTitle: "#filterByContentTypeTitle",
                filterByLanguageTitle: "#filterByLanguageTitle",
                filterByFunnelStageTitle: "#filterByFunnelStageTitle",
                filterByBusinessUnitTitle: "#filterByBusinessUnitTitle",
                filterByPersonaTitle: "#filterByPersonaTitle",
                filterByIndustryTitle: "#filterByIndustryTitle",
                filterByTopicTitle: "#filterByTopicTitle",
                noResultsMessage: "#noResultsMessage",
                saveSettings: "#save-microsite-builder-settings"

            },
            vex: {
                searchButtonTitle: "#searchButtonTitle",
                searchInputFieldPlaceholder: "#searchInputFieldPlaceholder",
                filterByAvailabilityTitle: "#filterByAvailabilityTitle",
                filterByLanguageTitle: "#filterByLanguageTitle",
                filterByFunnelStageTitle: "#filterByFunnelStageTitle",
                filterByBusinessUnitTitle: "#filterByBusinessUnitTitle",
                filterByPersonaTitle: "#filterByPersonaTitle",
                filterByIndustryTitle: "#filterByIndustryTitle",
                filterByTopicTitle: "#filterByTopicTitle",
                noResultsMessage: "#noResultsMessage",
                saveSettings: "#save-virtual-event-settings"

            },
            accessProtection: {
                //locators for Landing page/authoring
                title: "#title",
                emailSuccessMsg: "#emailSuccess",
                emailFailedMsg: "#emailFailed",
                unAuthorizedEmailMsg: "#unauthorizedEmail",
                emailConfirmedMsg: "#confirmedAccess",
                emailInstructionMsg: "#instructionEmailMessage",
                helperMsg: "#helperMessage>textarea"
            }
        };
        this.forms = {
            nameInput: "#name",
            delete: "i[title='Delete form']",
        };
        this.ctas = {
            nameInput: "#name",
            delete: "i[title='Delete CTA']",
            ctaType: 'input[name="ctaType"]',
            ctaLabel: "#label",
            destinationLinkInput: "#destinationUrl",
            destinationEmailInput: "#mailto",
            editCTALable: 'div[data-qa-hook="preview-section-button-label"]>div>div>span>i'
        };
        this.imageLibrary = {};
        this.accessProtection = {};
        this.segments = {
            nameInput: "#name",
            editSegmentPreview: `div[data-qa-hook="segment-edit-card"]`,
            deleteIcon: `i[title="Delete Segment"]`,
            editSegments: 'i[title="Edit Segment"]',
            cloneSegments: 'i[title="Clone Segment"]',

        };
        this.routes = {
            nameInput: "#name",
            fallbackType: `input[name="fallbackDestinationType"]`,
            fallbackUrl: "#fallbackExternalUrl",
            deleteIcon: `i[title="Delete Route"]`,
            analytics: 'i[title="Route Analytics"]',
            editRoutes: 'i[title="Edit Route"]',
            copyClipboard: 'i[title="Copy to Clipboard"]',
            editMaping: 'i[title="Edit Mapping"]',
        };
        this.rightSidebarPreview = "div[data-qa-hook='page-preview']";
        this.antModal = ".ant-modal-content";
        this.contentTags = {
            nameInput: "#name"
        }
        this.linksAndSharing = {
            nameInput: "#name"
        }
        this.trackLabels = {
            nameInput: "#name"
        }
        this.visitorActivity = {
            nameInput: "#name",
            scoreInput: `input[name="engagementScore"]`,
            deleteIcon: `i[class*="trash"]`
        }
        this.dropdownMenuNav = 'ul[role="menu"]'
    }

    /*********************************************************************************/
    /********************************* WEBHOOKS **************************************/
    /*********************************************************************************/
    addWebhook(config) {
        const name = config.name
        const url = config.url // The endpoint api to send webhook events to
        const type = config.type // Get this from the dropdown options 
        let alreadyExists = false

        this.goToPage(this.pageTitles.webhooks, this.pageUrls.webhooks)
        cy.ifElementWithExactTextExists(this.table.cellName, name, 2000, () => {
            alreadyExists = true
        })
        cy.get('body').then(() => {
            if (!alreadyExists) {
                cy.contains("button", "Add Webhook").click()
                cy.get(this.modal).within(() => {
                    cy.get(this.addWebhookModal.name).clear().type(name)
                    if (url) {
                        cy.get(this.addWebhookModal.url).clear().type(url)
                    }
                    cy.get(this.dropdown.box).click()
                    cy.get(this.dropdown.option(type)).click()
                    cy.contains("button", "Add Webhook").click()
                })
                cy.get(this.modal, { timeout: 6000 }).should("not.exist")
            }
        })
        cy.contains(this.table.cellName, name).should("exist")
    }

    deleteWebhook(list) {
        const webhooks = [list].flat()

        this.goToPage(this.pageTitles.webhooks, this.pageUrls.webhooks)
        webhooks.forEach((webhook) => {
            cy.ifElementWithExactTextExists(this.table.cellName, webhook, 3000, () => {
                cy.angryClick({
                    clickElement: this.table.cellName + `:contains('${webhook}')`,
                    checkElement: this.webhookPreview.name + `:contains('${webhook}')`
                })
                cy.get(this.webhookPreview.delete).click()
                cy.contains("button", "Delete Webhook").click()
            })
            cy.contains(this.table.cellName, webhook).should("not.exist")
        })
    }

    configureWebhook(config) {
        const name = config.name
        const on_off = config.on_off // should be 'on' or 'off'
        const eventFields = config.eventFields // object: key must be the exact text of the event field 

        this.goToPage(this.pageTitles.webhooks, this.pageUrls.webhooks)
        cy.angryClick({
            clickElement: this.table.cellName + `:contains('${name}')`,
            checkElement: this.webhookPreview.name + `:contains('${name}')`
        })

        if (on_off) {
            this.toggle(this.webhookPreview.enableToggle, on_off)
        }

        if (eventFields) {
            this.configureEventFields(eventFields)
        }

    }

    configureEventFields(fields) {
        // Sometimes, the modal randomly closes... not sure why. Gonna angry click it to open it again if it closes
        cy.angryClick({
            clickElement: this.webhookPreview.eventFields,
            checkElement: this.modal
        })
        cy.get(this.modal).within(() => {
            Object.entries(fields).forEach((field) => {
                cy.ifNoElementWithExactTextExists(this.dropdown.selectedValue, field[0], 500, () => {
                    cy.log("adding field")
                    cy.contains("button", "Add Field").click()
                    cy.get(this.dropdown.selectedValue).last().click()
                    cy.get(this.dropdown.option(field[0])).click()
                }, 'div')
                cy.containsExact(this.dropdown.selectedValue, field[0]).parents().eq(7).within(() => {
                    cy.get("#value").invoke('attr', 'value').then((value) => {
                        if (value !== field[1]) {
                            cy.get("#value").clear().type(field[1])
                        }
                    })
                })
            })
            cy.contains("button", "Save").click()
        })
    }

    /*********************************************************************************/
    /********************************* EXTERNAL CODE *********************************/
    /*********************************************************************************/
    addExternalCode(config) {
        const { name, code, interceptCode } = config

        this.goToPage(this.pageTitles.externalCode, this.pageUrls.externalCode)
        cy.contains("button", "Add External Code").click()
        cy.get(this.modal).within(() => {
            cy.get(this.externalCode.nameInput).clear().type(name)
            if (code) {
                cy.get(this.externalCode.codeEditor).type(code, { force: true })
            }
            if (interceptCode) {
                cy.get(this.externalCode.codeEditor).type(interceptCode, { force: true, parseSpecialCharSequences: false })
                //NOTE: Commenting below piece of code, because in code editor , always same code is getting typed for diff code names.We can uncomment it later if required
                // cy.intercept('POST', "/api/v3/external_codes", (req) => {
                //     // It is necessary to intercept the request payload and set the code to what is intended
                //     // Because the code editor will automatically add closing tags etc, which screws up the code
                //     req.body.code = interceptCode
                // })
            }
            cy.contains("button", "Add External Code").click()
        })
    }

    openCodePreview(code) {
        cy.angryClick({ clickElement: this.table.cellName + `:contains('${code}')`, checkElement: `${this.externalCode.previewName}:contains('${code}')` })
    }

    deleteExternalCode(list) {
        const codes = [list].flat()

        this.goToPage(this.pageTitles.externalCode, this.pageUrls.externalCode)
        codes.forEach((code) => {
            cy.ifElementWithExactTextExists(this.table.cellName, code, 1500, () => {
                this.openCodePreview(code)
                cy.contains(this.previewSideBar, code).should('exist').within(() => {
                    cy.get(this.externalCode.deleteIcon).click()
                })
                cy.contains(this.modal, "Delete External Code?").within(() => {
                    cy.contains("button", "Delete External Code").click()
                })
            })
            cy.ifNoElementWithExactTextExists(this.modal, "Delete External Code?", 10000, () => { }) // This just smart-waits for modal to disappear
            cy.ifNoElementWithExactTextExists(this.table.cellName, code, 10000, () => { }) // This just smart-waits for widget to disappear
            cy.contains(this.table.cellName, code).should("not.exist")
        })
    }

    editExternalCode(config) {
        const { name, newName, newCode, interceptCode, global } = config

        this.goToPage(this.pageTitles.externalCode, this.pageUrls.externalCode)
        this.openCodePreview(name)
        if (newName) {
            cy.get(this.externalCode.previewName).click().within(() => {
                cy.get(this.externalCode.nameInput).clear().type(newName)
                cy.contains("button", "Save").click()
                cy.contains(newName).should("exist")
            })
            cy.containsExact(this.table.cellName, newName).should('exist')
        }

        if (global) {
            // global must be 'on' or 'off'
            this.toggle(this.externalCode.globalToggle, global)
        }

        if (newCode) {
            cy.get("code").click()
            cy.contains(this.modal, "Edit Code").within(() => {
                cy.get(this.externalCode.codeEditor).clear({ force: true }).type(newCode, { force: true })
                cy.contains("button", "Save Code").click()
            })
            cy.get(this.modal).should('not.exist')
            cy.contains(this.table.cellCode, newCode).should('exist')
        }

        if (interceptCode) {
            cy.contains(this.table.cellName, name).parent().invoke("attr", "data-qa-hook").then(val => {
                const matches = val.match(/\d+/g)
                const id = matches[0]

                cy.intercept('PATCH', `/api/v3/external_codes/${id}`, (req) => {
                    // set the request body to something different before it's sent to the destination
                    req.body.code = interceptCode
                })
                cy.get("code").click()
                cy.contains(this.modal, "Edit Code").within(() => {
                    cy.get(this.externalCode.codeEditor).clear({ force: true }).type("replace me", { force: true })
                    cy.contains("button", "Save Code").click()
                })
            })
        }
    }

    /*********************************************************************************/
    /********************************* WIDGETS ***************************************/
    /*********************************************************************************/
    addWidget(config) {
        let name = config.name
        let code = config.code
        let checkSuccess = config.checkSuccess == false ? false : true

        cy.contains("button", "Add Widget").click()
        cy.get(this.modal).within(() => {
            cy.get(this.widgets.nameInput).clear().type(name)

            if (code) {
                cy.get(this.widgets.codeEditor).type(code, { force: true })
            }
            cy.contains("button", "Add Widget").click()
        })
        if (checkSuccess) {
            cy.get(this.modal, { timeout: 20000 }).should("not.exist")
            cy.containsExact(this.table.cellName, name).should('exist')
            if (code) {
                cy.contains(this.table.cellCode, code).should('exist')
            }
        }
    }

    editWidget(config) {
        let name = config.name
        let newName = config.newName
        let newCode = config.newCode

        this.openWidgetPreview(name)
        if (newName) {
            cy.get(this.widgets.previewName).click().within(() => {
                cy.get(this.widgets.nameInput).clear().type(newName)
                cy.contains("button", "Save").click()
                cy.contains(newName).should("exist")
            })
            cy.containsExact(this.table.cellName, newName).should('exist')
        }

        if (newCode) {
            cy.get("code").click()
            cy.contains(this.modal, "Update Widget").within(() => {
                cy.get(this.widgets.codeEditor).clear({ force: true }).type(newCode, { force: true })
                cy.contains("button", "Save Widget").click()
            })
            cy.get(this.modal).should('not.exist')
            cy.contains(this.table.cellCode, newCode).should('exist')
        }
    }

    deleteWidgets(list) {
        let widgets = [list].flat()

        widgets.forEach((widget) => {
            cy.ifElementWithExactTextExists(this.table.cellName, widget, 1500, () => {
                this.openWidgetPreview(widget)
                cy.contains(this.previewSideBar, widget).should('exist').within(() => {
                    cy.get(this.widgets.deleteIcon).click()
                })
                cy.contains(this.modal, "Delete Widget?").within(() => {
                    cy.contains("button", "Delete Widget").click()
                })
            })
            cy.ifNoElementWithExactTextExists(this.modal, "Delete Widget?", 10000, () => { }) // This just smart-waits for modal to disappear
            cy.ifNoElementWithExactTextExists(this.table.cellName, widget, 10000, () => { }) // This just smart-waits for widget to disappear
            cy.containsExact(this.table.cellName, widget).should("not.exist")
        })
    }

    openWidgetPreview(widget) {
        cy.angryClick({ clickElement: this.table.cellName + `:contains('${widget}')`, checkElement: `${this.widgets.previewName}:contains('${widget}')` })
    }

    /*********************************************************************************/
    /************************************* FORMS *************************************/
    /*********************************************************************************/
    addForm(name) {
        this.goToPage(this.pageTitles.forms, this.pageUrls.forms)
        cy.contains("button", "Add Form").click()
        cy.get(this.forms.nameInput).clear().type(name + "\n")
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.containsExact(this.table.cellName, name, { timeout: 20000 }).should("exist")
    }

    deleteForm(name) {
        this.goToPage(this.pageTitles.forms, this.pageUrls.forms)
        cy.get(this.pageSearch, { timeout: 20000 }).type(name)
        cy.ifElementWithExactTextExists(this.table.cellName, name, 20000, () => {
            cy.containsExact(this.table.cellName, name).click()
            cy.get(this.forms.delete).click()
            cy.contains("button", "Delete Form").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.containsExact(this.table.cellName, name).should("not.exist")
    }

    /*********************************************************************************/
    /********************************* APPEARANCE ************************************/
    /*********************************************************************************/
    clickAppearance(appearance) {
        cy.get(this.appearances.sidebar).within(() => {
            cy.containsExact("a", appearance, { timeout: 10000 }).should("exist").click()
        })
    }

    clickAddAppearance() {
        cy.get(this.appearances.sidebar).within(() => {
            cy.containsExact("div", '+ Add Appearance', { timeout: 10000 }).click()
        })
    }

    gotoAppearanceTab(tabUrl) {
        // we need to pass in the url of the tab  
        cy.url().then((url) => {
            if (!url.includes("/" + tabUrl)) {
                const segements = url.split('/')
                segements[segements.length - 1] = "" + tabUrl
                var newurl = segements.join("/")
                cy.visit(newurl, { timeout: 30000 })
            }
        })
    }

    goToCampaignAppearance(appearance, campaignName) {
        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        this.clickAppearance(appearance)
        this.gotoAppearanceTab(campaignName)
    }

    deleteAppearance(name, verify) {
        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        cy.waitFor({ element: this.appearances.sidebar, to: "exist", wait: 10000 })
        cy.get(this.appearances.sidebar).within(sidebar => {
            if (sidebar.find(`a:contains("${name}")`).length > 0) {
                cy.containsExact("div", name).siblings("div").within(() => {
                    cy.get(this.deleteIcon).click({ force: true })
                })
                cy.do(() => {
                    // Cypress.$() not affected by within(), so useful to get the delete button in the outside modal
                    // Also, Cypress.$() is synchronous with rest of javascript and not queued like the cy commands,
                    // hence the need to put it inside a cy.do()
                    Cypress.$("button:contains('Delete Appearance')").click()
                })
            }
            if (verify !== false) {
                cy.containsExact("div", name).should("not.exist")
            }
        })
    }
    lastUpdatedDate() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = months[today.getMonth()]
        var yyyy = today.getFullYear();
        today = mm + ' ' + dd + ', ' + yyyy;
        return today;
    }

    addNewAppearance(options) {
        const { name, primaryColor, titleAppearanceFont, bodyTextFont, bobyTextcolor, verify } = options

        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        cy.waitFor({ element: `div:contains('${name}')`, to: "exist", wait: 2000 })
        cy.wait(3000)
        cy.ifNoElementWithExactTextExists("div", name, 5000, () => {
            this.clickAddAppearance()
            if (name) {
                cy.contains(this.modal, "Add Appearance").within(() => {
                    cy.get(this.appearances.appearanceName).clear().type(name)
                })
            }

            if (primaryColor) {
                const { r, g, b, a } = primaryColor
                this.pickColor({ button: this.appearances.primaryColor, r: r, g: g, b: b, a: a })
            }

            if (titleAppearanceFont) {
                cy.get(this.appearances.titleFont).within(() => {
                    cy.get(this.dropdown.input).type(titleAppearanceFont + "\n", { force: true })
                })
            }

            if (bodyTextFont) {
                cy.get(this.appearances.bodyTextFont).within(() => {
                    cy.get(this.dropdown.input).type(bodyTextFont + "\n", { force: true })
                })
            }

            if (bobyTextcolor) {
                const { r, g, b, a } = bodyTextFont
                this.pickColor({ button: this.appearances.bodyTextColor, r: r, g: g, b: b, a: a })
            }

            cy.contains(this.modal, "Add Appearance").within(() => {
                cy.contains("button", "Add Appearance").click()
            })

            if (verify !== false) {
                cy.waitFor({ element: this.modal, to: "not.exist" })
                cy.get(this.appearances.sidebar).within(() => {
                    cy.containsExact("div", name, { timeout: 5000 }).should("exist")
                })
            }
        })
    }

    addAppearanceExternalCode(codes, verify) {
        [codes].flat().forEach(code => {
            cy.get("div[class*='withFormFieldLayout']:contains('External Codes')").find(".Select-control").find("input").type(code + "\n", { force: true })
        })
        if (verify !== false) {
            [codes].flat().forEach(code => {
                cy.contains("span", code, { timeout: 10000 }).should("exist")
            })
        }
    }

    removeAppearanceExternalCode(list) {
        const codes = [list].flat()
        cy.get(this.dropdown.box).within(box => {
            codes.forEach(code => {
                if (box.find(`div[class="Select-value"]:contains('${code}')`).length > 0) {
                    cy.get(`div[class="Select-value"]:contains('${code}')`).children("span[class='Select-value-icon']").click()
                }
            })
        })
        cy.contains("button", "Save").click()
        cy.contains("The record was saved successfully", { timeout: 20000 }).should("exist")
        codes.forEach(code => {
            cy.contains('div[class="Select-value"]', code).should("not.exist")
        })
    }

    configureHeaderAppearance(options) {
        const {
            appearance,
            dynamicLogo,
            thumbnail,
            verify
        } = options

        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        this.clickAppearance(appearance)
        this.gotoAppearanceTab("header")

        if (dynamicLogo) {
            // dynamicLogo must either be "on" or "off"
            this.toggle(this.appearances.header.dynamicLogo, dynamicLogo)
        }

        if (thumbnail) {
            cy.get(this.appearances.imagePicker).click()
            this.pickThumbnail(thumbnail)
        }

        cy.contains("button", "Save Header Settings").click()

        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
        }
    }

    configureFlowAppearance(options) {
        const {
            appearance,
            thumbnail,
            verify
        } = options

        this.goToCampaignAppearance(appearance, "flow")

        if (thumbnail) {
            cy.get(this.appearances.imagePicker).click()
            this.pickThumbnail(thumbnail)
        }
        cy.contains("button", "Save Flow Settings").click()
        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
        }

    }

    configuretopicSidebarAppearance(options) {
        const {
            appearance,
            thumbnail,
            verify
        } = options

        this.goToCampaignAppearance(appearance, "topic-sidebar")

        if (thumbnail) {
            cy.get(this.appearances.imagePicker).click()
            this.pickThumbnail(thumbnail)
        }
        cy.contains("button", "Save Topic Sidebar Settings").click()
        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
        }

    }

    configureVEXAppearance(options) {
        const { appearance, backgroundColor, headerBackgroundColor, hideNavigation, externalCodes, layout, verify } = options
        const { headerTitleFontFamily, headerTitleBoldFont, headerTitleFontSize, headerTitleFontColor } = options
        const { bodyFontFamily, bodyBoldFont, bodyFontSize, bodyFontColor } = options
        const { activeFontFamily, activeBoldFont, activeFontSize, activeFontColor } = options
        const { sessionDescriptionFontFamily, sessionDescriptionFontWeight, sessionDescriptionFontSize, sessionDescriptionFontColor } = options
        const { landingPageCardRadius, landingPageSearchFilterRadius, landingPageSearchFilterFontFamily, landingPageSearchFilterColor, landingPageSearchFilterBackgroundColor } = options
        const { landingPageHeadingStyleFontFamily, landingPageHeadingStyleColor, landingPageHeadingStyleFontSize, landingPageCarouselArrowsColor, landingPageCarouselArrowsBackgroundColor } = options
        const { landingPageSearchFilterFontSize, landingPageSearchFieldFontFamily, landingPageSearchFieldColor, landingPageSearchFieldBackgroundColor, landingPageSearchFieldFontSize } = options
        const { landingPageNoResultsMsgFontFamily, landingPageNoResultsMsgColor, landingPageNoResultsMsgFontSize } = options

        this.goToCampaignAppearance(appearance, "virtual-event")
        if (backgroundColor) {
            const { r, g, b, a } = backgroundColor
            this.pickColor({ button: this.appearances.vex.backgroundColor, r: r, g: g, b: b, a: a })
        }
        if (headerBackgroundColor) {
            const { r, g, b, a } = headerBackgroundColor
            this.pickColor({ button: this.appearances.vex.headerBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (headerTitleFontFamily) {
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.dropdown.input).type(headerTitleFontFamily + "\n", { force: true })
            })
        }
        if (headerTitleBoldFont == true || headerTitleBoldFont == false) {
            cy.get(this.appearances.vex.headerFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (headerTitleBoldFont && !fontWeightClass.includes("containerActive") || !headerTitleBoldFont && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.vex.headerFontWeight).click()
                }
            })
        }
        if (headerTitleFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.appearances[size[headerTitleFontSize]]).click()
            })
        }
        if (headerTitleFontColor) {
            const { r, g, b, a } = headerTitleFontColor
            this.pickColor({ button: this.appearances.vex.headerFontColor, r: r, g: g, b: b, a: a })
        }
        if (bodyFontFamily) {
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.dropdown.input).type(bodyFontFamily + "\n", { force: true })
            })
        }
        if (bodyBoldFont == true || bodyBoldFont == false) {
            cy.get(this.appearances.vex.bodyFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (bodyBoldFont && !fontWeightClass.includes("containerActive") || !bodyBoldFont && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.vex.bodyFontWeight).click()
                }
            })
        }
        if (bodyFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.appearances[size[bodyFontSize]]).click()
            })
        }
        if (bodyFontColor) {
            const { r, g, b, a } = bodyFontColor
            this.pickColor({ button: this.appearances.vex.bodyFontColor, r: r, g: g, b: b, a: a })
        }

        if (activeFontFamily) {
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.dropdown.input).type(activeFontFamily + "\n", { force: true })
            })
        }
        if (activeBoldFont == true || activeBoldFont == false) {
            cy.get(this.appearances.vex.activeFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (activeBoldFont && !fontWeightClass.includes("containerActive") || !activeBoldFont && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.vex.activeFontWeight).click()
                }
            })
        }
        if (activeFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.appearances[size[activeFontSize]]).click()
            })
        }
        if (activeFontColor) {
            const { r, g, b, a } = activeFontColor
            this.pickColor({ button: this.appearances.vex.activeFontColor, r: r, g: g, b: b, a: a })
        }
        if (sessionDescriptionFontFamily) {
            cy.get(this.appearances.vex.sessionDescriptionSettings).within(() => {
                cy.get(this.dropdown.input).type(sessionDescriptionFontFamily + "\n", { force: true })
            })
        }
        if (sessionDescriptionFontWeight == true || sessionDescriptionFontWeight == false) {
            cy.get(this.appearances.vex.sessionDescriptionFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (sessionDescriptionFontWeight && !fontWeightClass.includes("containerActive") || !sessionDescriptionFontWeight && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.vex.sessionDescriptionFontWeight).click()
                }
            })
        }
        if (sessionDescriptionFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.sessionDescriptionSettings).within(() => {
                cy.get(this.appearances[size[sessionDescriptionFontSize]]).click()
            })
        }
        if (sessionDescriptionFontColor) {
            const { r, g, b, a } = sessionDescriptionFontColor
            this.pickColor({ button: this.appearances.vex.sessionDescriptionFontColor, r: r, g: g, b: b, a: a })
        }
        if (hideNavigation == true || hideNavigation == false) {
            cy.get(this.appearances.vex.hideNavigation).invoke("attr", "class").then(checkboxClass => {
                if (hideNavigation && checkboxClass.includes("checkbox-container--unchecked") || !hideNavigation && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.appearances.vex.hideNavigation).click()
                }
            })
        }
        if (externalCodes) {
            this.addAppearanceExternalCode(externalCodes, verify)
        }
        if (layout) {
            // Values should be "Grid" or "Carousel"
            cy.get("div[class*='withFormFieldLayout']:contains('Landing Page Layout')").within(() => {
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(layout)).click()
            })
        }
        if (landingPageCardRadius) {
            cy.get(this.appearances.vex.cardRadius).clear().type(`{selectall}${landingPageCardRadius}` + "\n", { force: true })
        }
        if (landingPageSearchFilterRadius) {
            cy.wait(1000)
            cy.get(this.appearances.vex.searchFilterRadius).clear({ force: true }).type(`{selectall}${landingPageSearchFilterRadius}` + "\n", { force: true })
            cy.wait(1000)
        }
        if (landingPageSearchFilterFontFamily) {
            cy.get(this.appearances.vex.searchFilterSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageSearchFilterFontFamily + "\n", { force: true })
            })
        }
        if (landingPageSearchFilterColor) {
            const { r, g, b, a } = landingPageSearchFilterColor
            this.pickColor({ button: this.appearances.vex.searchFilterColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFilterBackgroundColor) {
            const { r, g, b, a } = landingPageSearchFilterBackgroundColor
            this.pickColor({ button: this.appearances.vex.searchFilterBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFilterFontSize) {
            const size = { small: "searchFiltersStyleFontSizeSmall", medium: "searchFiltersStyleFontSizeMedium", large: "searchFiltersStyleFontSizeLarge" }
            cy.get(this.appearances.vex.searchFilterSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageSearchFilterFontSize]]).click()
            })
        }
        if (landingPageSearchFieldFontFamily) {
            cy.get(this.appearances.vex.searchFieldSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageSearchFieldFontFamily + "\n", { force: true })
            })
        }
        if (landingPageSearchFieldColor) {
            const { r, g, b, a } = landingPageSearchFieldColor
            this.pickColor({ button: this.appearances.vex.searchFieldColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFieldBackgroundColor) {
            const { r, g, b, a } = landingPageSearchFieldBackgroundColor
            this.pickColor({ button: this.appearances.vex.searchFieldBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFieldFontSize) {
            const size = { small: "searchFieldStyleFontSizeSmall", medium: "searchFieldsStyleFontSizeMedium", large: "searchFieldStyleFontSizeLarge" }
            cy.get(this.appearances.vex.searchFieldSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageSearchFieldFontSize]]).click()
            })
        }
        if (landingPageHeadingStyleFontFamily) {
            cy.get(this.appearances.vex.headingStyleSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageHeadingStyleFontFamily + "\n", { force: true })
            })
        }
        if (landingPageHeadingStyleColor) {
            const { r, g, b, a } = landingPageHeadingStyleColor
            this.pickColor({ button: this.appearances.vex.headingStyleColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageHeadingStyleFontSize) {
            const size = { small: "defaultHeadingFontSizeSmall", medium: "defaultHeadingFontSizeMedium", large: "defaultHeadingFontSizeLarge" }
            cy.get(this.appearances.vex.headingStyleSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageHeadingStyleFontSize]]).click()
            })
        }
        if (landingPageCarouselArrowsColor) {
            const { r, g, b, a } = landingPageCarouselArrowsColor
            this.pickColor({ button: this.appearances.vex.carouselArrowsColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageCarouselArrowsBackgroundColor) {
            const { r, g, b, a } = landingPageCarouselArrowsBackgroundColor
            this.pickColor({ button: this.appearances.vex.carouselArrowsBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageNoResultsMsgFontFamily) {
            cy.get(this.appearances.vex.noResultMsgSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageNoResultsMsgFontFamily + "\n", { force: true })
            })
        }
        if (landingPageNoResultsMsgColor) {
            const { r, g, b, a } = landingPageNoResultsMsgColor
            this.pickColor({ button: this.appearances.vex.noResultsMsgColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageNoResultsMsgFontSize) {
            const size = { small: "noResultsMessageFontSizeSmall", medium: "noResultsMessageFontSizeMedium", large: "noResultsMessageFontSizeLarge" }
            cy.get(this.appearances.vex.noResultMsgSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageNoResultsMsgFontSize]]).click()
            })
        }
        cy.contains("button", "Save Virtual Event Settings").click()

        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
            this.verifyVEXappearance(options)
        }
    }

    verifyVEXappearance(options) {
        const { backgroundColor, headerBackgroundColor, hideNavigation, layout } = options
        const { headerTitleFontFamily, headerTitleBoldFont, headerTitleFontSize, headerTitleFontColor } = options
        const { bodyFontFamily, bodyBoldFont, bodyFontSize, bodyFontColor } = options
        const { activeFontFamily, activeBoldFont, activeFontSize, activeFontColor } = options
        const { sessionDescriptionFontFamily, sessionDescriptionFontWeight, sessionDescriptionFontSize, sessionDescriptionFontColor } = options
        const { landingPageCardRadius, landingPageSearchFilterRadius, landingPageSearchFilterFontFamily, landingPageSearchFilterColor, landingPageSearchFilterBackgroundColor } = options
        const { landingPageHeadingStyleFontFamily, landingPageHeadingStyleColor, landingPageHeadingStyleFontSize, landingPageCarouselArrowsColor, landingPageCarouselArrowsBackgroundColor } = options
        const { landingPageSearchFilterFontSize, landingPageSearchFieldFontFamily, landingPageSearchFieldColor, landingPageSearchFieldBackgroundColor, landingPageSearchFieldFontSize } = options
        const { landingPageNoResultsMsgFontFamily, landingPageNoResultsMsgColor, landingPageNoResultsMsgFontSize } = options

        if (backgroundColor) {
            const { r, g, b, a } = backgroundColor
            cy.get(this.appearances.vex.backgroundColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if (headerBackgroundColor) {
            const { r, g, b, a } = headerBackgroundColor
            cy.get(this.appearances.vex.headerBackgroundColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if (headerTitleFontFamily) {
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", headerTitleFontFamily)
            })
        }

        if (headerTitleBoldFont == true || headerTitleBoldFont == false) {
            const containOrNotContain = headerTitleBoldFont ? "contain" : "not.contain"
            cy.get(this.appearances.vex.headerFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if (headerTitleFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.appearances[size[headerTitleFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }

        if (headerTitleFontColor) {
            const { r, g, b, a } = headerTitleFontColor
            cy.get(this.appearances.vex.headerFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if (bodyFontFamily) {
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", bodyFontFamily)
            })
        }

        if (bodyBoldFont == true || bodyBoldFont == false) {
            const containOrNotContain = bodyBoldFont ? "contain" : "not.contain"
            cy.get(this.appearances.vex.bodyFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if (bodyFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.appearances[size[bodyFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }

        if (bodyFontColor) {
            const { r, g, b, a } = bodyFontColor
            cy.get(this.appearances.vex.bodyFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if (activeFontFamily) {
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", activeFontFamily)
            })
        }

        if (activeBoldFont == true || activeBoldFont == false) {
            const containOrNotContain = activeBoldFont ? "contain" : "not.contain"
            cy.get(this.appearances.vex.activeFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if (activeFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.appearances[size[activeFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (activeFontColor) {
            const { r, g, b, a } = activeFontColor
            cy.get(this.appearances.vex.activeFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (hideNavigation == true || hideNavigation == false) {
            cy.get(this.appearances.vex.hideNavigation).invoke("attr", "class").then(checkboxClass => {
                const checkOrUnchecked = hideNavigation ? "checkbox-container--checked" : "checkbox-container--unchecked"
                expect(checkboxClass).to.include(checkOrUnchecked)
            })
        }
        if (layout) {
            cy.get("div[class*='withFormFieldLayout']:contains('Landing Page Layout')").within(() => {
                cy.contains("span", layout).should("exist")
            })
        }
        if (sessionDescriptionFontFamily) {
            cy.get(this.appearances.vex.sessionDescriptionSettings).parent().within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", sessionDescriptionFontFamily)
            })
        }
        if (sessionDescriptionFontWeight == true || sessionDescriptionFontWeight == false) {
            const containOrNotContain = sessionDescriptionFontWeight ? "contain" : "not.contain"
            cy.get(this.appearances.vex.sessionDescriptionFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }
        if (sessionDescriptionFontSize) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.vex.sessionDescriptionSettings).parent().within(() => {
                cy.get(this.appearances[size[sessionDescriptionFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (sessionDescriptionFontColor) {
            const { r, g, b, a } = sessionDescriptionFontColor
            cy.get(this.appearances.vex.sessionDescriptionFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (landingPageCardRadius) {
            cy.get(this.appearances.vex.cardRadius).invoke("attr", "value").should("contain", landingPageCardRadius)
        }
        if (landingPageSearchFilterRadius) {
            cy.get(this.appearances.vex.searchFilterRadius).invoke("attr", "value").should("contain", landingPageSearchFilterRadius)
        }
        if (landingPageSearchFilterFontFamily) {
            cy.get(this.appearances.vex.searchFilterSettings).parent().within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", landingPageSearchFilterFontFamily)
            })
        }
        if (landingPageSearchFilterColor) {
            const { r, g, b, a } = landingPageSearchFilterColor
            cy.get(this.appearances.vex.searchFilterColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const colorStyle = a == 1 ? `color: rgb(${r}, ${g}, ${b})` : `color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(colorStyle)
                })
            })
        }
        if (landingPageSearchFilterBackgroundColor) {
            const { r, g, b, a } = landingPageSearchFilterBackgroundColor
            cy.get(this.appearances.vex.searchFilterBackgroundColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (landingPageSearchFilterFontSize) {
            const size = { small: "searchFiltersStyleFontSizeSmall", medium: "searchFiltersStyleFontSizeMedium", large: "searchFiltersStyleFontSizeLarge" }
            cy.get(this.appearances.vex.searchFilterSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageSearchFilterFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (landingPageSearchFieldFontFamily) {
            cy.get(this.appearances.vex.searchFieldSettings).parent().within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", landingPageSearchFieldFontFamily)
            })
        }
        if (landingPageSearchFieldColor) {
            const { r, g, b, a } = landingPageSearchFieldColor
            cy.get(this.appearances.vex.searchFieldColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const colorStyle = a == 1 ? `color: rgb(${r}, ${g}, ${b})` : `color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(colorStyle)
                })
            })
        }
        if (landingPageSearchFieldBackgroundColor) {
            const { r, g, b, a } = landingPageSearchFieldBackgroundColor
            cy.get(this.appearances.vex.searchFieldBackgroundColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (landingPageSearchFieldFontSize) {
            const size = { small: "searchFieldStyleFontSizeSmall", medium: "searchFieldsStyleFontSizeMedium", large: "searchFieldStyleFontSizeLarge" }
            cy.get(this.appearances.vex.searchFieldSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageSearchFieldFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (landingPageHeadingStyleFontFamily) {
            cy.get(this.appearances.vex.headingStyleSettings).parent().within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", landingPageHeadingStyleFontFamily)
            })
        }
        if (landingPageHeadingStyleColor) {
            const { r, g, b, a } = landingPageHeadingStyleColor
            cy.get(this.appearances.vex.headingStyleColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const colorStyle = a == 1 ? `color: rgb(${r}, ${g}, ${b})` : `color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(colorStyle)
                })
            })
        }
        if (landingPageHeadingStyleFontSize) {
            const size = { small: "defaultHeadingFontSizeSmall", medium: "defaultHeadingFontSizeMedium", large: "defaultHeadingFontSizeLarge" }
            cy.get(this.appearances.vex.headingStyleSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageHeadingStyleFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (landingPageCarouselArrowsColor) {
            const { r, g, b, a } = landingPageCarouselArrowsColor
            cy.get(this.appearances.vex.carouselArrowsColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const colorStyle = a == 1 ? `color: rgb(${r}, ${g}, ${b})` : `color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(colorStyle)
                })
            })
        }
        if (landingPageCarouselArrowsBackgroundColor) {
            const { r, g, b, a } = landingPageCarouselArrowsBackgroundColor
            cy.get(this.appearances.vex.carouselArrowsBackgroundColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (landingPageNoResultsMsgFontFamily) {
            cy.get(this.appearances.vex.noResultMsgSettings).parent().within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", landingPageNoResultsMsgFontFamily)
            })
        }
        if (landingPageNoResultsMsgColor) {
            const { r, g, b, a } = landingPageNoResultsMsgColor
            cy.get(this.appearances.vex.noResultsMsgColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const colorStyle = a == 1 ? `color: rgb(${r}, ${g}, ${b})` : `color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(colorStyle)
                })
            })
        }
        if (landingPageNoResultsMsgFontSize) {
            const size = { small: "noResultsMessageFontSizeSmall", medium: "noResultsMessageFontSizeMedium", large: "noResultsMessageFontSizeLarge" }
            cy.get(this.appearances.vex.noResultMsgSettings).parent().within(() => {
                cy.get(this.appearances.vex[size[landingPageNoResultsMsgFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
    }

    configureMicrositesAppearance(options) {
        const { appearance, hideNavigation, externalCodes, layout, verify } = options
        const { contentTypeTopicLabelsFontFamily, contentTypeTopicLabelsFontWeight, contentTypeTopicLabelsFontStyle, contentTypeTopicLabelsTextDecoration, contentTypeTopicLabelsColor, contentTypeTopicLabelsBackgroundColor } = options
        const { landingPageCardRadius, landingPageSearchFilterRadius, landingPageSearchFilterFontFamily, landingPageSearchFilterColor, landingPageSearchFilterBackgroundColor } = options
        const { landingPageHeadingStyleFontFamily, landingPageHeadingStyleColor, landingPageHeadingStyleFontSize, landingPageCarouselArrowsColor, landingPageCarouselArrowsBackgroundColor } = options
        const { landingPageSearchFilterFontSize, landingPageSearchFieldFontFamily, landingPageSearchFieldColor, landingPageSearchFieldBackgroundColor, landingPageSearchFieldFontSize } = options
        const { landingPageNoResultsMsgFontFamily, landingPageNoResultsMsgColor, landingPageNoResultsMsgFontSize } = options

        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        this.clickAppearance(appearance)
        this.gotoAppearanceTab("microsite-builder")

        if (hideNavigation == true || hideNavigation == false) {
            cy.get(this.appearances.microsites.hideNavigation).invoke("attr", "class").then(checkboxClass => {
                if (hideNavigation && checkboxClass.includes("checkbox-container--unchecked") || !hideNavigation && checkboxClass.includes("checkbox-container--checked")) {
                    cy.get(this.appearances.microsites.hideNavigation).click()
                }
            })
        }

        if (externalCodes) {
            this.addAppearanceExternalCode(externalCodes, verify)
        }

        if (layout) {
            // Values should be "Grid" or "Carousel"
            cy.get("div[class*='withFormFieldLayout']:contains('Landing Page Layout')").within(() => {
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(layout)).click()
            })
        }

        if (contentTypeTopicLabelsFontFamily) {
            cy.get(this.appearances.microsites.contentTypeTopicLabelsSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(contentTypeTopicLabelsFontFamily + "\n", { force: true })
            })
        }
        if (contentTypeTopicLabelsFontWeight == true || contentTypeTopicLabelsFontWeight == false) {
            cy.get(this.appearances.microsites.contentTypeTopicLabelsFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (contentTypeTopicLabelsFontWeight && !fontWeightClass.includes("containerActive") || !contentTypeTopicLabelsFontWeight && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.microsites.contentTypeTopicLabelsFontWeight).click()
                }
            })
        }
        if (contentTypeTopicLabelsFontStyle == true || contentTypeTopicLabelsFontStyle == false) {
            cy.get(this.appearances.microsites.contentTypeTopicLabelsFontStyle).invoke("attr", "value").then(fonStyleValue => {
                if (contentTypeTopicLabelsFontStyle && !fonStyleValue.includes("italic") || !contentTypeTopicLabelsFontStyle && fonStyleValue.includes("italic")) {
                    cy.get(this.appearances.microsites.contentTypeTopicLabelsFontStyle).click()
                }
            })
        }
        if (contentTypeTopicLabelsTextDecoration == true || contentTypeTopicLabelsTextDecoration == false) {
            cy.get(this.appearances.microsites.contentTypeTopicLabelsTextDecoration).invoke("attr", "value").then(fonStyleValue => {
                if (contentTypeTopicLabelsTextDecoration && !fonStyleValue.includes("underline") || !contentTypeTopicLabelsTextDecoration && fonStyleValue.includes("underline")) {
                    cy.get(this.appearances.microsites.contentTypeTopicLabelsTextDecoration).click()
                }
            })
        }
        if (contentTypeTopicLabelsColor) {
            const { r, g, b, a } = contentTypeTopicLabelsColor
            this.pickColor({ button: this.appearances.microsites.contentTypeTopicLabelsColor, r: r, g: g, b: b, a: a })
        }
        if (contentTypeTopicLabelsBackgroundColor) {
            const { r, g, b, a } = contentTypeTopicLabelsBackgroundColor
            this.pickColor({ button: this.appearances.microsites.contentTypeTopicLabelsBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageCardRadius) {
            cy.get(this.appearances.microsites.cardRadius).type(`{selectall}${landingPageCardRadius}` + "\n", { force: true })
        }
        cy.wait(1000)
        if (landingPageSearchFilterRadius) {
            cy.get(this.appearances.microsites.searchFilterRadius).type(`{selectall}${landingPageSearchFilterRadius}` + "\n", { force: true })
        }
        if (landingPageSearchFilterFontFamily) {
            cy.get(this.appearances.microsites.searchFilterSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageSearchFilterFontFamily + "\n", { force: true })
            })
        }
        if (landingPageSearchFilterColor) {
            const { r, g, b, a } = landingPageSearchFilterColor
            this.pickColor({ button: this.appearances.microsites.searchFilterColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFilterBackgroundColor) {
            const { r, g, b, a } = landingPageSearchFilterBackgroundColor
            this.pickColor({ button: this.appearances.microsites.searchFilterBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFilterFontSize) {
            const size = { small: "searchFiltersStyleFontSizeSmall", medium: "searchFiltersStyleFontSizeMedium", large: "searchFiltersStyleFontSizeLarge" }
            cy.get(this.appearances.microsites.searchFilterSettings).parent().within(() => {
                cy.get(this.appearances.microsites[size[landingPageSearchFilterFontSize]]).click()
            })
        }
        if (landingPageSearchFieldFontFamily) {
            cy.get(this.appearances.microsites.searchFieldSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageSearchFieldFontFamily + "\n", { force: true })
            })
        }
        if (landingPageSearchFieldColor) {
            const { r, g, b, a } = landingPageSearchFieldColor
            this.pickColor({ button: this.appearances.microsites.searchFieldColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFieldBackgroundColor) {
            const { r, g, b, a } = landingPageSearchFieldBackgroundColor
            this.pickColor({ button: this.appearances.microsites.searchFieldBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageSearchFieldFontSize) {
            const size = { small: "searchFieldStyleFontSizeSmall", medium: "searchFieldsStyleFontSizeMedium", large: "searchFieldStyleFontSizeLarge" }
            cy.get(this.appearances.microsites.searchFieldSettings).parent().within(() => {
                cy.get(this.appearances.microsites[size[landingPageSearchFieldFontSize]]).click()
            })
        }
        if (landingPageHeadingStyleFontFamily) {
            cy.get(this.appearances.microsites.headingStyleSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageHeadingStyleFontFamily + "\n", { force: true })
            })
        }
        if (landingPageHeadingStyleColor) {
            const { r, g, b, a } = landingPageHeadingStyleColor
            this.pickColor({ button: this.appearances.microsites.headingStyleColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageHeadingStyleFontSize) {
            const size = { small: "defaultHeadingFontSizeSmall", medium: "defaultHeadingFontSizeMedium", large: "defaultHeadingFontSizeLarge" }
            cy.get(this.appearances.microsites.headingStyleSettings).parent().within(() => {
                cy.get(this.appearances.microsites[size[landingPageHeadingStyleFontSize]]).click()
            })
        }
        if (landingPageCarouselArrowsColor) {
            const { r, g, b, a } = landingPageCarouselArrowsColor
            this.pickColor({ button: this.appearances.microsites.carouselArrowsColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageCarouselArrowsBackgroundColor) {
            const { r, g, b, a } = landingPageCarouselArrowsBackgroundColor
            this.pickColor({ button: this.appearances.microsites.carouselArrowsBackgroundColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageNoResultsMsgFontFamily) {
            cy.get(this.appearances.microsites.noResultMsgSettings).parent().within(() => {
                cy.get(this.dropdown.input).type(landingPageNoResultsMsgFontFamily + "\n", { force: true })
            })
        }
        if (landingPageNoResultsMsgColor) {
            const { r, g, b, a } = landingPageNoResultsMsgColor
            this.pickColor({ button: this.appearances.microsites.noResultsMsgColor, r: r, g: g, b: b, a: a })
        }
        if (landingPageNoResultsMsgFontSize) {
            const size = { small: "noResultsMessageFontSizeSmall", medium: "noResultsMessageFontSizeMedium", large: "noResultsMessageFontSizeLarge" }
            cy.get(this.appearances.microsites.noResultMsgSettings).parent().within(() => {
                cy.get(this.appearances.microsites[size[landingPageNoResultsMsgFontSize]]).click()
            })
        }

        cy.contains("button", "Save Microsite Builder Settings").click()

        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
            this.verifyMicrositeAppearance(options)
        }

    }

    verifyMicrositeAppearance(options) {
        const { hideNavigation, layout } = options

        if (hideNavigation == true || hideNavigation == false) {
            cy.get(this.appearances.microsites.hideNavigation).invoke("attr", "class").then(checkboxClass => {
                const checkOrUnchecked = hideNavigation ? "checkbox-container--checked" : "checkbox-container--unchecked"
                expect(checkboxClass).to.include(checkOrUnchecked)
            })
        }

        if (layout) {
            cy.get("div[class*='withFormFieldLayout']:contains('Landing Page Layout')").within(() => {
                cy.contains("span", layout).should("exist")
            })
        }
    }

    configureExploreAppearance(options) {
        const { appearance, externalCodes, verify } = options
        const { heroTitleFontFamily, heroTitleBoldFont, heroTitleFontSize, heroTitleFontColor, heroSubtitleFontFamily, heroSubtitleFontSize, heroSubtitleBoldFont, heroSubtitleFontColor } = options

        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        this.clickAppearance(appearance)
        this.gotoAppearanceTab("explore")

        if (externalCodes) {
            this.addAppearanceExternalCode(externalCodes, verify)
        }

        if (heroTitleFontFamily) {
            cy.get(this.appearances.explore.heroTitleFontFamily).within(() => {
                cy.get(this.dropdown.input).type(heroTitleFontFamily + "\n", { force: true })
            })
        }

        if (heroTitleBoldFont == true || heroTitleBoldFont == false) {
            cy.get(this.appearances.explore.heroTitleFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (heroTitleBoldFont && !fontWeightClass.includes("containerActive") || !heroTitleBoldFont && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.explore.heroTitleFontWeight).click()
                }
            })
        }

        if (heroTitleFontSize) {
            const size = { small: "#heroTitleFontSizeSmall", medium: "#heroTitleFontSizeMedium", large: "#heroTitleFontSizeLarge" }
            cy.get(this.appearances.explore.heroTitleStyle).parent().within(() => {
                cy.get(size[heroTitleFontSize]).click()
            })
        }

        if (heroTitleFontColor) {
            const { r, g, b, a } = heroTitleFontColor
            this.pickColor({ button: this.appearances.explore.heroTitleColor, r: r, g: g, b: b, a: a })
        }

        if (heroSubtitleFontFamily) {
            cy.get(this.appearances.explore.heroSubtitleFontFamily).within(() => {
                cy.get(this.dropdown.input).type(heroSubtitleFontFamily + "\n", { force: true })
            })
        }

        if (heroSubtitleBoldFont == true || heroSubtitleBoldFont == false) {
            cy.get(this.appearances.explore.heroSubtitleFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if (heroSubtitleBoldFont && !fontWeightClass.includes("containerActive") || !heroSubtitleBoldFont && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.explore.heroSubtitleFontWeight).click()
                }
            })
        }

        if (heroSubtitleFontSize) {
            const size = { small: "#heroSubtitleFontSizeSmall", medium: "#heroSubtitleFontSizeMedium", large: "#heroSubtitleFontSizeLarge" }
            cy.get(this.appearances.explore.heroSubtitleStyle).parent().within(() => {
                cy.get(size[heroSubtitleFontSize]).click()
            })
        }

        if (heroSubtitleFontColor) {
            const { r, g, b, a } = heroSubtitleFontColor
            this.pickColor({ button: this.appearances.explore.heroSubtitleFontColor, r: r, g: g, b: b, a: a })
        }

        cy.contains("button", "Save Explore Settings").click()

        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
        }
    }

    /*********************************************************************************/
    /********************************* LANGUAGES **************************************/
    /*********************************************************************************/

    clickAddLanguage() {
        cy.get(this.languages.sidebar).within(() => {
            cy.containsExact("div", '+ Add Language', { timeout: 10000 }).click()
        })
    }

    clicklanguage(language) {
        cy.get(this.languages.sidebar).within(() => {
            cy.containsExact("a", language, { timeout: 10000 }).should("exist").click()
        })
    }

    gotoLanguageTab(tabUrl) {
        // we need to pass in the url of the tab 
        cy.url().then((url) => {
            if (!url.includes("/" + tabUrl)) {
                const segements = url.split('/')
                segements[segements.length - 1] = "" + tabUrl
                var newurl = segements.join("/")
                cy.visit(newurl, { timeout: 20000 })
            }
        })
    }

    addNewLanguage(options) {
        const { name, code } = options
        this.goToPage(this.pageTitles.languages, this.pageUrls.languages)
        cy.waitFor({ element: `div:contains('${name}')`, to: "exist", wait: 2000 })

        cy.get("#sidebarScroller").then(sidebar => {
            if (sidebar.find(`a:contains('${name}')`).length === 0) {
                this.clickAddLanguage()
                cy.contains(this.modal, "Add Language").within(() => {
                    cy.get(this.dropdown.input).type(name + "\n", { force: true })
                    cy.ifElementWithExactTextExists("span", "Language Code", 1000, () => {
                        cy.get(this.languages.code).clear().type(code)
                    })
                    cy.contains("button", "Add Language").click()
                })

                cy.waitFor({ element: this.modal, to: "not.exist" })
                cy.get(this.languages.sidebar).within(() => {
                    cy.containsExact("div", name, { timeout: 5000 }).should("exist")
                })
            }
        })
    }

    configureExploreLanguage(options) {
        const { name, featuredLabel, search, searchInputPlaceholder, filterByContentType, verify } = options
        const { filterByFunnelStage, filterByBusinessUnit, filterByPersona, filterByIndustryTitle } = options

        this.goToPage(this.pageTitles.languages, this.pageUrls.languages)
        this.clicklanguage(name)
        this.gotoLanguageTab("explore")

        if (featuredLabel) {
            cy.get(this.languages.explore.featuredLabelInput).clear().type(featuredLabel)
        }

        if (search) {
            cy.get(this.languages.explore.searchInput).clear().type(search)
        }

        if (searchInputPlaceholder) {
            cy.get(this.languages.explore.searchPlaceholderInput).clear().type(searchInputPlaceholder)
        }

        if (filterByContentType) {
            cy.get(this.languages.explore.contentTypeInput).clear().type(filterByContentType)
        }

        if (filterByFunnelStage) {
            cy.get(this.languages.explore.funnelStageInput).clear().type(filterByFunnelStage)
        }

        if (filterByBusinessUnit) {
            cy.get(this.languages.explore.businessUnitInput).clear().type(filterByBusinessUnit)
        }

        if (filterByPersona) {
            cy.get(this.languages.explore.personaInput).clear().type(filterByPersona)
        }

        if (filterByIndustryTitle) {
            cy.get(this.languages.explore.industryTitleInput).clear().type(filterByIndustryTitle)
        }

        cy.contains("button", "Save Explore Settings").click()

        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
        }
    }

    resetLanguageSetting(options) {
        const { name, tab } = options
        this.clicklanguage(name)
        this.gotoLanguageTab(tab)
        cy.wait(5000)
        cy.get("#reset-settings", { timeout: 10000 }).scrollIntoView().click()
        cy.wait(2000)
        cy.contains(this.modal, "Are you sure?", { timeout: 10000 }).within(() => {
            cy.wait(2000)
            cy.contains("button", "Yes", { timeout: 10000 }).should("be.visible").click()
            cy.wait(2000)
        })

        cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
    }
    //I have added hard wait to make this function work. In regression if it's still fail then will remove waits
    deleteLanguage(name, verify) {
        this.goToPage(this.pageTitles.languages, this.pageUrls.languages)
        cy.waitFor({ element: this.pageSidebar, to: "exist", wait: 10000 })
        cy.wait(2000)
        cy.get(this.pageSidebar).within(sidebar => {
            cy.wait(2000)
            if (sidebar.find(`a:contains("${name}")`).length > 0) {
                cy.wait(2000)
                cy.containsExact("div", name).siblings("div").within(() => {
                    cy.wait(2000)
                    cy.get(this.deleteIcon).click({ force: true })
                })
                cy.do(() => {
                    // Cypress.$() not affected by within(), so useful to get the delete button in the outside modal
                    // Also, Cypress.$() is synchronous with rest of javascript and not queued like the cy commands,
                    // hence the need to put it inside a cy.do()
                    Cypress.$("button:contains('Delete Language')").click()
                })
            }
            if (verify !== false) {
                cy.containsExact("div", name).should("not.exist")
            }
        })
    }

    /*********************************************************************************/
    /**************************** ACCESS PROTECTION **********************************/
    /*********************************************************************************/

    addAccessProtectionGroup(name, description) {
        cy.get("#group-card-add").click()
        cy.get(this.antModal).within(() => {
            cy.get(this.addAccessProtectionGroupModal.name).clear().type(name)
            if (description) {
                cy.get(this.addAccessProtectionGroupModal.description).clear().type(description)
            }
            cy.contains("button", "Add Group").click()
        })
    }

    deleteAccessProtectionGroup(name) {
        cy.waitFor({ element: this.pageSidebar, to: "exist", wait: 10000 })
        cy.get(this.pageSidebar).within(sidebar => {
            if (sidebar.find(`a:contains("${name}")`).length > 0) {
                cy.containsExact("div", name).siblings("div").within(() => {
                    cy.get(this.deleteIcon).click({ force: true })
                })
                cy.do(() => {
                    // Cypress.$() not affected by within(), so useful to get the delete button in the outside modal
                    // Also, Cypress.$() is synchronous with rest of javascript and not queued like the cy commands,
                    // hence the need to put it inside a cy.do()
                    Cypress.$("button:contains('OK')").click()
                })
            }
            cy.containsExact("div", name).should("not.exist")
        })
    }

    /*********************************************************************************/
    /******************************* CONTENT TAGS*************************************/
    /*********************************************************************************/

    addTopicTag(name) {
        cy.contains("button", "Add Topic").click()
        cy.get(this.contentTags.nameInput).clear().type(name)
        cy.get(this.contentTags.nameInput).parent().within(() => {
            cy.contains("button", "Add").click()
        })
        cy.contains("span", name).should("exist")
    }

    deleteTopicTag(name) {
        cy.ifElementWithExactTextExists("span", name, 4000, () => {
            cy.contains("span", name).parent().within(() => {
                cy.get(this.deleteIcon).click()
            })
            cy.get(this.popover).within(() => {
                cy.contains("button", "Delete").click()
            })
            cy.contains("span", name).should("not.exist")
        })
    }


    /*********************************************************************************/
    /*********************************** CTAs ****************************************/
    /*********************************************************************************/
    addCTA(options) {
        const { name, label, ctaType, destination } = options
        this.goToPage(this.pageTitles.ctas, this.pageUrls.ctas)
        cy.contains("button", "Add CTA").click()
        cy.get(this.modal).within(() => {
            cy.get(this.ctas.nameInput).clear().type(name)
            cy.get(this.ctas.ctaLabel).clear().type(label)
            cy.get(this.ctas.ctaType).parent().contains(ctaType).click()
            if (ctaType == "Form") {
                cy.get(this.dropdown.input).type(destination + "\n", { force: true })
            }
            else if (ctaType == "Link") {
                cy.get(this.ctas.destinationLinkInput).type(destination)
            }
            else {
                cy.get(this.ctas.destinationEmailInput).type(destination)
            }
            cy.contains("button", "Save").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.containsExact(this.table.cellName, name).should("exist")
    }

    deleteCTA(name) {
        this.goToPage(this.pageTitles.ctas, this.pageUrls.ctas)
        cy.ifElementWithExactTextExists(this.table.cellName, name, 4000, () => {
            cy.containsExact(this.table.cellName, name).click()
            cy.get(this.ctas.delete).click({ force: true })
            cy.contains("button", "Delete CTA").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.containsExact(this.table.cellName, name).should("not.exist")
    }


    /*********************************************************************************/
    /******************************* LINKS&SHARING ***********************************/
    /*********************************************************************************/


    searchLinksAndSharing(name) {
        cy.wait(2000)
        cy.get(this.pageSidebar).within(() => {
            cy.get("input[name='search-experiences']").should("exist").type(name)
        })
    }

    addLinksAndSharing(name) {
        cy.get(this.pageSidebar).within(() => {
            cy.contains("div", "+ Add Configuration").click()
        })
        cy.get(this.modal).within(() => {
            cy.get(this.linksAndSharing.nameInput).type(name)
            cy.contains("button", "Add Configuration").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.get(this.pageSidebar).within(() => {
            cy.containsExact("div", name).should("exist")
        })
    }

    deleteLinksAndSharing(name) {
        cy.waitFor({ element: this.pageSidebar, to: "exist", wait: 10000 })
        cy.ifElementWithExactTextExists("div", name, 4000, () => {
            if (cy.containsExact("div", name, { timeout: 3000 })) {
                cy.containsExact("div", name).siblings("div").within(() => {
                    cy.get(this.deleteIcon).click({ force: true })
                })
                cy.do(() => {
                    // Cypress.$() not affected by within(), so useful to get the delete button in the outside modal
                    // Also, Cypress.$() is synchronous with rest of javascript and not queued like the cy commands,
                    // hence the need to put it inside a cy.do()
                    Cypress.$("button:contains('Delete Configuration')").click()
                })
            }
        })
        cy.containsExact("div", name).should("not.exist")
    }

    /*********************************************************************************/
    /****************************** VISITOR ACTIVITY *********************************/
    /*********************************************************************************/

    addVisitorActivity(options) {
        const { name, type, score } = options
        cy.contains("button", "Add Activity").click()
        cy.get(this.modal).within(() => {
            cy.get(this.visitorActivity.nameInput).clear().type(name)
            cy.get(this.dropdown.input).type(type + "\n", { force: true })
            cy.get(this.visitorActivity.scoreInput).clear().type(score)
            cy.contains("button", "Add Activity Definition").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.containsExact(this.table.cellName, name).should("exist")
    }

    deleteVisitorActivity(name) {
        cy.ifElementWithExactTextExists(this.table.cellName, name, 4000, () => {
            cy.containsExact(this.table.cellName, name).click()
            cy.get(this.visitorActivity.deleteIcon).click({ force: true })
            cy.contains("button", "Delete Activity").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.containsExact(this.table.cellName, name).should("not.exist")
    }



    /*********************************************************************************/
    /********************************** SEGMENTS *************************************/
    /*********************************************************************************/

    addSegment(name) {
        cy.contains("button", "Create Segment").click()
        cy.get(this.modal).within(() => {
            cy.get(this.segments.nameInput).clear().type(name)
            cy.contains("button", "Create Segment").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.get(this.segments.editSegmentPreview).within(() => {
            cy.contains("button", "Save").click()
        })
        cy.containsExact("p", name).should("exist")
    }

    deleteSegment(name) {
        cy.ifElementWithExactTextExists("p", name, 4000, () => {
            cy.contains("p", name).siblings("div").within(() => {
                cy.get(this.segments.deleteIcon).click()
            })
            cy.get(this.modal).within(() => {
                cy.contains("button", "Remove Segment").click()
            })
            cy.contains("p", name).should("not.exist")
        })
    }

    /*********************************************************************************/
    /*********************************** ROUTES **************************************/
    /*********************************************************************************/

    addRoute(options) {
        const { name, type, destination } = options
        cy.contains("button", "Create Destination Route").click()
        cy.get(this.modal).within(() => {
            cy.get(this.routes.nameInput).clear().type(name)
            cy.get(this.routes.fallbackType).parent().contains(type).click()
            if (type == "URL") {
                cy.get(this.routes.fallbackUrl).type(destination)
            }
            else {
                cy.get(this.dropdown.input).type(destination + "\n", { force: true })
            }
            cy.contains("button", "Create Destination Route").click()
        })
        cy.waitFor({ element: this.modal, to: "not.exist" })
        cy.contains("h4", name).should("exist")
    }

    deleteRoute(name) {
        cy.ifElementWithExactTextExists("h4", name, 4000, () => {
            cy.contains("h4", name).siblings("span").within(() => {
                cy.get(this.routes.deleteIcon).click()
            })
            cy.get(this.modal).within(() => {
                cy.contains("button", "Remove Route").click()
            })
            cy.contains("h4", name).should("not.exist")
        })
    }

    /*********************************************************************************/
    /******************************** TRACK LABELS ***********************************/
    /*********************************************************************************/

    addTrackLabel(name) {
        cy.ifNoElementWithExactTextExists("span", name, 2000, () => {
            cy.contains("button", "Add Label").click()
            cy.get(this.trackLabels.nameInput).clear().type(name)
            cy.get(this.trackLabels.nameInput).parent().within(() => {
                cy.contains("button", "Add").click()
            })
        })
        cy.contains("span", name).should("exist")
    }

    deleteTrackLabel(name) {
        cy.ifElementWithExactTextExists("span", name, 4000, () => {
            cy.contains("span", name).parent().within(() => {
                cy.get(this.deleteIcon).click()
            })
            cy.get(this.popover).within(() => {
                cy.contains("button", "Delete").click()
            })
            cy.contains("span", name).should("not.exist")
        })
    }

    configureLanguageOverride(config) {

        const language = config.language
        const searchButton = config.searchButton
        const searchInput = config.searchInput
        const availability = config.availability
        const languageInput = config.languageInput
        const funnelStages = config.funnelStages
        const businessUnits = config.businessUnits
        const personas = config.personas
        const industry = config.industry
        const topics = config.topics

        this.visit.languages()
        this.clicklanguage(language)
        this.gotoLanguageTab("virtual-event")
        cy.wait(5000) //Languages-Virtual Event Tab loading wait
        if (searchButton) {
            cy.get(this.languages.vex.searchButtonTitle).clear().type(searchButton)
        }
        if (searchInput) {
            cy.get(this.languages.vex.searchInputFieldPlaceholder).clear().type(searchInput)
        }
        if (availability) {
            cy.get(this.languages.vex.filterByAvailabilityTitle).clear().type(availability)
        }
        if (languageInput) {
            cy.get(this.languages.vex.filterByLanguageTitle).clear().type(languageInput)
        }
        if (funnelStages) {
            cy.get(this.languages.vex.filterByFunnelStageTitle).clear().type(funnelStages)
        }
        if (businessUnits) {
            cy.get(this.languages.vex.filterByBusinessUnitTitle).clear().type(businessUnits)
        }
        if (personas) {
            cy.get(this.languages.vex.filterByPersonaTitle).clear().type(personas)
        }
        if (industry) {
            cy.get(this.languages.vex.filterByIndustryTitle).clear().type(industry)
        }
        if (topics) {
            cy.get(this.languages.vex.filterByTopicTitle).clear().type(topics)
        }
        cy.contains("button", "Save Virtual Event Settings").click()
        cy.contains(this.messages.recordSaved, { timeout: 1000 }).should("exist")

    }

    configureAccessProtectionAppearance(options) {
        const { appearance, thumbnail, submitButtonColor, verify } = options
        const { headerTextFontFamilyLP, headerTextBoldFontLP, headerTextFontSizeLP, headerTextFontColorLP } = options
        const { bodyTextFamilyLP, bodyTextBoldFontLP, bodyTextFontSizeLP, bodyTextFontColorLP } = options
        const { emailAddressFamilyLP, emailAddressBoldFontLP, emailAddressFontSizeLP, emailAddressFontColorLP } = options
        const { submitButtonFontFamilyLP, submitButtonFontWeightLP, submitButtonFontSizeLP, submitButtonTextFontColorLP, submitButtonRadiusLP } = options

        this.goToCampaignAppearance(appearance, "access-protection")
        if (thumbnail) {
            cy.get(this.appearances.imagePicker).first().click()
            this.pickThumbnail(thumbnail)
        }
        if (submitButtonColor) {
            const { r, g, b, a } = submitButtonColor
            this.pickColor({ button: this.appearances.accessProtection.submitButtonColorLP, r: r, g: g, b: b, a: a })
        }
        if (headerTextFontFamilyLP) {
            cy.get(this.appearances.accessProtection.headerTextSettingsLP).within(() => {
                cy.get(this.dropdown.input).type(headerTextFontFamilyLP + "\n", { force: true })
            })
        }
        if (headerTextBoldFontLP == true || headerTextBoldFontLP == false) {
            cy.get(this.appearances.accessProtection.headerTextFontWeightLP).invoke("attr", "class").then(fontWeightClass => {
                if (headerTextBoldFontLP && !fontWeightClass.includes("containerActive") || !headerTextBoldFontLP && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.accessProtection.headerTextFontWeightLP).click()
                }
            })
        }
        if (headerTextFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.headerTextSettingsLP).within(() => {
                cy.get(this.appearances[size[headerTextFontSizeLP]]).click()
            })
        }
        if (headerTextFontColorLP) {
            const { r, g, b, a } = headerTextFontColorLP
            this.pickColor({ button: this.appearances.accessProtection.headerTextFontColorLP, r: r, g: g, b: b, a: a })
        }
        if (bodyTextFamilyLP) {
            cy.get(this.appearances.accessProtection.bodySettingsLP).within(() => {
                cy.get(this.dropdown.input).type(bodyTextFamilyLP + "\n", { force: true })
            })
        }
        if (bodyTextBoldFontLP == true || bodyTextBoldFontLP == false) {
            cy.get(this.appearances.accessProtection.bodyFontWeightLP).invoke("attr", "class").then(fontWeightClass => {
                if (bodyTextBoldFontLP && !fontWeightClass.includes("containerActive") || !bodyTextBoldFontLP && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.accessProtection.bodyFontWeightLP).click()
                }
            })
        }
        if (bodyTextFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.bodySettingsLP).within(() => {
                cy.get(this.appearances[size[bodyTextFontSizeLP]]).click()
            })
        }
        if (bodyTextFontColorLP) {
            const { r, g, b, a } = bodyTextFontColorLP
            this.pickColor({ button: this.appearances.accessProtection.bodyFontColorLP, r: r, g: g, b: b, a: a })
        }
        if (emailAddressFamilyLP) {
            cy.get(this.appearances.accessProtection.emailAddressSettingsLP).within(() => {
                cy.get(this.dropdown.input).type(emailAddressFamilyLP + "\n", { force: true })
            })
        }
        if (emailAddressBoldFontLP == true || emailAddressBoldFontLP == false) {
            cy.get(this.appearances.accessProtection.emailAddressFontWeightLP).invoke("attr", "class").then(fontWeightClass => {
                if (emailAddressBoldFontLP && !fontWeightClass.includes("containerActive") || !emailAddressBoldFontLP && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.accessProtection.emailAddressFontWeightLP).click()
                }
            })
        }
        if (emailAddressFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.emailAddressSettingsLP).within(() => {
                cy.get(this.appearances[size[emailAddressFontSizeLP]]).click()
            })
        }
        if (emailAddressFontColorLP) {
            const { r, g, b, a } = emailAddressFontColorLP
            this.pickColor({ button: this.appearances.accessProtection.emailAddressFontColorLP, r: r, g: g, b: b, a: a })
        }
        if (submitButtonFontFamilyLP) {
            cy.get(this.appearances.accessProtection.submitButtonTextSettingsLP).within(() => {
                cy.get(this.dropdown.input).type(submitButtonFontFamilyLP + "\n", { force: true })
            })
        }
        if (submitButtonFontWeightLP == true || submitButtonFontWeightLP == false) {
            cy.get(this.appearances.accessProtection.submitButtonTextWeightLP).invoke("attr", "class").then(fontWeightClass => {
                if (submitButtonFontWeightLP && !fontWeightClass.includes("containerActive") || !submitButtonFontWeightLP && fontWeightClass.includes("containerActive")) {
                    cy.get(this.appearances.accessProtection.submitButtonTextWeightLP).click()
                }
            })
        }
        if (submitButtonFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.submitButtonTextSettingsLP).within(() => {
                cy.get(this.appearances[size[submitButtonFontSizeLP]]).click()
            })
        }
        if (submitButtonTextFontColorLP) {
            const { r, g, b, a } = submitButtonTextFontColorLP
            this.pickColor({ button: this.appearances.accessProtection.submitButtonTextColorLP, r: r, g: g, b: b, a: a })
        }
        if (submitButtonRadiusLP) {
            cy.get(this.appearances.accessProtection.submitButtonRadiusLP).type(`{selectall}${submitButtonRadiusLP}` + "\n", { force: true })
        }

        cy.contains("button", "Save Access Protection Settings").click()
        if (verify !== false) {
            cy.contains(this.messages.recordSaved, { timeout: 10000 }).should("exist")
            this.verifyAccessProtectionAppearance(options)
        }
    }

    verifyAccessProtectionAppearance(options) {
        const { submitButtonColor } = options
        const { headerTextFontFamilyLP, headerTextBoldFontLP, headerTextFontSizeLP, headerTextFontColorLP } = options
        const { bodyTextFamilyLP, bodyTextBoldFontLP, bodyTextFontSizeLP, bodyTextFontColorLP } = options
        const { emailAddressFamilyLP, emailAddressBoldFontLP, emailAddressFontSizeLP, emailAddressFontColorLP } = options
        const { submitButtonFontFamilyLP, submitButtonFontWeightLP, submitButtonFontSizeLP, submitButtonTextFontColorLP, submitButtonRadiusLP } = options

        if (submitButtonColor) {
            const { r, g, b, a } = submitButtonColor
            cy.get(this.appearances.accessProtection.submitButtonColorLP).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (headerTextFontFamilyLP) {
            cy.get(this.appearances.accessProtection.headerTextSettingsLP).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", headerTextFontFamilyLP)
            })
        }
        if (headerTextBoldFontLP == true || headerTextBoldFontLP == false) {
            const containOrNotContain = headerTextBoldFontLP ? "contain" : "not.contain"
            cy.get(this.appearances.accessProtection.headerTextFontWeightLP).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }
        if (headerTextFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.headerTextSettingsLP).within(() => {
                cy.get(this.appearances[size[headerTextFontSizeLP]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (headerTextFontColorLP) {
            const { r, g, b, a } = headerTextFontColorLP
            cy.get(this.appearances.accessProtection.headerTextFontColorLP).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (bodyTextFamilyLP) {
            cy.get(this.appearances.accessProtection.bodySettingsLP).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", bodyTextFamilyLP)
            })
        }
        if (bodyTextBoldFontLP == true || bodyTextBoldFontLP == false) {
            const containOrNotContain = bodyTextBoldFontLP ? "contain" : "not.contain"
            cy.get(this.appearances.accessProtection.bodyFontWeightLP).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }
        if (bodyTextFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.bodySettingsLP).within(() => {
                cy.get(this.appearances[size[bodyTextFontSizeLP]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (bodyTextFontColorLP) {
            const { r, g, b, a } = bodyTextFontColorLP
            cy.get(this.appearances.accessProtection.bodyFontColorLP).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (emailAddressFamilyLP) {
            cy.get(this.appearances.accessProtection.emailAddressSettingsLP).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", emailAddressFamilyLP)
            })
        }
        if (emailAddressBoldFontLP == true || emailAddressBoldFontLP == false) {
            const containOrNotContain = emailAddressBoldFontLP ? "contain" : "not.contain"
            cy.get(this.appearances.accessProtection.emailAddressFontWeightLP).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }
        if (emailAddressFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.emailAddressSettingsLP).within(() => {
                cy.get(this.appearances[size[emailAddressFontSizeLP]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }
        if (emailAddressFontColorLP) {
            const { r, g, b, a } = emailAddressFontColorLP
            cy.get(this.appearances.accessProtection.emailAddressFontColorLP).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (submitButtonFontFamilyLP) {
            cy.get(this.appearances.accessProtection.submitButtonTextSettingsLP).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", submitButtonFontFamilyLP)
            })
        }

        if (submitButtonFontWeightLP == true || submitButtonFontWeightLP == false) {
            const containOrNotContain = submitButtonFontWeightLP ? "contain" : "not.contain"
            cy.get(this.appearances.accessProtection.submitButtonTextWeightLP).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if (submitButtonFontSizeLP) {
            const size = { small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge" }
            cy.get(this.appearances.accessProtection.submitButtonTextSettingsLP).within(() => {
                cy.get(this.appearances[size[submitButtonFontSizeLP]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }

        if (submitButtonTextFontColorLP) {
            const { r, g, b, a } = submitButtonTextFontColorLP
            cy.get(this.appearances.accessProtection.submitButtonTextColorLP).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }
        if (submitButtonRadiusLP) {
            cy.get(this.appearances.accessProtection.submitButtonRadiusLP).invoke("attr", "value").should("contain", submitButtonRadiusLP)
        }
    }

    configureAccessProtectionLanguageOverride(config) {
        const language = config.language
        const title = config.title
        const emailSuccess = config.emailSuccess
        const emailFailed = config.emailFailed
        const unAuthorizedEmail = config.unAuthorizedEmail
        const emailConfirmMsg = config.emailConfirmMsg
        const emailInstructionMsg = config.emailInstructionMsg
        const helperMsg = config.helperMsg

        this.visit.languages()
        this.clicklanguage(language)
        this.gotoLanguageTab("access-protection")
        cy.wait(3000) //Languages-Access Protection Tab loading wait
        if (title) {
            cy.get(this.languages.accessProtection.title).clear().type(title)
        }
        if (emailSuccess) {
            cy.get(this.languages.accessProtection.emailSuccessMsg).clear().type(emailSuccess)
        }
        if (emailFailed) {
            cy.get(this.languages.accessProtection.emailFailedMsg).clear().type(emailFailed)
        }
        if (unAuthorizedEmail) {
            cy.get(this.languages.accessProtection.unAuthorizedEmailMsg).clear().type(unAuthorizedEmail)
        }
        if (emailConfirmMsg) {
            cy.get(this.languages.accessProtection.emailConfirmedMsg).clear().type(emailConfirmMsg)
        }
        if (emailInstructionMsg) {
            cy.get(this.languages.accessProtection.emailInstructionMsg).clear().type(emailInstructionMsg)
        }
        if (helperMsg) {
            cy.get(this.languages.accessProtection.helperMsg).clear().type(helperMsg)
        }
        cy.contains("button", "Save Access Protection Settings").click()
        cy.contains(this.messages.recordSaved, { timeout: 1000 }).should("exist")

    }
}
