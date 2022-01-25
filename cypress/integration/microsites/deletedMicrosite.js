import { createAuthoringInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: "deletedMicrosite.js",
    slug: "deletedmicrosite-js",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const microsite1 = {
    name: "folderMicrosite",
}

const landingPage = {
    name: "Delete me",
    slug: "delete-me",
    visibility: 'Public',
    get url(){
        return `${microsite.url}/${this.slug}`
    }
}

const folder = {
    name: "Folder2"
}

const rootFolder = {
    name: "Root"
}

describe("Microsites - Deleted microsites and landing pages", () => {
    it("A deleted landing page or microsite should no longer be accessible on consumption side", () => {
        authoring.common.login()

        // Setup
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)
        authoring.microsites.addLandingPages(landingPage.name)
        authoring.microsites.editLandingPage(landingPage)

        // Verify urls return a good response
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(200)
        })
        cy.request({url: landingPage.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(200)
        })

        // Verify deleted landing page is no longer accessible
        authoring.microsites.removeLandingPages(landingPage.name)
        cy.request({url: landingPage.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })

        // Verify deleted microsite is no longer accessible
        authoring.microsites.visit()
        authoring.microsites.removeMicrositeWithTrashIcon(microsite.name)
        cy.request({url: microsite.url, failOnStatusCode: false}).then((response)=>{
            expect(response.status).to.eq(404)
        })
    })

    it("Add to folder with drag and drop and root folder option available ", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite1.name)
        authoring.microsites.addMicrosite(microsite1)
        authoring.microsites.editfolder(microsite1.name)
        cy.contains("span","Save Folder").should("exist").click()

        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('1')
        })
        cy.contains('td', microsite1.name).prev().click()
        cy.contains("a", microsite1.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",folder.name,{timeout:10000}).trigger("drop").trigger("dragend")
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('2')
        }) 

        cy.contains("span", folder.name,{timeout:10000}).click()
        cy.contains("a", microsite1.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",rootFolder.name,{timeout:10000}).trigger("drop").trigger("dragend") 
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('1')
        })

    })
})