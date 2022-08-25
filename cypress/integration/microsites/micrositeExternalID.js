import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({org: "automation-microsites", tld: "lookbookhq"})

const microsite = {
    name: 'micrositeExternalid.js',
    slug: 'micrositeexternalid-js',
    externalID: [1234, 5678, 6546],
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const microsite1 = {
    name: 'micrositeExternalidCloning.js',
    slug: 'micrositeexternalidcloning-js',
    micrositeSetup: true,
    externalID: [1234, 5678, 6546],
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

describe("Microsite - External_ID", function () {
    it("Verify user is able to see the three externalid's in Microsite and by cloning the Microsite", () => {
        authoring.common.login()
        authoring.microsites.visit()
        authoring.microsites.removeMicrosite(microsite.name)
        authoring.microsites.removeMicrosite(microsite1.name)

        // Set up an event and verifying the three externalid's are visible
        authoring.microsites.addMicrosite(microsite)
        authoring.microsites.setup(microsite)

        // Clone annd verify Virtual event
        authoring.microsites.cloneMicrosite(microsite1)
        cy.get(authoring.microsites.setupPage.nameInput).should("have.value", microsite1.name)
        microsite1.externalID.forEach((externalid, index) => {
            cy.get(authoring.vex.externalIDInput).eq(index).should('have.value', externalid)
        })
    })
})
