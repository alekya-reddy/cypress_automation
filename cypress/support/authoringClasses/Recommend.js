import { Common } from "./Common";

export class Recommend extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/recommend`;
        this.pageTitle = "Recommend Tracks";
        this.recommendAnalyticsTitle = "Recommend Analytics Overview";
        this.deleteTrackIcon = "i[class*='delete Icon__action']";
        this.addFolder =  "button:contains('Add Folder')"
        this.editFolder = 'i[title="Edit Folder"]';
        this.editTrack = 'i[class*="edit-for"]';
        this.recommendAnalytics = "a[id='TrackAnalyticsLink']";
        this.analyticsActivities = 'div[data-qa-hook="visitor-activities-card"]';
        this.contentClick = "div[draggable='true']:nth-child(2)";
        this.previewLink = 'div[data-qa-hook="page-preview"]>div>div:nth-child(2)>div>div>div';
        this.recommendCell = 'div[data-qa-hook="table-cell-internal-title"]>span';
        this.analyticsButton = "div[data-qa-hook='title-bar'] a",
        this.visitorRows = '[role="menuitem"]:nth-of-type(6) div',
        this.cloneTrack="[title='Clone Track']"
        this.createTrackModal = {
            nameInput: "input[name='name']"
        };
        this.pageControl = "div[data-qa-hook='title-bar']>h1",
        this.canonicalUrlOverride="#canonicalUrlOverride",
        this.pageSidebar = {
            container: "div[data-qa-hook='page-sidebar']",
            languageLabel: "label:contains('Language')",
            customUrlLabel: "label:contains('Custom URL')",
            externalCodeLabel: "label:contains('External Code')",
            appearanceLabel: "label:contains('Appearance')",
            accessProtectionLabel: "label:contains('Access Protection')",
            accessProtectionGroup: "#trackProtectionGroups",
            sidebarToggle: "[data-qa-hook='sidebar']",
            topicSidebarToggle: "[data-qa-hook='topicSidebar']",
            exitToggle: "[data-qa-hook='exit']",
            formsStrategyToggle: '[data-qa-hook="formsStrategy"]',
            cookieConsentToggle: '[data-qa-hook="gdprCookieConsent"]',
            cookieMessageToggle: '[data-qa-hook="cookieConsent"]',
            headerToggle: '[data-qa-hook="header"]',
            exitNoOverride: "[data-qa-hook='Exit no overrides']",
            exitOverride: "[data-qa-hook='Exit overrides']",
            linksAndshareLabel: "label:contains('Links & Sharing')",
            captions:"[data-qa-hook='showCaption']",
            pagePreview:'[data-qa-hook="page-preview"]',

        };
        this.popoverElements = {
            customUrlInput: "#customUrl"
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
        this.editRecommend = {
            nameInput: "#name",
            dropdownSelect: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(1)',
            dropdownSelectField: 'div[data-qa-hook="select-list"] > div > div > span:nth-child(1) > div:nth-child(2) > input'
        };
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addTrack(options){
        const name = options.name 

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Create Recommend Track").click()
        cy.contains(this.modal, "Create Recommend Track").within(()=>{
            cy.get(this.createTrackModal.nameInput).clear().type(name)
            cy.contains("button", "Create Recommend Track").click()
        })
        cy.contains(this.modal, "Create Recommend Track").should("not.exist")
        cy.containsExact("h1", name, {timeout: 10000}).should("exist")
    }

    goToTrack(name){
        cy.get(this.pageSearch).clear().type(name)
        cy.containsExact(this.table.experienceCellName, name).should("exist").within(() => {cy.get("a").click()})
        cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
    }

    editTrackRecommend(options){
        const name = options.name
        const parentFolder = options.parentFolder
        const labels = options.labels
   
         cy.get(this.editTrack).click()
         cy.contains(this.modal, "Edit Track").within(()=>{
            if (name) {
                cy.get(this.editRecommend.nameInput).clear().type(name)
            }
            if (parentFolder) {
                cy.get(this.editRecommend.dropdownSelect).eq(0).click()
                cy.get(this.editRecommend.dropdownSelectField).eq(0).type(parentFolder + "\n")
            }  
            if (labels) {
                cy.get(this.editRecommend.dropdownSelect).eq(1).click()
                cy.get(this.editRecommend.dropdownSelectField).eq(1).type(labels + "\n")
            }    
            cy.contains("button", "Save").click()
         })
   }

    deleteTrack(name, verify){
        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.pageSearch, {timeout: 20000}).clear().type(name)
        cy.ifElementWithExactTextExists(this.table.experienceCellName, name, 2000, () => {
            cy.containsExact(this.table.experienceCellName, name).should("exist").within(() => { 
                cy.get("a").click()
            })
            cy.contains(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
            cy.get(this.deleteTrackIcon, {timeout: 20000}).click()
            cy.contains(this.modal, "Do you want to delete this Track?").contains("button", "Yes").click()
        })

        if(verify !== false){
            cy.contains(this.pageTitleLocator, this.pageTitle, {timeout: 20000}).should("exist")
            cy.get(this.pageSearch).clear().type(name)
            cy.containsExact(this.table.experienceCellName, name).should("not.exist")
            cy.get(this.clearSearchIcon).click()
        }
    }

    configure(options){
        const { name, slug, language, appearance, externalCode, accessProtection, contents, verify } = options
        // These toggle options should have values of "on" or "off"
        const { sidebar, topicSidebar, exit, formsStrategy, cookieConsent, cookieMessage, header } = options
        // These options will require certain toggles to be "on"
        const { sidebarOptions, exitOptions, formsStrategyOptions } = options 

        /******************** Search Engine Directive*/
        const searchEngineDirective = options.searchEngineDirective
        const captions=options.captions
        const captionsLanguage=options.captionsLanguage
        const cloneName=options.cloneName

        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== name){
                this.goToTrack(name)
            }
        })

        if(slug){
            this.setCustomUrl(slug, verify)
        }

        if(appearance){
            this.setAppearance(appearance, verify)
        }

        if(externalCode){
            this.addExternalCode(externalCode)
        }

        if(accessProtection){
            this.addAccessProtection(accessProtection, verify)
        }

        if(language){
            this.setTrackLanguage(language, verify)
        }

        if(contents){
            this.addContent(contents, verify)
        }

        if(sidebar){
            this.toggle(this.pageSidebar.sidebarToggle, sidebar)
        }

        if(topicSidebar){
            this.toggle(this.pageSidebar.topicSidebarToggle, topicSidebar)
        }

        if(exit){
            this.toggle(this.pageSidebar.exitToggle, exit)
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

        if(sidebarOptions){
            this.configureSidebar(sidebarOptions, verify)
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

        if(searchEngineDirective){
            this.selectSearchEngineDirective(searchEngineDirective)
        }

        if(captions){
            const index=options.index
            const singleContent=options.contents[index]
            cy.get(`img[alt='${singleContent}']`,{timeout:20000}).click()
            cy.get(this.pageSidebar.captions).invoke('css', 'background-color').then(val => {
                if(val.includes('rgb(221, 221, 221)')){ //if radio button off
                    this.setCaptions(captionsLanguage,captions,verify)
                }
            })
        }

        if(cloneName){
            cy.get(this.cloneTrack,{timeout:10000}).click()
            cy.contains('h3',"Clone this Track",{timeout:10000}).should('be.visible')
            cy.get(this.editRecommend.nameInput).clear().type(cloneName)
            cy.contains('button','Clone this Track').click()
            cy.contains('form h3',"Clone this Track",{timeout:10000}).should('not.exist')
          }
    }

    addExternalCode(list, verify){
        const codes = [list].flat()

        cy.get(this.pageSidebar.externalCodeLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            codes.forEach( code => {
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(code)).click()
            })
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            codes.forEach( code => {
                cy.get(this.pageSidebar.externalCodeLabel).siblings("span").should("contain", code)
            })
        }
    }

    removeExternalCode(list, verify){
        const codes = [list].flat()
        cy.get(this.pageSidebar.externalCodeLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            codes.forEach( code => {
                cy.ifElementWithExactTextExists("span", code, 1000, ()=>{
                    cy.containsExact("span", code).parent().siblings("span").click()
                })
            })
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            codes.forEach( code => {
                cy.get(this.pageSidebar.externalCodeLabel).siblings("span").should("not.contain", code)
            })
        }
    }

    addLinksAndShare(link){
         cy.get(this.pageSidebar.linksAndshareLabel).siblings("span").click()
         cy.get(this.popover).within(()=>{
                cy.get(this.dropdown.box).click()
                cy.get(".Select-multi-value-wrapper > .Select-value").type(link + "\n")
            cy.contains("button", "Update").click()
        })
    }

    setAppearance(appearance, verify){
        cy.get(this.pageSidebar.appearanceLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.dropdown.box).click()
            cy.get(this.dropdown.option(appearance)).click()
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.get(this.pageSidebar.appearanceLabel).siblings("span").should("contain", appearance)

        }
    }

    addAccessProtection(accessProtection, verify){
        const type = accessProtection.type
        const groups = [accessProtection.groups].flat()

        cy.get(this.pageSidebar.accessProtectionLabel).siblings("span").click()
        cy.get(this.popover).within(()=>{
            cy.get(this.accessProtection.protectionTypeLabel).siblings(this.dropdown.box).click()
            cy.get(this.dropdown.option(type)).click()
            groups.forEach( group => {
                if(group !== "None") {
                    cy.get(this.accessProtection.APGroupLabel).siblings(this.dropdown.box).click()
                    cy.get(this.dropdown.option(group)).click()
                }
            })
            cy.contains("button", "Update").click()
        })

        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            groups.forEach( group => {
                if(group !== "None"){
                    cy.contains(this.pageSidebar.accessProtectionGroup, group).should("exist")
                }
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
        cy.contains("button", "Add Content to Track").click()
        contents.forEach((content) => {
            cy.get(this.modal).within(()=>{
                cy.get(this.contentPickerSearchBar).clear().type(content)
                cy.contains(this.contentPickerItem, content).click()
            })
        })
        cy.get(this.modal).contains("button", "Add Content to Track").click()

        if(verify !== false){
            cy.get(this.modal).should('not.exist')
            contents.forEach((content) => {
                cy.containsExact(this.table.internalTitleCell, content).should("exist")
            })
        }
    }

    configureSidebar(sidebarOptions, verify){
        const { cta } = sidebarOptions

        if(cta){
            cy.get(this.pageSidebar.sidebarToggle).parents().eq(1).within(() => {
                cy.contains("label", "CTA").siblings("span").click()
            })
            cy.get(this.popover).within(() => {
                if(Cypress.$(this.clearValueIcon).length > 0){
                    cy.get(this.clearValueIcon).click()
                }
                cy.get("input").type(cta + "\n", {force: true})
                cy.contains("button", "Update").click()
            })
            if(verify !== false){
                cy.get(this.pageSidebar.sidebarToggle).parents().eq(1).within(() => {
                    cy.containsExact("span", cta, {timeout: 10000}).should("exist")
                })
            }
        }
    }

    configureSidebarwithCtas(config){
        const ctaNumber = config.ctaNumber
        const ctaName = config.ctaName
        const location = config.location
        const buttonColor = config.buttonColor
        const fontColor = config.fontColor
        const addcta = config.addcta

       cy.get(this.pageSidebar.sidebarToggle).parents().eq(1).within(() => {
            cy.contains("label", ctaNumber).siblings("span").click()
        })
            cy.get(this.popover).within(()=>{
            if(Cypress.$(this.clearValueIcon).length > 0){
                cy.get(this.clearValueIcon).click()
            }
            cy.get(this.dropdown.box).eq(0).click()
            cy.get(this.dropdown.input).eq(0).type(ctaName + "\n", {force: true})
            cy.get(this.dropdown.box).eq(1).click()
            cy.get(this.dropdown.input).eq(1).type(location + "\n", {force: true})
            cy.get('#buttonColor').type(buttonColor)
            cy.wait(100)
            cy.get('#fontColor').type(fontColor)
            cy.wait(200)
            cy.contains('button', 'Update').click()
        })

        if(addcta){
            cy.log("in")
            cy.wait(3000)
            cy.contains('div', "+ Add CTA").click({force: true})
            cy.wait(500)
        }
    }

    configureTopicSidebarwithCtas(config){
        const ctaNumber = config.ctaNumber
        const ctaName = config.ctaName
        const location = config.location
        const buttonColor = config.buttonColor
        const fontColor = config.fontColor
        const addcta = config.addcta

       cy.get(this.pageSidebar.topicSidebarToggle).parents().eq(1).within(() => {
            cy.contains("label", ctaNumber).siblings("span").click()
        })
            cy.get(this.popover).within(()=>{
            if(Cypress.$(this.clearValueIcon).length > 0){
                cy.get(this.clearValueIcon).click()
            }
            cy.get(this.dropdown.box).eq(0).click()
            cy.get(this.dropdown.input).eq(0).type(ctaName + "\n", {force: true})
            cy.get(this.dropdown.box).eq(1).click()
            cy.get(this.dropdown.input).eq(1).type(location + "\n", {force: true})
            cy.get('#buttonColor').type(buttonColor)
            cy.wait(100)
            cy.get('#fontColor').type(fontColor)
            cy.wait(200)
            cy.contains('button', 'Update').click()
        })

        if(addcta){
            cy.contains('div', "+ Add CTA").click({force: true})
            cy.wait(2000)
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

        cy.contains(this.modal, "Exit customization for this Track").should("exist").within(() => {
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

            cy.contains("button", "Save Exit customization").click()
        })

        if(verify !== false){
            cy.contains(this.modal, "Exit customization for this Track").should("not.exist")
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
            cy.contains(this.modal, "Add Track Rule").should("not.exist")
        }
    }

    selectSearchEngineDirective(option){
        cy.contains('label',"Search Engine Directive",{timeout:10000}).siblings('span').click()
        cy.get(this.popover).within(()=>{
         cy.get(this.dropdown.box).click()
         cy.get(this.dropdown.option(option)).click()
         cy.contains("button", "Update").click()
     })
    }

    setCanonicalOverrideUrl(contentName,overrideUrl){
        cy.get(`img[alt='${contentName}']`,{timeout:10000}).click()
        cy.contains('label',"Canonical Url Override",{timeout:10000}).siblings('span').click()
        cy.get(this.popover).within(()=>{
          cy.get(this.canonicalUrlOverride).click()
         cy.get(this.canonicalUrlOverride).type(overrideUrl)
         cy.contains("button", "Update").click()
     })
    }

    setCaptions(captionsLanguage,captions, verify){
        if(captions==='on' || captions==='ON'){
            this.toggle(this.pageSidebar.captions, captions)
            //default should be english
            cy.contains('label','Language').siblings("span").should("contain", "English")
            cy.get(this.pageSidebar.pagePreview).within(()=>{
                cy.contains('label','Language').siblings("span").click()
            })
            cy.get(this.popover).within(()=>{
                cy.get(this.dropdown.box).click()
                cy.get(this.dropdown.option(captionsLanguage)).click()
                cy.contains("button", "Update").click()
            })
        }
        if(verify !== false){
            cy.get(this.popover).should("not.exist")
            cy.get(this.pageSidebar.pagePreview).within(()=>{
                cy.contains('label','Language').siblings("span").should("contain", captionsLanguage)
            })
        }
    } 
}
