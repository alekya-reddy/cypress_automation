import { CommonCX } from "./CommonCX";

export class MicrositesCX extends CommonCX {
    constructor(env, org, tld, baseUrl){
        super(env, org, tld, baseUrl);
        this.grid = ".pf-microsite-grid";
        this.gridCard = ".pf-microsite-card";
        this.navigation = {
            header: ".pf-microsite-header",
            menuItem: ".rc-menu-item",
            menuWithSubmenu: ".rc-menu-submenu-title",
            cookieSettings: "#pf-microsite-cookie-consent-button"
        };
    }

    clickContent(options){
        const { track, content } = options

        cy.contains("h4", track).siblings(this.grid).within(() => {
            cy.contains(this.gridCard, content).click()
        })
    }

    verifyLandingPageBlock(config){
        // This should be the same config object as the one passed into authoring method 'addAdvancedBlock'
        const checkContent = config.checkContent // If you want content checked, need to include checkContent: {text: [...text], locators: [...locators]}
        const typography = config.typography // this has sub options color, textAlign // color: {r, g, b} is the only format that will be checked - hex not checked 
        const className = config.className // Required to locate html block
        const track = config.track
        const expectContents = config.expectContents
        const heading = config.heading // this has sub options color, textAlign
        const background = config.background // this has several sub options 
        const spacing = config.spacing // Padding in valid css units, recommend using only pixels 

        if(className && !track){
            let locator = `.${className}`

            if(typography && typography.textAlign){
                cy.get(locator).should("have.css", "text-align", typography.textAlign)
            }
            if(typography && typography.color && !typography.color.hex){
                cy.get(locator).should("have.css", "color", `rgb(${typography.color.r}, ${typography.color.g}, ${typography.color.b})`)
            }
            if(background && background.color && !background.color.hex){
                cy.get(locator).should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.get(locator).invoke("css", "background-image").should("contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.get(locator).should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.get(locator).should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.get(locator).should("have.css", "padding", spacing)
            }
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
        
        if(track){ 
            cy.containsExact("h4", track, {timeout: 10000}).should("exist")

            if(heading){
                if(heading.color && !heading.color.hex){
                    cy.containsExact("h4", track).should("have.css", 'color', `rgb(${heading.color.r}, ${heading.color.g}, ${heading.color.b})`)
                }
                if(heading.textAlign){
                    cy.containsExact("h4", track).should("have.css", 'text-align', heading.textAlign)
                }
            }
            if(expectContents){
                expectContents.forEach((content)=>{
                    cy.containsExact("h4", track).siblings(this.grid).within(() => {
                        cy.contains(this.gridCard, content).should('exist')
                    })
                })
            }
            if(background && background.color && !background.color.hex){
                cy.containsExact("h4", track).parent().should("have.css", "background-color", `rgb(${background.color.r}, ${background.color.g}, ${background.color.b})`)
            }
            if(background && background.image.url){
                cy.containsExact("h4", track).parent().invoke("css", "background-image").should("contain", background.image.url)
            }
            if(background && background.position){
                let positionTranslator = {top: "0%", center: "50%", bottom: "100%"}
                cy.containsExact("h4", track).parent().should("have.css", "background-position", `50% ${positionTranslator[background.position]}`)
            }
            if(background && background.size){
                cy.containsExact("h4", track).parent().should("have.css", "background-size", background.size)
            }
            if(spacing){
                cy.containsExact("h4", track).parent().should("have.css", "padding", spacing)
            }
        }
    }
}