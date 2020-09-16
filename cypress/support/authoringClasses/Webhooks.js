import { Common } from "./Common";

export class Webhooks extends Common { 
    constructor(env, org, userName, password, customBaseUrl){
        super(env, org, userName, password, customBaseUrl);
        this.pageUrl = `${this.baseUrl}/authoring/content-library/config/webhooks`;
        this.pageTitle = "Webhooks Configuration";
        this.addWebhookModal = {
            name: "#name",
            url: "#url",
        };
        this.webhookPreview = {
            container: "div[data-qa-hook='preview-section-webhook-name']",
            delete: "i[title='Delete Webhook']"
        };
    }

    visit(){
        cy.visit(this.pageUrl);
    }

    addWebhook(config){
        const name = config.name
        const url = config.url
        const type = config.type 

        this.goToPage(this.pageTitle, this.pageUrl)
        cy.contains("button", "Add Webhook").click()
        cy.get(this.modal).within(()=>{
            cy.get(this.addWebhookModal.name).clear().type(name)
            cy.get(this.addWebhookModal.url).clear().type(url)
            cy.get(this.selectList).click()
            cy.get(this.dropDownOption(type)).click()
            cy.contains("button", "Add Webhook").click()
        })
        cy.get(this.modal).should("not.exist")
        cy.contains(this.table.cellName, name).should("exist")
    }

    deleteWebhook(list){
        const webhooks = [list].flat() 

        this.goToPage(this.pageTitle, this.pageUrl)
        webhooks.forEach((webhook)=>{
            cy.angryClick({
                clickElement: this.table.cellName + `:contains('${webhook}')`,
                checkElement: this.webhookPreview.container + `:contains('${webhook}')`
            })
            cy.get(this.webhookPreview.delete).click()
            cy.contains("button", "Delete Webhook").click()
            cy.contains(this.table.cellName, webhook).should("not.exist")
        })
    }

}