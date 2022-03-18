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
    parentFolder: "Folder2"
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
    name: "folder2"
}

const rootFolder = {
    name: "Root"
}

const folder2 = {
    name: "drag&drop"
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

    it.only("Add to folder with drag and drop and root folder option available ", () => {
        authoring.common.login()
        authoring.microsites.visit()
        cy.contains('span', folder.name).click()
        authoring.microsites.removeMicrosite(microsite1.name)
        authoring.microsites.addMicrosite(microsite1)
        cy.go("back")
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('2')
        })
        cy.contains('td', microsite1.name).prev().click()
        cy.contains("a", microsite1.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",folder2.name,{timeout:10000}).trigger("drop").trigger("dragend")
        cy.wait(2000)
        cy.contains("div",folder.name,{timeout:20000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('1')
        }) 

        cy.contains("span", folder2.name,{timeout:10000}).click()
        cy.contains('td', microsite1.name).prev().click()
        cy.contains("a", microsite1.name,{timeout:10000}).trigger("dragstart")
        cy.contains("div",folder.name,{timeout:10000}).trigger("drop").trigger("dragend") 
        cy.wait(1000)
        cy.contains("div",folder.name,{timeout:10000}).siblings('div').invoke('text').then(text=>{
            expect(text).to.equal('2')
        })
        cy.contains('span', "Root").click() // Resetting the folder structure to root, orelse when next time script runs in the same session its trying to find and unable to delete the deletedMicrosite.js" in child folder 
    })
})