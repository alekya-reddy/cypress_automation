import { Common } from "./Common";

export class Microsites extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/microsite`;
        this.pageTitle = "Microsites";
        this.micrositesPage = {
            card: this.antCard.container,
            cardTitle: this.antCard.title,
            nameInput: "input[name='name']"
        };
        this.setupPage = {
            nameInput: "input[name='name']",
            slugInput: "input[name='customUrl']",
            cookieConsentCheckbox: "input[name='gdprCookieConsentEnabled']"
        };
        this.tracks = {
            recommendRadio: "input[value='recommend']",
            targetRadio: "input[value='target']",
            selectionItem: ".ant-select-selection-item",
            removeSelectionItem: ".ant-select-selection-item-remove"
        };
        this.landingPages = {
            nameInput: "input[name='name']",
            slugInput: "input[name='slug']",
            addBlockButton: "button[class*='AddBlockButton']",
            addHTMLButton: "button:contains('HTML')",
            addTracksButton: "button:contains('Tracks')",
            editorMenu: "div[class^='BlockMenu']",
            menuBlock: "div[class^='BlockAction']",
            colorPickerBar: ".swatch-inner",
            colorPicker: ".sketch-picker",
            classNameInput: "input[name*='className']",
            trackRow: ".pf-event-sessions",
            blockContainer: "div[data-react-beautiful-dnd-draggable='0']",
            titleOverrideInput: "input[name*='trackTitleOverride']"
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
        const name = options.name
        const slug = options.slug 
        const newName = options.newName 
        const cookieConsent = options.cookieConsent
        const verify = options.verify

        this.goToMicrositeConfig(name)

        if(newName){
            cy.get(this.setupPage.nameInput).clear().type(newName)
        }

        if(slug){
            cy.get(this.setupPage.slugInput).clear().type(slug)
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
        const slug = options.slug 
        const newName = options.newName 
        const cookieConsent = options.cookieConsent

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
                cy.get(this.antDropSelect.options(track)).click()
            })
        }        

        if(target){
            cy.get(this.tracks.targetRadio).click()
            cy.contains(this.antModal, "Assign Tracks").within(()=>{
                cy.get(this.antDropSelect.selector).click()
            })
            target.forEach((track)=>{
                cy.get(this.antDropSelect.options(track), {timeout: 5000}).click()
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
        const verify = config.verify 

        this.tabToLandingPages()
        cy.containsExact(this.table.antCell, name).siblings("td:contains('Edit')").within(()=>{
            cy.contains("button", "Edit").click()
        })
        cy.contains(this.antModal + ":visible", "Edit Landing Page").within(()=>{
            if(newName){
                cy.get(this.landingPages.nameInput).clear().type(newName)
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
        cy.containsExact(this.antTable.cell, page).siblings(`td:contains('Modify Page')`).within(()=>{
            cy.contains("a", "Modify Page").invoke("attr", "href").then((href)=>{
                cy.visit(`${this.baseUrl}${href}`)
            })
        })
    }

    addAdvancedBlock(config){
        const type = config.type.toLowerCase()
        const content = config.content // HTML content that goes into the html block 
        const track = config.track
        const titleOverride = config.titleOverride
        const typography = config.typography // this has sub options 
        const className = config.className 
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units
        const verify = config.verify // Do not verify if using HEX color for any color pickers

        cy.get(this.landingPages.addBlockButton).eq(0).click({force: true}) // Always pick first one and add to top 

        if(type == "html"){
            cy.get(this.landingPages.addHTMLButton + ":visible").eq(0).click({force: true})
        } else if (type == "track"){
            cy.get(this.landingPages.addTracksButton + ":visible").eq(0).click({force: true})
        }

        // The menu of the most recently added one will be visible 
        cy.get(this.landingPages.editorMenu).within(()=>{
            cy.get(this.landingPages.menuBlock).eq(3).click() // This opens up the block editor modal 
        })

        if(content){
            cy.containsExact("div", "HTML Content").click() // Slides open the html content area
            cy.get("textarea").clear().type(content)
            cy.containsExact("span", "HTML Content").click() // Slides shut the html content area
        }

        if(track){
            cy.get("select[id*='experienceId']").select(track)
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
                cy.get(this.landingPages.colorPickerBar).click() // Clicking this bar opens the color picker
                cy.get(this.landingPages.colorPicker).within(()=>{
                    if(color.hex){
                        cy.get("input").eq(0).clear().type(color.hex) // This is the HEX color input
                    }
                    if(color.r){
                        cy.get("input").eq(1).clear().type(color.r)
                    }
                    if(color.g){
                        cy.get("input").eq(2).clear().type(color.g)
                    }
                    if(color.b){
                        cy.get("input").eq(3).clear().type(color.b)
                    }
                })
                cy.get(this.landingPages.colorPickerBar).click() // clicking this bar again closes the color picker 
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
                cy.get(this.landingPages.colorPickerBar).click() // Clicking this bar opens the color picker
                cy.get(this.landingPages.colorPicker).within(()=>{
                    if(color.hex){
                        cy.get("input").eq(0).clear().type(color.hex) // This is the HEX color input
                    }
                    if(color.r){
                        cy.get("input").eq(1).clear().type(color.r)
                    }
                    if(color.g){
                        cy.get("input").eq(2).clear().type(color.g)
                    }
                    if(color.b){
                        cy.get("input").eq(3).clear().type(color.b)
                    }
                })
                cy.get(this.landingPages.colorPickerBar).click() // clicking this bar again closes the color picker
            }
            if(textAlign){
                cy.get("select[id*='heading.textAlign']").select(textAlign)
            }
            cy.containsExact("span", "Heading").click()
        }

        if(typography){
            let color = typography.color // In HEX code or rgb (rgb preferred)
            let textAlign = typography.textAlign // center, left, right

            cy.containsExact("div", "Typography").click()
            if(color){
                cy.get(this.landingPages.colorPickerBar).click() // Clicking this bar opens the color picker
                cy.get(this.landingPages.colorPicker).within(()=>{
                    if(color.hex){
                        cy.get("input").eq(0).clear().type(color.hex) // This is the HEX color input
                    }
                    if(color.r){
                        cy.get("input").eq(1).clear().type(color.r)
                    }
                    if(color.g){
                        cy.get("input").eq(2).clear().type(color.g)
                    }
                    if(color.b){
                        cy.get("input").eq(3).clear().type(color.b)
                    }
                })
                cy.get(this.landingPages.colorPickerBar).click() // clicking this bar again closes the color picker
            }
            if(textAlign){
                cy.get("select[id*='typography.textAlign']").select(textAlign)
            }
            cy.containsExact("span", "Typography").click()
        }

        if(spacing){
            cy.containsExact("div", "Spacing").click()
            cy.get("input:visible").clear().type(spacing)
            cy.containsExact("span", "Spacing").click()
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
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units

        if(type == "html" && className){ // className is required to be able to find the correct block
            let locator = `div[class*='${className}']`
            cy.get(locator).invoke("attr", "style").then((style)=>{
                if(typography && typography.textAlign){
                    expect(style).to.include(`text-align: ${typography.textAlign}`)
                }
                if(typography && typography.color && !typography.color.hex){
                    expect(style).to.include(`color: rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
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

        if(type == "track" && track){ 
            const blockLocator = this.landingPages.trackRow 
            const trackName = titleOverride ? titleOverride : track
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
        }
    }

    configureLandingPage(config){
        const name = config.name
        const setHome = config.setHome 
        const blocks = config.blocks

        this.editLandingPage(config)

        if(setHome){
            this.setToHomePage(name)
        }

        if(blocks){
            this.goToPageEditor(name)
            blocks.forEach((block)=>{
                this.addAdvancedBlock(block)
                cy.get(this.landingPages.blockContainer).eq(0).click() // This makes the add block button reappear
            })
            cy.contains("button", "Save").click()
            cy.go("back")
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

}