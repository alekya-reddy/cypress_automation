import { Common } from "./Common";

export class Configurations extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.configRoute = `${this.baseUrl}/authoring/content-library/config`;
        this.pageUrls = {
            webhooks: `${this.configRoute}/webhooks`,
            widgets: `${this.configRoute}/widgets`,
            externalCode: `${this.configRoute}/external-code`,
            appearances: `${this.configRoute}/appearance`
        };
        this.pageTitles = {
            webhooks: "Webhooks Configuration",
            widgets: "Widgets Configuration",
            externalCode: "External Code Configuration",
            appearances: "Appearances Configuration"
        };
        this.visit = {
            webhooks: ()=>{ cy.visit(this.pageUrls.webhooks) },
            widgets: ()=>{ cy.visit(this.pageUrls.widgets) },
            externalCode: () => { cy.visit(this.pageUrls.externalCode) },
            appearances: () => { cy.visit(this.pageUrls.appearances) }
        };
        this.addWebhookModal = {
            name: "#name",
            url: "#url",
        };
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
            deleteIcon: "i[title='Delete External Code']"
        };
        // The following are empty, but gives you an idea of how I want locators organized in this class 
        this.appearances = {
            sidebar: "div[data-qa-hook='page-sidebar']",
            secondaryNav: "div[data-qa-hook='page-secondary-navigation']",
            fontSizeSmall: "#fontSizeSmall",
            fontSizeMedium: "#fontSizeMedium",
            fontSizeLarge: "#fontSizeLarge",
            header: {
                dynamicLogo: "div[data-qa-hook='dynamicLogo']",
            },
            vex: {
                backgroundColor: "#backgroundColor",
                headerTitleSettings: "#headerTitleAppearance",
                headerFontWeight: "#headerTextFontWeight",
                headerFontColor: "#headerTextColor",
                bodySettings: "#bodyAppearance",
                bodyFontWeight: "#bodyTextFontWeight",
                bodyFontColor: "#bodyTextColor",
                activeSettings: "#activeItemAppearance",
                activeFontWeight: "#activeItemFontWeight",
                activeFontColor: "#activeItemColor",
                hideNavigation: "div[data-qa-hook='checkbox']"
            }
        };
        this.languages = {};
        this.forms = {};
        this.ctas = {};
        this.imageLibrary = {};
        this.contentTags = {};
        this.accessProtection = {};
        this.segments = {};
        this.routes = {};
    }

    /*********************************************************************************/
    /********************************* WEBHOOKS **************************************/
    /*********************************************************************************/
    addWebhook(config){
        const name = config.name
        const url = config.url // The endpoint api to send webhook events to
        const type = config.type // Get this from the dropdown options 
        let alreadyExists = false

        this.goToPage(this.pageTitles.webhooks, this.pageUrls.webhooks)
        cy.ifElementWithExactTextExists(this.table.cellName, name, 2000, ()=>{
            alreadyExists = true
        })
        cy.get('body').then(()=>{
            if(!alreadyExists){
                cy.contains("button", "Add Webhook").click()
                cy.get(this.modal).within(()=>{
                    cy.get(this.addWebhookModal.name).clear().type(name)
                    cy.get(this.addWebhookModal.url).clear().type(url)
                    cy.get(this.dropdown.box).click()
                    cy.get(this.dropdown.option(type)).click()
                    cy.contains("button", "Add Webhook").click()
                })
                cy.get(this.modal).should("not.exist")
            }
        })
        cy.contains(this.table.cellName, name).should("exist")
    }

    deleteWebhook(list){
        const webhooks = [list].flat() 

        this.goToPage(this.pageTitles.webhooks, this.pageUrls.webhooks)
        webhooks.forEach((webhook)=>{
            cy.ifElementWithExactTextExists(this.table.cellName, webhook, 3000, ()=>{
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

    configureWebhook(config){
        const name = config.name
        const on_off = config.on_off // should be 'on' or 'off'
        const eventFields = config.eventFields // object: key must be the exact text of the event field 

        this.goToPage(this.pageTitles.webhooks, this.pageUrls.webhooks)
        cy.angryClick({
            clickElement: this.table.cellName + `:contains('${name}')`,
            checkElement: this.webhookPreview.name + `:contains('${name}')`
        })

        if(on_off){
            this.toggle(this.webhookPreview.enableToggle, on_off)
        }

        if(eventFields){
            this.configureEventFields(eventFields)
        }

    }

    configureEventFields(fields){
        // Sometimes, the modal randomly closes... not sure why. Gonna angry click it to open it again if it closes
        cy.angryClick({
            clickElement: this.webhookPreview.eventFields,
            checkElement: this.modal
        })
        cy.get(this.modal).within(()=>{
            Object.entries(fields).forEach((field)=>{
                cy.ifNoElementWithExactTextExists(this.dropdown.selectedValue, field[0], 500, ()=>{
                    cy.log("adding field")
                    cy.contains("button", "Add Field").click()
                    cy.get(this.dropdown.selectedValue).last().click()
                    cy.get(this.dropdown.option(field[0])).click()
                }, 'div')
                cy.containsExact(this.dropdown.selectedValue, field[0]).parents().eq(7).within(()=>{
                    cy.get("#value").invoke('attr', 'value').then((value)=>{
                        if(value !== field[1]){
                            cy.get("#value").clear().type(field[1])
                        }
                    }) 
                })
            })
            cy.contains("button", "Save").click()
        })
    }

    /*********************************************************************************/
    /********************************* External code *********************************/
    /*********************************************************************************/
    addExternalCode(config){
        const { name, code, interceptCode } = config

        this.goToPage(this.pageTitles.externalCode, this.pageUrls.externalCode)
        cy.contains("button", "Add External Code").click()
        cy.get(this.modal).within(()=>{
            cy.get(this.externalCode.nameInput).clear().type(name)
            if (code){
                cy.get(this.externalCode.codeEditor).type(code, {force: true})
            }
            if (interceptCode) {
                cy.get(this.externalCode.codeEditor).type(interceptCode, {force: true})
                cy.intercept('POST', "/api/v3/external_codes", (req) => {
                    // It is necessary to intercept the request payload and set the code to what is intended
                    // Because the code editor will automatically add closing tags etc, which screws up the code
                    req.body.code = interceptCode
                })
            }
            cy.contains("button", "Add External Code").click() 
        })
    }

    openCodePreview(code){
        cy.angryClick({clickElement: this.table.cellName + `:contains('${code}')`, checkElement: `${this.externalCode.previewName}:contains('${code}')`})
    }

    deleteExternalCode(list){
        const codes = [list].flat()

        this.goToPage(this.pageTitles.externalCode, this.pageUrls.externalCode)
        codes.forEach((code)=>{
            cy.ifElementWithExactTextExists(this.table.cellName, code, 1500, ()=>{
                this.openCodePreview(code)
                cy.contains(this.previewSideBar, code).should('exist').within(()=>{
                    cy.get(this.externalCode.deleteIcon).click()
                })
                cy.contains(this.modal, "Delete External Code?").within(()=>{
                    cy.contains("button", "Delete External Code").click()
                })
            })
            cy.ifNoElementWithExactTextExists(this.modal, "Delete External Code?", 10000, ()=>{}) // This just smart-waits for modal to disappear
            cy.ifNoElementWithExactTextExists(this.table.cellName, code, 10000, ()=>{}) // This just smart-waits for widget to disappear
            cy.containsExact(this.table.cellName, code).should("not.exist")
        })
    }

    editExternalCode(config){
        const { name, newName, newCode, interceptCode } = config

        this.goToPage(this.pageTitles.externalCode, this.pageUrls.externalCode)
        this.openCodePreview(name)
        if(newName){
            cy.get(this.externalCode.previewName).click().within(()=>{
                cy.get(this.externalCode.nameInput).clear().type(newName)
                cy.contains("button", "Save").click()
                cy.contains(newName).should("exist")
            })
            cy.containsExact(this.table.cellName, newName).should('exist')
        }

        if(newCode){
            cy.get("code").click()
            cy.contains(this.modal, "Edit Code").within(()=>{
                cy.get(this.externalCode.codeEditor).clear({force: true}).type(newCode, {force: true})
                cy.contains("button", "Save Code").click()
            })
            cy.get(this.modal).should('not.exist')
            cy.contains(this.table.cellCode, newCode).should('exist')
        }

        if(interceptCode){
            cy.contains(this.table.cellName, name).parent().invoke("attr", "data-qa-hook").then( val => {
                const matches = val.match(/\d+/g)
                const id = matches[0]

                cy.intercept('PATCH', `/api/v3/external_codes/${id}`, (req) => {
                    // set the request body to something different before it's sent to the destination
                    req.body.code = interceptCode
                })
                cy.get("code").click()
                cy.contains(this.modal, "Edit Code").within(()=>{
                    cy.get(this.externalCode.codeEditor).clear({force: true}).type("replace me", {force: true})
                    cy.contains("button", "Save Code").click()
                })
            })
        }
    }

    /*********************************************************************************/
    /********************************* WIDGETS ***************************************/
    /*********************************************************************************/
    addWidget(config){
        let name = config.name
        let code = config.code
        let checkSuccess = config.checkSuccess == false ? false : true 

        cy.contains("button", "Add Widget").click()
        cy.get(this.modal).within(()=>{
            cy.get(this.widgets.nameInput).clear().type(name)

            if (code){
                cy.get(this.widgets.codeEditor).type(code, {force: true})
            }
            cy.contains("button", "Add Widget").click() 
        })
        if(checkSuccess){
            cy.get(this.modal).should("not.exist")
            cy.containsExact(this.table.cellName, name).should('exist')
            if(code){
                cy.contains(this.table.cellCode, code).should('exist')
            }
        }
    }

    editWidget(config){
        let name = config.name 
        let newName = config.newName 
        let newCode = config.newCode

        this.openWidgetPreview(name)
        if(newName){
            cy.get(this.widgets.previewName).click().within(()=>{
                cy.get(this.widgets.nameInput).clear().type(newName)
                cy.contains("button", "Save").click()
                cy.contains(newName).should("exist")
            })
            cy.containsExact(this.table.cellName, newName).should('exist')
        }

        if(newCode){
            cy.get("code").click()
            cy.contains(this.modal, "Update Widget").within(()=>{
                cy.get(this.widgets.codeEditor).clear({force: true}).type(newCode, {force: true})
                cy.contains("button", "Save Widget").click()
            })
            cy.get(this.modal).should('not.exist')
            cy.contains(this.table.cellCode, newCode).should('exist')
        }
    }

    deleteWidgets(list){
        let widgets = [list].flat() 

        widgets.forEach((widget)=>{
            cy.ifElementWithExactTextExists(this.table.cellName, widget, 1500, ()=>{
                this.openWidgetPreview(widget)
                cy.contains(this.previewSideBar, widget).should('exist').within(()=>{
                    cy.get(this.widgets.deleteIcon).click()
                })
                cy.contains(this.modal, "Delete Widget?").within(()=>{
                    cy.contains("button", "Delete Widget").click()
                })
            })
            cy.ifNoElementWithExactTextExists(this.modal, "Delete Widget?", 10000, ()=>{}) // This just smart-waits for modal to disappear
            cy.ifNoElementWithExactTextExists(this.table.cellName, widget, 10000, ()=>{}) // This just smart-waits for widget to disappear
            cy.containsExact(this.table.cellName, widget).should("not.exist")
        })
    }

    openWidgetPreview(widget){
        cy.angryClick({clickElement: this.table.cellName + `:contains('${widget}')`, checkElement: `${this.widgets.previewName}:contains('${widget}')`})
    }

    /*********************************************************************************/
    /********************************* APPEARANCE ************************************/
    /*********************************************************************************/
    clickAppearance(appearance){
        cy.get(this.appearances.sidebar).within(() => {
            cy.containsExact("a", appearance, {timeout: 10000}).click()
        })
    }

    clickAppearanceTab(tab){
        cy.get(this.appearances.secondaryNav).within(() => {
            cy.containsExact("a", tab, {timeout: 10000}).click()
        })
    }

    configureHeaderAppearance(options){
        const { appearance, dynamicLogo, verify } = options

        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        this.clickAppearance(appearance)
        this.clickAppearanceTab("Header")

        if (dynamicLogo) {
            // dynamicLogo must either be "on" or "off"
            this.toggle(this.appearances.header.dynamicLogo, dynamicLogo)
        }

        cy.contains("button", "Save Header Settings").click()

        if (verify !== false){
            cy.contains(this.messages.recordSaved, {timeout: 10000}).should("exist")
        }
    }

    configureVEXAppearance(options){
        const {appearance, backgroundColor, hideNavigation, verify} = options
        const {headerTitleFontFamily, headerTitleBoldFont, headerTitleFontSize, headerTitleFontColor} = options
        const {bodyFontFamily, bodyBoldFont, bodyFontSize, bodyFontColor} = options
        const {activeFontFamily, activeBoldFont, activeFontSize, activeFontColor} = options

        this.goToPage(this.pageTitles.appearances, this.pageUrls.appearances)
        this.clickAppearance(appearance)
        this.clickAppearanceTab("Virtual Event")

        if(backgroundColor){
            const { r, g, b, a } = backgroundColor
            this.pickColor({button: this.appearances.vex.backgroundColor, r: r, g: g, b: b, a: a})
        }

        if(headerTitleFontFamily){
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.dropdown.input).type(headerTitleFontFamily + "\n", {force: true})
            })
        }

        if(headerTitleBoldFont == true || headerTitleBoldFont == false){
            cy.get(this.appearances.vex.headerFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if(headerTitleBoldFont && !fontWeightClass.includes("containerActive") || !headerTitleBoldFont && fontWeightClass.includes("containerActive")){
                    cy.get(this.appearances.vex.headerFontWeight).click()
                }
            })
        }

        if(headerTitleFontSize){
            const size = {small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge"}
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.appearances[size[headerTitleFontSize]]).click()
            })
        }

        if(headerTitleFontColor){
            const { r, g, b, a } = headerTitleFontColor
            this.pickColor({button: this.appearances.vex.headerFontColor, r: r, g: g, b: b, a: a})
        }

        if(bodyFontFamily){
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.dropdown.input).type(bodyFontFamily + "\n", {force: true})
            })
        }

        if(bodyBoldFont == true || bodyBoldFont == false){
            cy.get(this.appearances.vex.bodyFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if(bodyBoldFont && !fontWeightClass.includes("containerActive") || !bodyBoldFont && fontWeightClass.includes("containerActive")){
                    cy.get(this.appearances.vex.bodyFontWeight).click()
                }
            })
        }

        if(bodyFontSize){
            const size = {small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge"}
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.appearances[size[bodyFontSize]]).click()
            })
        }

        if(bodyFontColor){
            const { r, g, b, a } = bodyFontColor
            this.pickColor({button: this.appearances.vex.bodyFontColor, r: r, g: g, b: b, a: a})
        }

        if(activeFontFamily){
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.dropdown.input).type(activeFontFamily + "\n", {force: true})
            })
        }

        if(activeBoldFont == true || activeBoldFont == false){
            cy.get(this.appearances.vex.activeFontWeight).invoke("attr", "class").then(fontWeightClass => {
                if(activeBoldFont && !fontWeightClass.includes("containerActive") || !activeBoldFont && fontWeightClass.includes("containerActive")){
                    cy.get(this.appearances.vex.activeFontWeight).click()
                }
            })
        }

        if(activeFontSize){
            const size = {small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge"}
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.appearances[size[activeFontSize]]).click()
            })
        }

        if(activeFontColor){
            const { r, g, b, a } = activeFontColor
            this.pickColor({button: this.appearances.vex.activeFontColor, r: r, g: g, b: b, a: a})
        }

        if(hideNavigation == true || hideNavigation == false){
            cy.get(this.appearances.vex.hideNavigation).invoke("attr", "class").then(checkboxClass => {
                if(hideNavigation && checkboxClass.includes("checkbox-container--unchecked") || !hideNavigation && checkboxClass.includes("checkbox-container--checked")){
                    cy.get(this.appearances.vex.hideNavigation).click()
                }
            })
        }

        cy.contains("button", "Save Virtual Event Settings").click()

        if(verify !== false){
            cy.contains(this.messages.recordSaved, {timeout: 10000}).should("exist")
            this.verifyVEXappearance(options)
        }
    }

    verifyVEXappearance(options){
        const {backgroundColor, hideNavigation} = options
        const {headerTitleFontFamily, headerTitleBoldFont, headerTitleFontSize, headerTitleFontColor} = options
        const {bodyFontFamily, bodyBoldFont, bodyFontSize, bodyFontColor} = options
        const {activeFontFamily, activeBoldFont, activeFontSize, activeFontColor} = options

        if(backgroundColor){
            const { r, g, b, a } = backgroundColor
            cy.get(this.appearances.vex.backgroundColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if(headerTitleFontFamily){
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", headerTitleFontFamily)
            })
        }

        if(headerTitleBoldFont == true || headerTitleBoldFont == false){
            const containOrNotContain = headerTitleBoldFont ? "contain" : "not.contain"
            cy.get(this.appearances.vex.headerFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if(headerTitleFontSize){
            const size = {small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge"}
            cy.get(this.appearances.vex.headerTitleSettings).within(() => {
                cy.get(this.appearances[size[headerTitleFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }

        if(headerTitleFontColor){
            const { r, g, b, a } = headerTitleFontColor
            cy.get(this.appearances.vex.headerFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if(bodyFontFamily){
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", bodyFontFamily)
            })
        }

        if(bodyBoldFont == true || bodyBoldFont == false){
            const containOrNotContain = bodyBoldFont ? "contain" : "not.contain"
            cy.get(this.appearances.vex.bodyFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if(bodyFontSize){
            const size = {small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge"}
            cy.get(this.appearances.vex.bodySettings).within(() => {
                cy.get(this.appearances[size[bodyFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }

        if(bodyFontColor){
            const { r, g, b, a } = bodyFontColor
            cy.get(this.appearances.vex.bodyFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if(activeFontFamily){
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.dropdown.selectedValue).invoke("text").should("eq", activeFontFamily)
            })
        }

        if(activeBoldFont == true || activeBoldFont == false){
            const containOrNotContain = activeBoldFont ? "contain" : "not.contain"
            cy.get(this.appearances.vex.activeFontWeight).invoke("attr", "class").should(containOrNotContain, "containerActive")
        }

        if(activeFontSize){
            const size = {small: "fontSizeSmall", medium: "fontSizeMedium", large: "fontSizeLarge"}
            cy.get(this.appearances.vex.activeSettings).within(() => {
                cy.get(this.appearances[size[activeFontSize]]).invoke("attr", "class").should("contain", "letterActive")
            })
        }

        if(activeFontColor){
            const { r, g, b, a } = activeFontColor
            cy.get(this.appearances.vex.activeFontColor).within(() => {
                cy.get("span").invoke("attr", "style").then(style => {
                    const backgroundColorStyle = a == 1 ? `background-color: rgb(${r}, ${g}, ${b})` : `background-color: rgba(${r}, ${g}, ${b}, ${a})`
                    expect(style).to.include(backgroundColorStyle)
                })
            })
        }

        if(hideNavigation == true || hideNavigation == false){
            cy.get(this.appearances.vex.hideNavigation).invoke("attr", "class").then(checkboxClass => {
                const checkOrUnchecked = hideNavigation ? "checkbox-container--checked" : "checkbox-container--unchecked"
                expect(checkboxClass).to.include(checkOrUnchecked)
            })
        }
    }
}