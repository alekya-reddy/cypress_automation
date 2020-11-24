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
        this.setupLocators = {

        };
        this.tracks = {
            recommendRadio: "input[value='recommend']",
            targetRadio: "input[value='target']"
        };
        this.landingPages = {
            nameInput: "input[name='name']",
            addBlockButton: "button[class*='AddBlockButton']",
            addHTMLButton: "button:contains('HTML')",
            addTracksButton: "button:contains('Tracks')",
            editorMenu: "div[class^='BlockMenu']",
            menuBlock: "div[class^='BlockAction']",
            colorPickerBar: ".swatch-inner",
            colorPicker: ".sketch-picker",
            classNameInput: "input[name*='className']",
            trackRow: ".pf-event-sessions"
        };
        this.navigationLocators = {

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
        this.waitForAntModal({title: "Add Microsite"})
        if (verify !== false){
            cy.contains(this.antModal, "Add Microsite").should('not.be.visible')
            cy.containsExact(this.micrositesPage.cardTitle, microsite, {timeout: 10000}).should('exist')
        }
    }

    removeMicrosite(microsite){
        this.goToPage(this.pageTitle, this.pageUrl) 
        cy.ifElementWithExactTextExists(this.micrositesPage.cardTitle, microsite, 5000, () => {
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

    goToMicrositeConfig(microsite){
        cy.containsExact(this.micrositesPage.cardTitle, microsite, {timeout: 20000}).parents(this.micrositesPage.card).within(() => {
            cy.contains("button", "Configure").click()
        })
        cy.contains(this.pageTitleLocator, microsite, {timeout: 20000}).should("exist")
    }

    tabToSetup(){

    }

    setup(options){

    }

    tabToTracks(){
        cy.url().then((url)=>{
            if(!url.includes("/tracks")){
                cy.containsExact("a", "Tracks", {timeout: 20000}).click()
            }
        })
    }

    addTracks(options){
        const target = [options.target].flat()
        const recommend = [options.recommend].flat() 
        const verify = options.verify 

        this.tabToTracks()
        cy.contains("button", "Assign Tracks").click()
        cy.get(this.tracks.targetRadio).click()
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            cy.get(this.antDropSelect.selector).click()
        })
        target.forEach((track)=>{
            track ? cy.get(this.antDropSelect.options(track)).click() : null
        })
        cy.get(this.tracks.recommendRadio).click()
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            cy.get(this.antDropSelect.selector).click()
        })
        recommend.forEach((track)=>{
            track ? cy.get(this.antDropSelect.options(track)).click() : null
        })
        cy.contains(this.antModal, "Assign Tracks").within(()=>{
            cy.get(this.antDropSelect.selector).click() // clicking again closes the dropdown options
            cy.contains("button", "Submit").click()
        })

        if(verify){
            const allTracks = target.concat(recommend)
            allTracks.forEach((track)=>{
                cy.containsExact(this.antTable.cell, track, {timeout: 20000}).should("exist")
            })
        }
    }

    removeTracks(){

    }

    removeAllTracks(){

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

    goToPageEditor(page){
        cy.containsExact(this.antTable.cell, page).siblings(`td:contains('Modify Page')`).within(()=>{
            cy.contains("a", "Modify Page").invoke("attr", "href").then((href)=>{
                cy.visit(`${this.baseUrl}${href}`)
            })
        })
    }

    addAdvancedBlock(config){
        const type = config.type.toLowerCase()
        const content = config.content 
        const track = config.track
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
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units

        if(type == "html" && className){ // className is required to be able to find the correct block
            let locator = `div[class='${className}']`
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
                    expect(style).to.include(`background-image: url("${background.image.url}")`)
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
            let blockLocator = this.landingPages.trackRow 
            cy.contains(blockLocator, track).should("exist")
            if(heading){
                cy.contains(blockLocator, track).within(()=>{
                    if(heading.color && !heading.color.hex){
                        cy.get("h4").should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                    }
                    if(heading.textAlign){
                        cy.get("h4").should("have.css", 'text-align', heading.textAlign)
                    }
                })
            }
            if(background && background.color && !background.color.hex){
                cy.contains(blockLocator, track).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.contains(blockLocator, track).should("have.css", "background-image", `url("${background.image.url}")`)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.contains(blockLocator, track).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.contains(blockLocator, track).should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.contains(blockLocator, track).should("have.css", "padding", spacing)
            }
        }
    }

    tabToNavigation(){

    }

}