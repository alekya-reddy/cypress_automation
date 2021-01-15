import { Common } from "./Common";

export class Target extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/target`;
        this.pageTitle = "Target Tracks";
        this.deleteTrackIcon = "i[title='Delete Track']";
        this.createTrackModal = {
            nameInput: "input[name='name']"
        };
        this.pageSidebar = {
            container: "div[data-qa-hook='page-sidebar']",
            customUrlLabel: "label:contains('Custom URL')",
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
            exitOverride: "[data-qa-hook='Exit overrides']"
        };
        this.popoverElements = {
            customUrlInput: "#customUrl",
            endPromoterLinkInput: "#link",
            APGroupLabel: "label[for='visitorGroupIds']",
            protectionTypeLabel: "label[for='protectionType']"
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
        this.exitOverride = {
            delayLabel: "label[for='delay']",
            delayInput: "input[name='delay']",
            delayDecrement: "span[class*='NumberInput__decrementButton']"
        };
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addTrack(options){
        const name = options.name 

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Create Target Track").click()
        cy.contains(this.modal, "Create Target Track").within(()=>{
            cy.get(this.createTrackModal.nameInput).clear().type(name)
            cy.contains("button", "Create Target Track").click()
        })
        cy.contains(this.modal, "Create Target Track").should("not.exist")
        cy.containsExact("h1", name, {timeout: 10000}).should("exist")
    }

    goToTrack(name){
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.cellName, name).should("exist").within(() => {cy.get("a").click()})
        cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
    }

    deleteTrack(name, verify){
        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.pageSearch, {timeout: 20000}).clear().type(name)
        cy.ifElementWithExactTextExists(this.table.cellName, name, 2000, () => {
            cy.containsExact(this.table.cellName, name).should("exist").within(() => { 
                cy.get("a").click()
            })
            cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
            cy.get(this.deleteTrackIcon, {timeout: 20000}).click()
            cy.contains(this.modal, "Do you want to delete this Track?").contains("button", "Yes").click()
        })

        if(verify !== false){
            cy.contains(this.pageTitleLocator, this.pageTitle, {timeout: 20000}).should("exist")
            cy.get(this.pageSearch).clear().type(name)
            cy.containsExact(this.table.cellName, name).should("not.exist")
            cy.get(this.clearSearchIcon).click()
        }
    }

    configure(options){
        const name = options.name
        const slug = options.slug
        const accessProtection = options.accessProtection
        const contents = options.contents
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

        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== name){
                this.goToTrack(name)
            }
        })

        if(slug){
            this.setCustomUrl(slug, verify)
        }

        if(accessProtection){
            this.addAccessProtection(accessProtection, verify)
        }

        if(contents){
            this.addContent(contents, verify)
        }

        if(flow){
            this.toggle(this.pageSidebar.flowToggle, flow)
        }

        if(signposts){
            this.toggle(this.pageSidebar.signpostsToggle, signposts)
        }

        if(bottombar){
            this.toggle(this.pageSidebar.bottombarToggle, bottombar)
        }

        if(endPromoter){
            this.toggle(this.pageSidebar.endPromoterToggle, endPromoter)
        }

        if(exit){
            this.toggle(this.pageSidebar.exitToggle, exit)
        }

        if(inactivity){
            this.toggle(this.pageSidebar.inactivityToggle, inactivity)
        }

        if(formsStrategy){
            this.toggle(this.pageSidebar.formsStrategyToggle, formsStrategy)
        }

        if(cookieConsent){
            this.toggle(this.pageSidebar.cookieConsentToggle, cookieConsent)
        }

        if(cookieMessage){
            this.toggle(this.pageSidebar.cookieMessageToggle, cookieMessage)
        }

        if(header){
            this.toggle(this.pageSidebar.headerToggle, header)
        }

        if(flowCTA){
            this.configureFlowCTA(flowCTA, verify)
        }

        if(endPromoterOptions){
            this.configureEndPromoter(endPromoterOptions, verify)
        }

        if(exitOptions){
            this.configureExit(exitOptions, verify)
        }

        if(formsStrategyOptions){
            const { trackRule } = formsStrategyOptions

            cy.contains("button", "View Form Strategy").click()
            cy.contains(this.modal, "Forms Strategy").should("exist")

            if(trackRule){
                this.configureFormTrackRule(trackRule, verify)
            }

            cy.get(this.closeModal).click()
        }
    }

    addAccessProtection(accessProtection, verify){
        const type = accessProtection.type
        const groups = [accessProtection.groups].flat()

        cy.get(this.pageSidebar.accessProtectionLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.popoverElements.protectionTypeLabel).siblings(this.dropdown.box).click()
            cy.get(this.dropdown.option(type)).click()
            groups.forEach( group => {
                cy.get(this.popoverElements.APGroupLabel).siblings(this.dropdown.box).click()
                cy.get(this.dropdown.option(group)).click()
            })
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.be.visible")
            groups.forEach( group => {
                cy.contains(this.pageSidebar.accessProtectionGroup, group).should("exist")
            })
        }
    }

    setCustomUrl(slug, verify){
        cy.get(this.pageSidebar.customUrlLabel).siblings("span").click()
        cy.get(this.popover).get(this.popoverElements.customUrlInput).clear().type(slug + "\n")
        cy.ifElementWithExactTextExists("button", "Change", 1000, () => {
            cy.contains("button", "Change").click()
        })

        if(verify !== false){
            cy.get(this.pageSidebar.customUrlLabel).siblings("span").should("contain", slug)
        }
    }

    addContent(contents, verify){
        cy.contains("button", "Add Content").click()
        contents.forEach((content) => {
            cy.get(this.modal).within(()=>{
                cy.get(this.contentPickerSearchBar).clear().type(content)
                cy.contains(this.contentPickerItem, content).click()
            })
        })
        cy.get(this.modal).contains("button", "Add Content").click()

        if(verify !== false){
            cy.get(this.modal).should('not.exist')
            contents.forEach((content) => {
                cy.containsExact("strong", content).should("exist")
            })
        }
    }

    configureFlowCTA(flowCTA, verify){
        cy.get(this.pageSidebar.flowToggle).parents().eq(1).within(() => {
            cy.contains("label", "CTA").siblings("span").click()
        })
        cy.get(this.popover).within(() => {
            if(Cypress.$(this.clearValueIcon).length > 0){
                cy.get(this.clearValueIcon).click()
            }
            cy.get("input").type(flowCTA + "\n", {force: true})
            cy.contains("button", "Update").click()
        })
        if(verify !== false){
            cy.get(this.pageSidebar.flowToggle).parents().eq(1).within(() => {
                cy.containsExact("span", flowCTA, {timeout: 10000}).should("exist")
            })
        }
    }

    configureEndPromoter(endPromoterOptions, verify){
        const { link } = endPromoterOptions

        if(link){
            cy.get(this.pageSidebar.endPromoterToggle).parents().eq(1).within(() => {
                cy.contains("label", "Link").siblings("span").click()
            })
            cy.get(this.popover).within(() => {
                cy.get(this.popoverElements.endPromoterLinkInput).clear().type(link + "\n")
            })

            if(verify !== false){
                cy.get(this.pageSidebar.endPromoterToggle).parents().eq(1).within(() => {
                    cy.contains("label", "Link").siblings("span").should("contain", link)
                })
            }
        }
    }

    configureExit(exitOptions, verify){
        const { delay } = exitOptions

        cy.get(this.pageSidebar.exitToggle).parents().eq(1).within(() => {
            if(Cypress.$(this.pageSidebar.exitNoOverride).length > 0){
                cy.get(this.pageSidebar.exitNoOverride).click()
            } else if (Cypress.$(this.pageSidebar.exitOverride).length > 0){
                cy.get(this.pageSidebar.exitOverride).click()
            }
        })

        cy.contains(this.modal, "Exit Overrides for this Track").should("exist").within(() => {
            if(delay){
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

            cy.contains("button", "Save Exit Overrides").click()
        })

        if(verify !== false){
            cy.contains(this.modal, "Exit Overrides for this Track").should("not.be.visible")
            cy.get(this.pageSidebar.exitToggle).parents().eq(1).within(() => {
                if(delay){
                    cy.contains(`${delay} seconds`).should("exist")
                }
            })
        }
    }

    configureFormTrackRule(trackRule, verify){
        const { form, timeOnTrack, showToUnknown, showToKnown, dismissable } = trackRule

        cy.get(this.formsStrategy.trackRule).within(() => {
            if(Cypress.$(this.formsStrategy.trackRuleCard).length > 0){
                cy.get(this.formsStrategy.trackRuleCard).click()
            } else {
                cy.contains("button", "Add Rule").click()
            }
        })

        if(form){
            cy.get(this.formsStrategy.formLabel).parent().within(() => {
                if(Cypress.$(this.clearValueIcon).length > 0){
                    cy.get(this.clearValueIcon).click()
                }
                cy.get("input").type(form + "\n", {force: true})
            })
        }

        if(timeOnTrack){
            cy.contains("label", "Total time on Track").click()
            cy.get(this.formsStrategy.timeOnTrackInput).clear().type(timeOnTrack)
        }

        if(showToUnknown){
            this.toggle(this.formsStrategy.unknownToggle, showToUnknown)
        }

        if(showToKnown){
            this.toggle(this.formsStrategy.knownToggle, showToKnown)
        }

        if(dismissable){
            this.toggle(this.formsStrategy.dismissableToggle, dismissable)
        }

        cy.contains(this.modal, "Track Rule").within(()=>{
            cy.contains("button", "Save").click()
        })

        if(verify !== false){
            cy.contains(this.modal, "Add Track Rule").should("not.be.visible")
        }
    }
}

