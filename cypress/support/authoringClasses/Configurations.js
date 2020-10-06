import { Common } from "./Common";

export class Configurations extends Common { 
    constructor(env, org, tld, userName, password, baseUrl){
        super(env, org, tld, userName, password, baseUrl);
        this.configRoute = `${this.baseUrl}/authoring/content-library/config`;
        this.pageUrls = {
            webhooks: `${this.configRoute}/webhooks`
        };
        this.pageTitles = {
            webhooks: "Webhooks Configuration"
        };
        this.visit = {
            webhooks: ()=>{ cy.visit(this.pageUrls.webhooks) }
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
        // The following are empty, but gives you an idea of how I want locators organized in this class 
        this.appearances = {};
        this.languages = {};
        this.forms = {};
        this.ctas = {};
        this.imageLibrary = {};
        this.contentTags = {};
        this.accessProtection = {};
        this.segments = {};
        this.routes = {};
    }

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
                    cy.get(this.selectList).click()
                    cy.get(this.dropDownOption(type)).click()
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
                cy.ifNoElementWithExactTextExists(this.selectValue, field[0], 500, ()=>{
                    cy.log("adding field")
                    cy.contains("button", "Add Field").click()
                    cy.get(this.selectValue).last().click()
                    cy.get(this.dropDownOption(field[0])).click()
                }, 'div')
                cy.containsExact(this.selectValue, field[0]).parents().eq(7).within(()=>{
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

}