import { createAuthoringInstance, createConsumptionInstance } from '../../support/pageObject.js'

const authoring = createAuthoringInstance({ org: "automation-vex", tld: "lookbookhq" })

const originalEvent = {
    name: 'vexExternalid.js',
    slug: 'vexExternalid-js',
    externalID: [1234, 5678, 6546],
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}
const event = {
    name: 'vexExternalidCloning.js',
    slug: 'vexExternalidcloning-js',
    eventSetup: true,
    externalID: [1234, 5678, 6546],
    get url() {
        return `${authoring.common.baseUrl}/${this.slug}`
    }
}

describe("VEX - External_ID", function () {
    it("Verify user is able to see the three externalid's in vex and by cloning the event", () => {
        authoring.common.login()
        authoring.vex.visit()
        authoring.vex.deleteVirtualEventfromfolders(originalEvent.name)
        authoring.vex.deleteVirtualEvent(event.name)

        // Set up an event and verifying the three externalid's are visible
        authoring.vex.addVirtualEvent(originalEvent)
        authoring.vex.configureEvent(originalEvent)

        // Clone annd verify Virtual event
        authoring.vex.cloneEvent(event)
        cy.get(authoring.vex.eventNameInput).should("have.value", event.name)
        cy.get(authoring.vex.eventSlugInput).should("not.have.value", event.slug)
        event.externalID.forEach((externalid, index) => {
            cy.get(authoring.vex.externalIDInput).eq(index).should('have.value', externalid)
        })
    })
})
