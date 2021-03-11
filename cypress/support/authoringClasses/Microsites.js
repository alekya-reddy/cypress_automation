import { Common } from "./Common";

export class Microsites extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/microsite`;
        this.pageTitle = "Microsites";
        this.addMicrositeButton = "#add-microsite-button";
        this.micrositesPage = {
            card: this.antCard.container,
            cardTitle: this.antCard.title,
            nameInput: "input[name='name']"
        };
        this.cloneButton = "i[class*='Icon__fa-clone']";
        this.cloneOptions = {
            micrositeSetup: "input[value='Microsite setup']",
            tracks: "input[value='Tracks']",
            landingPages: "input[value='Landing pages']",
            navigation: "input[value='Navigation']"
        };
        this.setupPage = {
            nameInput: "input[name='name']",
            slugInput: "input[name='customUrl']",
            appearanceInput: "input[class='ant-select-selection-search-input']",
            cookieConsentCheckbox: "input[name='gdprCookieConsentEnabled']",
            accessProtectionGroup: ".ant-select-selection-item",
            removeAccessProtectionGroup: ".ant-select-selection-item-remove",
            disallowGroups: ".ant-select-selection-item"
        };
        this.tracks = {
            recommendRadio: "input[value='recommend']",
            targetRadio: "input[value='target']",
            selectionItem: ".ant-select-selection-item",
            removeSelectionItem: ".ant-select-selection-item-remove",
            emptyTracksTabImage: ".ant-empty-image"
        };
        this.landingPages = {
            nameInput: "input[name='name']",
            slugInput: "input[name='slug']",
            addBlockButton: "button[class*='AddBlockButton']",
            addHTMLButton: "button:contains('HTML')",
            addTracksButton: "button:contains('Tracks')",
            addFeaturedButton: "button:contains('Featured Content')",
            editorMenu: "div[class^='BlockMenu']",
            menuBlock: "div[class^='BlockAction']",
            colorPickerBar: ".swatch-inner",
            colorPicker: ".sketch-picker",
            classNameInput: "input[name*='className']",
            trackRow: ".pf-event-sessions",
            blockContainer: "div[data-react-beautiful-dnd-draggable='0']",
            titleOverrideInput: "input[name*='trackTitleOverride']",
            spacingInput: "input[name*='spacing.padding']",
            micrositeCard: ".microsite-session-card",
            micrositeCardTitle: ".pf-event-microsite-card-title > div",
            privateRadio: "input[value='private']",
            publicRadio: "input[value='public']",
            recommendRadio: "input[value='recommend']",
            targetRadio: "input[value='target']",
            searchOverrideLabel: "label[for*='searchConfiguration.searchButtonTitle']",
            carouselArrow: ".pf-microsite-carousel-arrow",
            landingPageLayout: "select[id*='landingPageLayout']"
        };
        this.navigation = {
            addButton: "button:contains('Add Navigation Item')",
            labelInput: "input[name='title']",
            linkInput: "input[name='link']",
            newTabCheckBox: "input[name='newTab']",
            navRow: ".rst__row",
            navTitle: ".rst__rowTitle",
            navSubtitle: ".rst__rowSubtitle",
            navHandle: ".rst__moveHandle",
            navContent: ".rst__rowContents",
            navRemoveBox: ".rst__rowToolbar"
        };
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addMicrosite(microsite, verify){
        this.goToPage(this.pageTitle, this.pageUrl)
        cy.get(this.pageTitleBar).within(()=>{
            cy.contains("button", "Add Microsite").click()
        })
        cy.contains(this.antModal, "Add Microsite").within(()=>{
            cy.get(this.micrositesPage.nameInput).clear().type(microsite)
            cy.contains('button', 'Add Microsite').click()
        })
        if(verify !== false){
            this.waitForAntModal({title: "Add Microsite"})
            cy.contains(this.antModal, "Add Microsite").should('not.be.visible')
            cy.containsExact(this.micrositesPage.cardTitle, microsite, {timeout: 10000}).should('exist')
        }
    }

    removeMicrosite(microsite){
        this.goToPage(this.pageTitle, this.pageUrl) 
        cy.waitFor({element: this.micrositesPage.cardTitle, to: "exist"})
        cy.ifElementWithExactTextExists(this.micrositesPage.cardTitle, microsite, 2000, () => {
            cy.containsExact(this.micrositesPage.cardTitle, microsite).parents(this.micrositesPage.card).within(() => {
                cy.contains("button", "More Actions").click()
            })
            cy.contains("li", "Remove").should("exist").click()
            cy.contains(this.antModal, "Are you sure want to remove this record?").within(()=>{
                cy.contains('Yes').click()
            })
        })
        cy.containsExact(this.micrositesPage.cardTitle, microsite).should('not.exist')
    }

    goToMicrositeConfig(microsite, verify){
        cy.get(this.pageTitleLocator).invoke('text').then((text)=>{
            if(text !== microsite){
                cy.containsExact(this.micrositesPage.cardTitle, microsite, {timeout: 20000}).should('exist').parents(this.micrositesPage.card).within(() => {
                    cy.contains("button", "Configure").click()
                })
            }
        })
        if(verify !== false){
            cy.contains(this.pageTitleLocator, microsite, {timeout: 20000}).should("exist")
        }
    }

    tabToSetup(){
        cy.containsExact("a", "Microsite Setup", {timeout: 20000}).click()
    }

    setup(options){

        const { name, slug, externalCode, newName, appearance, cookieConsent, accessProtection, disallowGroups, verify} = options

        this.goToMicrositeConfig(name)

        if(newName){
            cy.get(this.setupPage.nameInput).clear().type(newName)
        }

        if(slug){
            cy.get(this.setupPage.slugInput).clear().type(slug)
        }
        
        if(appearance){
            cy.contains(this.antRow,'Appearance').within(()=>{
                cy.get(this.setupPage.appearanceInput).clear({force: true}).type(appearance +'\n', {force: true})   
            })
            cy.get(`span[title='${appearance}']`).should("exist")
        }

        if(externalCode){
            this.addExternalCode(externalCode, verify)
        }

        if(accessProtection){
            this.addAccessProtection(accessProtection, verify)
        }

        if(disallowGroups){
            this.addDisallowedGroups(disallowGroups, verify)
        }

        if(cookieConsent == false || cookieConsent == true){
            cy.get(this.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
                if( (cookieConsent == false && attr.includes("ant-checkbox-checked")) || (cookieConsent == true && !attr.includes("ant-checkbox-checked")) ){
                    cy.get(this.setupPage.cookieConsentCheckbox).click()
                }
            }) 
        }

        cy.contains('button', 'Save').click()
        
        if(verify !== false){
            cy.contains(this.messages.recordSaved, {timeout: 20000}).should("exist")
            this.verifySetup(options)
        }
    }

    verifySetup(options){
        const { slug, newName, cookieConsent } = options

        if(newName){
            cy.get(this.setupPage.nameInput).should("have.value", newName)
            cy.containsExact(this.pageTitleLocator, newName, {timeout: 10000}).should("exist")
        }
        if(slug){
            cy.get(this.setupPage.slugInput).should("have.value", slug)
        }
        if(cookieConsent == false){
            cy.get(this.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
                expect(attr).not.to.include("ant-checkbox-checked")
            }) 
        }
        if(cookieConsent == true){
            cy.get(this.setupPage.cookieConsentCheckbox).parent().invoke('attr', 'class').then((attr)=>{
                expect(attr).to.include("ant-checkbox-checked")
            }) 
        }
    }

    addExternalCode(externalCode, verify){
        const codes = [externalCode].flat()
        cy.contains(this.antRow, "External Codes").within(() => {
            codes.forEach( code => {
                cy.get(this.antDropSelect.selector).type(code + "\n")
            })
            cy.get(this.antDropSelect.selector).click()
        })

        if(verify !== false){
            cy.contains(this.antRow, "External Codes").within(() => {
                codes.forEach( code => {
                    cy.containsExact("span", code, {timeout: 10000}).should("exist")
                })
            })
        }
    }

    removeExternalCode(list, verify){
        const codes = [list].flat()
        codes.forEach( code => {
            cy.ifElementWithExactTextExists("span", code, 1000, () => {
                cy.contains(this.antRow, "External Codes").within(() => {
                    cy.containsExact("span", code).siblings("span").click()
                })
            })
        })

        if(verify !== false){
            codes.forEach( code => {
                cy.contains(this.antRow, "External Codes").within(() => {
                    cy.containsExact("span", code).should("not.exist")
                })
            })
        }
    }

    addAccessProtection(accessProtection, verify){
        const type = accessProtection.type
        const groups = [accessProtection.groups].flat()

        if(type){
            cy.contains(this.antRow, "Protection Type").within(()=>{
                cy.get(this.antDropSelect.selector).click()
            })
            cy.get(this.antDropSelect.options(type)).click()
        }
        
        if(groups[0]){
            cy.contains(this.antRow, "Groups").within(()=>{
                groups.forEach(group => {
                    cy.get(this.antDropSelect.selector).type(group + "\n")
                })
                cy.get(this.antDropSelect.selector).click()
            })
        }

        if(verify !== false && groups[0]){
            groups.forEach((group)=>{
                cy.contains(this.setupPage.accessProtectionGroup, group).should('exist')
            })
        }
    }

    addDisallowedGroups(disallowGroups, verify){
        const groups = [disallowGroups].flat()
        cy.contains(this.antRow, "Disallow Groups").within(() => {
            groups.forEach( group => {
                cy.get(this.antDropSelect.selector).type(group + "\n")
            })
            cy.get(this.antDropSelect.selector).click()
        })
        if(verify !== false && groups[0]){
            groups.forEach((group)=>{
                cy.contains(this.setupPage.disallowGroups, group).should('exist')
            })
        }

    }

    removeAccessProtection(list){
        const groups = [list].flat()

        groups.forEach((group)=>{
            cy.ifElementExists(this.setupPage.accessProtectionGroup + `:contains('${group}')`, 2000, () => {
                cy.contains(this.antRow, "Groups").within(()=>{
                    cy.contains(this.setupPage.accessProtectionGroup, group).within(()=>{
                        cy.get(this.setupPage.removeAccessProtectionGroup).click()
                    })
                    cy.contains(this.setupPage.accessProtectionGroup, group).should("not.exist")
                })
            })
        })
    }

    tabToTracks(){
        cy.url().then((url)=>{
            if(!url.includes("/tracks")){
                cy.containsExact("a", "Tracks", {timeout: 20000}).click()
            }
        })
    }

    addTracks(options){
        const target = options.target ? [options.target].flat() : false
        const recommend = options.recommend ? [options.recommend].flat() : false
        const verify = options.verify 

        this.tabToTracks()
        cy.contains("button", "Assign Tracks").click()

        if(recommend){
            cy.get(this.tracks.recommendRadio).click()
            cy.contains(this.antModal, "Assign Tracks").within(()=>{
                cy.get(this.antDropSelect.selector).click()
            })
            recommend.forEach((track)=>{
                cy.get('input[class="ant-select-selection-search-input"]').type(track + "\n")
            })
        }        

        if(target){
            cy.get(this.tracks.targetRadio).click()
            cy.contains(this.antModal, "Assign Tracks").within(()=>{
                cy.get(this.antDropSelect.selector).click()
            })
            target.forEach((track)=>{
                cy.get('input[class="ant-select-selection-search-input"]').type(track + "\n")
            })
        }
        
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            cy.get(this.antDropSelect.selector).click() // clicking again closes the dropdown options
            cy.contains("button", "Submit").click()
        })

        if(verify !== false){
            let allTracks = []
            allTracks = target ? allTracks.concat(target) : allTracks
            allTracks = recommend ? allTracks.concat(recommend) : allTracks
            allTracks.forEach((track)=>{
                cy.containsExact(this.antTable.cell, track, {timeout: 20000}).should("exist")
            })
        }
    }

    verifyTracks(options){
        const target = options.target ? [options.target].flat() : false
        const recommend = options.recommend ? [options.recommend].flat() : false

        this.tabToTracks()

        let allTracks = []
        allTracks = target ? allTracks.concat(target) : allTracks
        allTracks = recommend ? allTracks.concat(recommend) : allTracks
        allTracks.forEach((track)=>{
            cy.containsExact(this.antTable.cell, track, {timeout: 20000}).should("exist")
        })
    }

    removeTracks(list, verify){
        const tracks = [list].flat()

        this.tabToTracks()
        tracks.forEach((track)=>{
            cy.ifElementWithExactTextExists(this.antTable.cell, track, 1000, ()=>{
                cy.containsExact(this.antTable.cell, track).siblings("td:contains('Remove')").within(()=>{
                    cy.contains('button', 'Remove').click()
                })
                cy.contains(this.antModal, "Are you sure?").contains("button", "Delete").click()
            })
            if(verify !== false){
                cy.waitFor({element: `${this.antTable.cell}:contains('${track}')`, to: "not.exist", wait: 20000})
                cy.containsExact(this.antTable.cell, track).should("not.exist")
            }
        })
    }

    removeTracks2(options){
        // This is the second way to remove tracks - using the assign tracks modal 
        const target = [options.target].flat()
        const recommend = [options.recommend].flat() 
        const verify = options.verify 

        this.tabToTracks()
        cy.contains("button", "Assign Tracks").click()
        cy.get(this.tracks.targetRadio).click()
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            target.forEach((track)=>{
                if(track){
                    cy.containsExact(this.tracks.selectionItem, track).should("exist").within(() => {
                        cy.get(this.tracks.removeSelectionItem).click()
                    })
                }
            })
        })
        cy.get(this.tracks.recommendRadio).click()
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            recommend.forEach((track)=>{
                if(track){
                    cy.containsExact(this.tracks.selectionItem, track).should("exist").within(() => {
                        cy.get(this.tracks.removeSelectionItem).click()
                    })
                }
            })
        })
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            cy.contains("button", "Submit").click()
        })

        if(verify !== false){
            const allTracks = target.concat(recommend)
            allTracks.forEach((track)=>{
                cy.containsExact(this.antTable.cell, track).should("not.exist")
            })
        }
    }

    removeAllTracks(){
        this.tabToTracks()
        cy.get(this.antTable.row).then((rows) => {
            for(let i = rows.length - 1; i >= 0; i--){
                cy.get(this.antTable.row).eq(i).contains('button', 'Remove').click()
                cy.contains(this.antModal, "Are you sure?").contains("button", "Delete").click()
            }
        })
    }

    tabToLandingPages(){
        cy.url().then((url)=>{
            if(!url.includes("/pages")){
                cy.containsExact("a", "Landing Pages", {timeout: 20000}).click()
            }
        })
    }

    addLandingPages(list, verify){
        const pages = [list].flat()

        this.tabToLandingPages()
        pages.forEach((page)=>{
            cy.contains("button", "Add Page").click()
            cy.contains(this.antModal, "Add Page").within(()=>{
                cy.get(this.landingPages.nameInput).clear().type(page)
                cy.contains("button", "Add Page").click()
            })
            if(verify !== false){
                cy.contains(this.antModal, "Add Page").should("not.be.visible")
                cy.containsExact(this.antTable.cell, page).should('exist')
            }
        })
    }

    removeLandingPages(list, verify){
        const pages = [list].flat()

        this.tabToLandingPages()
        cy.contains("button", "Add Page", {timeout: 20000}).should("exist") 
        pages.forEach((page)=>{
            cy.ifElementWithExactTextExists(this.antTable.cell, page, 1000, ()=>{
                cy.containsExact(this.antTable.cell, page).siblings("td:contains('Remove')").within(()=>{
                    cy.contains('button', 'Remove').click()
                })
                cy.contains("button", "Yes").click()
            })
            if(verify !== false){
                cy.waitFor({element: `${this.antTable.cell}:contains('${page}')`, to: "not.exist", wait: 20000})
                cy.containsExact(this.antTable.cell, page).should("not.exist")
            }
        })
    }

    editLandingPage(config){
        const name = config.name
        const newName = config.newName
        const slug = config.slug
        const visibility = config.visibility ? config.visibility.toLowerCase() : false
        const verify = config.verify 

        this.tabToLandingPages()
        cy.containsExact(this.table.antCell, name).siblings("td:contains('Edit')").within(()=>{
            cy.contains("button", "Edit").click()
        })
        cy.contains(this.antModal + ":visible", "Edit Landing Page").within(()=>{
            if(newName){
                cy.get(this.landingPages.nameInput).clear().type(newName)
            }
            if (visibility == 'public') {
                cy.get(this.landingPages.publicRadio).click()
            } else if (visibility == 'private') {
                cy.get(this.landingPages.privateRadio).click()
            }
            if(slug){
                cy.get(this.landingPages.slugInput).clear().type(slug)
            }
            cy.contains("button", "Submit").click()
        })
        if(verify !== false){
            const checkName = newName ? newName : name 
            cy.contains(this.antModal, "Edit Landing Page").should('not.be.visible')
            if(newName){ 
                cy.containsExact(this.table.antCell, checkName).should('exist') 
            }
            if(visibility == 'public'){
                cy.containsExact(this.antCell, checkName).siblings("td:contains('Set as Home Page')").should('exist')
                cy.containsExact(this.antCell, checkName).siblings("td:contains('Public')").should('exist')
            } else if(visibility == 'private'){
                cy.containsExact(this.antCell, checkName).siblings("td:contains('Set as Home Page')").should('not.exist')
                cy.containsExact(this.antCell, checkName).siblings("td:contains('Private')").should('exist')
            }
            if(slug){
                cy.containsExact(this.table.antCell, checkName).siblings(`td:contains('${slug}')`).should('exist')
            }
        }
    }

    setToHomePage(page){
        cy.containsExact(this.antTable.cell, page).siblings("td:contains('Set as Home Page')").within(()=>{
            cy.contains("button", "Set as Home Page").click()
        })
    }

    goToPageEditor(page){
        cy.containsExact(this.antTable.cell, page, {timeout: 10000}).siblings(`td:contains('Modify Page')`).within(()=>{
            cy.contains("a", "Modify Page").invoke("attr", "href").then((href)=>{
                cy.visit(`${this.baseUrl}${href}`)
            })
        })
    }
    configureFilter(filterName, filterSettings){
        const { enableToggle, overrideLabel , textColor, backgroundColor } = filterSettings
        cy.containsExact("div", "Filters Configuration").click()
        cy.containsExact("span", filterName).click()
        if(enableToggle){
            cy.get("input[name*='.enable']").click()
        }
        if(overrideLabel){
            cy.get("input[name*='.overrideLabel']").clear().type(overrideLabel)
        }
        if(textColor){
            this.pickColor2(textColor)
        }
        if(backgroundColor){
            this.pickColor2(backgroundColor)
        }
        cy.get("span:contains('" + filterName + "')").eq(1).click()
        cy.containsExact("span", "Filters Configuration").click()
    }

    verifyFilterConfiguration(filterName, filterSettings){
        const { enableToggle, overrideLabel } = filterSettings
            if(enableToggle){
                if(overrideLabel){
                    cy.containsExact("option", overrideLabel).should("exist")
                }
                else{
                    cy.containsExact("option", filterName).should("exist")
                }
            }
    }

    addAdvancedBlock(config){
        const type = config.type.toLowerCase()
        const content = config.content // HTML content that goes into the html block 
        const track = config.track
        const name = config.name
        const titleOverride = config.titleOverride
        const typography = config.typography // this has sub options 
        const className = config.className 
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units
        const topicFilter = config.topicFilter
        const contentTypeFilter = config.contentTypeFilter
        const funnelStageFilter = config.funnelStageFilter
        const industryFilter = config.industryFilter
        const personaFilter = config.personaFilter
        const businessUnitFilter = config.businessUnitFilter
        const card = config.card
        const layout = config.layout
        const verify = config.verify // Do not verify if using HEX color for any color pickers
        const searchConfiguration = config.searchConfiguration
        
        cy.waitFor({element: this.landingPages.addBlockButton, to: "exist", wait: 10000})
        cy.get(this.landingPages.addBlockButton).eq(0).click({force: true}) // Always pick first one and add to top 

        if(type == "html"){
            cy.get(this.landingPages.addHTMLButton + ":visible").eq(0).click({force: true})
        } else if (type == "track"){
            cy.get(this.landingPages.addTracksButton + ":visible").eq(0).click({force: true})
        } else if (type == "featured") {
            cy.get(this.landingPages.addFeaturedButton + ":visible").eq(0).click({force: true})
        }

        // The menu of the most recently added one will be visible 
        cy.get(this.landingPages.editorMenu).within(()=>{
            cy.get(this.landingPages.menuBlock).eq(3).click() // This opens up the block editor modal 
        })

        if(content){
            cy.containsExact("div", "HTML Content").click() // Slides open the html content area
            cy.get("textarea").clear().type(content, {parseSpecialCharSequences: false})
            cy.containsExact("span", "HTML Content").click() // Slides shut the html content area
        }

        if(track){
            cy.get("select[id*='experienceId']").select(track)
        }

        if(layout){
            // Values should be "Carousel" or "Grid"
            cy.get(this.landingPages.landingPageLayout).select(layout)
        }

        if(name){
            cy.get("input[name*='name']").clear().type(name)
        }

        if(titleOverride){
            cy.get(this.landingPages.titleOverrideInput).clear().type(titleOverride)
        }

        if(background){
            const color = background.color // object with keys hex, r, g, b
            const image = background.image // image must be an object that can be passed into pickThumbnail method (Common classs)
            const position = background.position // center, top, bottom -> these seem to only matter if size is 'cover'
            const size = background.size // cover or contain

            cy.containsExact("div", "Background").click()
            if(color){
                this.pickColor2(color)
            }
            if(image){
                cy.contains("button", "Add Image").click()
                this.pickThumbnail(image)
            }
            if(position){
                cy.get("select[id*='backgroundPosition']").select(position)
            }
            if(size){
                cy.get("select[id*='backgroundSize']").select(size)
            }
            cy.containsExact("span", "Background").click()
        }

        if(heading){
            let color = heading.color // In HEX code or rgb (rgb preferred)
            let textAlign = heading.textAlign // center, left, right

            cy.containsExact("div", "Heading").click()
            if(color){
                this.pickColor2(color)
            }
            if(textAlign){
                cy.get("select[id*='heading.textAlign']").select(textAlign)
            }
            cy.containsExact("span", "Heading").click()
        }

        if(typography){
            // color should be nn HEX code or rgb (rgb preferred)
            // textAlign should be center, left, or right
            // fontSize should be in pixels (eg 5px)
            const { color, textAlign, fontSize } = typography

            cy.containsExact("div", "Typography").click()
            if(color){
                this.pickColor2(color)
            }
            if(textAlign){
                cy.get("select[id*='typography.textAlign']").select(textAlign)
            }
            if(fontSize){
                cy.get("input[name*='typography.fontSize']").clear().type(fontSize)
            }
            cy.containsExact("span", "Typography").click()
        }

        if(spacing){
            cy.containsExact("div", "Spacing").click()
            cy.get(this.landingPages.spacingInput).clear().type(spacing)
            cy.containsExact("span", "Spacing").click()
        }
        if(topicFilter){
            this.configureFilter("Topic Filter", topicFilter)
        }
        if(contentTypeFilter){
            this.configureFilter("Content Type", contentTypeFilter)
        }
        if(funnelStageFilter){
            this.configureFilter("Funnel Stage", funnelStageFilter)
        }
        if(industryFilter){
            this.configureFilter("Industry", industryFilter)
        }
        if(personaFilter){
            this.configureFilter("Persona", personaFilter)
        }
        if(businessUnitFilter){
            this.configureFilter("Business Unit", businessUnitFilter)
        }
        if(card){
            const { color, textAlign, fontSize } = card

            cy.containsExact("div", "Card Configuration").click()

            if(color){
                this.pickColor2(color)
            }

            if(textAlign){
                cy.get("select[id*='cardConfiguration.textAlign']").select(textAlign)
            }

            if(fontSize){
                cy.get("input[name*='cardConfiguration.fontSize']").clear().type(fontSize)
            }
            cy.containsExact("span", "Card Configuration").click()
        }
        if(searchConfiguration){
            const { enableToggle, searchButtonTitle, buttonTextColor, inputTextColor, buttonBackgroundAndBorderColor} = searchConfiguration
            cy.containsExact("div","Search Configuration").click()
            if(enableToggle){
                cy.get("input[name*='searchConfiguration.enable']").click()
            }
            if(searchButtonTitle){
                cy.get(this.landingPages.searchOverrideLabel).parent().within(() => {
                    cy.get("input").clear().type(searchButtonTitle)
                })
            }
            if(buttonTextColor){
                this.pickColor2(buttonTextColor)
            }
            if(inputTextColor){
                this.pickColor2(inputTextColor)
            }
            if(buttonBackgroundAndBorderColor){
                this.pickColor2(buttonBackgroundAndBorderColor)
            }
        }

        if(className){
            cy.get(this.landingPages.classNameInput).clear().type(className)
        }

        cy.contains("button", "Confirm").click()

        if(verify !== false){
            this.verifyBlock(config)
        }
    }

    verifyBlock(config){
        const type = config.type.toLowerCase()
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options 
        const className = config.className 
        const track = config.track
        const titleOverride = config.titleOverride
        const name = config.name
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units
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

        if(type == "html" && className){ // className is required to be able to find the correct block
            let locator = `div[class*='${className}']`
            cy.get(locator).invoke("attr", "style").then((style)=>{
                if(typography && typography.textAlign){
                    expect(style).to.include(`text-align: ${typography.textAlign}`)
                }
                if(typography && typography.color && !typography.color.hex){
                    expect(style).to.include(`color: rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
                }
                if(typography && typography.fontSize){
                    expect(style).to.include(`font-size: ${typography.fontSize}`)
                }
                if(background && background.color && !background.color.hex){
                    expect(style).to.include(`background-color: rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
                }
                if(background && background.image.url){
                    expect(style).to.include(background.image.url)
                }
                if(background && background.position){
                    expect(style).to.include(`background-position: center ${background.position}`)
                }
                if(background && background.size){
                    expect(style).to.include(`background-size: ${background.size}`)
                }
                if(spacing){
                    expect(style).to.include(`padding: ${spacing}`)
                }
            })
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

        if(type == "track" || type == "featured"){ 
            const blockLocator = this.landingPages.trackRow
            const trackName = titleOverride || track || name
            cy.contains(blockLocator, trackName).should("exist")
            if(heading){
                cy.contains(blockLocator, trackName).within(()=>{
                    if(heading.color && !heading.color.hex){
                        cy.get("h4").should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                    }
                    if(heading.textAlign){
                        cy.get("h4").should("have.css", 'text-align', heading.textAlign)
                    }
                })
            }
            if(background && background.color && !background.color.hex){
                cy.contains(blockLocator, trackName).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.contains(blockLocator, trackName).invoke("css", "background-image").should("have.contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.contains(blockLocator, trackName).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.contains(blockLocator, trackName).should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.contains(blockLocator, trackName).should("have.css", "padding", spacing)
            }
            cy.contains(blockLocator, trackName).within(() => {
                if(topicFilter){
                    this.verifyFilterConfiguration("Topic Filter", topicFilter)
                }
                if(contentTypeFilter){
                    this.verifyFilterConfiguration("Content Type", contentTypeFilter)
                }
                if(funnelStageFilter){
                    this.verifyFilterConfiguration("Funnel Stage", funnelStageFilter)
                }
                if(industryFilter){
                    this.verifyFilterConfiguration("Industry", industryFilter)
                }
                if(personaFilter){
                    this.verifyFilterConfiguration("Persona", personaFilter)
                }
                if(businessUnitFilter){
                    this.verifyFilterConfiguration("Business Unit", businessUnitFilter)
                }
                if(card){
                    const { color, textAlign, fontSize } = card
                    if(color){
                        cy.get(this.landingPages.micrositeCardTitle).eq(0).should("have.css", "color", `rgb(${color.r}, ${color.g}, ${color.b})`)
                    }
    
                    if(textAlign){
                        cy.get(this.landingPages.micrositeCardTitle).eq(0).should("have.css", "text-align", textAlign)
                    }
                    
                    if(fontSize){
                        cy.get(this.landingPages.micrositeCardTitle).eq(0).should("have.css", "font-size", fontSize)
                    }
                }
                if(searchConfiguration){
                    const overrideTitle = searchConfiguration.searchButtonTitle
                    if(overrideTitle){
                        cy.contains('button', overrideTitle).should("exist")
                    } else {
                        cy.containsExact('button', 'Search').should("exist")
                    }
                }
                if(contents){
                    contents.forEach(content => {
                        cy.contains(this.landingPages.micrositeCardTitle, content.name).should("exist")
                    })
                }
                // The assets will render in a carousel in the live experience
                // if(layout){
                //     const shouldExistOrNot = layout == "Carousel" ? "exist" : "not.exist"
                //     cy.get(this.landingPages.carouselArrow).should(shouldExistOrNot)
                // }
            })
        }
    }

    addFeaturedContent(config, verify){
        const blockName = config.to
        const contents = config.contents

        contents.forEach(content => {
            cy.contains(this.landingPages.trackRow, blockName, {timeout: 10000}).should("exist").within((block) => {
                // Get the content menu modal to open
                let cardExists = false
                cy.waitFor({element: this.landingPages.micrositeCard, to: "exist", wait: 1500})
                cy.do(() => {
                    if (block.find(this.landingPages.micrositeCard).length > 0) {
                        cardExists = true
                        cy.get(this.landingPages.micrositeCard).last().click({force: true})
                        cy.get(this.landingPages.addBlockButton).last().click()
                        cy.get("div[class*='StyledFocusRing']").last().within(() => {
                            cy.get(this.landingPages.editorMenu).within(() => {
                                cy.get(this.landingPages.menuBlock).eq(3).click()
                            })
                        })
                    }
                })
                cy.do(() => {
                    if (!cardExists) {
                        cy.get("div[class*='BlocksEmptyState']").click({force: true})
                        cy.get(this.landingPages.addBlockButton).click()
                        cy.get(this.landingPages.editorMenu).within(() => {
                            cy.get(this.landingPages.menuBlock).eq(3).click()
                        })
                    }
                })
            })

            // Set track type
            if (content.trackType == "target") {
                cy.angryClick({clickElement: this.landingPages.targetRadio, checkElement: "label[class*='ant-radio-wrapper-checked']:contains('Target')"})
            } else if (content.trackType == "recommend") {
                cy.get(this.landingPages.recommendRadio).click()
            }
            
            // Set track
            cy.contains(this.antRow, "Tracks").within(() => {
                cy.get(this.antDropSelect.selector).click()
            })
            cy.get(this.antDropSelect.optionsContainer + ":visible").within(() => {
                cy.get(this.antDropSelect.options(content.track)).click()
            })

            // Set contents
            cy.contains(this.antRow, "Contents").within(() => {
                cy.get(this.antDropSelect.selector).click()
            })
            cy.get(this.antDropSelect.optionsContainer + ":visible").within(() => {
                cy.get(this.antDropSelect.options(content.name)).click()
            })

            if (verify !== false) {
                cy.contains(this.landingPages.trackRow, blockName, {timeout: 10000}).should("exist").within(() => {
                    cy.contains(this.landingPages.micrositeCard, content.name, {timeout: 10000}).should("exist")
                })
            }

            cy.contains("button", "Confirm").click({force: true})
        })
    }

    removeFeaturedContent(options, verify){
        const { 
            block, 
            content, 
            index = 0 
        } = options
        cy.contains(this.landingPages.trackRow, block, {timeout: 10000}).within(() => {
            const containsContent = content ? `:contains('${content}')` : ""
            cy.get(this.landingPages.micrositeCard + containsContent).eq(index).click({force: true})
            cy.get("div[class*='StyledFocusRing']" + containsContent).eq(index).within(() => {
                cy.get(this.landingPages.editorMenu).within(() => {
                    cy.get(this.landingPages.menuBlock).eq(4).click()
                })
            })

            if (verify !== false){
                // Note: if deleting contents with the same name, or using purely index, disable verify or this will fail
                cy.contains(this.landingPages.micrositeCard, content).should("not.exist")
            }
        })
    }

    removeBlock(locator){
        // Must first navigate to the landing page editor 
        // locator should be something specific to the block 
        // The blocks are shifty, getting attached, detached, then reattached to dom
        // There is case where Cypress finds the block, but when it tries to interact with it, block has been detached and reattached
        // Cypress not smart enough to requery for the same block, and instead tries to click the previously found block that has been detached 
        // Hence, need to wait for DOM to settle before interacting with it
        cy.waitFor({element: locator, to: "not.exist", wait: 1000})
        cy.get(locator).should('exist')
        cy.get(locator).parents(this.landingPages.blockContainer).click() // this selects the block and makes the menu appear
        cy.get(locator).parents(this.landingPages.blockContainer).within(()=>{
            cy.get(this.landingPages.menuBlock).eq(4).click() 
        })
        cy.get(locator).should("not.exist")
    }

    configureLandingPage(config){
        const name = config.name
        const setHome = config.setHome 
        const blocks = config.blocks
        const stayInEditor = config.stayInEditor

        this.editLandingPage(config)

        if(setHome){
            this.setToHomePage(name)
        }

        if(blocks){
            this.goToPageEditor(name)
            blocks.forEach((block)=>{
                const featuredBlockType = block.type == "featured"
                if (featuredBlockType) {
                    const featuredBlock = {...block}
                    featuredBlock.verify = false // Need to turn off verification or else might verify cards that don't exist yet
                    this.addAdvancedBlock(featuredBlock)
                    if(featuredBlock.contents && featuredBlock.contents.length > 0){
                        this.addFeaturedContent({to: featuredBlock.name, contents: featuredBlock.contents})
                    }
                    this.verifyBlock(block) // block retains the original value of verify
                } else {
                    this.addAdvancedBlock(block)
                }
                cy.get(this.landingPages.blockContainer).eq(0).click() // This makes the add block button reappear
            })
            cy.contains("button", "Save").click()
            if (!stayInEditor){
                cy.go("back")
            }
        }
    }

    tabToNavigation(){
        cy.url().then((url)=>{
            if(!url.includes("/navigation")){
                cy.containsExact("a", "Navigation", {timeout: 10000}).click()
            }
        })
    }

    addNavItem(config){
        const label = config.label
        const type = config.type
        const source = config.source
        const newTab = config.newTab
        const verify = config.verify

        this.tabToNavigation()
        cy.get(this.navigation.addButton).click()
        cy.contains(this.antModal, "Add Navigation Item").should('exist')
        cy.get(this.navigation.labelInput).clear().type(label)
        cy.get(this.antDropSelect.selector).eq(0).click()
        cy.get(this.antDropSelect.options(type)).click()
        if(source && type !== "Link"){
            cy.get(this.antDropSelect.selector).eq(1).click()
            cy.get(this.antDropSelect.options(source)).click()
        } else if (source && type == "Link"){
            cy.get(this.navigation.linkInput).clear().type(source)
        }
        if(newTab){
            cy.get(this.navigation.newTabCheckBox).click()
        }
        cy.contains('button', "Submit").click()

        if(verify !== false){
            this.waitForAntModal({title: "Add Navigation Item"})
            cy.containsExact(this.navigation.navTitle, label).should('exist').parent().within(()=>{
                if(type == "Link" && newTab){
                    cy.containsExact(this.navigation.navSubtitle, `${type}: ${source} (new tab)`).should('exist')
                } else {
                    cy.containsExact(this.navigation.navSubtitle, `${type}: ${source}`).should('exist')
                }
            })
        }
    }

    removeNavItems(list, verify){
        const navItems = [list].flat()

        this.tabToNavigation()
        navItems.forEach((navItem)=>{
            cy.ifElementWithExactTextExists(this.navigation.navTitle, navItem, 1000, ()=>{
                cy.containsExact(this.navigation.navTitle, navItem).parents(this.navigation.navRow).within(()=>{
                    cy.contains("button", "Remove").click()
                })
            })
            if(verify){
                cy.waitFor({element: `${this.navigation.navTitle}:contains('${navItem}')`, to: "not.exist", wait: 10000})
                cy.containsExact(this.navigation.navTitle, navItem).should('not.exist')    
            }
        })
    }

    attachSubNav(config){
        // Tip: This function drags the subject by the draggable menu, and drops onto the target's "remove" button 
        // To simply reorder nav items at the top level, you don't need this function. Just drag subject's menu over the target's menu 
        // To make subject a sublink of target, use this function. Subject must be above the target for this to work
        // To make subject a third-level submenu of target, which itself is a submenu of a first level nav-item, first drag subject to target
        // This make make subject a second-level submenu alongside target, then drag subject to itself 
        // This effectively drags the subject back, and then it will link up to the target as a third-level submenu 
        const subject = config.subject // name of the nav item to be moved
        const target = config.target // name of the nav item that subject will connect to 

        cy.containsExact(this.navigation.navTitle, subject).parents(this.navigation.navRow).children(this.navigation.navHandle).trigger("dragstart")
        cy.containsExact(this.navigation.navTitle, target).parents(this.navigation.navRow).children(this.navigation.navContent).children(this.navigation.navRemoveBox).trigger("drop").trigger("dragend")
    }

    selectCloneOptions(config){
        // To specify which event 'tabs' you want to clone, pass them in as a key and set to true. 
        // The key must be the same as their corresponding locator keys in the this.cloneOptions object.
        Object.keys(config).forEach(option => {
            if(this.cloneOptions[option] && config[option]){
                cy.get(this.cloneOptions[option]).click()
                cy.get(this.cloneOptions[option]).parent().should("have.class", "ant-checkbox-checked")
            }
        })
    }

    cloneMicrosite(config){
        const name = config.name
        const verify = config.verify

        cy.get(this.cloneButton).click()
        cy.contains(this.antModal, "Clone this Microsite").within(()=>{
            cy.get(this.micrositesPage.nameInput).clear().type(name)
        })
        this.selectCloneOptions(config)
        cy.contains("button", "Add Microsite").click()
        if(verify !== false){
            cy.contains(this.antModal, "Clone this Microsite").should("not.be.visible")
            cy.containsExact(this.pageTitleLocator, name, {timeout: 20000}).should("exist")
        }
    }
}