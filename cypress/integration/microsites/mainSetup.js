import { createAuthoringInstance } from '../../support/pageObject.js';

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite1 = {
    name: "mainSetup.js 1",
    slug: "mainsetup-js-1",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const newName = "123 !@#$%^&()-_=+:"

const microsite2 = {
    name: "mainSetup.js 2",
    slug: "mainsetup-js-2",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

const target = {
    name: "Target Common Resource",
    slug: "target-common-resource",
    get url(){
        return `${authoring.common.baseUrl}/${this.slug}`
    },
    contents: ["Website Common Resource"]
}

describe("Microsites - main setup", () => {
    it("Add microsite, configure main setup area, remove microsite", ()=>{
        authoring.common.login()

        // Set up the test environment
        authoring.microsites.removeMicrosite(microsite1.name)
        authoring.microsites.removeMicrosite(microsite2.name)
        authoring.microsites.removeMicrosite(newName)
        authoring.microsites.addMicrosite(microsite1.name)
        authoring.microsites.addMicrosite(microsite2.name)
        authoring.microsites.setup(microsite2)

        // The preview button should point to the microsite url 
        cy.contains("a", "Preview Microsite").should("have.attr", "href", microsite2.url)

        // Test add new microsite input validation
        authoring.microsites.visit()
        authoring.microsites.addMicrosite(microsite2.name, false)
        cy.contains(authoring.microsites.messages.duplicateEntry3).should("exist")
        cy.contains(authoring.microsites.antModal, "Add Microsite").within(() => { cy.contains("button", "Cancel").click() })

        // Test the microsite name input 
        authoring.microsites.setup({
            name: microsite1.name,
            newName: newName
        })
        cy.reload()
        authoring.microsites.verifySetup({newName: newName})
        authoring.microsites.setup({
            name: newName,
            newName: " ",
            verify: false
        })
        cy.contains(authoring.microsites.messages.saveFailed, {timeout: 10000}).should("exist")
        cy.contains(authoring.microsites.messages.blankInput).should("exist")
        authoring.microsites.setup({
            name: newName,
            newName: microsite2.name,
            verify: false
        })
        cy.contains(authoring.microsites.messages.saveFailed, {timeout: 10000}).should("exist")
        cy.contains(authoring.microsites.messages.duplicateEntry3).should("exist")

        // Test the microsite slug input 
        authoring.microsites.setup({
            name: newName,
            newName: microsite1.name,
            slug: "321-abc"
        })
        cy.reload()
        authoring.microsites.verifySetup({
            newName: microsite1.name, 
            slug: "321-abc"
        })
        authoring.microsites.setup({
            name: microsite1.name,
            slug: "special)(*&^%$#@!", // These special characters should get stripped out 
            verify: false
        })
        authoring.microsites.verifySetup({slug: "special"})
        authoring.microsites.setup({
            name: microsite1.name,
            slug: " ",
            verify: false
        })
        cy.contains("cannot be empty", {timeout: 10000}).should("exist")
        authoring.microsites.setup({
            name: microsite1.name,
            slug: microsite2.slug, // slug already exists in another microsite
            verify: false
        })
        cy.contains(authoring.microsites.messages.saveFailed, {timeout: 10000}).should("exist")
        cy.contains(authoring.microsites.messages.duplicateEntry).should("exist")
        authoring.microsites.setup({
            name: microsite1.name,
            slug: target.slug, // slug already exists in a track 
            verify: false
        })
        cy.contains(authoring.microsites.messages.saveFailed, {timeout: 10000}).should("exist")
        cy.contains(authoring.microsites.messages.duplicateEntry).should("exist")

        // The cookie consent checkbox input can be tested in a separate cookie consent file when this feature becomes available 
    })
})